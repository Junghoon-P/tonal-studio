// 디자인 공용 스타일 조합 — 값은 디자인 명세 수치 그대로

export const CARD =
  'bg-sf border border-cbd rounded-xl p-5 transition-colors';

export const CARD_TITLE =
  'm-0 text-[0.8125rem] font-bold tracking-[0.08em] uppercase text-tx3';

export const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 min-h-11 px-[1.125rem] border-0 rounded-lg bg-ac text-oac text-[0.9375rem] font-semibold cursor-pointer transition-colors hover:bg-ach active:scale-[0.985]';

export const BTN_SECONDARY =
  'inline-flex items-center justify-center gap-2 min-h-11 px-[1.125rem] border border-bds rounded-lg bg-transparent text-tx text-[0.9375rem] font-semibold cursor-pointer transition-colors hover:bg-sf2 active:scale-[0.985]';

export const SEG_GROUP =
  'flex gap-[0.125rem] p-[0.1875rem] border border-cbd rounded-[10px] bg-sf2';

// 색상 유틸리티는 겹치면 CSS 순서에 따라 임의로 이기므로, 켬/끔을 한 벌씩만 적용한다
export const segClass = (on: boolean): string =>
  cx(
    'inline-flex items-center gap-1.5 min-h-11 px-3.5 border-0 rounded-lg text-[0.875rem] font-semibold cursor-pointer transition-colors active:scale-[0.985]',
    on ? 'bg-sf text-tx shadow-[0_0_0_1px_var(--bds)]' : 'bg-transparent text-tx2',
  );

export const INPUT_BASE =
  'min-h-11 px-3 py-2 border border-bds rounded-lg bg-sf text-tx text-[0.875rem]';

export const TH_COL =
  'text-left py-2 text-xs font-semibold tracking-[0.06em] uppercase text-tx3 border-b border-bd';

export const cx = (...parts: Array<string | false | undefined>): string =>
  parts.filter(Boolean).join(' ');
