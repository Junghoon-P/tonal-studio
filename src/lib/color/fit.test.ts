import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { fitForeground, fitFill } from './fit';

describe('fitForeground', () => {
  it('밝은 배경에서 목표 대비를 만족할 때까지 명도를 낮춘다', () => {
    const t = fitForeground('#FFFFFF', 254, 0.155, 7, 0.64, -1);
    expect(contrastRatio(t.hex, '#FFFFFF')).toBeGreaterThanOrEqual(7);
  });

  it('어두운 배경에서 목표 대비를 만족할 때까지 명도를 높인다', () => {
    const t = fitForeground('#1A1A1A', 84, 0.11, 7, 0.6, 1);
    expect(contrastRatio(t.hex, '#1A1A1A')).toBeGreaterThanOrEqual(7);
  });

  it('색상(H)과 채도(C)를 유지한다', () => {
    const t = fitForeground('#FFFFFF', 166, 0.11, 4.5, 0.55, -1);
    expect(t.H).toBe(166);
    expect(t.C).toBe(0.11);
  });

  it('도달 불가능하면 무채색 폴백을 반환한다', () => {
    const t = fitForeground('#808080', 0, 0, 21, 0.5, -1);
    expect(t.C).toBe(0);
    expect(t.hex).toMatch(/^#[0-9A-F]{6}$/);
  });
});

describe('fitFill', () => {
  it('전경 대비 목표를 만족하는 채움색을 찾는다', () => {
    const t = fitFill('#FFFFFF', 254, 0.165, 4.5, 0.62, -1);
    expect(contrastRatio('#FFFFFF', t.hex)).toBeGreaterThanOrEqual(4.5);
  });

  it('폴백에서도 채도와 색상을 유지한다', () => {
    const t = fitFill('#808080', 254, 0.1, 21, 0.5, 1);
    expect(t.C).toBe(0.1);
    expect(t.H).toBe(254);
  });
});
