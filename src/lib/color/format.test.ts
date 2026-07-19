import { describe, expect, it } from 'vitest';
import { formatRatio, levelOf } from './format';
import { statusLightnessGap } from './statusGap';
import { tokenLabel } from './tokenMeta';
import { buildPalette } from './palette';

describe('formatRatio', () => {
  it('소수 둘째 자리까지 내림해 표기한다 (반올림으로 기준 초과처럼 보이지 않게)', () => {
    expect(formatRatio(4.499999)).toBe('4.49');
    expect(formatRatio(7)).toBe('7.00');
    expect(formatRatio(21)).toBe('21.00');
  });
});

describe('levelOf', () => {
  it.each([
    [7.2, 'AAA'],
    [4.6, 'AA'],
    [3.1, '3:1'],
    [2.9, '미달'],
  ])('%f → %s', (r, lv) => {
    expect(levelOf(r)).toBe(lv);
  });
});

describe('statusLightnessGap', () => {
  it('상태 3색의 최소 명도 간격을 정수로 반환한다', () => {
    const p = buildPalette({ dark: false, hc: false, hue: 254, warm: 55, aaa: true });
    const gap = statusLightnessGap(p);
    expect(Number.isInteger(gap)).toBe(true);
    expect(gap).toBeGreaterThan(0);
  });
});

describe('tokenLabel', () => {
  it('표기용 CSS 변수 이름을 반환한다', () => {
    expect(tokenLabel('sf')).toBe('--surface');
    expect(tokenLabel('okT')).toBe('--success');
  });

  it('매핑에 없는 키는 --키 형태로 폴백한다', () => {
    expect(tokenLabel('ach')).toBe('--ach');
  });
});
