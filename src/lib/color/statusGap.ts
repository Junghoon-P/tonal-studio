import type { Palette } from './types';

// 상태 3색(성공·경고·오류)의 최소 명도 간격 — 흑백에서도 구분되는 근거
export const statusLightnessGap = (palette: Palette): number => {
  const ok = Math.round(palette.okT.L * 100);
  const wn = Math.round(palette.wnT.L * 100);
  const dg = Math.round(palette.dgT.L * 100);
  return Math.min(Math.abs(ok - wn), Math.abs(ok - dg), Math.abs(wn - dg));
};
