import { describe, expect, it } from 'vitest';
import { contrastRatio, relativeLuminance } from './contrast';

describe('relativeLuminance', () => {
  it('흰색은 1, 검은색은 0이다', () => {
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
  });

  it('sRGB 감마를 반영한다 — #808080 ≈ 0.2159', () => {
    expect(relativeLuminance('#808080')).toBeCloseTo(0.2159, 3);
  });
});

describe('contrastRatio', () => {
  it('검정 대 흰색은 21:1이다', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });

  it('같은 색은 1:1이다', () => {
    expect(contrastRatio('#4053B8', '#4053B8')).toBeCloseTo(1, 5);
  });

  it('인자 순서와 무관하게 같은 값을 반환한다', () => {
    expect(contrastRatio('#123456', '#FEDCBA')).toBeCloseTo(
      contrastRatio('#FEDCBA', '#123456'),
      10,
    );
  });

  it('WCAG 기준값 — #767676 대 흰색은 4.5:1 이상', () => {
    expect(contrastRatio('#767676', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  });
});
