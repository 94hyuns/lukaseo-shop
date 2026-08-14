# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# 이 프로젝트의 규약

- **CSS Modules + CSS 변수만 사용.** Tailwind 없음. 색·간격을 하드코딩하지 말고 `styles/variables.css`의 토큰을 쓴다.
- **`next/image` 금지.** `images.unoptimized: true` 상태라 이점이 없다. `<img>`에 `eslint-disable-next-line @next/next/no-img-element` 주석을 붙여 쓴다.
- **`output: 'export'`를 임의로 빼지 말 것.** 서버 기능(API Routes, Server Actions)이 필요해지면 배포 방식부터 다시 정해야 한다. 결제 단계에서 함께 결정한다.
- 금액은 **원 단위 정수**로만 다룬다. `NUMERIC`/`FLOAT` 금지.
- 한글 타이포그래피 조정값(본문 15px, 행간 1.75, `word-break: keep-all`)은 의도적인 값이니 되돌리지 말 것.
- 카드 전체 클릭은 **stretched link**(`::after` inset 0)로 구현한다. 카드를 `<a>`로 감싸지 않는다.
- 작업 후 반드시 `npm run build`와 `npx eslint .`를 통과시킨다.

전체 설계는 `lukaseo-web` 스킬의 `references/design-doc.md`를 참고한다.
