-- 주문 생성·데모 결제·관리자 쓰기 (설계문서 5장 + 9장)
--
-- 핵심 결정: "결제 금액은 서버가 DB 가격으로 재계산한다"의 서버를
-- Postgres SECURITY DEFINER 함수로 둔다. 금액 계산·재고 차감·스냅샷이
-- 전부 DB 트랜잭션 안에서 일어나므로 클라이언트는 slug 와 수량만 보낼
-- 수 있고, 금액을 위조할 길이 없다. 별도 API 서버와 service_role 키
-- 없이 정적 사이트에서 바로 동작한다. 포트원 실결제(웹훅 검증)가
-- 붙는 시점에 그 부분만 Worker 로 옮긴다.

-- ─────────────────────────────── 주문 생성

create or replace function create_order(
  items jsonb,                 -- [{"slug": text, "quantity": int}]
  receiver_name text,
  receiver_phone text,
  address text,
  address_detail text default null,
  postcode text default '',
  memo text default null
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  ono text;
  total int := 0;
  shipping int;
  it record;
  p record;
  line_price int;
begin
  if uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  if items is null or jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then
    raise exception 'EMPTY_CART';
  end if;
  if jsonb_array_length(items) > 50 then
    raise exception 'TOO_MANY_ITEMS';
  end if;
  if coalesce(trim(receiver_name), '') = '' or coalesce(trim(receiver_phone), '') = ''
     or coalesce(trim(address), '') = '' then
    raise exception 'MISSING_RECEIVER';
  end if;

  ono := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-'
             || upper(substr(md5(gen_random_uuid()::text), 1, 6));

  insert into orders (order_no, user_id, status, total_amount,
                      receiver_name, receiver_phone, address, address_detail, postcode, memo)
  values (ono, uid, 'pending', 0,
          trim(receiver_name), trim(receiver_phone), trim(address), address_detail, postcode, memo);

  for it in select * from jsonb_to_recordset(items) as x(slug text, quantity int)
  loop
    if it.quantity is null or it.quantity < 1 or it.quantity > 99 then
      raise exception 'BAD_QUANTITY';
    end if;

    -- for update: 동시 주문이 같은 재고를 두 번 차감하지 못하게 행을 잠근다
    select id, name, price, sale_price, stock, status
      into p from products where slug = it.slug for update;

    if not found or p.status <> 'active' then
      raise exception 'UNAVAILABLE:%', it.slug;
    end if;
    if p.stock < it.quantity then
      raise exception 'OUT_OF_STOCK:%', it.slug;
    end if;

    -- ★ 가격은 클라이언트가 보낸 값이 아니라 지금 이 트랜잭션의 DB 값
    line_price := coalesce(p.sale_price, p.price);

    update products set stock = stock - it.quantity where id = p.id;

    insert into order_items (order_no, product_id, product_name, unit_price, quantity)
    values (ono, p.id, p.name, line_price, it.quantity);

    total := total + line_price * it.quantity;
  end loop;

  -- 배송비 정책은 장바구니 화면(components/CartView)과 같은 값이어야 한다.
  -- 지금은 상수, 운영 단계에서 설정 테이블로 뺀다.
  shipping := case when total >= 500000 then 0 else 3000 end;

  update orders set total_amount = total + shipping where order_no = ono;
  return ono;
end $$;

revoke all on function create_order(jsonb, text, text, text, text, text, text) from public;
grant execute on function create_order(jsonb, text, text, text, text, text, text) to authenticated;

-- ─────────────────────────────── 데모 결제
--
-- 실제 PG 없이 결제 완료 상태를 만드는 포트폴리오용 함수. 포트원이
-- 붙으면 이 함수 대신 웹훅 검증이 orders.status 를 전이시킨다.

create or replace function pay_order_demo(target_order_no text) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  o record;
begin
  if uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select order_no, user_id, status, total_amount
    into o from orders where order_no = target_order_no for update;

  if not found or o.user_id <> uid then
    raise exception 'ORDER_NOT_FOUND';
  end if;
  if o.status <> 'pending' then
    raise exception 'NOT_PAYABLE:%', o.status;
  end if;

  -- payment_id 를 주문번호에 고정해 두 번 눌러도 결제가 한 건만 남는다
  insert into payments (payment_id, order_no, status, amount, method, idempotency_key)
  values ('DEMO-' || target_order_no, target_order_no, 'paid', o.total_amount, 'demo',
          'DEMO-' || target_order_no)
  on conflict (payment_id) do nothing;

  update orders set status = 'paid', paid_at = now() where order_no = target_order_no;
end $$;

revoke all on function pay_order_demo(text) from public;
grant execute on function pay_order_demo(text) to authenticated;

-- ─────────────────────────────── 관리자 쓰기 권한 (9장)
--
-- 관리자 화면의 "조회"는 포트폴리오라 계속 공개하고, "쓰기"만
-- admin_users 에 등록된 계정으로 제한한다. 등록은 SQL Editor 에서
-- 수동으로 한다: insert into admin_users (user_id) values ('<uuid>');

create table admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table admin_users enable row level security;
-- 본인이 관리자인지 확인하는 용도로만 조회를 연다
create policy "본인 행만 조회" on admin_users
  for select using (auth.uid() = user_id);

create policy "관리자는 상품 수정" on products
  for update
  using (exists (select 1 from admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from admin_users a where a.user_id = auth.uid()));
