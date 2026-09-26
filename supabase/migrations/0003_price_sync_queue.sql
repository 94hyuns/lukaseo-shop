-- 가격 갱신 웹 업로드 → 승인 대기열 (설계문서 8-6)
--
-- 흐름: 관리자가 브라우저에서 비교표(xlsx)를 올리면 클라이언트가 파싱·검증
-- (lib/price-sync — 로컬 파이프라인과 같은 코드)한 결과를 stage_price_sync 로
-- 스테이징한다. 별도 관리자(또는 본인)가 리포트를 보고 approve 하면 ok 행만
-- 상품에 반영되고 price_history 에 이력이 남는다.
--
-- 함수가 SECURITY DEFINER 인 이유: price_sync_* 테이블은 클라이언트 쓰기
-- 정책이 없다. 관리자 검사와 상태 전이를 함수 안에서 강제해, 대기열을
-- 건너뛰고 반영하는 경로를 막는다.

-- ─────────────────────────────── 스테이징

create or replace function stage_price_sync(items jsonb) returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  rid bigint;
  it record;
  pid bigint;
  cnt_total int := 0;
  cnt_ok int := 0;
  cnt_held int := 0;
  cnt_rejected int := 0;
begin
  if not exists (select 1 from admin_users a where a.user_id = auth.uid()) then
    raise exception 'ADMIN_ONLY';
  end if;
  if items is null or jsonb_typeof(items) <> 'array'
     or jsonb_array_length(items) = 0 or jsonb_array_length(items) > 2000 then
    raise exception 'BAD_ITEMS';
  end if;

  insert into price_sync_runs (source, status, created_by)
  values ('excel', 'awaiting_approval', auth.uid())
  returning id into rid;

  for it in
    select * from jsonb_to_recordset(items) as x(
      sku text, product_slug text,
      old_price int, new_price int, old_stock int, new_stock int,
      verdict text, reason text, source_label text)
  loop
    if it.verdict not in ('ok', 'held', 'rejected') then
      raise exception 'BAD_VERDICT:%', it.verdict;
    end if;

    pid := null;
    if it.product_slug is not null then
      select id into pid from products where slug = it.product_slug;
    end if;
    -- ok 판정인데 상품을 못 찾으면 스테이징 데이터가 깨진 것 — 통째로 거부
    if it.verdict = 'ok' and pid is null then
      raise exception 'OK_WITHOUT_PRODUCT:%', coalesce(it.sku, '?');
    end if;

    insert into price_sync_items
      (run_id, product_id, match_key, old_price, new_price,
       old_stock, new_stock, verdict, reason, source_label)
    values
      (rid, pid, coalesce(it.sku, ''), it.old_price, coalesce(it.new_price, 0),
       it.old_stock, it.new_stock, it.verdict, it.reason, it.source_label);

    cnt_total := cnt_total + 1;
    if it.verdict = 'ok' then cnt_ok := cnt_ok + 1;
    elsif it.verdict = 'held' then cnt_held := cnt_held + 1;
    else cnt_rejected := cnt_rejected + 1;
    end if;
  end loop;

  update price_sync_runs
     set total_count = cnt_total, held_count = cnt_held, failed_count = cnt_rejected
   where id = rid;
  return rid;
end $$;

revoke all on function stage_price_sync(jsonb) from public;
grant execute on function stage_price_sync(jsonb) to authenticated;

-- ─────────────────────────────── 승인 (ok 행만 반영)

create or replace function approve_price_sync(target_run bigint) returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  run_status text;
  it record;
  price_now int;
  applied int := 0;
begin
  if not exists (select 1 from admin_users a where a.user_id = auth.uid()) then
    raise exception 'ADMIN_ONLY';
  end if;

  select status into run_status from price_sync_runs where id = target_run for update;
  if not found then
    raise exception 'RUN_NOT_FOUND';
  end if;
  if run_status <> 'awaiting_approval' then
    raise exception 'NOT_AWAITING:%', run_status;
  end if;

  for it in
    select product_id, new_price, new_stock
      from price_sync_items
     where run_id = target_run and verdict = 'ok'
  loop
    -- 이력의 old_price 는 스테이징 시점이 아니라 승인(반영) 시점 값이어야
    -- 롤백 근거가 된다 — 그 사이 가격이 바뀌었을 수 있다.
    select price into price_now from products where id = it.product_id for update;
    if not found then
      continue; -- 스테이징 후 삭제된 상품 — 건너뛴다
    end if;

    update products
       set price = it.new_price,
           -- 비교표의 현재가는 시장 실가라 할인 개념이 없다 → 할인 제거
           sale_price = null,
           stock = coalesce(it.new_stock, stock)
     where id = it.product_id;

    insert into price_history (product_id, run_id, old_price, new_price)
    values (it.product_id, target_run, price_now, it.new_price);

    applied := applied + 1;
  end loop;

  update price_sync_runs
     set status = 'applied', applied_count = applied, applied_at = now()
   where id = target_run;
  return applied;
end $$;

revoke all on function approve_price_sync(bigint) from public;
grant execute on function approve_price_sync(bigint) to authenticated;

-- ─────────────────────────────── 폐기

create or replace function discard_price_sync(target_run bigint) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  run_status text;
begin
  if not exists (select 1 from admin_users a where a.user_id = auth.uid()) then
    raise exception 'ADMIN_ONLY';
  end if;
  select status into run_status from price_sync_runs where id = target_run for update;
  if not found or run_status <> 'awaiting_approval' then
    raise exception 'NOT_AWAITING';
  end if;
  -- 스키마의 status 값 중 '반영 안 하고 종료'에 해당하는 것은 failed 뿐이다
  update price_sync_runs set status = 'failed' where id = target_run;
end $$;

revoke all on function discard_price_sync(bigint) from public;
grant execute on function discard_price_sync(bigint) to authenticated;

-- ─────────────────────────────── 관리자 조회 정책
-- 쓰기는 위 함수들만 하고, 화면 조회는 관리자 계정에 연다.

create policy "관리자는 갱신 실행 조회" on price_sync_runs
  for select using (exists (select 1 from admin_users a where a.user_id = auth.uid()));

create policy "관리자는 갱신 행 조회" on price_sync_items
  for select using (exists (select 1 from admin_users a where a.user_id = auth.uid()));

create policy "관리자는 가격 이력 조회" on price_history
  for select using (exists (select 1 from admin_users a where a.user_id = auth.uid()));
