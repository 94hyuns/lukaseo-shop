/**
 * 상품 도메인 타입.
 *
 * 실제 스키마(설계문서 4-2)의 `product_specs`는 key-value 텍스트 테이블이지만,
 * 여기서는 슬롯별로 타입이 갈리는 판별 유니온으로 둔다. 호환성 엔진이
 * `cpu.spec.socket` 처럼 필드에 직접 접근해야 하는데, key-value 로는
 * 매번 문자열을 찾아 파싱해야 하고 오타가 컴파일 타임에 안 걸린다.
 *
 * Supabase 를 붙이는 3단계에서 key-value → 이 타입으로 바꾸는 어댑터를
 * lib/shop/adapters.ts 에 한 겹 두면 화면 코드는 그대로 쓸 수 있다.
 */

/** 견적짜기 부품 슬롯 8종 (설계문서 3-2에서 17개 → 8개로 축소) */
export type PartSlot =
  | 'cpu'
  | 'mainboard'
  | 'ram'
  | 'gpu'
  | 'ssd'
  | 'psu'
  | 'case'
  | 'cooler';

export type Socket = 'LGA1700' | 'LGA1851' | 'AM4' | 'AM5';
export type MemoryType = 'DDR4' | 'DDR5';
export type BoardFormFactor = 'ATX' | 'mATX' | 'ITX';

/**
 * 성능 등급 1~10. 실제 벤치마크 점수가 아니라 병목 경고용 상대 지표다.
 * CPU와 GPU를 같은 축에 올려 비교하려면 이런 정규화가 한 번은 필요하다.
 */
export type PerfTier = number;

export type CpuSpec = {
  kind: 'cpu';
  socket: Socket;
  cores: number;
  threads: number;
  baseClock: string;
  /** 정격 소비전력(W). 파워 용량 계산의 기준 */
  tdp: number;
  tier: PerfTier;
  /** 내장 그래픽 유무. 없으면 그래픽카드가 필수다 */
  igpu: boolean;
};

export type MainboardSpec = {
  kind: 'mainboard';
  socket: Socket;
  chipset: string;
  memoryType: MemoryType;
  memorySlots: number;
  formFactor: BoardFormFactor;
  tdp: number;
};

export type RamSpec = {
  kind: 'ram';
  memoryType: MemoryType;
  /** 모듈 1개 용량 */
  capacityGb: number;
  /** 구성 매수 (2면 듀얼 채널) */
  modules: number;
  speedMhz: number;
  tdp: number;
};

export type GpuSpec = {
  kind: 'gpu';
  chipset: string;
  vramGb: number;
  /** 케이스 장착 가능 여부 판정에 쓴다 */
  lengthMm: number;
  tdp: number;
  tier: PerfTier;
  /** 제조사 권장 파워 용량(W) */
  recommendedPsu: number;
};

export type SsdSpec = {
  kind: 'ssd';
  interface: 'M.2 NVMe' | 'SATA';
  capacityGb: number;
  readMbps: number;
  tdp: number;
};

export type PsuSpec = {
  kind: 'psu';
  /** 정격 출력(W) */
  wattage: number;
  efficiency: string;
  modular: '풀모듈러' | '세미모듈러' | '논모듈러';
};

export type CaseSpec = {
  kind: 'case';
  /** 장착 가능한 메인보드 규격 */
  formFactors: BoardFormFactor[];
  maxGpuLengthMm: number;
  maxCoolerHeightMm: number;
  size: string;
};

export type CoolerSpec = {
  kind: 'cooler';
  coolerType: '공랭' | '수랭';
  /** 수랭은 라디에이터 방식이라 높이 제약이 사실상 없다. 0으로 둔다 */
  heightMm: number;
  /** 지원 소켓 목록 */
  sockets: Socket[];
  /** 감당 가능한 발열(W) */
  tdpRating: number;
};

/** 완제품 PC. 부품처럼 조합 대상이 아니라 카드에 요약 스펙만 보여준다 */
export type SystemSpec = {
  kind: 'system';
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
};

/** 모니터·주변기기처럼 호환성 판정에 참여하지 않는 상품 */
export type GenericSpec = {
  kind: 'generic';
  highlights: string[];
};

/** 견적짜기에 들어갈 수 있는 부품 스펙 */
export type PartSpec =
  | CpuSpec
  | MainboardSpec
  | RamSpec
  | GpuSpec
  | SsdSpec
  | PsuSpec
  | CaseSpec
  | CoolerSpec;

export type ProductSpec = PartSpec | SystemSpec | GenericSpec;

export type ProductStatus = 'active' | 'soldout';

export type Product = {
  /** 실제 스키마의 products.slug */
  slug: string;
  /** 매칭 키. 가격 갱신 파이프라인(설계문서 8-4)이 1순위로 쓰는 값 */
  sku: string;
  name: string;
  brand: string;
  categorySlug: string;
  /** 정가. 원 단위 정수 — 부동소수 오차를 피한다 */
  price: number;
  /** 할인가. 없으면 정가로 판다 */
  salePrice?: number;
  stock: number;
  status: ProductStatus;
  shortDesc: string;
  description: string;
  spec: ProductSpec;
  badges?: string[];
};

export type Category = {
  slug: string;
  name: string;
  group: 'system' | 'part' | 'peripheral';
  description: string;
};
