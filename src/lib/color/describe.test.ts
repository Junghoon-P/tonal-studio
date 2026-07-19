import { describe, expect, it } from 'vitest';
import { describeColor } from './describe';

describe('describeColor', () => {
  it('명도·채도·색상 계열을 말로 묘사한다', () => {
    expect(describeColor({ hex: '#034F97', L: 0.4, C: 0.13, H: 254 })).toBe(
      '어두운 선명한 블루 계열',
    );
    expect(describeColor({ hex: '#FFFFFF', L: 1, C: 0, H: 0 })).toBe(
      '매우 밝은 무채색에 가까운 회색 계열',
    );
    expect(describeColor({ hex: '#574D4E', L: 0.45, C: 0.014, H: 20 })).toBe(
      '중간 밝기의 무채색에 가까운 회색 계열',
    );
  });

  it('저채도지만 색조가 느껴지면 은은한 + 색상명으로 묘사한다', () => {
    expect(describeColor({ hex: '#8B7355', L: 0.55, C: 0.05, H: 60 })).toBe(
      '중간 밝기의 은은한 앰버 계열',
    );
  });

  it('매우 어두운 명도 구간을 구분한다', () => {
    expect(describeColor({ hex: '#151111', L: 0.18, C: 0.006, H: 300 })).toBe(
      '매우 어두운 무채색에 가까운 회색 계열',
    );
  });
});
