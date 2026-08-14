import { SLOT_ORDER, type BuildSlots } from './compatibility';
import { getProduct } from '@/lib/shop/catalog';

/**
 * 견적 공유 링크의 인코딩·디코딩.
 *
 * ⚠️ 이건 암호화가 아니다. 정적 사이트에는 서버가 없으므로 복호화 키를 숨길
 * 곳이 없다 — 키를 번들에 넣으면 개발자도구에서 그대로 꺼낼 수 있다. 여기서
 * 하는 일은 주소창이 부품 목록으로 읽히지 않게 만드는 인코딩이다.
 *
 * 애초에 감출 대상도 아니다. 상품 slug 는 사이트에 공개된 값이고, 견적 링크는
 * 남에게 보내라고 만든 것이다. 정말로 되돌릴 수 없는 짧은 링크가 필요하면
 * 서버에 견적을 저장하고 share_token 을 발급해야 한다 (설계문서 7장).
 * 그때 이 파일의 encode/decode 를 토큰 발급·조회로 바꾸면 호출부는 그대로다.
 */

/** 쿼리 파라미터 이름. build 의 b */
export const SHARE_PARAM = 'b';

const SEPARATOR = '|';

/** base64 → URL 에 그대로 쓸 수 있는 문자로 */
function toUrlSafe(base64: string): string {
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromUrlSafe(token: string): string {
  const base64 = token.replaceAll('-', '+').replaceAll('_', '/');
  // atob 는 길이가 4의 배수가 아니면 던진다
  const padding = (4 - (base64.length % 4)) % 4;
  return base64 + '='.repeat(padding);
}

/**
 * 구성을 토큰 하나로 만든다.
 *
 * 슬롯 순서를 고정해 두면 슬롯 이름을 따로 담을 필요가 없다.
 * 빈 슬롯은 빈 칸으로 남기고, 뒤쪽 빈 칸은 잘라 길이를 줄인다.
 */
export function encodeBuild(build: BuildSlots): string {
  const parts = SLOT_ORDER.map((slot) => build[slot]?.slug ?? '');

  while (parts.length > 0 && parts[parts.length - 1] === '') parts.pop();
  if (parts.length === 0) return '';

  // slug 는 ASCII 라서 btoa 로 충분하다. 한글이 섞이면 여기서 던진다.
  return toUrlSafe(btoa(parts.join(SEPARATOR)));
}

/**
 * 토큰을 구성으로 되돌린다.
 *
 * 토큰은 URL 로 들어오는 값이라 신뢰하지 않는다. 깨졌거나, 없는 상품이거나,
 * 슬롯에 안 맞는 부품이면 그 슬롯만 조용히 버린다. 링크 하나가 틀렸다고
 * 견적짜기 화면 전체가 죽으면 안 된다.
 */
export function decodeBuild(token: string): BuildSlots {
  if (!token) return {};

  let decoded: string;
  try {
    decoded = atob(fromUrlSafe(token));
  } catch {
    return {};
  }

  const parts = decoded.split(SEPARATOR);
  const build: BuildSlots = {};

  SLOT_ORDER.forEach((slot, index) => {
    const slug = parts[index];
    if (!slug) return;
    const product = getProduct(slug);
    if (product && product.categorySlug === slot) build[slot] = product;
  });

  return build;
}

/**
 * 슬롯마다 파라미터를 하나씩 쓰던 옛 형식(`?cpu=...&gpu=...`)도 읽어준다.
 * 이미 나간 링크가 있을 수 있고, 지원 비용이 몇 줄이라 굳이 끊지 않는다.
 */
export function decodeLegacyQuery(searchParams: URLSearchParams): BuildSlots {
  const build: BuildSlots = {};

  for (const slot of SLOT_ORDER) {
    const slug = searchParams.get(slot);
    if (!slug) continue;
    const product = getProduct(slug);
    if (product && product.categorySlug === slot) build[slot] = product;
  }

  return build;
}
