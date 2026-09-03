import rawPriceOverrides from '../../data/price-overrides.json';
import { buildCpuProducts } from './cpu-catalog';
import type { Category, PartSlot, Product } from './types';

/**
 * 목데이터 카탈로그.
 *
 * 3단계에서 Supabase 로 옮길 때 이 파일만 fetch 로 교체하면 되도록,
 * 화면 코드는 아래 조회 함수들만 호출하고 배열에 직접 접근하지 않는다.
 */

export const CATEGORIES: Category[] = [
  {
    slug: 'gaming-pc',
    name: '게이밍 PC',
    group: 'system',
    description: '게임 성능을 기준으로 부품을 맞춘 완제품입니다. 조립·세팅을 마친 상태로 배송됩니다.',
  },
  {
    slug: 'overclock-pc',
    name: '오버클럭 PC',
    group: 'system',
    description: '수랭 쿨링과 고급 메인보드를 얹어 출고 전 오버클럭 검증을 마친 구성입니다.',
  },
  {
    slug: 'cpu',
    name: 'CPU',
    group: 'part',
    description: '인텔·AMD 프로세서. 실물 비교표에서 가져온 목록이며, 조립 스펙이 등록된 모델만 견적짜기에 나타납니다.',
  },
  {
    slug: 'mainboard',
    name: '메인보드',
    group: 'part',
    description: '모든 부품이 꽂히는 판. 소켓과 메모리 규격이 구성 전체를 결정합니다.',
  },
  {
    slug: 'ram',
    name: '메모리',
    group: 'part',
    description: 'DDR4와 DDR5는 서로 호환되지 않습니다. 메인보드 규격을 먼저 확인하세요.',
  },
  {
    slug: 'gpu',
    name: '그래픽카드',
    group: 'part',
    description: '게임 성능을 가장 크게 좌우하는 부품. 길이가 케이스에 들어가는지 확인이 필요합니다.',
  },
  {
    slug: 'ssd',
    name: '저장장치',
    group: 'part',
    description: 'NVMe SSD와 SATA SSD. 체감 속도 차이가 큽니다.',
  },
  {
    slug: 'psu',
    name: '파워',
    group: 'part',
    description: '용량이 모자라면 고사양 게임 중 시스템이 꺼집니다. 여유를 두고 고르세요.',
  },
  {
    slug: 'case',
    name: '케이스',
    group: 'part',
    description: '메인보드 규격, 그래픽카드 길이, 쿨러 높이 세 가지가 들어가야 합니다.',
  },
  {
    slug: 'cooler',
    name: '쿨러',
    group: 'part',
    description: '공랭과 수랭. CPU 발열과 케이스 높이에 맞춰 고릅니다.',
  },
  {
    slug: 'monitor',
    name: '모니터',
    group: 'peripheral',
    description: '주사율과 해상도. 그래픽카드 성능에 맞춰 고르는 편이 낭비가 없습니다.',
  },
  {
    slug: 'peripheral',
    name: '주변기기',
    group: 'peripheral',
    description: '키보드·마우스·헤드셋.',
  },
];

const HAND_PRODUCTS: Product[] = [
  // ─────────────────────────────── 완제품 PC
  {
    slug: 'lx-starter-4060',
    sku: 'SYS-GM-001',
    name: 'LUKA 스타터 4060',
    brand: 'LUKA',
    categorySlug: 'gaming-pc',
    price: 1290000,
    salePrice: 1189000,
    stock: 12,
    status: 'active',
    shortDesc: 'FHD 고주사율 게임을 목표로 맞춘 입문 구성입니다.',
    description:
      'FHD 해상도에서 대부분의 온라인 게임을 높은 프레임으로 돌리는 것을 목표로 맞춘 구성입니다. 발열이 낮은 부품으로만 묶어 소음이 적고, 나중에 그래픽카드만 바꿔도 오래 쓸 수 있도록 파워에 여유를 뒀습니다.',
    spec: {
      kind: 'system',
      cpu: 'i5-14400F',
      gpu: 'RTX 4060 8GB',
      ram: 'DDR5 16GB',
      storage: 'NVMe 500GB',
    },
    badges: ['인기'],
  },
  {
    slug: 'lx-standard-5070',
    sku: 'SYS-GM-002',
    name: 'LUKA 스탠다드 5070',
    brand: 'LUKA',
    categorySlug: 'gaming-pc',
    price: 2190000,
    salePrice: 2049000,
    stock: 7,
    status: 'active',
    shortDesc: 'QHD 주력 구성. 대부분의 최신 게임을 옵션 타협 없이 돌립니다.',
    description:
      'QHD 해상도를 기준으로 맞춘 주력 구성입니다. 그래픽카드와 CPU의 성능 급을 맞춰 어느 한쪽이 놀지 않도록 했고, 저장장치는 로딩 체감이 큰 NVMe 1TB로 올렸습니다.',
    spec: {
      kind: 'system',
      cpu: 'i7-14700K',
      gpu: 'RTX 5070 12GB',
      ram: 'DDR5 32GB',
      storage: 'NVMe 1TB',
    },
    badges: ['인기', '무이자'],
  },
  {
    slug: 'lx-ryzen-9700x',
    sku: 'SYS-GM-003',
    name: 'LUKA 라이젠 9700X',
    brand: 'LUKA',
    categorySlug: 'gaming-pc',
    price: 1990000,
    stock: 5,
    status: 'active',
    shortDesc: '전력 대비 성능을 우선한 AM5 구성입니다.',
    description:
      '같은 성능대에서 소비전력이 낮은 부품으로 묶었습니다. 발열이 적어 쿨러 소음이 작고, AM5 소켓이라 다음 세대 CPU로 업그레이드할 여지가 남습니다.',
    spec: {
      kind: 'system',
      cpu: 'Ryzen 7 9700X',
      gpu: 'RTX 4070 SUPER 12GB',
      ram: 'DDR5 32GB',
      storage: 'NVMe 1TB',
    },
  },
  {
    slug: 'lx-oc-5080',
    sku: 'SYS-OC-001',
    name: 'LUKA OC 5080 수랭',
    brand: 'LUKA',
    categorySlug: 'overclock-pc',
    price: 3890000,
    salePrice: 3690000,
    stock: 3,
    status: 'active',
    shortDesc: '출고 전 오버클럭 검증을 마친 4K 구성입니다.',
    description:
      '4K 해상도를 기준으로 맞춘 최상위 구성입니다. 240mm 수랭으로 발열을 잡고, 출고 전 부하 테스트를 거쳐 오버클럭 설정이 안정적으로 유지되는지 확인한 뒤 배송합니다.',
    spec: {
      kind: 'system',
      cpu: 'i7-14700K',
      gpu: 'RTX 5080 16GB',
      ram: 'DDR5 64GB',
      storage: 'NVMe 2TB',
    },
    badges: ['신제품', '무이자'],
  },
  {
    slug: 'lx-oc-silent',
    sku: 'SYS-OC-002',
    name: 'LUKA OC 사일런트',
    brand: 'LUKA',
    categorySlug: 'overclock-pc',
    price: 2790000,
    stock: 0,
    status: 'soldout',
    shortDesc: '소음을 우선해 팬 곡선까지 맞춘 구성입니다.',
    description:
      '성능보다 정숙성을 앞에 둔 구성입니다. 흡음 케이스와 대형 공랭을 조합하고 팬 회전수 곡선을 직접 잡아, 게임 중에도 소음이 크게 튀지 않습니다.',
    spec: {
      kind: 'system',
      cpu: 'Ryzen 7 9700X',
      gpu: 'RTX 5070 12GB',
      ram: 'DDR5 32GB',
      storage: 'NVMe 2TB',
    },
  },

  // ─────────────────────────────── 메인보드
  {
    slug: 'asus-prime-b760m-k-d5',
    sku: 'MB-ASU-B760MK',
    name: 'ASUS PRIME B760M-K D5',
    brand: 'ASUS',
    categorySlug: 'mainboard',
    price: 159000,
    stock: 22,
    status: 'active',
    shortDesc: 'LGA1700 · DDR5 · mATX. 무난한 보급형입니다.',
    description:
      '오버클럭을 하지 않는 구성이라면 이 급에서 충분합니다. mATX라 작은 케이스에도 들어갑니다.',
    spec: {
      kind: 'mainboard',
      socket: 'LGA1700',
      chipset: 'B760',
      memoryType: 'DDR5',
      memorySlots: 2,
      formFactor: 'mATX',
      tdp: 30,
    },
  },
  {
    slug: 'msi-mag-z790-tomahawk',
    sku: 'MB-MSI-Z790TK',
    name: 'MSI MAG Z790 TOMAHAWK',
    brand: 'MSI',
    categorySlug: 'mainboard',
    price: 379000,
    salePrice: 349000,
    stock: 9,
    status: 'active',
    shortDesc: 'LGA1700 · DDR5 · ATX. 오버클럭용 전원부를 갖췄습니다.',
    description:
      'K 모델 CPU를 오버클럭할 계획이라면 전원부가 이 정도는 되어야 합니다. 메모리 슬롯 4개, M.2 슬롯도 넉넉합니다.',
    spec: {
      kind: 'mainboard',
      socket: 'LGA1700',
      chipset: 'Z790',
      memoryType: 'DDR5',
      memorySlots: 4,
      formFactor: 'ATX',
      tdp: 45,
    },
  },
  {
    slug: 'asus-prime-h610m-k-d4',
    sku: 'MB-ASU-H610MK',
    name: 'ASUS PRIME H610M-K D4',
    brand: 'ASUS',
    categorySlug: 'mainboard',
    price: 109000,
    stock: 30,
    status: 'active',
    shortDesc: 'LGA1700 · DDR4 · mATX. 최저가 구성용입니다.',
    description:
      '같은 LGA1700 소켓이지만 메모리가 DDR4입니다. DDR5 메모리는 물리적으로 꽂히지 않으니 주의하세요.',
    spec: {
      kind: 'mainboard',
      socket: 'LGA1700',
      chipset: 'H610',
      memoryType: 'DDR4',
      memorySlots: 2,
      formFactor: 'mATX',
      tdp: 25,
    },
  },
  {
    slug: 'asrock-b650m-pg',
    sku: 'MB-ASR-B650MPG',
    name: 'ASRock B650M PG Riptide',
    brand: 'ASRock',
    categorySlug: 'mainboard',
    price: 199000,
    salePrice: 182000,
    stock: 16,
    status: 'active',
    shortDesc: 'AM5 · DDR5 · mATX. 라이젠 주력 보드입니다.',
    description: 'AM5 구성에서 가격과 확장성의 균형이 좋은 보드입니다. 메모리 슬롯 4개를 지원합니다.',
    spec: {
      kind: 'mainboard',
      socket: 'AM5',
      chipset: 'B650',
      memoryType: 'DDR5',
      memorySlots: 4,
      formFactor: 'mATX',
      tdp: 30,
    },
  },
  {
    slug: 'msi-b550m-pro-vdh',
    sku: 'MB-MSI-B550M',
    name: 'MSI B550M PRO-VDH WIFI',
    brand: 'MSI',
    categorySlug: 'mainboard',
    price: 129000,
    stock: 14,
    status: 'active',
    shortDesc: 'AM4 · DDR4 · mATX. 구형 라이젠용입니다.',
    description: 'AM4 플랫폼용 보드입니다. 와이파이가 내장되어 있어 별도 랜카드가 필요 없습니다.',
    spec: {
      kind: 'mainboard',
      socket: 'AM4',
      chipset: 'B550',
      memoryType: 'DDR4',
      memorySlots: 4,
      formFactor: 'mATX',
      tdp: 25,
    },
  },

  // ─────────────────────────────── 메모리
  {
    slug: 'samsung-ddr5-5600-32g',
    sku: 'RAM-SAM-D5-32',
    name: '삼성전자 DDR5-5600 16GB x2',
    brand: '삼성전자',
    categorySlug: 'ram',
    price: 139000,
    salePrice: 128000,
    stock: 50,
    status: 'active',
    shortDesc: 'DDR5 32GB 듀얼 구성. 가장 무난한 용량입니다.',
    description:
      '게임과 일반 작업 모두 32GB면 부족함이 없습니다. 두 개를 같은 색 슬롯에 꽂아야 듀얼 채널로 동작합니다.',
    spec: { kind: 'ram', memoryType: 'DDR5', capacityGb: 16, modules: 2, speedMhz: 5600, tdp: 10 },
    badges: ['인기'],
  },
  {
    slug: 'teamgroup-ddr5-6000-64g',
    sku: 'RAM-TEA-D5-64',
    name: '팀그룹 T-FORCE DDR5-6000 32GB x2',
    brand: 'TeamGroup',
    categorySlug: 'ram',
    price: 289000,
    stock: 12,
    status: 'active',
    shortDesc: 'DDR5 64GB. 영상 편집·가상머신용입니다.',
    description:
      '게임만 한다면 과합니다. 영상 편집이나 가상머신처럼 메모리를 크게 먹는 작업을 겸할 때 의미가 있습니다.',
    spec: { kind: 'ram', memoryType: 'DDR5', capacityGb: 32, modules: 2, speedMhz: 6000, tdp: 12 },
  },
  {
    slug: 'samsung-ddr4-3200-16g',
    sku: 'RAM-SAM-D4-16',
    name: '삼성전자 DDR4-3200 8GB x2',
    brand: '삼성전자',
    categorySlug: 'ram',
    price: 59000,
    stock: 45,
    status: 'active',
    shortDesc: 'DDR4 16GB. 최소 예산 구성용입니다.',
    description: '16GB는 요즘 게임에서 아슬아슬한 용량입니다. 여유가 되면 32GB를 권합니다.',
    spec: { kind: 'ram', memoryType: 'DDR4', capacityGb: 8, modules: 2, speedMhz: 3200, tdp: 8 },
  },
  {
    slug: 'gskill-ddr4-3600-32g',
    sku: 'RAM-GSK-D4-32',
    name: 'G.SKILL RIPJAWS V DDR4-3600 16GB x2',
    brand: 'G.SKILL',
    categorySlug: 'ram',
    price: 109000,
    salePrice: 98000,
    stock: 20,
    status: 'active',
    shortDesc: 'DDR4 32GB. 라이젠 5000 시리즈와 궁합이 좋습니다.',
    description:
      'AM4 라이젠은 메모리 속도에 성능이 민감합니다. 3600MHz가 이 플랫폼에서 가성비 지점입니다.',
    spec: { kind: 'ram', memoryType: 'DDR4', capacityGb: 16, modules: 2, speedMhz: 3600, tdp: 9 },
  },

  // ─────────────────────────────── 그래픽카드
  {
    slug: 'gigabyte-rtx4060-eagle',
    sku: 'GPU-GIG-4060',
    name: 'GIGABYTE RTX 4060 EAGLE OC 8GB',
    brand: 'GIGABYTE',
    categorySlug: 'gpu',
    price: 419000,
    salePrice: 389000,
    stock: 24,
    status: 'active',
    shortDesc: 'FHD 고주사율용. 소비전력이 낮아 파워 부담이 적습니다.',
    description:
      'FHD 해상도라면 대부분의 게임을 높은 프레임으로 돌립니다. 115W라 550W 파워로도 넉넉하고, 길이가 짧아 작은 케이스에도 들어갑니다.',
    spec: {
      kind: 'gpu',
      chipset: 'RTX 4060',
      vramGb: 8,
      lengthMm: 242,
      tdp: 115,
      tier: 5,
      recommendedPsu: 450,
    },
  },
  {
    slug: 'msi-rtx4070s-ventus',
    sku: 'GPU-MSI-4070S',
    name: 'MSI RTX 4070 SUPER VENTUS 3X 12GB',
    brand: 'MSI',
    categorySlug: 'gpu',
    price: 899000,
    stock: 10,
    status: 'active',
    shortDesc: 'QHD 주력. 12GB VRAM으로 텍스처 부담이 적습니다.',
    description:
      'QHD 해상도에서 옵션을 크게 낮추지 않고 돌릴 수 있는 지점입니다. 285mm로 길이가 있어 케이스 지원 길이를 확인해야 합니다.',
    spec: {
      kind: 'gpu',
      chipset: 'RTX 4070 SUPER',
      vramGb: 12,
      lengthMm: 285,
      tdp: 220,
      tier: 7,
      recommendedPsu: 650,
    },
    badges: ['인기'],
  },
  {
    slug: 'asus-rtx5070-dual',
    sku: 'GPU-ASU-5070',
    name: 'ASUS DUAL RTX 5070 OC 12GB',
    brand: 'ASUS',
    categorySlug: 'gpu',
    price: 1090000,
    salePrice: 1029000,
    stock: 6,
    status: 'active',
    shortDesc: '신형 아키텍처. QHD 최상옵션과 4K 진입이 가능합니다.',
    description:
      'QHD에서는 여유가 있고 4K도 옵션 조정으로 들어갑니다. 304mm로 길어서 미니타워에는 들어가지 않는 경우가 많습니다.',
    spec: {
      kind: 'gpu',
      chipset: 'RTX 5070',
      vramGb: 12,
      lengthMm: 304,
      tdp: 250,
      tier: 8,
      recommendedPsu: 650,
    },
    badges: ['신제품'],
  },
  {
    slug: 'msi-rtx5080-gaming-trio',
    sku: 'GPU-MSI-5080',
    name: 'MSI RTX 5080 GAMING TRIO 16GB',
    brand: 'MSI',
    categorySlug: 'gpu',
    price: 1990000,
    stock: 4,
    status: 'active',
    shortDesc: '4K 최상옵션용. 336mm 대형 카드입니다.',
    description:
      '4K 해상도를 목표로 하는 구성의 상단입니다. 336mm에 3슬롯을 차지하므로 케이스와 파워를 먼저 정하고 접근하는 편이 안전합니다.',
    spec: {
      kind: 'gpu',
      chipset: 'RTX 5080',
      vramGb: 16,
      lengthMm: 336,
      tdp: 360,
      tier: 9,
      recommendedPsu: 850,
    },
  },
  {
    slug: 'sapphire-rx7600-pulse',
    sku: 'GPU-SAP-7600',
    name: 'SAPPHIRE PULSE RX 7600 8GB',
    brand: 'SAPPHIRE',
    categorySlug: 'gpu',
    price: 359000,
    salePrice: 329000,
    stock: 15,
    status: 'active',
    shortDesc: 'FHD 입문. 204mm로 짧아 소형 케이스에 잘 맞습니다.',
    description:
      '같은 가격대 경쟁 제품보다 래스터 성능이 조금 앞섭니다. 다만 레이트레이싱 성능은 뒤처지니 용도를 보고 고르세요.',
    spec: {
      kind: 'gpu',
      chipset: 'RX 7600',
      vramGb: 8,
      lengthMm: 204,
      tdp: 165,
      tier: 5,
      recommendedPsu: 550,
    },
  },

  // ─────────────────────────────── 저장장치
  {
    slug: 'samsung-990pro-2tb',
    sku: 'SSD-SAM-990P2T',
    name: '삼성전자 990 PRO 2TB',
    brand: '삼성전자',
    categorySlug: 'ssd',
    price: 249000,
    salePrice: 229000,
    stock: 28,
    status: 'active',
    shortDesc: 'PCIe 4.0 NVMe. 읽기 7450MB/s.',
    description: '이 급에서 더 빠른 제품을 골라도 체감 차이가 크지 않습니다. 안정성과 보증이 강점입니다.',
    spec: { kind: 'ssd', interface: 'M.2 NVMe', capacityGb: 2000, readMbps: 7450, tdp: 8 },
    badges: ['인기'],
  },
  {
    slug: 'sk-p41-1tb',
    sku: 'SSD-SKH-P41-1T',
    name: 'SK하이닉스 Platinum P41 1TB',
    brand: 'SK하이닉스',
    categorySlug: 'ssd',
    price: 129000,
    stock: 35,
    status: 'active',
    shortDesc: 'PCIe 4.0 NVMe 1TB. 발열이 낮은 편입니다.',
    description: '전력 효율이 좋아 발열이 낮습니다. 방열판 없는 메인보드에서도 속도 저하가 적습니다.',
    spec: { kind: 'ssd', interface: 'M.2 NVMe', capacityGb: 1000, readMbps: 7000, tdp: 6 },
  },
  {
    slug: 'wd-blue-sa510-1tb',
    sku: 'SSD-WDC-SA510',
    name: 'WD Blue SA510 1TB',
    brand: 'Western Digital',
    categorySlug: 'ssd',
    price: 89000,
    stock: 40,
    status: 'active',
    shortDesc: 'SATA 2.5인치. 보조 저장용으로 씁니다.',
    description:
      'NVMe보다 느리지만 저장 용도로는 충분합니다. M.2 슬롯이 부족할 때 추가하기 좋습니다.',
    spec: { kind: 'ssd', interface: 'SATA', capacityGb: 1000, readMbps: 560, tdp: 4 },
  },

  // ─────────────────────────────── 파워
  {
    slug: 'fsp-hydro-k-pro-400',
    sku: 'PSU-FSP-400',
    name: 'FSP HYDRO K PRO 400W',
    brand: 'FSP',
    categorySlug: 'psu',
    price: 49000,
    stock: 30,
    status: 'active',
    shortDesc: '400W 80+ BRONZE. 사무용·저사양 구성 전용입니다.',
    description:
      '그래픽카드를 다는 구성에는 용량이 모자랍니다. 내장 그래픽만 쓰는 사무용 조립에 씁니다.',
    spec: { kind: 'psu', wattage: 400, efficiency: '80+ BRONZE', modular: '논모듈러' },
  },
  {
    slug: 'seasonic-focus-gx-550',
    sku: 'PSU-SEA-550',
    name: '시소닉 FOCUS GX-550',
    brand: 'Seasonic',
    categorySlug: 'psu',
    price: 109000,
    salePrice: 99000,
    stock: 22,
    status: 'active',
    shortDesc: '550W 80+ GOLD 풀모듈러. 중급 구성의 기본값입니다.',
    description:
      '풀모듈러라 안 쓰는 케이블을 빼둘 수 있어 선정리가 쉽습니다. 10년 보증이 붙습니다.',
    spec: { kind: 'psu', wattage: 550, efficiency: '80+ GOLD', modular: '풀모듈러' },
  },
  {
    slug: 'micronics-classic2-700',
    sku: 'PSU-MIC-700',
    name: '마이크로닉스 CLASSIC II 700W',
    brand: 'MICRONICS',
    categorySlug: 'psu',
    price: 79000,
    stock: 26,
    status: 'active',
    shortDesc: '700W 80+ BRONZE. 용량 대비 가격이 낮습니다.',
    description:
      '용량 대비 가격이 낮은 대신 효율 등급과 케이블 정리 편의는 떨어집니다. 예산이 빠듯할 때의 선택지입니다.',
    spec: { kind: 'psu', wattage: 700, efficiency: '80+ BRONZE', modular: '논모듈러' },
  },
  {
    slug: 'seasonic-vertex-gx-850',
    sku: 'PSU-SEA-850',
    name: '시소닉 VERTEX GX-850',
    brand: 'Seasonic',
    categorySlug: 'psu',
    price: 209000,
    salePrice: 189000,
    stock: 11,
    status: 'active',
    shortDesc: '850W 80+ GOLD 풀모듈러. 고사양 그래픽카드용입니다.',
    description:
      'ATX 3.0 규격이라 최신 그래픽카드의 12V-2x6 커넥터를 변환 젠더 없이 바로 연결합니다.',
    spec: { kind: 'psu', wattage: 850, efficiency: '80+ GOLD', modular: '풀모듈러' },
  },

  // ─────────────────────────────── 케이스
  {
    slug: 'zalman-p30-itx',
    sku: 'CAS-ZAL-P30',
    name: '잘만 P30 ITX',
    brand: 'ZALMAN',
    categorySlug: 'case',
    price: 59000,
    stock: 18,
    status: 'active',
    shortDesc: 'ITX 전용 초소형. 쿨러 높이 70mm까지만 들어갑니다.',
    description:
      '부피가 작은 대신 제약이 많습니다. ITX 보드만 들어가고, 대형 공랭 쿨러는 높이에서 걸립니다.',
    spec: {
      kind: 'case',
      formFactors: ['ITX'],
      maxGpuLengthMm: 320,
      maxCoolerHeightMm: 70,
      size: '미니ITX',
    },
  },
  {
    slug: 'darkflash-dlm21-mesh',
    sku: 'CAS-DAR-DLM21',
    name: 'darkFlash DLM21 MESH',
    brand: 'darkFlash',
    categorySlug: 'case',
    price: 49000,
    salePrice: 43000,
    stock: 25,
    status: 'active',
    shortDesc: 'mATX 미니타워. 전면 메쉬로 흡기가 잘 됩니다.',
    description:
      '작지만 전면이 뚫려 있어 발열 처리가 나쁘지 않습니다. ATX 보드는 들어가지 않습니다.',
    spec: {
      kind: 'case',
      formFactors: ['mATX', 'ITX'],
      maxGpuLengthMm: 330,
      maxCoolerHeightMm: 160,
      size: '미니타워',
    },
  },
  {
    slug: 'abko-suitmaster-361h',
    sku: 'CAS-ABK-361H',
    name: '앱코 SUITMASTER 361H',
    brand: 'ABKO',
    categorySlug: 'case',
    price: 69000,
    stock: 20,
    status: 'active',
    shortDesc: 'ATX 미들타워. 기본 팬이 포함되어 있습니다.',
    description: '가장 무난한 미들타워입니다. 기본 팬 3개가 달려 있어 추가 구매 없이 조립할 수 있습니다.',
    spec: {
      kind: 'case',
      formFactors: ['ATX', 'mATX', 'ITX'],
      maxGpuLengthMm: 330,
      maxCoolerHeightMm: 165,
      size: '미들타워',
    },
    badges: ['인기'],
  },
  {
    slug: 'lianli-o11-dynamic-evo',
    sku: 'CAS-LIA-O11EVO',
    name: 'LIAN LI O11 DYNAMIC EVO',
    brand: 'LIAN LI',
    categorySlug: 'case',
    price: 189000,
    stock: 8,
    status: 'active',
    shortDesc: 'ATX 미들타워. 수랭 확장성과 내부 공간이 넉넉합니다.',
    description:
      '420mm까지 그래픽카드가 들어가고 상단·측면 라디에이터를 동시에 달 수 있습니다. 대형 구성에서 공간 때문에 막히는 일이 거의 없습니다.',
    spec: {
      kind: 'case',
      formFactors: ['ATX', 'mATX', 'ITX'],
      maxGpuLengthMm: 420,
      maxCoolerHeightMm: 167,
      size: '미들타워',
    },
  },

  // ─────────────────────────────── 쿨러
  {
    slug: 'intel-stock-cooler',
    sku: 'COO-INT-STOCK',
    name: '인텔 기본 쿨러 (LGA1700)',
    brand: 'Intel',
    categorySlug: 'cooler',
    price: 15000,
    stock: 60,
    status: 'active',
    shortDesc: '높이 47mm. 65W 이하 CPU 전용입니다.',
    description:
      '높이가 낮아 어떤 케이스에도 들어가지만 감당 가능한 발열이 65W까지입니다. K 모델에는 쓸 수 없습니다.',
    spec: { kind: 'cooler', coolerType: '공랭', heightMm: 47, sockets: ['LGA1700'], tdpRating: 65 },
  },
  {
    slug: 'pccooler-rz400',
    sku: 'COO-PCC-RZ400',
    name: 'PCCOOLER RZ400 공랭',
    brand: 'PCCOOLER',
    categorySlug: 'cooler',
    price: 29000,
    salePrice: 26000,
    stock: 40,
    status: 'active',
    shortDesc: '높이 152mm 공랭. 가격 대비 성능이 좋습니다.',
    description:
      '이 가격대에서 성능이 가장 무난합니다. 152mm라 미니타워에도 대체로 들어갑니다.',
    spec: {
      kind: 'cooler',
      coolerType: '공랭',
      heightMm: 152,
      sockets: ['LGA1700', 'AM4', 'AM5'],
      tdpRating: 180,
    },
    badges: ['인기'],
  },
  {
    slug: 'noctua-nh-d15',
    sku: 'COO-NOC-D15',
    name: '녹투아 NH-D15 chromax.black',
    brand: 'Noctua',
    categorySlug: 'cooler',
    price: 159000,
    stock: 9,
    status: 'active',
    shortDesc: '높이 165mm 듀얼타워 공랭. 수랭급 성능에 소음이 적습니다.',
    description:
      '공랭 중 최상급입니다. 다만 165mm로 높아 케이스 지원 높이를 반드시 확인해야 합니다.',
    spec: {
      kind: 'cooler',
      coolerType: '공랭',
      heightMm: 165,
      sockets: ['LGA1700', 'LGA1851', 'AM4', 'AM5'],
      tdpRating: 250,
    },
  },
  {
    slug: '3rsys-socool-rc240',
    sku: 'COO-3RS-RC240',
    name: '3RSYS SOCOOL RC240 수랭',
    brand: '3RSYS',
    categorySlug: 'cooler',
    price: 89000,
    salePrice: 79000,
    stock: 14,
    status: 'active',
    shortDesc: '240mm 수랭. 높이 제약에서 자유롭습니다.',
    description:
      '라디에이터를 케이스 상단이나 전면에 다는 방식이라 CPU 위 공간을 차지하지 않습니다. 대신 케이스가 240mm 라디에이터를 지원해야 합니다.',
    spec: {
      kind: 'cooler',
      coolerType: '수랭',
      heightMm: 0,
      sockets: ['LGA1700', 'LGA1851', 'AM4', 'AM5'],
      tdpRating: 250,
    },
  },

  // ─────────────────────────────── 모니터 · 주변기기
  {
    slug: 'lg-27gs60f',
    sku: 'MON-LGE-27GS60',
    name: 'LG 울트라기어 27GS60F',
    brand: 'LG전자',
    categorySlug: 'monitor',
    price: 289000,
    salePrice: 259000,
    stock: 17,
    status: 'active',
    shortDesc: '27인치 FHD 180Hz IPS.',
    description: 'FHD 고주사율 게이밍용입니다. IPS 패널이라 색이 무난하고 시야각이 넓습니다.',
    spec: { kind: 'generic', highlights: ['27인치', 'FHD 1920x1080', '180Hz', 'IPS', '1ms'] },
  },
  {
    slug: 'samsung-odyssey-g5',
    sku: 'MON-SAM-G5',
    name: '삼성 오디세이 G5 32인치',
    brand: '삼성전자',
    categorySlug: 'monitor',
    price: 419000,
    stock: 10,
    status: 'active',
    shortDesc: '32인치 QHD 165Hz 커브드.',
    description: 'QHD 해상도에 곡률이 들어간 32인치입니다. 게임 몰입감 위주의 선택입니다.',
    spec: { kind: 'generic', highlights: ['32인치', 'QHD 2560x1440', '165Hz', 'VA', '1000R 곡률'] },
    badges: ['인기'],
  },
  {
    slug: 'dell-u2723qe',
    sku: 'MON-DEL-U2723',
    name: 'DELL UltraSharp U2723QE',
    brand: 'DELL',
    categorySlug: 'monitor',
    price: 749000,
    stock: 5,
    status: 'active',
    shortDesc: '27인치 4K 60Hz. 작업용 색 정확도가 강점입니다.',
    description:
      '게임보다 작업용입니다. 색 정확도가 높고 USB-C 한 선으로 화면·전원·허브가 연결됩니다.',
    spec: { kind: 'generic', highlights: ['27인치', '4K 3840x2160', '60Hz', 'IPS Black', 'USB-C 90W'] },
  },
  {
    slug: 'logitech-g-pro-x-tkl',
    sku: 'PER-LOG-GPROX',
    name: '로지텍 G PRO X TKL',
    brand: 'Logitech',
    categorySlug: 'peripheral',
    price: 189000,
    salePrice: 169000,
    stock: 21,
    status: 'active',
    shortDesc: '텐키리스 기계식 무선 키보드.',
    description: '텐키를 뺀 크기라 마우스 공간이 넓어집니다. 무선 지연은 체감되지 않습니다.',
    spec: { kind: 'generic', highlights: ['텐키리스', '기계식 적축', '무선 LIGHTSPEED', 'RGB'] },
  },
  {
    slug: 'razer-viper-v3-pro',
    sku: 'PER-RAZ-VIPERV3',
    name: 'Razer Viper V3 Pro',
    brand: 'Razer',
    categorySlug: 'peripheral',
    price: 219000,
    stock: 13,
    status: 'active',
    shortDesc: '54g 초경량 무선 게이밍 마우스.',
    description: '54g로 가볍고 8000Hz 폴링을 지원합니다. FPS 위주 사용자를 겨냥한 제품입니다.',
    spec: { kind: 'generic', highlights: ['54g', '무선 HyperSpeed', '35K DPI', '8000Hz 폴링'] },
  },
  {
    slug: 'steelseries-arctis-nova-5',
    sku: 'PER-STE-NOVA5',
    name: '스틸시리즈 Arctis Nova 5',
    brand: 'SteelSeries',
    categorySlug: 'peripheral',
    price: 159000,
    salePrice: 139000,
    stock: 0,
    status: 'soldout',
    shortDesc: '무선 게이밍 헤드셋. 배터리 60시간.',
    description: '착용감이 가볍고 배터리가 오래갑니다. 마이크 품질은 이 가격대 평균 수준입니다.',
    spec: { kind: 'generic', highlights: ['무선 2.4GHz', '배터리 60시간', '블루투스 동시 연결'] },
  },
];

/**
 * CPU 는 실물 비교표(엑셀)가 원본이다 — data/catalog-cpu.json 에서 생성한다.
 * 나머지 카테고리는 아직 손으로 관리하는 목데이터.
 */
export const PRODUCTS: Product[] = [...HAND_PRODUCTS, ...buildCpuProducts()];

/* ──────────────────────── 가격 갱신 반영 (빌드 타임) ──────────────────────── */

/**
 * `npm run price-sync` 가 엑셀을 검증해 만든 승인분(data/price-overrides.json)을
 * 카탈로그 위에 덮어쓴다. 코드의 리터럴 값은 초기값이고, 실제 판매가의 원천은
 * 엑셀이다 — 매일 수기 입력하는 현행 업무를 그대로 흡수하는 구조 (설계문서 8장).
 * DB 가 붙으면 이 병합은 서버의 반영 단계로 옮겨간다.
 */
type PriceOverride = { price?: number; salePrice?: number | null; stock?: number };

const PRICE_OVERRIDES = rawPriceOverrides as Record<string, PriceOverride>;

for (const product of PRODUCTS) {
  const override = PRICE_OVERRIDES[product.slug];
  if (!override) continue;
  if (override.price !== undefined) product.price = override.price;
  // 엑셀에서 할인가 칸을 비우면 "할인 없음"이다. undefined(키 없음)와 구분한다
  if (override.salePrice !== undefined) product.salePrice = override.salePrice ?? undefined;
  if (override.stock !== undefined) {
    product.stock = override.stock;
    product.status = override.stock > 0 ? 'active' : 'soldout';
  }
}

/* ────────────────────────────── 조회 함수 ────────────────────────────── */

/** 실제 판매가. 할인가가 있으면 그쪽을 쓴다 */
export function effectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}

/** 할인율(%). 할인이 없으면 0 */
export function discountRate(product: Product): number {
  if (!product.salePrice) return 0;
  return Math.round((1 - product.salePrice / product.price) * 100);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((product) => product.categorySlug === categorySlug);
}

export function getCategoriesByGroup(group: Category['group']): Category[] {
  return CATEGORIES.filter((category) => category.group === group);
}

/**
 * 견적짜기 슬롯에 담을 수 있는 부품만 추린다.
 * 슬롯 이름과 카테고리 slug 를 일부러 같은 문자열로 맞춰뒀다.
 */
export function getPartsBySlot(slot: PartSlot): Product[] {
  return PRODUCTS.filter(
    (product) =>
      product.categorySlug === slot &&
      product.status === 'active' &&
      // 조립 스펙이 보강된 부품만. 스펙 없이 '호환성 문제 없음'이라고 말할 수는 없다
      product.spec.kind === slot,
  );
}

/** 정적 생성 대상 파라미터 */
export function getProductParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export function getCategoryParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}
