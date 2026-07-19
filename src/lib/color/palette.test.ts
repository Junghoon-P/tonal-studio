import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { buildPalette } from './palette';
import { PALETTE_KEYS, type Palette, type PaletteInput } from './types';

const MODES: PaletteInput[] = [
  { dark: false, hc: false, hue: 254, warm: 55, aaa: true },
  { dark: true, hc: false, hue: 254, warm: 55, aaa: true },
  { dark: false, hc: true, hue: 254, warm: 55, aaa: true },
  { dark: true, hc: true, hue: 254, warm: 55, aaa: true },
  { dark: false, hc: false, hue: 30, warm: 10, aaa: false },
  { dark: true, hc: false, hue: 120, warm: 90, aaa: false },
];

const matrixTarget = (input: PaletteInput, fg: string): number => {
  const base = input.hc || input.aaa ? 7 : 4.5;
  if (fg === 'tx') return 7;
  if (fg === 'tx3') return input.hc ? 7 : 4.5;
  return base;
};

describe('buildPalette', () => {
  it('23개 토큰 전부 유효한 hex를 생성한다', () => {
    for (const m of MODES) {
      const p = buildPalette(m);
      for (const k of PALETTE_KEYS) {
        expect(p[k].hex, `${JSON.stringify(m)} ${k}`).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });

  it('본문 텍스트는 모든 모드에서 배경 대비 7:1 이상이다', () => {
    for (const m of MODES) {
      const p = buildPalette(m);
      expect(
        contrastRatio(p.tx.hex, p.bg.hex),
        JSON.stringify(m),
      ).toBeGreaterThanOrEqual(7);
    }
  });

  it('텍스트×표면 매트릭스(7×3)가 모든 모드에서 기준을 전수 통과한다', () => {
    const fgs = ['tx', 'tx2', 'tx3', 'acT', 'okT', 'wnT', 'dgT'] as const;
    const bgs = ['bg', 'sf', 'sf2'] as const;
    for (const m of MODES) {
      const p: Palette = buildPalette(m);
      for (const f of fgs) {
        for (const b of bgs) {
          const r = contrastRatio(p[f].hex, p[b].hex);
          expect(
            r,
            `${JSON.stringify(m)} ${f}/${b}`,
          ).toBeGreaterThanOrEqual(matrixTarget(m, f));
        }
      }
    }
  });

  it('주요 버튼(oac/ac)은 기준(고대비 7, 일반 4.5)을 만족한다', () => {
    for (const m of MODES) {
      const p = buildPalette(m);
      expect(
        contrastRatio(p.oac.hex, p.ac.hex),
        JSON.stringify(m),
      ).toBeGreaterThanOrEqual(m.hc ? 7 : 4.5);
    }
  });

  it('포커스 링은 배경 대비 기준(고대비 4.5, 일반 3)을 만족한다', () => {
    for (const m of MODES) {
      const p = buildPalette(m);
      expect(
        contrastRatio(p.fc.hex, p.bg.hex),
        JSON.stringify(m),
      ).toBeGreaterThanOrEqual(m.hc ? 4.5 : 3);
    }
  });

  it('구분 필수 경계(bds)는 표면 대비 기준을 만족한다', () => {
    for (const m of MODES) {
      const p = buildPalette(m);
      expect(
        contrastRatio(p.bds.hex, p.sf.hex),
        JSON.stringify(m),
      ).toBeGreaterThanOrEqual(m.hc ? 4.5 : 3);
    }
  });

  it('소프트 상태 표면 위 전경(okF/wnF/dgF)은 기준을 만족한다', () => {
    for (const m of MODES) {
      const p = buildPalette(m);
      const t = m.hc ? 7 : 4.5;
      expect(contrastRatio(p.okF.hex, p.okS.hex)).toBeGreaterThanOrEqual(t);
      expect(contrastRatio(p.wnF.hex, p.wnS.hex)).toBeGreaterThanOrEqual(t);
      expect(contrastRatio(p.dgF.hex, p.dgS.hex)).toBeGreaterThanOrEqual(t);
    }
  });

  it('같은 입력은 캐시된 동일 객체를 반환한다', () => {
    const a = buildPalette(MODES[0]);
    const b = buildPalette({ ...MODES[0] });
    expect(a).toBe(b);
  });

  it('상태 3색(okT/wnT/dgT)은 서로 다른 명도를 가진다', () => {
    const p = buildPalette(MODES[0]);
    const ls = [p.okT.L, p.wnT.L, p.dgT.L].map((l) => Math.round(l * 100));
    expect(new Set(ls).size).toBe(3);
  });
});
