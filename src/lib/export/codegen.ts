import { buildPalette } from '../color/palette';
import type { Palette, PaletteKey } from '../color/types';

export type ExportTab = 'css' | 'tw' | 'sh';

export interface ExportInput {
  hue: number;
  warm: number;
  aaa: boolean;
}

// 내보내기 CSS 변수명 매핑 (디자인 cssNames 그대로)
const CSS_NAMES: ReadonlyArray<readonly [PaletteKey, string]> = [
  ['bg', 'bg'],
  ['sf', 'surface'],
  ['sf2', 'surface-2'],
  ['bd', 'border'],
  ['bds', 'border-strong'],
  ['tx', 'text'],
  ['tx2', 'text-2'],
  ['tx3', 'text-3'],
  ['ac', 'accent'],
  ['ach', 'accent-hover'],
  ['oac', 'on-accent'],
  ['acT', 'accent-text'],
  ['fc', 'focus-ring'],
  ['okT', 'success'],
  ['wnT', 'warning'],
  ['dgT', 'danger'],
  ['okS', 'success-soft'],
  ['wnS', 'warning-soft'],
  ['dgS', 'danger-soft'],
  ['okF', 'on-success-soft'],
  ['wnF', 'on-warning-soft'],
  ['dgF', 'on-danger-soft'],
];

const cssBlock = (p: Palette, pad: string): string =>
  CSS_NAMES.map(([k, n]) => `${pad}--${n}: ${p[k].hex};`).join('\n');

const fourModes = ({
  hue,
  warm,
  aaa,
}: ExportInput): [Palette, Palette, Palette, Palette] => [
  buildPalette({ dark: false, hc: false, hue, warm, aaa }),
  buildPalette({ dark: true, hc: false, hue, warm, aaa }),
  buildPalette({ dark: false, hc: true, hue, warm, aaa }),
  buildPalette({ dark: true, hc: true, hue, warm, aaa }),
];

const buildCssCode = (input: ExportInput): string => {
  const [l, d, lh, dh] = fourModes(input);
  const target = input.aaa ? 'AAA 7:1' : 'AA 4.5:1';
  return `/* Tonal tokens — 액센트 ${input.hue}° · 목표 ${target}
   모든 값은 WCAG 상대 휘도 계산으로 검증됨 */
:root {
${cssBlock(l, '  ')}
}

:root[data-theme="dark"] {
${cssBlock(d, '  ')}
}

/* 고대비 — 별도 테마가 아니라 토큰 스왑 */
@media (prefers-contrast: more) {
  :root {
${cssBlock(lh, '    ')}
  }
  :root[data-theme="dark"] {
${cssBlock(dh, '    ')}
  }
}`;
};

const TAILWIND_CODE = `// tailwind.config.js — 색상은 전부 CSS 변수 참조
// 다크·고대비는 셀렉터 스왑으로 해결되므로 variant가 늘지 않습니다
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: { DEFAULT: 'var(--surface)', 2: 'var(--surface-2)' },
        border: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
        text: { DEFAULT: 'var(--text)', 2: 'var(--text-2)', 3: 'var(--text-3)' },
        accent: {
          DEFAULT: 'var(--accent)', hover: 'var(--accent-hover)',
          text: 'var(--accent-text)', on: 'var(--on-accent)'
        },
        success: { DEFAULT: 'var(--success)', soft: 'var(--success-soft)', 'on-soft': 'var(--on-success-soft)' },
        warning: { DEFAULT: 'var(--warning)', soft: 'var(--warning-soft)', 'on-soft': 'var(--on-warning-soft)' },
        danger: { DEFAULT: 'var(--danger)', soft: 'var(--danger-soft)', 'on-soft': 'var(--on-danger-soft)' }
      },
      outlineColor: { ring: 'var(--focus-ring)' }
    }
  }
}`;

const shadcnVars = (p: Palette): string =>
  [
    `  --background: ${p.bg.hex};`,
    `  --foreground: ${p.tx.hex};`,
    `  --card: ${p.sf.hex};`,
    `  --card-foreground: ${p.tx.hex};`,
    `  --primary: ${p.ac.hex};`,
    `  --primary-foreground: ${p.oac.hex};`,
    `  --secondary: ${p.sf2.hex};`,
    `  --secondary-foreground: ${p.tx2.hex};`,
    `  --muted: ${p.sf2.hex};`,
    `  --muted-foreground: ${p.tx3.hex};`,
    `  --accent: ${p.sf2.hex};`,
    `  --accent-foreground: ${p.acT.hex};`,
    `  --destructive: ${p.dgT.hex};`,
    `  --destructive-foreground: ${p.dgS.hex};`,
    `  --border: ${p.bd.hex};`,
    `  --input: ${p.bds.hex};`,
    `  --ring: ${p.fc.hex};`,
  ].join('\n');

const buildShadcnCode = (input: ExportInput): string => {
  const [l, d] = fourModes(input);
  const level = input.aaa ? 'AAA' : 'AA';
  return `/* shadcn/ui — app/globals.css 매핑 (${level} 검증값) */
:root {
${shadcnVars(l)}
}

.dark {
${shadcnVars(d).replace(/^ {2}/gm, '  ')}
}`;
};

export const buildExportCode = (tab: ExportTab, input: ExportInput): string => {
  if (tab === 'css') return buildCssCode(input);
  if (tab === 'tw') return TAILWIND_CODE;
  return buildShadcnCode(input);
};
