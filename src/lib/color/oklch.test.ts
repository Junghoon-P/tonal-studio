import { describe, expect, it } from 'vitest';
import { oklchToHex } from './oklch';

const channel = (hex: string, i: number): number =>
  parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);

describe('oklchToHex', () => {
  it('L=1, C=0은 흰색을 만든다', () => {
    expect(oklchToHex(1, 0, 0)).toBe('#FFFFFF');
  });

  it('L=0, C=0은 검은색을 만든다', () => {
    expect(oklchToHex(0, 0, 0)).toBe('#000000');
  });

  it('sRGB 레드의 OKLCH 좌표를 다시 레드로 변환한다', () => {
    const hex = oklchToHex(0.6279, 0.2577, 29.23);
    expect(Math.abs(channel(hex, 0) - 255)).toBeLessThanOrEqual(2);
    expect(channel(hex, 1)).toBeLessThanOrEqual(4);
    expect(channel(hex, 2)).toBeLessThanOrEqual(4);
  });

  it('중성 회색은 세 채널이 같다', () => {
    const hex = oklchToHex(0.6, 0, 0);
    expect(channel(hex, 0)).toBe(channel(hex, 1));
    expect(channel(hex, 1)).toBe(channel(hex, 2));
  });

  it('가멋 밖 채도는 클램프되어 유효한 hex를 만든다', () => {
    const hex = oklchToHex(0.7, 0.4, 150);
    expect(hex).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('항상 대문자 6자리 hex를 반환한다', () => {
    for (const [L, C, H] of [
      [0.5, 0.1, 0],
      [0.97, 0.005, 90],
      [0.2, 0.05, 300],
    ]) {
      expect(oklchToHex(L, C, H)).toMatch(/^#[0-9A-F]{6}$/);
    }
  });
});
