import { effectivePrice } from '@/lib/shop/catalog';
import type {
  CaseSpec,
  CoolerSpec,
  CpuSpec,
  GpuSpec,
  MainboardSpec,
  PartSlot,
  Product,
  PsuSpec,
  RamSpec,
  SsdSpec,
} from '@/lib/shop/types';

/**
 * 견적 호환성 검증 엔진 (설계문서 7장).
 *
 * 이 파일은 순수 함수만 둔다 — React도 fetch도 들어오지 않는다.
 * 규칙이 늘어날수록 테스트로 고정해야 하는데, 입력을 넣으면 출력이 정해지는
 * 형태여야 테스트가 붙는다.
 */

export type BuildSlots = Partial<Record<PartSlot, Product>>;

export type IssueLevel = 'error' | 'warning';

export type Issue = {
  level: IssueLevel;
  /** 문제에 연루된 슬롯. UI에서 해당 슬롯을 함께 붉게 표시한다 */
  slots: PartSlot[];
  message: string;
};

/** 슬롯 → 스펙 타입 대응. specOf 의 반환 타입을 좁히는 데 쓴다 */
type SlotSpecMap = {
  cpu: CpuSpec;
  mainboard: MainboardSpec;
  ram: RamSpec;
  gpu: GpuSpec;
  ssd: SsdSpec;
  psu: PsuSpec;
  case: CaseSpec;
  cooler: CoolerSpec;
};

export const SLOT_ORDER: PartSlot[] = [
  'cpu',
  'cooler',
  'mainboard',
  'ram',
  'gpu',
  'ssd',
  'psu',
  'case',
];

export const SLOT_LABELS: Record<PartSlot, string> = {
  cpu: 'CPU',
  cooler: '쿨러',
  mainboard: '메인보드',
  ram: '메모리',
  gpu: '그래픽카드',
  ssd: '저장장치',
  psu: '파워',
  case: '케이스',
};

/** 그래픽카드는 내장 그래픽이 있으면 생략할 수 있어 필수에서 뺀다 */
const REQUIRED_SLOTS: PartSlot[] = ['cpu', 'cooler', 'mainboard', 'ram', 'ssd', 'psu', 'case'];

/** 팬·USB 장치 등 부품 목록에 잡히지 않는 소비전력 */
const MISC_POWER_W = 30;

/** 파워는 최대 부하의 이 배수 이상이어야 한다 (설계문서 7장) */
const PSU_HEADROOM = 1.3;

/** CPU와 GPU의 성능 등급이 이만큼 벌어지면 병목으로 본다 */
const BOTTLENECK_TIER_GAP = 2;

/**
 * 슬롯에 담긴 부품의 스펙을 타입을 좁혀 꺼낸다.
 * 슬롯 이름과 spec.kind 가 같은 문자열이라는 규약에 기대므로,
 * 어긋나면 조용히 무시하지 말고 null 을 돌려 규칙 검사에서 빠지게 한다.
 */
function specOf<S extends PartSlot>(build: BuildSlots, slot: S): SlotSpecMap[S] | null {
  const product = build[slot];
  if (!product || product.spec.kind !== slot) return null;
  return product.spec as SlotSpecMap[S];
}

/** 견적에 담긴 부품들의 소비전력 합 */
export function totalTdp(build: BuildSlots): number {
  const parts = Object.values(build);
  const sum = parts.reduce((acc, product) => {
    const spec = product.spec;
    return acc + ('tdp' in spec ? spec.tdp : 0);
  }, 0);
  return sum > 0 ? sum + MISC_POWER_W : 0;
}

/** 권장 파워 용량 — 최대 부하에 여유를 얹고 50W 단위로 올림 */
export function recommendedWattage(build: BuildSlots): number {
  const load = totalTdp(build);
  if (load === 0) return 0;
  return Math.ceil((load * PSU_HEADROOM) / 50) * 50;
}

export function totalPrice(build: BuildSlots): number {
  return Object.values(build).reduce((acc, product) => acc + effectivePrice(product), 0);
}

/** 아직 안 채운 필수 슬롯 */
export function missingSlots(build: BuildSlots): PartSlot[] {
  return REQUIRED_SLOTS.filter((slot) => !build[slot]);
}

/**
 * 호환성 검사 본체.
 * 부품이 덜 채워진 상태에서도 호출되므로, 각 규칙은 필요한 슬롯이 모두
 * 채워졌을 때만 판정한다. 빈 슬롯을 오류로 보고하지는 않는다 — 그건
 * missingSlots 의 몫이고, 조립 중에 계속 붉은 배너가 뜨면 읽지 않게 된다.
 */
export function validateBuild(build: BuildSlots): Issue[] {
  const issues: Issue[] = [];

  const cpu = specOf(build, 'cpu');
  const mainboard = specOf(build, 'mainboard');
  const ram = specOf(build, 'ram');
  const gpu = specOf(build, 'gpu');
  const psu = specOf(build, 'psu');
  const pcCase = specOf(build, 'case');
  const cooler = specOf(build, 'cooler');

  // ① CPU ↔ 메인보드 소켓
  if (cpu && mainboard && cpu.socket !== mainboard.socket) {
    issues.push({
      level: 'error',
      slots: ['cpu', 'mainboard'],
      message: `CPU 소켓(${cpu.socket})과 메인보드 소켓(${mainboard.socket})이 다릅니다. 물리적으로 장착되지 않습니다.`,
    });
  }

  // ② 메모리 ↔ 메인보드 규격
  if (ram && mainboard && ram.memoryType !== mainboard.memoryType) {
    issues.push({
      level: 'error',
      slots: ['ram', 'mainboard'],
      message: `메인보드는 ${mainboard.memoryType} 전용인데 ${ram.memoryType} 메모리를 골랐습니다. 두 규격은 슬롯 모양이 달라 호환되지 않습니다.`,
    });
  }

  // ③ 메인보드 폼팩터 ↔ 케이스 지원 규격
  if (mainboard && pcCase && !pcCase.formFactors.includes(mainboard.formFactor)) {
    issues.push({
      level: 'error',
      slots: ['mainboard', 'case'],
      message: `케이스가 지원하는 보드 규격은 ${pcCase.formFactors.join('/')}입니다. ${mainboard.formFactor} 보드는 들어가지 않습니다.`,
    });
  }

  // ④ 그래픽카드 길이 ↔ 케이스
  if (gpu && pcCase && gpu.lengthMm > pcCase.maxGpuLengthMm) {
    issues.push({
      level: 'error',
      slots: ['gpu', 'case'],
      message: `그래픽카드 길이 ${gpu.lengthMm}mm가 케이스 지원 한계 ${pcCase.maxGpuLengthMm}mm를 넘습니다.`,
    });
  }

  // ⑤ 쿨러 높이 ↔ 케이스 (수랭은 높이 개념이 없어 0으로 저장한다)
  if (cooler && pcCase && cooler.heightMm > 0 && cooler.heightMm > pcCase.maxCoolerHeightMm) {
    issues.push({
      level: 'error',
      slots: ['cooler', 'case'],
      message: `쿨러 높이 ${cooler.heightMm}mm가 케이스 지원 한계 ${pcCase.maxCoolerHeightMm}mm를 넘습니다. 측면 패널이 닫히지 않습니다.`,
    });
  }

  // ⑥ 쿨러 소켓 지원
  if (cpu && cooler && !cooler.sockets.includes(cpu.socket)) {
    issues.push({
      level: 'error',
      slots: ['cpu', 'cooler'],
      message: `이 쿨러는 ${cooler.sockets.join('/')} 소켓만 지원합니다. ${cpu.socket} 브라켓이 없습니다.`,
    });
  }

  // ⑦ 쿨러 성능 ↔ CPU 발열
  if (cpu && cooler && cooler.tdpRating < cpu.tdp) {
    issues.push({
      level: 'warning',
      slots: ['cpu', 'cooler'],
      message: `쿨러가 감당하는 발열은 ${cooler.tdpRating}W인데 CPU는 ${cpu.tdp}W입니다. 부하가 걸리면 온도 때문에 성능이 깎입니다.`,
    });
  }

  // ⑧ 파워 용량
  if (psu) {
    const required = recommendedWattage(build);
    if (required > psu.wattage) {
      issues.push({
        level: 'warning',
        slots: ['psu'],
        message: `현재 구성의 권장 파워 용량은 ${required}W입니다. ${psu.wattage}W로는 고부하 상황에서 시스템이 꺼질 수 있습니다.`,
      });
    }
  }

  // ⑨ 그래픽카드 제조사 권장 파워
  if (gpu && psu && gpu.recommendedPsu > psu.wattage) {
    issues.push({
      level: 'warning',
      slots: ['gpu', 'psu'],
      message: `그래픽카드 제조사 권장 파워는 ${gpu.recommendedPsu}W 이상입니다.`,
    });
  }

  // ⑩ CPU ↔ GPU 성능 균형
  if (cpu && gpu) {
    const gap = cpu.tier - gpu.tier;
    if (gap >= BOTTLENECK_TIER_GAP) {
      issues.push({
        level: 'warning',
        slots: ['cpu', 'gpu'],
        message: 'CPU 대비 그래픽카드 성능이 낮습니다. 게임 프레임이 그래픽카드에서 먼저 막힙니다.',
      });
    } else if (-gap >= BOTTLENECK_TIER_GAP) {
      issues.push({
        level: 'warning',
        slots: ['cpu', 'gpu'],
        message: '그래픽카드 대비 CPU 성능이 낮습니다. 그래픽카드가 제 성능을 내지 못합니다.',
      });
    }
  }

  // ⑪ 화면 출력 수단
  if (cpu && !cpu.igpu && !build.gpu) {
    issues.push({
      level: 'warning',
      slots: ['cpu', 'gpu'],
      message: '이 CPU는 내장 그래픽이 없습니다. 그래픽카드를 넣지 않으면 화면이 출력되지 않습니다.',
    });
  }

  return issues;
}

/** 배너 한 줄로 요약할 때 쓰는 집계 */
export function summarize(issues: Issue[]) {
  const errors = issues.filter((issue) => issue.level === 'error');
  const warnings = issues.filter((issue) => issue.level === 'warning');
  return { errors, warnings, hasError: errors.length > 0 };
}
