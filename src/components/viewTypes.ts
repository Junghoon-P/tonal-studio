export type ViewId = 'palette' | 'check' | 'export' | 'spec';

export type SimId = 'none' | 'prot' | 'deut' | 'trit' | 'gray';

export const VIEW_HEADING_ID: Record<ViewId, string> = {
  palette: 'h-palette',
  check: 'h-check',
  export: 'h-export',
  spec: 'h-spec',
};

export const VIEW_LABEL: Record<ViewId, string> = {
  palette: '팔레트',
  check: '검사',
  export: '내보내기',
  spec: '스펙',
};

// 화면 전환 후 새 화면의 헤딩으로 포커스를 옮겨 스크린리더 문맥을 유지한다
export const focusHeading = (id: string): void => {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('tabindex', '-1');
    el.style.outline = 'none';
    el.focus();
  }, 80);
};
