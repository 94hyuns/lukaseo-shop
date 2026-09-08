-- lukashop 초기 스키마 (설계문서 4장 + 8-6장)
--
-- ⚠️ 아직 실행되지 않은 준비물이다. Supabase 프로젝트(리전: Northeast Asia
-- Seoul)를 만든 뒤 SQL Editor 또는 supabase CLI 로 적용한다.
--
-- 금액 컬럼은 전부 int(원 단위)다. NUMERIC/FLOAT 금지 — 부동소수 오차.

-- ─────────────────────────────── 카탈로그

create table categories (
  id          bigserial primary key,
  parent_id   bigint references categories(id),
  slug        text unique not null,
  name        text not null,
  sort_order  int default 0
);

create table products (
  id            bigserial primary key,
  category_id   bigint not null references categories(id),
  slug          text unique not null,
  sku           text unique not null,          -- 가격 갱신 매칭 키 (8-4)
  name          text not null,
  brand         text,
  price         int  not null,                 -- 정가 (원 단위 정수)
  sale_price    int,                           -- 할인가
  stock         int  not null default 0,
  status        text not null default 'active'
                check (status in ('active','soldout','hidden')),
  thumbnail_url text,
  short_desc    text,
  description   text,
  created_at    timestamptz default now()
);
create index on products (category_id, status);

-- key-value 스펙. 프론트의 판별 유니온 타입과는 어댑터로 변환한다
create table product_specs (
  id          bigserial primary key,
  product_id  bigint not null references products(id) on delete cascade,
  spec_key    text not null,           -- 'socket' | 'memory_type' | 'tdp' ...
  spec_value  text not null,
  is_featured boolean default false,   -- true 면 상품 카드에 표시
  sort_order  int default 0
);
create index on product_specs (product_id);

create table product_images (
  id          bigserial primary key,
  product_id  bigint not null references products(id) on delete cascade,
  url         text not null,
  sort_order  int default 0
);

-- ─────────────────────────────── 장바구니

create table carts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique not null references auth.users(id) on delete cascade,
  created_at  timestamptz default now()
);

create table cart_items (
  id          bigserial primary key,
  cart_id     uuid not null references carts(id) on delete cascade,
  product_id  bigint not null references products(id),
  quantity    int not null check (quantity > 0),
  unique (cart_id, product_id)
);

-- ─────────────────────────────── 주문·결제

create table orders (
  order_no       text primary key,       -- 'ORD-20260821-A3F9K2' 형식
  user_id        uuid references auth.users(id),
  status         text not null default 'pending'
                 check (status in ('pending','paid','preparing','shipped','delivered',
                                   'cancelled','failed','refunded')),
  total_amount   int not null,           -- ★ 결제 검증의 기준값. 서버가 DB 가격으로 계산
  receiver_name  text not null,
  receiver_phone text not null,
  address        text not null,
  address_detail text,
  postcode       text not null,
  memo           text,
  created_at     timestamptz default now(),
  paid_at        timestamptz
);

create table order_items (
  id            bigserial primary key,
  order_no      text not null references orders(order_no) on delete cascade,
  product_id    bigint not null references products(id),
  product_name  text not null,          -- 주문 시점 이름 스냅샷
  unit_price    int  not null,          -- 주문 시점 가격 스냅샷 — 이후 가격 변동과 무관
  quantity      int  not null check (quantity > 0)
);
create index on order_items (order_no);

-- 주문 1 : 결제 N — 재시도·부분취소 대응
create table payments (
  id              bigserial primary key,
  payment_id      text unique not null,  -- 포트원 paymentId (서버가 생성)
  order_no        text not null references orders(order_no),
  status          text not null
                  check (status in ('ready','paid','failed','cancelled','partial_cancelled')),
  amount          int  not null,
  method          text,
  pg_tid          text,                  -- PG사 거래번호
  raw_response    jsonb,                 -- 원본 응답 전량 보관 (분쟁 대비)
  idempotency_key text unique,           -- ★ 이중 결제 방지
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on payments (order_no);

-- ─────────────────────────────── 리뷰

create table reviews (
  id          bigserial primary key,
  product_id  bigint not null references products(id) on delete cascade,
  user_id     uuid not null references auth.users(id),
  rating      int not null check (rating between 1 and 5),
  body        text not null,
  created_at  timestamptz default now()
);
create index on reviews (product_id, created_at desc);

-- ─────────────────────────────── 견적짜기

create table builds (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id),
  name        text not null default '내 견적',
  is_public   boolean default false,
  share_token text unique,               -- 공유 URL. 현재 프론트의 ?b= 토큰을 대체
  created_at  timestamptz default now()
);

create table build_items (
  id         bigserial primary key,
  build_id   uuid not null references builds(id) on delete cascade,
  slot       text not null
             check (slot in ('cpu','mainboard','ram','gpu','ssd','psu','case','cooler')),
  product_id bigint not null references products(id),
  quantity   int default 1,
  unique (build_id, slot, product_id)
);

-- ─────────────────────────────── 가격 갱신 파이프라인 (8-6)

create table price_sync_settings (
  id                int primary key default 1 check (id = 1),  -- 단일 행
  mode              text not null default 'auto_approve'
                    check (mode in ('manual','auto_approve','auto')),
  change_threshold  numeric not null default 0.30,  -- 이 비율 초과 변동은 보류
  margin_rate       numeric not null default 0.10,  -- 참고가 → 제안가 마진
  schedule_cron     text default '0 3 * * *',
  updated_at        timestamptz default now()
);

-- 우리 상품 ↔ 외부 상품 매핑 (네이버는 최초 1회 수동 매핑, 이후 ID 조회)
create table product_external_refs (
  id           bigserial primary key,
  product_id   bigint not null references products(id) on delete cascade,
  source       text not null check (source in ('naver')),
  external_id  text not null,
  unique (source, external_id),
  unique (product_id, source)
);

create table price_sync_runs (
  id            bigserial primary key,
  source        text not null check (source in ('excel','naver')),
  status        text not null default 'pending'
                check (status in ('pending','awaiting_approval','applied','rolled_back','failed')),
  total_count   int default 0,
  applied_count int default 0,
  held_count    int default 0,
  failed_count  int default 0,
  created_by    uuid references auth.users(id),
  created_at    timestamptz default now(),
  applied_at    timestamptz
);

-- 행 단위 결과 (스테이징 겸 리포트). 프론트 lib/price-sync/validate.ts 의
-- SyncItem 과 대응한다
create table price_sync_items (
  id          bigserial primary key,
  run_id      bigint not null references price_sync_runs(id) on delete cascade,
  product_id  bigint references products(id),
  match_key   text not null,
  old_price   int,
  new_price   int not null,
  old_stock   int,
  new_stock   int,
  verdict     text not null check (verdict in ('ok','held','rejected')),
  reason      text,
  source_label text,
  -- 교차 비교 결과 (8-8)
  ref_price       int,      -- 비교 대상 가격 (네이버 최저가)
  ref_source      text,     -- 'naver'
  price_gap_rate  numeric,  -- (new_price - ref_price) / ref_price
  gap_verdict     text check (gap_verdict in ('competitive','expensive','suspicious','no_ref'))
);
create index on price_sync_items (run_id, verdict);

-- 가격 변경 이력 (롤백 근거)
create table price_history (
  id          bigserial primary key,
  product_id  bigint not null references products(id) on delete cascade,
  run_id      bigint references price_sync_runs(id),
  old_price   int,
  new_price   int not null,
  changed_at  timestamptz default now()
);
create index on price_history (product_id, changed_at desc);

-- ─────────────────────────────── RLS (4-3)

alter table products enable row level security;
-- 프론트가 품절 상품도 목록에 보여주므로 hidden 만 감춘다
create policy "상품은 숨김 외 누구나 조회" on products
  for select using (status <> 'hidden');

alter table categories enable row level security;
create policy "카테고리는 누구나 조회" on categories
  for select using (true);

alter table product_specs enable row level security;
create policy "스펙은 누구나 조회" on product_specs
  for select using (true);

alter table product_images enable row level security;
create policy "이미지는 누구나 조회" on product_images
  for select using (true);

alter table orders enable row level security;
create policy "본인 주문만 조회" on orders
  for select using (auth.uid() = user_id);
-- ★ 주문 생성·수정 정책은 만들지 않는다. 반드시 서버(service_role)를 거쳐
--   금액 위조를 원천 차단한다 (설계문서 4-3).

alter table order_items enable row level security;
create policy "본인 주문 품목만 조회" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.order_no = order_items.order_no
        and orders.user_id = auth.uid()
    )
  );

alter table payments enable row level security;
-- 결제는 조회도 서버 경유. 클라이언트 정책 없음

alter table carts enable row level security;
create policy "본인 장바구니만" on carts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table cart_items enable row level security;
create policy "본인 장바구니 품목만" on cart_items
  for all using (
    exists (select 1 from carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
  );

alter table reviews enable row level security;
create policy "리뷰는 누구나 조회" on reviews
  for select using (true);
create policy "본인 리뷰만 작성" on reviews
  for insert with check (auth.uid() = user_id);
create policy "본인 리뷰만 수정·삭제" on reviews
  for update using (auth.uid() = user_id);
create policy "본인 리뷰만 삭제" on reviews
  for delete using (auth.uid() = user_id);

alter table builds enable row level security;
create policy "본인 견적 관리" on builds
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "공개 견적은 누구나 조회" on builds
  for select using (is_public = true);

alter table build_items enable row level security;
create policy "견적 품목은 견적 권한을 따른다" on build_items
  for all using (
    exists (
      select 1 from builds
      where builds.id = build_items.build_id
        and (builds.user_id = auth.uid() or builds.is_public = true)
    )
  );

-- 가격 갱신 테이블들은 관리자 전용 — 클라이언트 정책 없이 서버만 접근
alter table price_sync_settings enable row level security;
alter table product_external_refs enable row level security;
alter table price_sync_runs enable row level security;
alter table price_sync_items enable row level security;
alter table price_history enable row level security;
