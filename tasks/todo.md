# Tonal Studio 구현 TODO

계획: `~/.claude/plans/wobbly-watching-kite.md`

- [x] 1. 스캐폴딩 (Next.js + TS + Tailwind v4 + Vitest + git init)
- [x] 2. 색 수학 엔진 TDD (oklch / contrast / fit / palette / hueName)
- [x] 3. 훅 + 루트 셸 (테마 주입, 헤더, 단축키, aria-live)
- [x] 4. 화면 4개 (팔레트 → 검사 → 내보내기 → 스펙)
- [x] 5. KeyDialog + BYOK + AI 추천
- [x] 6. 검증 (vitest / tsc / lint / build / 브라우저 확인)

## 리뷰

- 테스트 61개 전부 통과, lib 커버리지 99% (Stmts 98.98%)
- `tsc --noEmit` · `eslint` · `next build` 모두 클린
- 브라우저 실검증: 4화면 전환(클릭+1~4 단축키), T/C 테마·고대비 토글 시 토큰
  재계산, 매트릭스 21쌍 전수 통과 표시, 다크는 OS 설정 자동 감지,
  BYOK 다이얼로그 형식 오류 경로(요청 전 차단·입력값 보존) 확인
- 유일한 콘솔 경고는 브라우저 확장(cz-shortcut-listen) 주입 속성으로 앱 무관
- 실제 OpenAI 키 유효 경로(연결됨·AI 추천)는 사용자 키 입력 후 확인 필요

## 추가 — 직접 검사 보강 (2026-07-19)

- [x] 대비 검사기 → 확대 검사기: 대형 샘플(보조/본문/대형/초대형 4단계), 색각
  시뮬레이션 필터를 샘플에도 적용, 대비율 표기 확대
- [x] 언어적 묘사(`describeColor`): 모든 검사 색을 "어두운 선명한 블루 계열"
  식으로 설명 — 전맹 사용자의 1급 표현
- [x] 토큰 테이블 각 행 "크게 검사" 버튼 → 토큰 사전 선택 + 검사 화면 이동 + 낭독
- 테스트 64개 통과 · lint/tsc/build 클린 · 브라우저 실검증 완료
