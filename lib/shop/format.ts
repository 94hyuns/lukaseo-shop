import type { ProductSpec } from './types';

/**
 * 금액 표기. 값은 원 단위 정수로만 다룬다 (설계문서 0장 — NUMERIC/FLOAT 금지).
 *
 * toLocaleString 대신 Intl 인스턴스를 한 번 만들어 재사용한다. 상품 카드가
 * 수십 개 깔리는 화면에서 매번 포매터를 새로 만들면 낭비다.
 */
const WON = new Intl.NumberFormat('ko-KR');

export function formatPrice(amount: number): string {
  return `${WON.format(amount)}원`;
}

/** 원화 기호가 필요 없는 자리(합계표 등)에서 쓴다 */
export function formatNumber(value: number): string {
  return WON.format(value);
}

/**
 * 상품 카드에 노출할 스펙 뱃지 문자열.
 * 설계문서 3-2에서 "상품 카드에 CPU/GPU 스펙 노출"을 이 사이트의 정체성으로 잡았다.
 */
export function featuredSpecs(spec: ProductSpec): string[] {
  switch (spec.kind) {
    case 'system':
      return [spec.cpu, spec.gpu, spec.ram, spec.storage];
    case 'cpu':
      return [spec.socket, `${spec.cores}C/${spec.threads}T`, `${spec.tdp}W`];
    case 'mainboard':
      return [spec.socket, spec.chipset, spec.memoryType, spec.formFactor];
    case 'ram':
      return [
        spec.memoryType,
        `${spec.capacityGb}GB x${spec.modules}`,
        `${spec.speedMhz}MHz`,
      ];
    case 'gpu':
      return [spec.chipset, `${spec.vramGb}GB`, `${spec.lengthMm}mm`, `${spec.tdp}W`];
    case 'ssd':
      return [spec.interface, `${formatCapacity(spec.capacityGb)}`, `${spec.readMbps}MB/s`];
    case 'psu':
      return [`${spec.wattage}W`, spec.efficiency, spec.modular];
    case 'case':
      return [
        spec.formFactors.join('/'),
        `VGA ${spec.maxGpuLengthMm}mm`,
        `쿨러 ${spec.maxCoolerHeightMm}mm`,
      ];
    case 'cooler':
      return [
        spec.coolerType,
        spec.heightMm > 0 ? `${spec.heightMm}mm` : '높이 제약 없음',
        `${spec.tdpRating}W`,
      ];
    case 'generic':
      return spec.highlights;
  }
}

/** 상세 페이지 스펙 표에 쓸 라벨-값 쌍 */
export function specTable(spec: ProductSpec): { label: string; value: string }[] {
  switch (spec.kind) {
    case 'system':
      return [
        { label: 'CPU', value: spec.cpu },
        { label: '그래픽카드', value: spec.gpu },
        { label: '메모리', value: spec.ram },
        { label: '저장장치', value: spec.storage },
      ];
    case 'cpu':
      return [
        { label: '소켓', value: spec.socket },
        { label: '코어/스레드', value: `${spec.cores}코어 ${spec.threads}스레드` },
        { label: '기본 클럭', value: spec.baseClock },
        { label: 'TDP', value: `${spec.tdp}W` },
        { label: '내장 그래픽', value: spec.igpu ? '있음' : '없음 (그래픽카드 필수)' },
      ];
    case 'mainboard':
      return [
        { label: '소켓', value: spec.socket },
        { label: '칩셋', value: spec.chipset },
        { label: '메모리 규격', value: spec.memoryType },
        { label: '메모리 슬롯', value: `${spec.memorySlots}개` },
        { label: '폼팩터', value: spec.formFactor },
      ];
    case 'ram':
      return [
        { label: '규격', value: spec.memoryType },
        { label: '구성', value: `${spec.capacityGb}GB x ${spec.modules}매` },
        { label: '총 용량', value: `${spec.capacityGb * spec.modules}GB` },
        { label: '동작 속도', value: `${spec.speedMhz}MHz` },
      ];
    case 'gpu':
      return [
        { label: '칩셋', value: spec.chipset },
        { label: 'VRAM', value: `${spec.vramGb}GB` },
        { label: '길이', value: `${spec.lengthMm}mm` },
        { label: 'TDP', value: `${spec.tdp}W` },
        { label: '권장 파워', value: `${spec.recommendedPsu}W 이상` },
      ];
    case 'ssd':
      return [
        { label: '인터페이스', value: spec.interface },
        { label: '용량', value: formatCapacity(spec.capacityGb) },
        { label: '순차 읽기', value: `${spec.readMbps}MB/s` },
      ];
    case 'psu':
      return [
        { label: '정격 출력', value: `${spec.wattage}W` },
        { label: '80PLUS 등급', value: spec.efficiency },
        { label: '케이블', value: spec.modular },
      ];
    case 'case':
      return [
        { label: '지원 보드', value: spec.formFactors.join(', ') },
        { label: '크기', value: spec.size },
        { label: 'VGA 최대 길이', value: `${spec.maxGpuLengthMm}mm` },
        { label: '쿨러 최대 높이', value: `${spec.maxCoolerHeightMm}mm` },
      ];
    case 'cooler':
      return [
        { label: '방식', value: spec.coolerType },
        { label: '높이', value: spec.heightMm > 0 ? `${spec.heightMm}mm` : '해당 없음 (수랭)' },
        { label: '지원 소켓', value: spec.sockets.join(', ') },
        { label: '감당 발열', value: `${spec.tdpRating}W` },
      ];
    case 'generic':
      return spec.highlights.map((value, index) => ({
        label: index === 0 ? '주요 사양' : '',
        value,
      }));
  }
}

function formatCapacity(gb: number): string {
  return gb >= 1000 ? `${gb / 1000}TB` : `${gb}GB`;
}
