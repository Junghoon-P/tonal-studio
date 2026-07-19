import { contrastRatio } from './contrast';
import { oklchToHex } from './oklch';
import type { ColorToken } from './types';

const MAX_STEPS = 300;
const STEP = 0.005;

// 색상(H)·채도(C)는 유지하고 명도(L)만 dir 방향으로 이동해
// 배경 대비 목표를 처음 만족하는 전경색을 찾는다
export const fitForeground = (
  bgHex: string,
  H: number,
  C: number,
  target: number,
  startL: number,
  dir: 1 | -1,
): ColorToken => {
  let L = startL;
  for (let i = 0; i < MAX_STEPS; i++) {
    const hex = oklchToHex(L, C, H);
    if (contrastRatio(hex, bgHex) >= target) return { hex, L, C, H };
    L += dir * STEP;
    if (L <= 0.03 || L >= 0.99) break;
  }
  const fallbackL = dir < 0 ? 0.05 : 0.985;
  return { hex: oklchToHex(fallbackL, 0, 0), L: fallbackL, C: 0, H };
};

// 고정된 전경색(fgHex)에 대해 목표 대비를 만족하는 채움색을 찾는다
export const fitFill = (
  fgHex: string,
  H: number,
  C: number,
  target: number,
  startL: number,
  dir: 1 | -1,
): ColorToken => {
  let L = startL;
  for (let i = 0; i < MAX_STEPS; i++) {
    const hex = oklchToHex(L, C, H);
    if (contrastRatio(fgHex, hex) >= target) return { hex, L, C, H };
    L += dir * STEP;
    if (L <= 0.03 || L >= 0.99) break;
  }
  const fallbackL = dir < 0 ? 0.2 : 0.9;
  return { hex: oklchToHex(fallbackL, C, H), L: fallbackL, C, H };
};
