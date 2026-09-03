import type { CpuSpec } from './types';

/**
 * CPU 조립 스펙 수동 보강표.
 *
 * 상품 목록의 원본은 실물 비교표(엑셀)지만, 비교표에는 소켓·코어수·TDP·
 * 내장그래픽 같은 조립 스펙이 없다. 호환성 엔진은 이 값들 없이는 판정을
 * 못 하므로, 스펙은 여기서 SKU 기준으로 수동 보강한다.
 *
 * ★ 이 표에 스펙이 있는 모델만 견적짜기에 나타난다. 스펙을 모르는 상품을
 *   견적에 넣어 "호환성 문제 없음"이라고 말하는 것이 더 나쁘기 때문이다.
 *   새 모델을 견적짜기에 올리려면 여기에 한 항목 추가하면 된다.
 */

export type CpuEnrichment = {
  spec: CpuSpec;
  shortDesc?: string;
  description?: string;
  badges?: string[];
};

export const CPU_ENRICHMENT: Record<string, CpuEnrichment> = {
  'CPU-INT-14400F': {
    spec: {
      kind: 'cpu',
      socket: 'LGA1700',
      cores: 10,
      threads: 16,
      baseClock: '2.5GHz',
      tdp: 65,
      tier: 6,
      igpu: false,
    },
    shortDesc: '10코어 16스레드. 가격 대비 게임 성능이 가장 무난한 선택입니다.',
    description:
      '게임 위주로 쓴다면 이 급에서 더 올릴 이유가 크지 않습니다. 내장 그래픽이 없는 F 모델이라 그래픽카드가 반드시 필요합니다.',
    badges: ['인기'],
  },
  'CPU-INT-14700K': {
    spec: {
      kind: 'cpu',
      socket: 'LGA1700',
      cores: 20,
      threads: 28,
      baseClock: '3.4GHz',
      tdp: 125,
      tier: 8,
      igpu: true,
    },
    shortDesc: '20코어 28스레드. 게임과 작업을 함께 하는 구성용입니다.',
    description:
      '배수 잠금이 풀린 K 모델이라 오버클럭이 가능합니다. 대신 발열이 큽니다 — 기본 쿨러로는 감당이 안 되니 별도 쿨러를 반드시 함께 고르세요.',
  },
  'CPU-AMD-7600': {
    spec: {
      kind: 'cpu',
      socket: 'AM5',
      cores: 6,
      threads: 12,
      baseClock: '3.8GHz',
      tdp: 65,
      tier: 6,
      igpu: true,
    },
    shortDesc: '6코어 12스레드. 65W라 쿨링 부담이 적습니다.',
    description:
      'AM5 소켓의 입문 라인입니다. 소켓 수명이 길어 나중에 CPU만 갈아끼우는 업그레이드가 가능합니다. DDR5 전용이라 메모리를 함께 맞춰야 합니다.',
  },
  'CPU-AMD-9700X': {
    spec: {
      kind: 'cpu',
      socket: 'AM5',
      cores: 8,
      threads: 16,
      baseClock: '3.8GHz',
      tdp: 65,
      tier: 8,
      igpu: true,
    },
    shortDesc: '8코어 16스레드를 65W로 돌립니다. 전력 효율이 강점입니다.',
    description:
      '같은 성능대의 인텔 대비 소비전력이 절반 수준입니다. 파워와 쿨러 예산을 아낄 수 있어 전체 견적으로 보면 차이가 줄어듭니다.',
    badges: ['신제품'],
  },
  'CPU-AMD-5600': {
    spec: {
      kind: 'cpu',
      socket: 'AM4',
      cores: 6,
      threads: 12,
      baseClock: '3.5GHz',
      tdp: 65,
      tier: 4,
      igpu: false,
    },
    shortDesc: '구형 AM4 플랫폼. 최소 예산 구성에 씁니다.',
    description:
      '단종 수순인 AM4 소켓이라 업그레이드 여지는 없지만, 가격이 내려갈 대로 내려가 최소 예산 구성에서는 여전히 선택지입니다. DDR4 메인보드와 묶어야 합니다.',
  },
};
