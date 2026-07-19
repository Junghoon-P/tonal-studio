export interface ColorToken {
  hex: string;
  L: number;
  C: number;
  H: number;
}

export const PALETTE_KEYS = [
  'bg',
  'sf',
  'sf2',
  'bd',
  'bds',
  'cbd',
  'tx',
  'tx2',
  'tx3',
  'ac',
  'ach',
  'oac',
  'acT',
  'fc',
  'okT',
  'wnT',
  'dgT',
  'okS',
  'wnS',
  'dgS',
  'okF',
  'wnF',
  'dgF',
] as const;

export type PaletteKey = (typeof PALETTE_KEYS)[number];

export type Palette = Record<PaletteKey, ColorToken>;

export interface PaletteInput {
  dark: boolean;
  hc: boolean;
  hue: number;
  warm: number;
  aaa: boolean;
}
