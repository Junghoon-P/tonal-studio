import type { PaletteKey } from './types';

// UI 표기용 CSS 변수 이름 (검사기·매트릭스·토큰 테이블 공용)
export const TOKEN_META: Partial<Record<PaletteKey, string>> = {
  bg: '--bg',
  sf: '--surface',
  sf2: '--surface-2',
  bd: '--border',
  bds: '--border-strong',
  tx: '--text',
  tx2: '--text-2',
  tx3: '--text-3',
  ac: '--accent',
  acT: '--accent-text',
  oac: '--on-accent',
  fc: '--focus-ring',
  okT: '--success',
  wnT: '--warning',
  dgT: '--danger',
};

export const tokenLabel = (key: PaletteKey): string =>
  TOKEN_META[key] ?? `--${key}`;
