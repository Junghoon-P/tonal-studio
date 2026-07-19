export type SpecMockKind =
  | 'lock'
  | 'input'
  | 'checking'
  | 'valid'
  | 'error'
  | 'unlocked';

export interface SpecCardData {
  n: string;
  name: string;
  when: string;
  mock: SpecMockKind;
  pts: string[];
}

// BYOK 여정 6개 상태 — 디자인 명세 그대로
export const SPEC_CARDS: SpecCardData[] = [
  {
    n: '01',
    name: '미입력 — 잠금',
    when: '키 없음 · AI 진입점',
    mock: 'lock',
    pts: [
      '배지: --surface-2 + 1px --border-strong + 자물쇠 아이콘 — 반투명·회색 처리 없음. "대기"이지 "고장"이 아님',
      '카피가 가치를 먼저 말함: "무드를 설명하면 제안" → 그다음 잠금 해제 조건',
      '진입 버튼은 표준 2차 버튼과 동일 스타일 · 최소 44px',
      '툴의 다른 모든 기능은 키 없이 완전 동작',
    ],
  },
  {
    n: '02',
    name: '입력 중',
    when: '다이얼로그 · 초기',
    mock: 'input',
    pts: [
      'type="password" 기본 · 붙여넣기 제한 없음 · autocomplete="off"',
      'label for/id 연결, 형식 힌트는 aria-describedby',
      '표시 토글: aria-pressed + "API 키 표시/숨기기" 라벨 · 44×44',
      '입력을 재개하면 이전 오류가 즉시 해제됨',
    ],
  },
  {
    n: '03',
    name: '검증 중',
    when: '연결 확인 직후',
    mock: 'checking',
    pts: [
      'GET /v1/models 실제 핑 · 8초 타임아웃',
      '필드·토글·버튼 disabled, 버튼은 스피너 + "확인 중…" 라벨 유지',
      'aria-live(polite)로 "키를 확인하는 중" 즉시 공지',
      'prefers-reduced-motion: 스피너 정지 — 텍스트가 상태를 전달',
    ],
  },
  {
    n: '04',
    name: '유효 — 연결됨',
    when: 'GET /v1/models 200',
    mock: 'valid',
    pts: [
      '전체 키 재표시 금지 — sk-•••• + 끝 4자만',
      '저장 위치 localStorage("tonal-openai-key") · 서버 무전송을 입력 지점에 명시',
      '교체 = 필드로 복귀 + 포커스 이동 · 삭제 = 즉시 제거 + aria-live 공지',
      '삭제 시 진입점은 01 잠금 상태로 복귀',
    ],
  },
  {
    n: '05',
    name: '무효 — 오류 3종',
    when: '형식 / 401 / 429',
    mock: 'error',
    pts: [
      '원인 분기: 형식(정규식, 요청 전 차단) / 인증(401·403) / 한도(429) + 네트워크',
      '아이콘 + 제목 + 해결 힌트 — 색 단독 전달 금지',
      'aria-invalid="true" + aria-describedby로 필드에 연결',
      '실패해도 입력값 보존 — 재시도 비용 최소화',
    ],
  },
  {
    n: '06',
    name: '해제 — AI 활성',
    when: '키 연결 후 진입점',
    mock: 'unlocked',
    pts: [
      '배지 "연결됨": --success-soft + 체크 아이콘 — 명도로도 구분',
      '무드 입력 → 색상·온도 적용, 결과·이유를 aria-live로 공지',
      '사용 중 401 감지 시 배지가 "재확인 필요"로 강등 + 재연결 유도',
      'AI는 설정을 "제안"만 — 대비 보장은 여전히 생성기의 몫',
    ],
  },
];
