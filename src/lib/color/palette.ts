import { fitFill, fitForeground } from './fit';
import { oklchToHex } from './oklch';
import type { ColorToken, Palette, PaletteInput } from './types';

const tok = (L: number, C: number, H: number): ColorToken => ({
  hex: oklchToHex(L, C, H),
  L,
  C,
  H,
});

interface Targets {
  T: number;
  T3: number;
  Tfc: number;
  N: number;
  nc: number;
}

const targetsOf = ({ hc, warm, aaa }: PaletteInput): Targets => ({
  T: hc || aaa ? 7 : 4.5,
  T3: hc ? 7 : 4.5,
  Tfc: hc ? 4.5 : 3,
  N: (270 + (warm / 100) * 180) % 360,
  nc: hc ? 0 : 0.0042 + (warm / 100) * 0.0024,
});

const buildLight = (hue: number, hc: boolean, t: Targets): Palette => {
  const { T, T3, Tfc, N, nc } = t;
  const bg = hc ? tok(1, 0, 0) : tok(0.9715, nc, N);
  const sf = tok(1, 0, 0);
  const sf2 = hc ? tok(0.955, 0, 0) : tok(0.9525, nc, N);
  const bd = hc ? fitForeground(sf.hex, N, 0, 3, 0.7, -1) : tok(0.888, nc + 0.002, N);
  const bds = fitForeground(sf.hex, N, hc ? 0 : 0.012, hc ? 4.5 : 3, 0.65, -1);
  const ac = fitFill('#FFFFFF', hue, hc ? 0.13 : 0.165, hc ? 7 : 4.5, 0.62, -1);
  const wnT = fitForeground(sf2.hex, 84, 0.115, T, 0.64, -1);
  const okS = hc ? tok(1, 0, 0) : tok(0.944, 0.042, 166);
  const wnS = hc ? tok(1, 0, 0) : tok(0.951, 0.052, 86);
  const dgS = hc ? tok(1, 0, 0) : tok(0.938, 0.04, 27);
  return {
    bg,
    sf,
    sf2,
    bd,
    bds,
    cbd: bd,
    tx: hc ? tok(0.135, 0, 0) : tok(0.235, 0.01, N),
    tx2: fitForeground(sf2.hex, N, hc ? 0 : 0.014, T, 0.6, -1),
    tx3: fitForeground(sf2.hex, N, hc ? 0 : 0.016, T3, 0.68, -1),
    ac,
    ach: tok(Math.max(ac.L - 0.055, 0.05), ac.C, hue),
    oac: tok(1, 0, 0),
    acT: fitForeground(sf2.hex, hue, hc ? 0.12 : 0.155, T, 0.64, -1),
    fc: fitForeground(bg.hex, hue, 0.155, Tfc, 0.68, -1),
    okT: tok(wnT.L - 0.09, 0.1, 166),
    wnT,
    dgT: tok(wnT.L - 0.18, 0.14, 29),
    okS,
    wnS,
    dgS,
    okF: fitForeground(okS.hex, 166, 0.11, T3, 0.55, -1),
    wnF: fitForeground(wnS.hex, 84, 0.12, T3, 0.58, -1),
    dgF: fitForeground(dgS.hex, 29, 0.14, T3, 0.52, -1),
  };
};

const buildDark = (hue: number, hc: boolean, t: Targets): Palette => {
  const { T, T3, Tfc, N, nc } = t;
  const bg = hc ? tok(0, 0, 0) : tok(0.183, nc + 0.002, N);
  const sf = hc ? tok(0.13, 0, 0) : tok(0.226, nc + 0.003, N);
  const sf2 = hc ? tok(0.19, 0, 0) : tok(0.268, nc + 0.004, N);
  const bd = hc ? fitForeground(sf.hex, N, 0, 3, 0.45, 1) : tok(0.34, nc + 0.003, N);
  const bds = fitForeground(sf.hex, N, hc ? 0 : 0.008, hc ? 4.5 : 3, 0.42, 1);
  const ink = hc ? tok(0.09, 0, 0) : tok(0.155, 0.012, N);
  const ac = fitFill(ink.hex, hue, hc ? 0.12 : 0.14, hc ? 7 : 4.5, 0.56, 1);
  const wnT = fitForeground(sf2.hex, 84, 0.11, T, 0.6, 1);
  const okS = hc ? tok(0, 0, 0) : tok(0.285, 0.045, 166);
  const wnS = hc ? tok(0, 0, 0) : tok(0.3, 0.05, 86);
  const dgS = hc ? tok(0, 0, 0) : tok(0.275, 0.045, 27);
  return {
    bg,
    sf,
    sf2,
    bd,
    bds,
    cbd: bd,
    tx: hc ? tok(0.985, 0, 0) : tok(0.93, 0.005, N),
    tx2: fitForeground(sf2.hex, N, hc ? 0 : 0.008, T, 0.58, 1),
    tx3: fitForeground(sf2.hex, N, hc ? 0 : 0.01, T3, 0.5, 1),
    ac,
    ach: tok(Math.min(ac.L + 0.05, 0.97), ac.C, hue),
    oac: ink,
    acT: fitForeground(sf2.hex, hue, hc ? 0.11 : 0.13, T, 0.56, 1),
    fc: fitForeground(bg.hex, hue, 0.13, Tfc, 0.5, 1),
    okT: tok(Math.min(wnT.L + 0.09, 0.93), 0.1, 166),
    wnT,
    dgT: tok(Math.min(wnT.L + 0.18, 0.975), 0.12, 25),
    okS,
    wnS,
    dgS,
    okF: fitForeground(okS.hex, 166, 0.1, T3, 0.6, 1),
    wnF: fitForeground(wnS.hex, 84, 0.11, T3, 0.62, 1),
    dgF: fitForeground(dgS.hex, 25, 0.12, T3, 0.6, 1),
  };
};

const cache = new Map<string, Palette>();

export const buildPalette = (input: PaletteInput): Palette => {
  const { dark, hc, hue, warm, aaa } = input;
  const key = [dark, hc, hue, warm, aaa].join('|');
  const hit = cache.get(key);
  if (hit) return hit;
  const t = targetsOf(input);
  const palette = dark ? buildDark(hue, hc, t) : buildLight(hue, hc, t);
  cache.set(key, palette);
  return palette;
};
