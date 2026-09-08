-- 코드 카탈로그 → DB 시드 (scripts/generate-seed-sql.ts 가 생성)
-- 생성 시각: 2026-09-08T12:38:38.318Z
begin;

-- 카테고리
insert into categories (slug, name, sort_order) values ('gaming-pc', '게이밍 PC', 0);
insert into categories (slug, name, sort_order) values ('overclock-pc', '오버클럭 PC', 10);
insert into categories (slug, name, sort_order) values ('cpu', 'CPU', 20);
insert into categories (slug, name, sort_order) values ('mainboard', '메인보드', 30);
insert into categories (slug, name, sort_order) values ('ram', '메모리', 40);
insert into categories (slug, name, sort_order) values ('gpu', '그래픽카드', 50);
insert into categories (slug, name, sort_order) values ('ssd', '저장장치', 60);
insert into categories (slug, name, sort_order) values ('psu', '파워', 70);
insert into categories (slug, name, sort_order) values ('case', '케이스', 80);
insert into categories (slug, name, sort_order) values ('cooler', '쿨러', 90);
insert into categories (slug, name, sort_order) values ('monitor', '모니터', 100);
insert into categories (slug, name, sort_order) values ('peripheral', '주변기기', 110);

-- 상품
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'gaming-pc'), 'lx-starter-4060', 'SYS-GM-001', 'LUKA 스타터 4060', 'LUKA', 1290000, 1189000, 12, 'active', 'FHD 고주사율 게임을 목표로 맞춘 입문 구성입니다.', 'FHD 해상도에서 대부분의 온라인 게임을 높은 프레임으로 돌리는 것을 목표로 맞춘 구성입니다. 발열이 낮은 부품으로만 묶어 소음이 적고, 나중에 그래픽카드만 바꿔도 오래 쓸 수 있도록 파워에 여유를 뒀습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-starter-4060'), 'kind', 'system', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-starter-4060'), 'cpu', 'i5-14400F', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-starter-4060'), 'gpu', 'RTX 4060 8GB', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-starter-4060'), 'ram', 'DDR5 16GB', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-starter-4060'), 'storage', 'NVMe 500GB', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-starter-4060'), 'badges', '["인기"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'gaming-pc'), 'lx-standard-5070', 'SYS-GM-002', 'LUKA 스탠다드 5070', 'LUKA', 2190000, 2049000, 7, 'active', 'QHD 주력 구성. 대부분의 최신 게임을 옵션 타협 없이 돌립니다.', 'QHD 해상도를 기준으로 맞춘 주력 구성입니다. 그래픽카드와 CPU의 성능 급을 맞춰 어느 한쪽이 놀지 않도록 했고, 저장장치는 로딩 체감이 큰 NVMe 1TB로 올렸습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-standard-5070'), 'kind', 'system', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-standard-5070'), 'cpu', 'i7-14700K', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-standard-5070'), 'gpu', 'RTX 5070 12GB', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-standard-5070'), 'ram', 'DDR5 32GB', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-standard-5070'), 'storage', 'NVMe 1TB', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-standard-5070'), 'badges', '["인기","무이자"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'gaming-pc'), 'lx-ryzen-9700x', 'SYS-GM-003', 'LUKA 라이젠 9700X', 'LUKA', 1990000, null, 5, 'active', '전력 대비 성능을 우선한 AM5 구성입니다.', '같은 성능대에서 소비전력이 낮은 부품으로 묶었습니다. 발열이 적어 쿨러 소음이 작고, AM5 소켓이라 다음 세대 CPU로 업그레이드할 여지가 남습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-ryzen-9700x'), 'kind', 'system', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-ryzen-9700x'), 'cpu', 'Ryzen 7 9700X', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-ryzen-9700x'), 'gpu', 'RTX 4070 SUPER 12GB', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-ryzen-9700x'), 'ram', 'DDR5 32GB', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-ryzen-9700x'), 'storage', 'NVMe 1TB', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'overclock-pc'), 'lx-oc-5080', 'SYS-OC-001', 'LUKA OC 5080 수랭', 'LUKA', 3890000, 3690000, 3, 'active', '출고 전 오버클럭 검증을 마친 4K 구성입니다.', '4K 해상도를 기준으로 맞춘 최상위 구성입니다. 240mm 수랭으로 발열을 잡고, 출고 전 부하 테스트를 거쳐 오버클럭 설정이 안정적으로 유지되는지 확인한 뒤 배송합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-5080'), 'kind', 'system', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-5080'), 'cpu', 'i7-14700K', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-5080'), 'gpu', 'RTX 5080 16GB', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-5080'), 'ram', 'DDR5 64GB', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-5080'), 'storage', 'NVMe 2TB', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-5080'), 'badges', '["신제품","무이자"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'overclock-pc'), 'lx-oc-silent', 'SYS-OC-002', 'LUKA OC 사일런트', 'LUKA', 2790000, null, 0, 'soldout', '소음을 우선해 팬 곡선까지 맞춘 구성입니다.', '성능보다 정숙성을 앞에 둔 구성입니다. 흡음 케이스와 대형 공랭을 조합하고 팬 회전수 곡선을 직접 잡아, 게임 중에도 소음이 크게 튀지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-silent'), 'kind', 'system', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-silent'), 'cpu', 'Ryzen 7 9700X', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-silent'), 'gpu', 'RTX 5070 12GB', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-silent'), 'ram', 'DDR5 32GB', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lx-oc-silent'), 'storage', 'NVMe 2TB', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'mainboard'), 'asus-prime-b760m-k-d5', 'MB-ASU-B760MK', 'ASUS PRIME B760M-K D5', 'ASUS', 159000, null, 22, 'active', 'LGA1700 · DDR5 · mATX. 무난한 보급형입니다.', '오버클럭을 하지 않는 구성이라면 이 급에서 충분합니다. mATX라 작은 케이스에도 들어갑니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-b760m-k-d5'), 'kind', 'mainboard', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-b760m-k-d5'), 'socket', 'LGA1700', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-b760m-k-d5'), 'chipset', 'B760', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-b760m-k-d5'), 'memoryType', 'DDR5', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-b760m-k-d5'), 'memorySlots', '2', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-b760m-k-d5'), 'formFactor', 'mATX', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-b760m-k-d5'), 'tdp', '30', 6);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'mainboard'), 'msi-mag-z790-tomahawk', 'MB-MSI-Z790TK', 'MSI MAG Z790 TOMAHAWK', 'MSI', 379000, 349000, 9, 'active', 'LGA1700 · DDR5 · ATX. 오버클럭용 전원부를 갖췄습니다.', 'K 모델 CPU를 오버클럭할 계획이라면 전원부가 이 정도는 되어야 합니다. 메모리 슬롯 4개, M.2 슬롯도 넉넉합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-mag-z790-tomahawk'), 'kind', 'mainboard', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-mag-z790-tomahawk'), 'socket', 'LGA1700', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-mag-z790-tomahawk'), 'chipset', 'Z790', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-mag-z790-tomahawk'), 'memoryType', 'DDR5', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-mag-z790-tomahawk'), 'memorySlots', '4', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-mag-z790-tomahawk'), 'formFactor', 'ATX', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-mag-z790-tomahawk'), 'tdp', '45', 6);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'mainboard'), 'asus-prime-h610m-k-d4', 'MB-ASU-H610MK', 'ASUS PRIME H610M-K D4', 'ASUS', 109000, null, 30, 'active', 'LGA1700 · DDR4 · mATX. 최저가 구성용입니다.', '같은 LGA1700 소켓이지만 메모리가 DDR4입니다. DDR5 메모리는 물리적으로 꽂히지 않으니 주의하세요.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-h610m-k-d4'), 'kind', 'mainboard', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-h610m-k-d4'), 'socket', 'LGA1700', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-h610m-k-d4'), 'chipset', 'H610', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-h610m-k-d4'), 'memoryType', 'DDR4', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-h610m-k-d4'), 'memorySlots', '2', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-h610m-k-d4'), 'formFactor', 'mATX', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-prime-h610m-k-d4'), 'tdp', '25', 6);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'mainboard'), 'asrock-b650m-pg', 'MB-ASR-B650MPG', 'ASRock B650M PG Riptide', 'ASRock', 199000, 182000, 16, 'active', 'AM5 · DDR5 · mATX. 라이젠 주력 보드입니다.', 'AM5 구성에서 가격과 확장성의 균형이 좋은 보드입니다. 메모리 슬롯 4개를 지원합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asrock-b650m-pg'), 'kind', 'mainboard', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asrock-b650m-pg'), 'socket', 'AM5', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asrock-b650m-pg'), 'chipset', 'B650', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asrock-b650m-pg'), 'memoryType', 'DDR5', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asrock-b650m-pg'), 'memorySlots', '4', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asrock-b650m-pg'), 'formFactor', 'mATX', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asrock-b650m-pg'), 'tdp', '30', 6);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'mainboard'), 'msi-b550m-pro-vdh', 'MB-MSI-B550M', 'MSI B550M PRO-VDH WIFI', 'MSI', 129000, null, 14, 'active', 'AM4 · DDR4 · mATX. 구형 라이젠용입니다.', 'AM4 플랫폼용 보드입니다. 와이파이가 내장되어 있어 별도 랜카드가 필요 없습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-b550m-pro-vdh'), 'kind', 'mainboard', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-b550m-pro-vdh'), 'socket', 'AM4', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-b550m-pro-vdh'), 'chipset', 'B550', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-b550m-pro-vdh'), 'memoryType', 'DDR4', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-b550m-pro-vdh'), 'memorySlots', '4', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-b550m-pro-vdh'), 'formFactor', 'mATX', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-b550m-pro-vdh'), 'tdp', '25', 6);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'ram'), 'samsung-ddr5-5600-32g', 'RAM-SAM-D5-32', '삼성전자 DDR5-5600 16GB x2', '삼성전자', 139000, 128000, 50, 'active', 'DDR5 32GB 듀얼 구성. 가장 무난한 용량입니다.', '게임과 일반 작업 모두 32GB면 부족함이 없습니다. 두 개를 같은 색 슬롯에 꽂아야 듀얼 채널로 동작합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr5-5600-32g'), 'kind', 'ram', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr5-5600-32g'), 'memoryType', 'DDR5', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr5-5600-32g'), 'capacityGb', '16', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr5-5600-32g'), 'modules', '2', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr5-5600-32g'), 'speedMhz', '5600', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr5-5600-32g'), 'tdp', '10', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr5-5600-32g'), 'badges', '["인기"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'ram'), 'teamgroup-ddr5-6000-64g', 'RAM-TEA-D5-64', '팀그룹 T-FORCE DDR5-6000 32GB x2', 'TeamGroup', 289000, null, 12, 'active', 'DDR5 64GB. 영상 편집·가상머신용입니다.', '게임만 한다면 과합니다. 영상 편집이나 가상머신처럼 메모리를 크게 먹는 작업을 겸할 때 의미가 있습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'teamgroup-ddr5-6000-64g'), 'kind', 'ram', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'teamgroup-ddr5-6000-64g'), 'memoryType', 'DDR5', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'teamgroup-ddr5-6000-64g'), 'capacityGb', '32', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'teamgroup-ddr5-6000-64g'), 'modules', '2', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'teamgroup-ddr5-6000-64g'), 'speedMhz', '6000', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'teamgroup-ddr5-6000-64g'), 'tdp', '12', 5);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'ram'), 'samsung-ddr4-3200-16g', 'RAM-SAM-D4-16', '삼성전자 DDR4-3200 8GB x2', '삼성전자', 59000, null, 45, 'active', 'DDR4 16GB. 최소 예산 구성용입니다.', '16GB는 요즘 게임에서 아슬아슬한 용량입니다. 여유가 되면 32GB를 권합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr4-3200-16g'), 'kind', 'ram', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr4-3200-16g'), 'memoryType', 'DDR4', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr4-3200-16g'), 'capacityGb', '8', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr4-3200-16g'), 'modules', '2', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr4-3200-16g'), 'speedMhz', '3200', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-ddr4-3200-16g'), 'tdp', '8', 5);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'ram'), 'gskill-ddr4-3600-32g', 'RAM-GSK-D4-32', 'G.SKILL RIPJAWS V DDR4-3600 16GB x2', 'G.SKILL', 109000, 98000, 20, 'active', 'DDR4 32GB. 라이젠 5000 시리즈와 궁합이 좋습니다.', 'AM4 라이젠은 메모리 속도에 성능이 민감합니다. 3600MHz가 이 플랫폼에서 가성비 지점입니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gskill-ddr4-3600-32g'), 'kind', 'ram', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gskill-ddr4-3600-32g'), 'memoryType', 'DDR4', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gskill-ddr4-3600-32g'), 'capacityGb', '16', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gskill-ddr4-3600-32g'), 'modules', '2', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gskill-ddr4-3600-32g'), 'speedMhz', '3600', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gskill-ddr4-3600-32g'), 'tdp', '9', 5);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'gpu'), 'gigabyte-rtx4060-eagle', 'GPU-GIG-4060', 'GIGABYTE RTX 4060 EAGLE OC 8GB', 'GIGABYTE', 419000, 389000, 24, 'active', 'FHD 고주사율용. 소비전력이 낮아 파워 부담이 적습니다.', 'FHD 해상도라면 대부분의 게임을 높은 프레임으로 돌립니다. 115W라 550W 파워로도 넉넉하고, 길이가 짧아 작은 케이스에도 들어갑니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gigabyte-rtx4060-eagle'), 'kind', 'gpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gigabyte-rtx4060-eagle'), 'chipset', 'RTX 4060', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gigabyte-rtx4060-eagle'), 'vramGb', '8', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gigabyte-rtx4060-eagle'), 'lengthMm', '242', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gigabyte-rtx4060-eagle'), 'tdp', '115', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gigabyte-rtx4060-eagle'), 'tier', '5', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'gigabyte-rtx4060-eagle'), 'recommendedPsu', '450', 6);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'gpu'), 'msi-rtx4070s-ventus', 'GPU-MSI-4070S', 'MSI RTX 4070 SUPER VENTUS 3X 12GB', 'MSI', 899000, null, 10, 'active', 'QHD 주력. 12GB VRAM으로 텍스처 부담이 적습니다.', 'QHD 해상도에서 옵션을 크게 낮추지 않고 돌릴 수 있는 지점입니다. 285mm로 길이가 있어 케이스 지원 길이를 확인해야 합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx4070s-ventus'), 'kind', 'gpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx4070s-ventus'), 'chipset', 'RTX 4070 SUPER', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx4070s-ventus'), 'vramGb', '12', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx4070s-ventus'), 'lengthMm', '285', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx4070s-ventus'), 'tdp', '220', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx4070s-ventus'), 'tier', '7', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx4070s-ventus'), 'recommendedPsu', '650', 6);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx4070s-ventus'), 'badges', '["인기"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'gpu'), 'asus-rtx5070-dual', 'GPU-ASU-5070', 'ASUS DUAL RTX 5070 OC 12GB', 'ASUS', 1090000, 1029000, 6, 'active', '신형 아키텍처. QHD 최상옵션과 4K 진입이 가능합니다.', 'QHD에서는 여유가 있고 4K도 옵션 조정으로 들어갑니다. 304mm로 길어서 미니타워에는 들어가지 않는 경우가 많습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-rtx5070-dual'), 'kind', 'gpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-rtx5070-dual'), 'chipset', 'RTX 5070', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-rtx5070-dual'), 'vramGb', '12', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-rtx5070-dual'), 'lengthMm', '304', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-rtx5070-dual'), 'tdp', '250', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-rtx5070-dual'), 'tier', '8', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-rtx5070-dual'), 'recommendedPsu', '650', 6);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'asus-rtx5070-dual'), 'badges', '["신제품"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'gpu'), 'msi-rtx5080-gaming-trio', 'GPU-MSI-5080', 'MSI RTX 5080 GAMING TRIO 16GB', 'MSI', 1990000, null, 4, 'active', '4K 최상옵션용. 336mm 대형 카드입니다.', '4K 해상도를 목표로 하는 구성의 상단입니다. 336mm에 3슬롯을 차지하므로 케이스와 파워를 먼저 정하고 접근하는 편이 안전합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx5080-gaming-trio'), 'kind', 'gpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx5080-gaming-trio'), 'chipset', 'RTX 5080', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx5080-gaming-trio'), 'vramGb', '16', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx5080-gaming-trio'), 'lengthMm', '336', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx5080-gaming-trio'), 'tdp', '360', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx5080-gaming-trio'), 'tier', '9', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'msi-rtx5080-gaming-trio'), 'recommendedPsu', '850', 6);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'gpu'), 'sapphire-rx7600-pulse', 'GPU-SAP-7600', 'SAPPHIRE PULSE RX 7600 8GB', 'SAPPHIRE', 359000, 329000, 15, 'active', 'FHD 입문. 204mm로 짧아 소형 케이스에 잘 맞습니다.', '같은 가격대 경쟁 제품보다 래스터 성능이 조금 앞섭니다. 다만 레이트레이싱 성능은 뒤처지니 용도를 보고 고르세요.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sapphire-rx7600-pulse'), 'kind', 'gpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sapphire-rx7600-pulse'), 'chipset', 'RX 7600', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sapphire-rx7600-pulse'), 'vramGb', '8', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sapphire-rx7600-pulse'), 'lengthMm', '204', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sapphire-rx7600-pulse'), 'tdp', '165', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sapphire-rx7600-pulse'), 'tier', '5', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sapphire-rx7600-pulse'), 'recommendedPsu', '550', 6);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'ssd'), 'samsung-990pro-2tb', 'SSD-SAM-990P2T', '삼성전자 990 PRO 2TB', '삼성전자', 249000, 229000, 28, 'active', 'PCIe 4.0 NVMe. 읽기 7450MB/s.', '이 급에서 더 빠른 제품을 골라도 체감 차이가 크지 않습니다. 안정성과 보증이 강점입니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-990pro-2tb'), 'kind', 'ssd', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-990pro-2tb'), 'interface', 'M.2 NVMe', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-990pro-2tb'), 'capacityGb', '2000', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-990pro-2tb'), 'readMbps', '7450', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-990pro-2tb'), 'tdp', '8', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-990pro-2tb'), 'badges', '["인기"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'ssd'), 'sk-p41-1tb', 'SSD-SKH-P41-1T', 'SK하이닉스 Platinum P41 1TB', 'SK하이닉스', 129000, null, 35, 'active', 'PCIe 4.0 NVMe 1TB. 발열이 낮은 편입니다.', '전력 효율이 좋아 발열이 낮습니다. 방열판 없는 메인보드에서도 속도 저하가 적습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sk-p41-1tb'), 'kind', 'ssd', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sk-p41-1tb'), 'interface', 'M.2 NVMe', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sk-p41-1tb'), 'capacityGb', '1000', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sk-p41-1tb'), 'readMbps', '7000', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'sk-p41-1tb'), 'tdp', '6', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'ssd'), 'wd-blue-sa510-1tb', 'SSD-WDC-SA510', 'WD Blue SA510 1TB', 'Western Digital', 89000, null, 40, 'active', 'SATA 2.5인치. 보조 저장용으로 씁니다.', 'NVMe보다 느리지만 저장 용도로는 충분합니다. M.2 슬롯이 부족할 때 추가하기 좋습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'wd-blue-sa510-1tb'), 'kind', 'ssd', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'wd-blue-sa510-1tb'), 'interface', 'SATA', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'wd-blue-sa510-1tb'), 'capacityGb', '1000', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'wd-blue-sa510-1tb'), 'readMbps', '560', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'wd-blue-sa510-1tb'), 'tdp', '4', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'psu'), 'fsp-hydro-k-pro-400', 'PSU-FSP-400', 'FSP HYDRO K PRO 400W', 'FSP', 49000, null, 30, 'active', '400W 80+ BRONZE. 사무용·저사양 구성 전용입니다.', '그래픽카드를 다는 구성에는 용량이 모자랍니다. 내장 그래픽만 쓰는 사무용 조립에 씁니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'fsp-hydro-k-pro-400'), 'kind', 'psu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'fsp-hydro-k-pro-400'), 'wattage', '400', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'fsp-hydro-k-pro-400'), 'efficiency', '80+ BRONZE', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'fsp-hydro-k-pro-400'), 'modular', '논모듈러', 3);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'psu'), 'seasonic-focus-gx-550', 'PSU-SEA-550', '시소닉 FOCUS GX-550', 'Seasonic', 109000, 99000, 22, 'active', '550W 80+ GOLD 풀모듈러. 중급 구성의 기본값입니다.', '풀모듈러라 안 쓰는 케이블을 빼둘 수 있어 선정리가 쉽습니다. 10년 보증이 붙습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'seasonic-focus-gx-550'), 'kind', 'psu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'seasonic-focus-gx-550'), 'wattage', '550', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'seasonic-focus-gx-550'), 'efficiency', '80+ GOLD', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'seasonic-focus-gx-550'), 'modular', '풀모듈러', 3);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'psu'), 'micronics-classic2-700', 'PSU-MIC-700', '마이크로닉스 CLASSIC II 700W', 'MICRONICS', 79000, null, 26, 'active', '700W 80+ BRONZE. 용량 대비 가격이 낮습니다.', '용량 대비 가격이 낮은 대신 효율 등급과 케이블 정리 편의는 떨어집니다. 예산이 빠듯할 때의 선택지입니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'micronics-classic2-700'), 'kind', 'psu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'micronics-classic2-700'), 'wattage', '700', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'micronics-classic2-700'), 'efficiency', '80+ BRONZE', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'micronics-classic2-700'), 'modular', '논모듈러', 3);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'psu'), 'seasonic-vertex-gx-850', 'PSU-SEA-850', '시소닉 VERTEX GX-850', 'Seasonic', 209000, 189000, 11, 'active', '850W 80+ GOLD 풀모듈러. 고사양 그래픽카드용입니다.', 'ATX 3.0 규격이라 최신 그래픽카드의 12V-2x6 커넥터를 변환 젠더 없이 바로 연결합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'seasonic-vertex-gx-850'), 'kind', 'psu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'seasonic-vertex-gx-850'), 'wattage', '850', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'seasonic-vertex-gx-850'), 'efficiency', '80+ GOLD', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'seasonic-vertex-gx-850'), 'modular', '풀모듈러', 3);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'case'), 'zalman-p30-itx', 'CAS-ZAL-P30', '잘만 P30 ITX', 'ZALMAN', 59000, null, 18, 'active', 'ITX 전용 초소형. 쿨러 높이 70mm까지만 들어갑니다.', '부피가 작은 대신 제약이 많습니다. ITX 보드만 들어가고, 대형 공랭 쿨러는 높이에서 걸립니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'zalman-p30-itx'), 'kind', 'case', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'zalman-p30-itx'), 'formFactors', '["ITX"]', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'zalman-p30-itx'), 'maxGpuLengthMm', '320', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'zalman-p30-itx'), 'maxCoolerHeightMm', '70', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'zalman-p30-itx'), 'size', '미니ITX', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'case'), 'darkflash-dlm21-mesh', 'CAS-DAR-DLM21', 'darkFlash DLM21 MESH', 'darkFlash', 49000, 43000, 25, 'active', 'mATX 미니타워. 전면 메쉬로 흡기가 잘 됩니다.', '작지만 전면이 뚫려 있어 발열 처리가 나쁘지 않습니다. ATX 보드는 들어가지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'darkflash-dlm21-mesh'), 'kind', 'case', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'darkflash-dlm21-mesh'), 'formFactors', '["mATX","ITX"]', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'darkflash-dlm21-mesh'), 'maxGpuLengthMm', '330', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'darkflash-dlm21-mesh'), 'maxCoolerHeightMm', '160', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'darkflash-dlm21-mesh'), 'size', '미니타워', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'case'), 'abko-suitmaster-361h', 'CAS-ABK-361H', '앱코 SUITMASTER 361H', 'ABKO', 69000, null, 20, 'active', 'ATX 미들타워. 기본 팬이 포함되어 있습니다.', '가장 무난한 미들타워입니다. 기본 팬 3개가 달려 있어 추가 구매 없이 조립할 수 있습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'abko-suitmaster-361h'), 'kind', 'case', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'abko-suitmaster-361h'), 'formFactors', '["ATX","mATX","ITX"]', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'abko-suitmaster-361h'), 'maxGpuLengthMm', '330', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'abko-suitmaster-361h'), 'maxCoolerHeightMm', '165', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'abko-suitmaster-361h'), 'size', '미들타워', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'abko-suitmaster-361h'), 'badges', '["인기"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'case'), 'lianli-o11-dynamic-evo', 'CAS-LIA-O11EVO', 'LIAN LI O11 DYNAMIC EVO', 'LIAN LI', 189000, null, 8, 'active', 'ATX 미들타워. 수랭 확장성과 내부 공간이 넉넉합니다.', '420mm까지 그래픽카드가 들어가고 상단·측면 라디에이터를 동시에 달 수 있습니다. 대형 구성에서 공간 때문에 막히는 일이 거의 없습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lianli-o11-dynamic-evo'), 'kind', 'case', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lianli-o11-dynamic-evo'), 'formFactors', '["ATX","mATX","ITX"]', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lianli-o11-dynamic-evo'), 'maxGpuLengthMm', '420', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lianli-o11-dynamic-evo'), 'maxCoolerHeightMm', '167', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lianli-o11-dynamic-evo'), 'size', '미들타워', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cooler'), 'intel-stock-cooler', 'COO-INT-STOCK', '인텔 기본 쿨러 (LGA1700)', 'Intel', 15000, null, 60, 'active', '높이 47mm. 65W 이하 CPU 전용입니다.', '높이가 낮아 어떤 케이스에도 들어가지만 감당 가능한 발열이 65W까지입니다. K 모델에는 쓸 수 없습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-stock-cooler'), 'kind', 'cooler', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-stock-cooler'), 'coolerType', '공랭', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-stock-cooler'), 'heightMm', '47', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-stock-cooler'), 'sockets', '["LGA1700"]', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-stock-cooler'), 'tdpRating', '65', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cooler'), 'pccooler-rz400', 'COO-PCC-RZ400', 'PCCOOLER RZ400 공랭', 'PCCOOLER', 29000, 26000, 40, 'active', '높이 152mm 공랭. 가격 대비 성능이 좋습니다.', '이 가격대에서 성능이 가장 무난합니다. 152mm라 미니타워에도 대체로 들어갑니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'pccooler-rz400'), 'kind', 'cooler', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'pccooler-rz400'), 'coolerType', '공랭', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'pccooler-rz400'), 'heightMm', '152', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'pccooler-rz400'), 'sockets', '["LGA1700","AM4","AM5"]', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'pccooler-rz400'), 'tdpRating', '180', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'pccooler-rz400'), 'badges', '["인기"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cooler'), 'noctua-nh-d15', 'COO-NOC-D15', '녹투아 NH-D15 chromax.black', 'Noctua', 159000, null, 9, 'active', '높이 165mm 듀얼타워 공랭. 수랭급 성능에 소음이 적습니다.', '공랭 중 최상급입니다. 다만 165mm로 높아 케이스 지원 높이를 반드시 확인해야 합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'noctua-nh-d15'), 'kind', 'cooler', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'noctua-nh-d15'), 'coolerType', '공랭', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'noctua-nh-d15'), 'heightMm', '165', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'noctua-nh-d15'), 'sockets', '["LGA1700","LGA1851","AM4","AM5"]', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'noctua-nh-d15'), 'tdpRating', '250', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cooler'), '3rsys-socool-rc240', 'COO-3RS-RC240', '3RSYS SOCOOL RC240 수랭', '3RSYS', 89000, 79000, 14, 'active', '240mm 수랭. 높이 제약에서 자유롭습니다.', '라디에이터를 케이스 상단이나 전면에 다는 방식이라 CPU 위 공간을 차지하지 않습니다. 대신 케이스가 240mm 라디에이터를 지원해야 합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = '3rsys-socool-rc240'), 'kind', 'cooler', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = '3rsys-socool-rc240'), 'coolerType', '수랭', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = '3rsys-socool-rc240'), 'heightMm', '0', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = '3rsys-socool-rc240'), 'sockets', '["LGA1700","LGA1851","AM4","AM5"]', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = '3rsys-socool-rc240'), 'tdpRating', '250', 4);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'monitor'), 'lg-27gs60f', 'MON-LGE-27GS60', 'LG 울트라기어 27GS60F', 'LG전자', 289000, 259000, 17, 'active', '27인치 FHD 180Hz IPS.', 'FHD 고주사율 게이밍용입니다. IPS 패널이라 색이 무난하고 시야각이 넓습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lg-27gs60f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'lg-27gs60f'), 'highlights', '["27인치","FHD 1920x1080","180Hz","IPS","1ms"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'monitor'), 'samsung-odyssey-g5', 'MON-SAM-G5', '삼성 오디세이 G5 32인치', '삼성전자', 419000, null, 10, 'active', '32인치 QHD 165Hz 커브드.', 'QHD 해상도에 곡률이 들어간 32인치입니다. 게임 몰입감 위주의 선택입니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-odyssey-g5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-odyssey-g5'), 'highlights', '["32인치","QHD 2560x1440","165Hz","VA","1000R 곡률"]', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'samsung-odyssey-g5'), 'badges', '["인기"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'monitor'), 'dell-u2723qe', 'MON-DEL-U2723', 'DELL UltraSharp U2723QE', 'DELL', 749000, null, 5, 'active', '27인치 4K 60Hz. 작업용 색 정확도가 강점입니다.', '게임보다 작업용입니다. 색 정확도가 높고 USB-C 한 선으로 화면·전원·허브가 연결됩니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'dell-u2723qe'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'dell-u2723qe'), 'highlights', '["27인치","4K 3840x2160","60Hz","IPS Black","USB-C 90W"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'peripheral'), 'logitech-g-pro-x-tkl', 'PER-LOG-GPROX', '로지텍 G PRO X TKL', 'Logitech', 189000, 169000, 21, 'active', '텐키리스 기계식 무선 키보드.', '텐키를 뺀 크기라 마우스 공간이 넓어집니다. 무선 지연은 체감되지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'logitech-g-pro-x-tkl'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'logitech-g-pro-x-tkl'), 'highlights', '["텐키리스","기계식 적축","무선 LIGHTSPEED","RGB"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'peripheral'), 'razer-viper-v3-pro', 'PER-RAZ-VIPERV3', 'Razer Viper V3 Pro', 'Razer', 219000, null, 13, 'active', '54g 초경량 무선 게이밍 마우스.', '54g로 가볍고 8000Hz 폴링을 지원합니다. FPS 위주 사용자를 겨냥한 제품입니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'razer-viper-v3-pro'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'razer-viper-v3-pro'), 'highlights', '["54g","무선 HyperSpeed","35K DPI","8000Hz 폴링"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'peripheral'), 'steelseries-arctis-nova-5', 'PER-STE-NOVA5', '스틸시리즈 Arctis Nova 5', 'SteelSeries', 159000, 139000, 0, 'soldout', '무선 게이밍 헤드셋. 배터리 60시간.', '착용감이 가볍고 배터리가 오래갑니다. 마이크 품질은 이 가격대 평균 수준입니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'steelseries-arctis-nova-5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'steelseries-arctis-nova-5'), 'highlights', '["무선 2.4GHz","배터리 60시간","블루투스 동시 연결"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-9850x3d', 'CPU-RYZEN7-9850X3D', '라이젠7 9850X3D', 'AMD', 734870, null, 10, 'active', 'FHD 게임 상대성능 1.31 · 멀티스레드 0.95 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-9850x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-9850x3d'), 'highlights', '["FHD 게임 1.31","멀티 0.95"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-9800x3d', 'CPU-RYZEN7-9800X3D', '라이젠7 9800X3D', 'AMD', 700280, null, 10, 'active', 'FHD 게임 상대성능 1.28 · 멀티스레드 0.94 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-9800x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-9800x3d'), 'highlights', '["FHD 게임 1.28","멀티 0.94"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen9-9950x3d2', 'CPU-RYZEN9-9950X3D2', '라이젠9 9950X3D2', 'AMD', 1431000, null, 10, 'active', 'FHD 게임 상대성능 1.27 · 멀티스레드 1.79 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9950x3d2'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9950x3d2'), 'highlights', '["FHD 게임 1.27","멀티 1.79"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen9-9950x3d', 'CPU-RYZEN9-9950X3D', '라이젠9 9950X3D', 'AMD', 1069500, null, 10, 'active', 'FHD 게임 상대성능 1.26 · 멀티스레드 1.73 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 입고. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9950x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9950x3d'), 'highlights', '["FHD 게임 1.26","멀티 1.73"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen9-9900x3d', 'CPU-RYZEN9-9900X3D', '라이젠9 9900X3D', 'AMD', 846990, null, 10, 'active', 'FHD 게임 상대성능 1.23 · 멀티스레드 1.33 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9900x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9900x3d'), 'highlights', '["FHD 게임 1.23","멀티 1.33"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-7800x3d', 'CPU-RYZEN7-7800X3D', '라이젠7 7800X3D', 'AMD', 481870, null, 10, 'active', 'FHD 게임 상대성능 1.21 · 멀티스레드 0.75 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-7800x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-7800x3d'), 'highlights', '["FHD 게임 1.21","멀티 0.75"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-7700x3d', 'CPU-RYZEN7-7700X3D', '라이젠7 7700X3D', 'AMD', 386330, null, 10, 'active', 'FHD 게임 상대성능 1.18 · 멀티스레드 0.72 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 소량. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-7700x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-7700x3d'), 'highlights', '["FHD 게임 1.18","멀티 0.72"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen9-7950x3d', 'CPU-RYZEN9-7950X3D', '라이젠9 7950X3D', 'AMD', 711130, null, 10, 'active', 'FHD 게임 상대성능 1.20 · 멀티스레드 1.49 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-7950x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-7950x3d'), 'highlights', '["FHD 게임 1.20","멀티 1.49"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-7500x3d', 'CPU-RYZEN5-7500X3D', '라이젠5 7500X3D', 'AMD', 321600, null, 10, 'active', 'FHD 게임 상대성능 1.17 · 멀티스레드 0.54 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-7500x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-7500x3d'), 'highlights', '["FHD 게임 1.17","멀티 0.54"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra7-270k', 'CPU-CORE-ULTRA7-270K', '코어 울트라7 270K+', 'Intel', 516790, null, 10, 'active', 'FHD 게임 상대성능 1.14 · 멀티스레드 1.82 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-270k'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-270k'), 'highlights', '["FHD 게임 1.14","멀티 1.82"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'amd-ryzen7-9700x', 'CPU-AMD-9700X', '라이젠7 9700X', 'AMD', 403180, null, 10, 'active', '8코어 16스레드를 65W로 돌립니다. 전력 효율이 강점입니다.', '같은 성능대의 인텔 대비 소비전력이 절반 수준입니다. 파워와 쿨러 예산을 아낄 수 있어 전체 견적으로 보면 차이가 줄어듭니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'kind', 'cpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'socket', 'AM5', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'cores', '8', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'threads', '16', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'baseClock', '3.8GHz', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'tdp', '65', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'tier', '8', 6);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'igpu', 'true', 7);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen7-9700x'), 'badges', '["신제품"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen9-9950x', 'CPU-RYZEN9-9950X', '라이젠9 9950X', 'AMD', 845990, null, 10, 'active', 'FHD 게임 상대성능 1.13 · 멀티스레드 1.75 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9950x'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9950x'), 'highlights', '["FHD 게임 1.13","멀티 1.75"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen9-9900x', 'CPU-RYZEN9-9900X', '라이젠9 9900X', 'AMD', 692160, null, 10, 'active', 'FHD 게임 상대성능 1.12 · 멀티스레드 1.38 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9900x'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-9900x'), 'highlights', '["FHD 게임 1.12","멀티 1.38"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-9600x', 'CPU-RYZEN5-9600X', '라이젠5 9600X', 'AMD', 268590, null, 10, 'active', 'FHD 게임 상대성능 1.11 · 멀티스레드 0.70 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-9600x'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-9600x'), 'highlights', '["FHD 게임 1.11","멀티 0.70"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-14900ks-ddr5', 'CPU-COREI9-14900KS-DDR5', '코어i9-14900KS DDR5', 'Intel', 1000000, null, 10, 'active', 'FHD 게임 상대성능 1.11 · 멀티스레드 1.57 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900ks-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900ks-ddr5'), 'highlights', '["FHD 게임 1.11","멀티 1.57"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-14900k-ddr5', 'CPU-COREI9-14900K-DDR5', '코어i9-14900K DDR5', 'Intel', 878860, null, 10, 'active', 'FHD 게임 상대성능 1.10 · 멀티스레드 1.56 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 71. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900k-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900k-ddr5'), 'highlights', '["FHD 게임 1.10","멀티 1.56"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-14900kf-ddr5', 'CPU-COREI9-14900KF-DDR5', '코어i9-14900KF DDR5', 'Intel', 753290, null, 10, 'active', 'FHD 게임 상대성능 1.10 · 멀티스레드 1.56 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 63. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900kf-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900kf-ddr5'), 'highlights', '["FHD 게임 1.10","멀티 1.56"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-14900-ddr5', 'CPU-COREI9-14900-DDR5', '코어i9-14900 DDR5', 'Intel', 929890, null, 10, 'active', 'FHD 게임 상대성능 1.09 · 멀티스레드 1.51 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 71. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900-ddr5'), 'highlights', '["FHD 게임 1.09","멀티 1.51"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-14900f-ddr5', 'CPU-COREI9-14900F-DDR5', '코어i9-14900F DDR5', 'Intel', 887910, null, 10, 'active', 'FHD 게임 상대성능 1.09 · 멀티스레드 1.51 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 83. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900f-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-14900f-ddr5'), 'highlights', '["FHD 게임 1.09","멀티 1.51"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-13900k-ddr5', 'CPU-COREI9-13900K-DDR5', '코어i9-13900K DDR5', 'Intel', 732520, null, 0, 'soldout', 'FHD 게임 상대성능 1.09 · 멀티스레드 1.52 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절
벌크. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-13900k-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-13900k-ddr5'), 'highlights', '["FHD 게임 1.09","멀티 1.52"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-13900kf-ddr5', 'CPU-COREI9-13900KF-DDR5', '코어i9-13900KF DDR5', 'Intel', 544830, null, 0, 'soldout', 'FHD 게임 상대성능 1.09 · 멀티스레드 1.52 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절
벌크. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-13900kf-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-13900kf-ddr5'), 'highlights', '["FHD 게임 1.09","멀티 1.52"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-9600', 'CPU-RYZEN5-9600', '라이젠5 9600', 'AMD', 265000, null, 10, 'active', 'FHD 게임 상대성능 1.08 · 멀티스레드 0.67 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-9600'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-9600'), 'highlights', '["FHD 게임 1.08","멀티 0.67"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'intel-i7-14700k', 'CPU-INT-14700K', '코어i7-14700K DDR5', 'Intel', 580340, null, 10, 'active', '20코어 28스레드. 게임과 작업을 함께 하는 구성용입니다.', '배수 잠금이 풀린 K 모델이라 오버클럭이 가능합니다. 대신 발열이 큽니다 — 기본 쿨러로는 감당이 안 되니 별도 쿨러를 반드시 함께 고르세요.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i7-14700k'), 'kind', 'cpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i7-14700k'), 'socket', 'LGA1700', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i7-14700k'), 'cores', '20', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i7-14700k'), 'threads', '28', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i7-14700k'), 'baseClock', '3.4GHz', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i7-14700k'), 'tdp', '125', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i7-14700k'), 'tier', '8', 6);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i7-14700k'), 'igpu', 'true', 7);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-14700kf-ddr5', 'CPU-COREI7-14700KF-DDR5', '코어i7-14700KF DDR5', 'Intel', 530370, null, 0, 'soldout', 'FHD 게임 상대성능 1.08 · 멀티스레드 1.40 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-14700kf-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-14700kf-ddr5'), 'highlights', '["FHD 게임 1.08","멀티 1.40"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-13700k-ddr5', 'CPU-COREI7-13700K-DDR5', '코어i7-13700K DDR5', 'Intel', 605060, null, 0, 'soldout', 'FHD 게임 상대성능 1.08 · 멀티스레드 1.18 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-13700k-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-13700k-ddr5'), 'highlights', '["FHD 게임 1.08","멀티 1.18"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-13700kf-ddr5', 'CPU-COREI7-13700KF-DDR5', '코어i7-13700KF DDR5', 'Intel', 401390, null, 0, 'soldout', 'FHD 게임 상대성능 1.08 · 멀티스레드 1.18 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-13700kf-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-13700kf-ddr5'), 'highlights', '["FHD 게임 1.08","멀티 1.18"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-14700-ddr5', 'CPU-COREI7-14700-DDR5', '코어i7-14700 DDR5', 'Intel', 583990, null, 10, 'active', 'FHD 게임 상대성능 1.07 · 멀티스레드 1.33 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 48. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-14700-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-14700-ddr5'), 'highlights', '["FHD 게임 1.07","멀티 1.33"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-14700f-ddr5', 'CPU-COREI7-14700F-DDR5', '코어i7-14700F DDR5', 'Intel', 550140, null, 10, 'active', 'FHD 게임 상대성능 1.07 · 멀티스레드 1.33 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 47. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-14700f-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-14700f-ddr5'), 'highlights', '["FHD 게임 1.07","멀티 1.33"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra9-285k', 'CPU-CORE-ULTRA9-285K', '코어 울트라9 285K', 'Intel', 917660, null, 10, 'active', 'FHD 게임 상대성능 1.07 · 멀티스레드 1.79 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 76. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra9-285k'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra9-285k'), 'highlights', '["FHD 게임 1.07","멀티 1.79"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-13900-ddr5', 'CPU-COREI9-13900-DDR5', '코어i9-13900 DDR5', 'Intel', 720530, null, 0, 'soldout', 'FHD 게임 상대성능 1.07 · 멀티스레드 1.50 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-13900-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-13900-ddr5'), 'highlights', '["FHD 게임 1.07","멀티 1.50"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-13900f-ddr5', 'CPU-COREI9-13900F-DDR5', '코어i9-13900F DDR5', 'Intel', 852440, null, 0, 'soldout', 'FHD 게임 상대성능 1.07 · 멀티스레드 1.50 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-13900f-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-13900f-ddr5'), 'highlights', '["FHD 게임 1.07","멀티 1.50"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-9500f', 'CPU-RYZEN5-9500F', '라이젠5 9500F', 'AMD', 245000, null, 10, 'active', 'FHD 게임 상대성능 1.06 · 멀티스레드 0.65 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-9500f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-9500f'), 'highlights', '["FHD 게임 1.06","멀티 0.65"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra9-285', 'CPU-CORE-ULTRA9-285', '코어 울트라9 285', 'Intel', 770970, null, 0, 'soldout', 'FHD 게임 상대성능 1.02 · 멀티스레드 1.34 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra9-285'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra9-285'), 'highlights', '["FHD 게임 1.02","멀티 1.34"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-5800x3d', 'CPU-RYZEN7-5800X3D', '라이젠7 5800X3D', 'AMD', 600780, null, 10, 'active', 'FHD 게임 상대성능 1.06 · 멀티스레드 0.61 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 재출시. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-5800x3d'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-5800x3d'), 'highlights', '["FHD 게임 1.06","멀티 0.61"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-13700-ddr5', 'CPU-COREI7-13700-DDR5', '코어i7-13700 DDR5', 'Intel', 610990, null, 0, 'soldout', 'FHD 게임 상대성능 1.06 · 멀티스레드 1.13 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-13700-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-13700-ddr5'), 'highlights', '["FHD 게임 1.06","멀티 1.13"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-13700f-ddr5', 'CPU-COREI7-13700F-DDR5', '코어i7-13700F DDR5', 'Intel', 438560, null, 0, 'soldout', 'FHD 게임 상대성능 1.06 · 멀티스레드 1.13 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-13700f-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-13700f-ddr5'), 'highlights', '["FHD 게임 1.06","멀티 1.13"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra5-250k', 'CPU-CORE-ULTRA5-250K', '코어 울트라5 250K+', 'Intel', 356990, null, 10, 'active', 'FHD 게임 상대성능 1.05 · 멀티스레드 1.37 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 33. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-250k'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-250k'), 'highlights', '["FHD 게임 1.05","멀티 1.37"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra5-250kf', 'CPU-CORE-ULTRA5-250KF', '코어 울트라5 250KF+', 'Intel', 299575, null, 10, 'active', 'FHD 게임 상대성능 1.05 · 멀티스레드 1.37 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 기준. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-250kf'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-250kf'), 'highlights', '["FHD 게임 1.05","멀티 1.37"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra7-265k', 'CPU-CORE-ULTRA7-265K', '코어 울트라7 265K', 'Intel', 424250, null, 0, 'soldout', 'FHD 게임 상대성능 1.03 · 멀티스레드 1.53 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-265k'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-265k'), 'highlights', '["FHD 게임 1.03","멀티 1.53"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra7-265kf', 'CPU-CORE-ULTRA7-265KF', '코어 울트라7 265KF', 'Intel', 425010, null, 0, 'soldout', 'FHD 게임 상대성능 1.03 · 멀티스레드 1.53 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-265kf'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-265kf'), 'highlights', '["FHD 게임 1.03","멀티 1.53"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra7-265', 'CPU-CORE-ULTRA7-265', '코어 울트라7 265', 'Intel', 623990, null, 10, 'active', 'FHD 게임 상대성능 1.01 · 멀티스레드 1.22 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 47. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-265'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-265'), 'highlights', '["FHD 게임 1.01","멀티 1.22"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra7-265f', 'CPU-CORE-ULTRA7-265F', '코어 울트라7 265F', 'Intel', 522000, null, 10, 'active', 'FHD 게임 상대성능 1.01 · 멀티스레드 1.22 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 52. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-265f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra7-265f'), 'highlights', '["FHD 게임 1.01","멀티 1.22"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen9-7900x', 'CPU-RYZEN9-7900X', '라이젠9 7900X', 'AMD', 437410, null, 10, 'active', 'FHD 게임 상대성능 0.99 · 멀티스레드 1.19 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-7900x'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-7900x'), 'highlights', '["FHD 게임 0.99","멀티 1.19"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-7700x', 'CPU-RYZEN7-7700X', '라이젠7 7700X', 'AMD', 365000, null, 10, 'active', 'FHD 게임 상대성능 0.98 · 멀티스레드 0.83 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-7700x'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-7700x'), 'highlights', '["FHD 게임 0.98","멀티 0.83"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-12900k-ddr5', 'CPU-COREI9-12900K-DDR5', '코어i9-12900K DDR5', 'Intel', 643070, null, 0, 'soldout', 'FHD 게임 상대성능 0.98 · 멀티스레드 1.13 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-12900k-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-12900k-ddr5'), 'highlights', '["FHD 게임 0.98","멀티 1.13"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-12900kf-ddr5', 'CPU-COREI9-12900KF-DDR5', '코어i9-12900KF DDR5', 'Intel', 229, null, 10, 'active', 'FHD 게임 상대성능 0.98 · 멀티스레드 1.13 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-12900kf-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-12900kf-ddr5'), 'highlights', '["FHD 게임 0.98","멀티 1.13"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen9-7900', 'CPU-RYZEN9-7900', '라이젠9 7900', 'AMD', 478000, null, 10, 'active', 'FHD 게임 상대성능 0.97 · 멀티스레드 1.04 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-7900'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen9-7900'), 'highlights', '["FHD 게임 0.97","멀티 1.04"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei9-12900-ddr5', 'CPU-COREI9-12900-DDR5', '코어i9-12900 DDR5', 'Intel', 679900, null, 0, 'soldout', 'FHD 게임 상대성능 0.97 · 멀티스레드 1.10 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-12900-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei9-12900-ddr5'), 'highlights', '["FHD 게임 0.97","멀티 1.10"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-7700', 'CPU-RYZEN7-7700', '라이젠7 7700', 'AMD', 347870, null, 10, 'active', 'FHD 게임 상대성능 0.96 · 멀티스레드 0.78 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-7700'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-7700'), 'highlights', '["FHD 게임 0.96","멀티 0.78"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-7600x', 'CPU-RYZEN5-7600X', '라이젠5 7600X', 'AMD', 342060, null, 0, 'soldout', 'FHD 게임 상대성능 0.96 · 멀티스레드 0.64 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-7600x'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-7600x'), 'highlights', '["FHD 게임 0.96","멀티 0.64"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-14600k-ddr5', 'CPU-COREI5-14600K-DDR5', '코어i5-14600K DDR5', 'Intel', 416880, null, 0, 'soldout', 'FHD 게임 상대성능 1.01 · 멀티스레드 1.00 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절
벌크가격. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14600k-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14600k-ddr5'), 'highlights', '["FHD 게임 1.01","멀티 1.00"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-14600kf-ddr5', 'CPU-COREI5-14600KF-DDR5', '코어i5-14600KF DDR5', 'Intel', 378170, null, 0, 'soldout', 'FHD 게임 상대성능 1.01 · 멀티스레드 1.00 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절
벌크가격. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14600kf-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14600kf-ddr5'), 'highlights', '["FHD 게임 1.01","멀티 1.00"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-14600-ddr5', 'CPU-COREI5-14600-DDR5', '코어i5-14600 DDR5', 'Intel', 364290, null, 10, 'active', 'FHD 게임 상대성능 1.00 · 멀티스레드 0.98 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크(쿨러X). 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14600-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14600-ddr5'), 'highlights', '["FHD 게임 1.00","멀티 0.98"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-13600k-ddr5', 'CPU-COREI5-13600K-DDR5', '코어i5-13600K DDR5', 'Intel', 374020, null, 0, 'soldout', 'FHD 게임 상대성능 0.99 · 멀티스레드 0.95 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절
벌크가격. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13600k-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13600k-ddr5'), 'highlights', '["FHD 게임 0.99","멀티 0.95"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-13600kf-ddr5', 'CPU-COREI5-13600KF-DDR5', '코어i5-13600KF DDR5', 'Intel', 358200, null, 0, 'soldout', 'FHD 게임 상대성능 0.99 · 멀티스레드 0.95 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절
벌크가격. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13600kf-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13600kf-ddr5'), 'highlights', '["FHD 게임 0.99","멀티 0.95"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra5-245k', 'CPU-CORE-ULTRA5-245K', '코어 울트라5 245K', 'Intel', 335520, null, 10, 'active', 'FHD 게임 상대성능 0.98 · 멀티스레드 1.10 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 26. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-245k'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-245k'), 'highlights', '["FHD 게임 0.98","멀티 1.10"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra5-245kf', 'CPU-CORE-ULTRA5-245KF', '코어 울트라5 245KF', 'Intel', 295350, null, 10, 'active', 'FHD 게임 상대성능 0.98 · 멀티스레드 1.10 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 24. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-245kf'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-245kf'), 'highlights', '["FHD 게임 0.98","멀티 1.10"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra5-235', 'CPU-CORE-ULTRA5-235', '코어 울트라5 235', 'Intel', 447250, null, 10, 'active', 'FHD 게임 상대성능 0.96 · 멀티스레드 0.98 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 40. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-235'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-235'), 'highlights', '["FHD 게임 0.96","멀티 0.98"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'amd-ryzen5-7600', 'CPU-AMD-7600', '라이젠5 7600', 'AMD', 289000, null, 0, 'soldout', '6코어 12스레드. 65W라 쿨링 부담이 적습니다.', 'AM5 소켓의 입문 라인입니다. 소켓 수명이 길어 나중에 CPU만 갈아끼우는 업그레이드가 가능합니다. DDR5 전용이라 메모리를 함께 맞춰야 합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-7600'), 'kind', 'cpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-7600'), 'socket', 'AM5', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-7600'), 'cores', '6', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-7600'), 'threads', '12', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-7600'), 'baseClock', '3.8GHz', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-7600'), 'tdp', '65', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-7600'), 'tier', '6', 6);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-7600'), 'igpu', 'true', 7);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-12700k-ddr5', 'CPU-COREI7-12700K-DDR5', '코어i7-12700K DDR5', 'Intel', 410180, null, 0, 'soldout', 'FHD 게임 상대성능 0.94 · 멀티스레드 0.95 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-12700k-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-12700k-ddr5'), 'highlights', '["FHD 게임 0.94","멀티 0.95"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-12700kf-ddr5', 'CPU-COREI7-12700KF-DDR5', '코어i7-12700KF DDR5', 'Intel', 332190, null, 0, 'soldout', 'FHD 게임 상대성능 0.94 · 멀티스레드 0.95 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-12700kf-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-12700kf-ddr5'), 'highlights', '["FHD 게임 0.94","멀티 0.95"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-12700-ddr5', 'CPU-COREI7-12700-DDR5', '코어i7-12700 DDR5', 'Intel', 443690, null, 0, 'soldout', 'FHD 게임 상대성능 0.93 · 멀티스레드 0.91 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-12700-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-12700-ddr5'), 'highlights', '["FHD 게임 0.93","멀티 0.91"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei7-12700f-ddr5', 'CPU-COREI7-12700F-DDR5', '코어i7-12700F DDR5', 'Intel', 413340, null, 0, 'soldout', 'FHD 게임 상대성능 0.93 · 멀티스레드 0.91 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-12700f-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei7-12700f-ddr5'), 'highlights', '["FHD 게임 0.93","멀티 0.91"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-7500f', 'CPU-RYZEN5-7500F', '라이젠5 7500F', 'AMD', 175960, null, 10, 'active', 'FHD 게임 상대성능 0.91 · 멀티스레드 0.60 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-7500f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-7500f'), 'highlights', '["FHD 게임 0.91","멀티 0.60"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra5-225', 'CPU-CORE-ULTRA5-225', '코어 울트라5 225', 'Intel', 306000, null, 10, 'active', 'FHD 게임 상대성능 0.91 · 멀티스레드 0.75 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 25. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-225'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-225'), 'highlights', '["FHD 게임 0.91","멀티 0.75"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-core-ultra5-225f', 'CPU-CORE-ULTRA5-225F', '코어 울트라5 225F', 'Intel', 219990, null, 10, 'active', 'FHD 게임 상대성능 0.91 · 멀티스레드 0.75 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 18. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-225f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-core-ultra5-225f'), 'highlights', '["FHD 게임 0.91","멀티 0.75"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-13600-ddr5', 'CPU-COREI5-13600-DDR5', '코어i5-13600 DDR5', 'Intel', 363440, null, 10, 'active', 'FHD 게임 상대성능 0.90 · 멀티스레드 0.90 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크(쿨러X). 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13600-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13600-ddr5'), 'highlights', '["FHD 게임 0.90","멀티 0.90"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-14500-ddr5', 'CPU-COREI5-14500-DDR5', '코어i5-14500 DDR5', 'Intel', 387960, null, 0, 'soldout', 'FHD 게임 상대성능 0.90 · 멀티스레드 0.88 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14500-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14500-ddr5'), 'highlights', '["FHD 게임 0.90","멀티 0.88"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-7400f', 'CPU-RYZEN5-7400F', '라이젠5 7400F', 'AMD', 172420, null, 10, 'active', 'FHD 게임 상대성능 0.89 · 멀티스레드 0.58 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-7400f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-7400f'), 'highlights', '["FHD 게임 0.89","멀티 0.58"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-13500-ddr5', 'CPU-COREI5-13500-DDR5', '코어i5-13500 DDR5', 'Intel', 352040, null, 0, 'soldout', 'FHD 게임 상대성능 0.88 · 멀티스레드 0.86 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13500-ddr5'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13500-ddr5'), 'highlights', '["FHD 게임 0.88","멀티 0.86"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-13600k-ddr4', 'CPU-COREI5-13600K-DDR4', '코어i5-13600K DDR4', 'Intel', 358200, null, 0, 'soldout', 'FHD 게임 상대성능 0.95 · 멀티스레드 0.95 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품품절
벌크. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13600k-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13600k-ddr4'), 'highlights', '["FHD 게임 0.95","멀티 0.95"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-12600k-ddr4', 'CPU-COREI5-12600K-DDR4', '코어i5-12600K DDR4', 'Intel', 330000, null, 0, 'soldout', 'FHD 게임 상대성능 0.82 · 멀티스레드 0.72 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품품절
벌크. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12600k-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12600k-ddr4'), 'highlights', '["FHD 게임 0.82","멀티 0.72"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-12600kf-ddr4', 'CPU-COREI5-12600KF-DDR4', '코어i5-12600KF DDR4', 'Intel', 279880, null, 0, 'soldout', 'FHD 게임 상대성능 0.82 · 멀티스레드 0.72 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품품절
벌크. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12600kf-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12600kf-ddr4'), 'highlights', '["FHD 게임 0.82","멀티 0.72"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-14400-ddr4', 'CPU-COREI5-14400-DDR4', '코어i5-14400 DDR4', 'Intel', 337460, null, 10, 'active', 'FHD 게임 상대성능 0.82 · 멀티스레드 0.70 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 25. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14400-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-14400-ddr4'), 'highlights', '["FHD 게임 0.82","멀티 0.70"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'intel-i5-14400f', 'CPU-INT-14400F', '코어i5-14400F DDR4', 'Intel', 241090, null, 10, 'active', '10코어 16스레드. 가격 대비 게임 성능이 가장 무난한 선택입니다.', '게임 위주로 쓴다면 이 급에서 더 올릴 이유가 크지 않습니다. 내장 그래픽이 없는 F 모델이라 그래픽카드가 반드시 필요합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'kind', 'cpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'socket', 'LGA1700', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'cores', '10', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'threads', '16', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'baseClock', '2.5GHz', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'tdp', '65', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'tier', '6', 6);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'igpu', 'false', 7);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'intel-i5-14400f'), 'badges', '["인기"]', 99);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-13400-ddr4', 'CPU-COREI5-13400-DDR4', '코어i5-13400 DDR4', 'Intel', 352590, null, 10, 'active', 'FHD 게임 상대성능 0.81 · 멀티스레드 0.68 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 25. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13400-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13400-ddr4'), 'highlights', '["FHD 게임 0.81","멀티 0.68"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-13400f-ddr4', 'CPU-COREI5-13400F-DDR4', '코어i5-13400F DDR4', 'Intel', 218950, null, 0, 'soldout', 'FHD 게임 상대성능 0.81 · 멀티스레드 0.68 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품품절
벌크. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13400f-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-13400f-ddr4'), 'highlights', '["FHD 게임 0.81","멀티 0.68"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-8700g', 'CPU-RYZEN7-8700G', '라이젠7 8700G', 'AMD', 413890, null, 10, 'active', 'FHD 게임 상대성능 0.83 · 멀티스레드 0.81 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-8700g'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-8700g'), 'highlights', '["FHD 게임 0.83","멀티 0.81"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-8700f', 'CPU-RYZEN7-8700F', '라이젠7 8700F (피닉스)', 'AMD', 225450, null, 10, 'active', 'FHD 게임 상대성능 0.83 · 멀티스레드 0.80 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 사면호구1. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-8700f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-8700f'), 'highlights', '["FHD 게임 0.83","멀티 0.80"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-8600g', 'CPU-RYZEN5-8600G', '라이젠5 8600G', 'AMD', 269700, null, 10, 'active', 'FHD 게임 상대성능 0.79 · 멀티스레드 0.62 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-8600g'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-8600g'), 'highlights', '["FHD 게임 0.79","멀티 0.62"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-12500-ddr4', 'CPU-COREI5-12500-DDR4', '코어i5-12500 DDR4', 'Intel', 372800, null, 10, 'active', 'FHD 게임 상대성능 0.80 · 멀티스레드 0.55 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크(쿨러X). 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12500-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12500-ddr4'), 'highlights', '["FHD 게임 0.80","멀티 0.55"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-12400-ddr4', 'CPU-COREI5-12400-DDR4', '코어i5-12400 DDR4', 'Intel', 292770, null, 10, 'active', 'FHD 게임 상대성능 0.77 · 멀티스레드 0.52 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 25. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12400-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12400-ddr4'), 'highlights', '["FHD 게임 0.77","멀티 0.52"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei5-12400f-ddr4', 'CPU-COREI5-12400F-DDR4', '코어i5-12400F DDR4', 'Intel', 195000, null, 10, 'active', 'FHD 게임 상대성능 0.77 · 멀티스레드 0.52 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크 18. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12400f-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei5-12400f-ddr4'), 'highlights', '["FHD 게임 0.77","멀티 0.52"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'amd-ryzen5-5600', 'CPU-AMD-5600', '라이젠5 5600', 'AMD', 164990, null, 10, 'active', '구형 AM4 플랫폼. 최소 예산 구성에 씁니다.', '단종 수순인 AM4 소켓이라 업그레이드 여지는 없지만, 가격이 내려갈 대로 내려가 최소 예산 구성에서는 여전히 선택지입니다. DDR4 메인보드와 묶어야 합니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-5600'), 'kind', 'cpu', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-5600'), 'socket', 'AM4', 1);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-5600'), 'cores', '6', 2);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-5600'), 'threads', '12', 3);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-5600'), 'baseClock', '3.5GHz', 4);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-5600'), 'tdp', '65', 5);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-5600'), 'tier', '4', 6);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'amd-ryzen5-5600'), 'igpu', 'false', 7);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-8500g', 'CPU-RYZEN5-8500G', '라이젠5 8500G', 'AMD', 235000, null, 10, 'active', 'FHD 게임 상대성능 0.76 · 멀티스레드 0.48 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-8500g'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-8500g'), 'highlights', '["FHD 게임 0.76","멀티 0.48"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-8400f', 'CPU-RYZEN5-8400F', '라이젠5 8400F', 'AMD', 176180, null, 10, 'active', 'FHD 게임 상대성능 0.76 · 멀티스레드 0.60 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 사면호구2. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-8400f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-8400f'), 'highlights', '["FHD 게임 0.76","멀티 0.60"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-14100-ddr4', 'CPU-COREI3-14100-DDR4', '코어i3-14100 DDR4', 'Intel', 190500, null, 10, 'active', 'FHD 게임 상대성능 0.74 · 멀티스레드 0.40 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크+쿨러. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-14100-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-14100-ddr4'), 'highlights', '["FHD 게임 0.74","싱글 0.89","멀티 0.40"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-14100f-ddr4', 'CPU-COREI3-14100F-DDR4', '코어i3-14100F DDR4', 'Intel', 172260, null, 10, 'active', 'FHD 게임 상대성능 0.74 · 멀티스레드 0.40 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-14100f-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-14100f-ddr4'), 'highlights', '["FHD 게임 0.74","싱글 0.89","멀티 0.40"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-13100-ddr4', 'CPU-COREI3-13100-DDR4', '코어i3-13100 DDR4', 'Intel', 241000, null, 10, 'active', 'FHD 게임 상대성능 0.72 · 멀티스레드 0.38 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크+쿨러. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-13100-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-13100-ddr4'), 'highlights', '["FHD 게임 0.72","싱글 0.86","멀티 0.38"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-13100f-ddr4', 'CPU-COREI3-13100F-DDR4', '코어i3-13100F DDR4', 'Intel', 177990, null, 10, 'active', 'FHD 게임 상대성능 0.72 · 멀티스레드 0.38 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크+쿨러. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-13100f-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-13100f-ddr4'), 'highlights', '["FHD 게임 0.72","싱글 0.86","멀티 0.38"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-12100-ddr4', 'CPU-COREI3-12100-DDR4', '코어i3-12100 DDR4', 'Intel', 193620, null, 10, 'active', 'FHD 게임 상대성능 0.68 · 멀티스레드 0.36 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크+쿨러. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-12100-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-12100-ddr4'), 'highlights', '["FHD 게임 0.68","싱글 0.84","멀티 0.36"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-12100f-ddr4', 'CPU-COREI3-12100F-DDR4', '코어i3-12100F DDR4', 'Intel', 159600, null, 10, 'active', 'FHD 게임 상대성능 0.68 · 멀티스레드 0.36 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크+쿨러. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-12100f-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-12100f-ddr4'), 'highlights', '["FHD 게임 0.68","싱글 0.84","멀티 0.36"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen7-5700g', 'CPU-RYZEN7-5700G', '라이젠7 5700G', 'AMD', 323990, null, 0, 'soldout', 'FHD 게임 상대성능 0.72 · 멀티스레드 0.62 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-5700g'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen7-5700g'), 'highlights', '["FHD 게임 0.72","싱글 0.78","멀티 0.62"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-5600gt', 'CPU-RYZEN5-5600GT', '라이젠5 5600GT', 'AMD', 206500, null, 10, 'active', 'FHD 게임 상대성능 0.80 · 멀티스레드 0.47 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-5600gt'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-5600gt'), 'highlights', '["FHD 게임 0.80","싱글 0.78","멀티 0.47"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-5600g', 'CPU-RYZEN5-5600G', '라이젠5 5600G', 'AMD', 215200, null, 10, 'active', 'FHD 게임 상대성능 0.69 · 멀티스레드 0.46 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-5600g'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-5600g'), 'highlights', '["FHD 게임 0.69","싱글 0.74","멀티 0.46"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen5-5500gt', 'CPU-RYZEN5-5500GT', '라이젠5 5500GT', 'AMD', 195910, null, 10, 'active', 'FHD 게임 상대성능 0.78 · 멀티스레드 0.46 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-5500gt'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen5-5500gt'), 'highlights', '["FHD 게임 0.78","싱글 0.73","멀티 0.46"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-10105', 'CPU-COREI3-10105', '코어i3-10105', 'Intel', 154560, null, 10, 'active', 'FHD 게임 상대성능 0.66 · 멀티스레드 0.24 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크+쿨러. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-10105'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-10105'), 'highlights', '["FHD 게임 0.66","싱글 0.58","멀티 0.24"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-10105f', 'CPU-COREI3-10105F', '코어i3-10105F', 'Intel', 106880, null, 10, 'active', 'FHD 게임 상대성능 0.66 · 멀티스레드 0.24 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크+쿨러. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-10105f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-10105f'), 'highlights', '["FHD 게임 0.66","싱글 0.58","멀티 0.24"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-10100', 'CPU-COREI3-10100', '코어i3-10100', 'Intel', 159890, null, 10, 'active', 'FHD 게임 상대성능 0.66 · 멀티스레드 0.24 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 벌크+쿨러. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-10100'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-10100'), 'highlights', '["FHD 게임 0.66","싱글 0.58","멀티 0.24"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-corei3-10100f', 'CPU-COREI3-10100F', '코어i3-10100F', 'Intel', 102000, null, 10, 'active', 'FHD 게임 상대성능 0.66 · 멀티스레드 0.24 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-10100f'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-corei3-10100f'), 'highlights', '["FHD 게임 0.66","싱글 0.58","멀티 0.24"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-ryzen3-5300g', 'CPU-RYZEN3-5300G', '라이젠3 5300G', 'AMD', 178670, null, 10, 'active', 'FHD 게임 상대성능 0.67 · 멀티스레드 0.32 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen3-5300g'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-ryzen3-5300g'), 'highlights', '["FHD 게임 0.67","싱글 0.72","멀티 0.32"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-300-ddr4', 'CPU-300-DDR4', '300 DDR4', '기타', 166500, null, 0, 'soldout', 'FHD 게임 상대성능 0.33 · 멀티스레드 0.17 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-300-ddr4'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-300-ddr4'), 'highlights', '["FHD 게임 0.33","싱글 0.71","멀티 0.17"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-g6400', 'CPU-G6400', '펜티엄 골드 G6400', 'Intel', 72700, null, 0, 'soldout', 'FHD 게임 상대성능 0.89 · 멀티스레드 0.11 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-g6400'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-g6400'), 'highlights', '["FHD 게임 0.89","싱글 0.55","멀티 0.11"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-g5905', 'CPU-G5905', '셀러론 G5905', 'Intel', 54700, null, 0, 'soldout', 'FHD 게임 상대성능 0.74 · 멀티스레드 0.08 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-g5905'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-g5905'), 'highlights', '["FHD 게임 0.74","싱글 0.48","멀티 0.08"]', 1);
insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)
values ((select id from categories where slug = 'cpu'), 'cpu-g5900', 'CPU-G5900', '셀러론 G5900', 'Intel', 89680, null, 0, 'soldout', 'FHD 게임 상대성능 0.67 · 멀티스레드 0.07 (RTX 5070 조합 기준)', '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다. 매입 특이사항: 정품 품절. 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.');
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-g5900'), 'kind', 'generic', 0);
insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = 'cpu-g5900'), 'highlights', '["FHD 게임 0.67","싱글 0.46","멀티 0.07"]', 1);

-- 가격 갱신 설정 싱글턴 행
insert into price_sync_settings (id) values (1);

commit;
