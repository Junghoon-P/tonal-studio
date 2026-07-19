'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { Chip } from '@/components/ui/Chip';
import { CARD, CARD_TITLE, cx, INPUT_BASE } from '@/components/ui/styles';
import { contrastRatio, relativeLuminance } from '@/lib/color/contrast';
import { fitForeground } from '@/lib/color/fit';
import { formatRatio } from '@/lib/color/format';
import { tokenLabel } from '@/lib/color/tokenMeta';
import type { PaletteKey } from '@/lib/color/types';

const FG_KEYS: PaletteKey[] = [
  'tx', 'tx2', 'tx3', 'acT', 'okT', 'wnT', 'dgT', 'ac', 'oac', 'fc', 'bds',
];
const BG_KEYS: PaletteKey[] = ['bg', 'sf', 'sf2', 'ac', 'okS', 'wnS', 'dgS'];

interface ContrastCheckerProps {
  ckFg: PaletteKey;
  ckBg: PaletteKey;
  onCkFg: (key: PaletteKey) => void;
  onCkBg: (key: PaletteKey) => void;
}

export const ContrastChecker = ({
  ckFg,
  ckBg,
  onCkFg,
  onCkBg,
}: ContrastCheckerProps): JSX.Element => {
  const { palette, target } = useStudio();
  const fg = palette[ckFg];
  const bg = palette[ckBg];
  const ratio = contrastRatio(fg.hex, bg.hex);
  const chips: Array<{ text: string; pass: boolean; warnish: boolean }> = [
    { text: '본문 AA 4.5', pass: ratio >= 4.5, warnish: false },
    { text: '본문 AAA 7.0', pass: ratio >= 7, warnish: ratio >= 4.5 },
    { text: '대형 텍스트 3.0', pass: ratio >= 3, warnish: false },
    { text: 'UI 요소 3.0', pass: ratio >= 3, warnish: false },
  ];
  // 미달이면 H·C를 유지한 채 명도만 조정한 보정안을 제시한다
  const suggestion =
    ratio < target
      ? fitForeground(
          bg.hex,
          fg.H,
          fg.C,
          target,
          fg.L,
          relativeLuminance(bg.hex) > 0.18 ? -1 : 1,
        )
      : null;
  const optionLabel = (key: PaletteKey): string =>
    `${tokenLabel(key)}  ${palette[key].hex}`;
  return (
    <div className={cx('min-w-0 flex-[1_1_340px]', CARD)}>
      <h3 className={cx(CARD_TITLE, 'mb-4')}>대비 검사기</h3>
      <div className="flex flex-wrap gap-3">
        <div className="flex-[1_1_10rem]">
          <label htmlFor="ck-fg" className="mb-1 block text-[0.8125rem] font-semibold text-tx">
            전경 (텍스트)
          </label>
          <select
            id="ck-fg"
            value={ckFg}
            onChange={(e): void => onCkFg(e.target.value as PaletteKey)}
            className={cx(INPUT_BASE, 'w-full px-2.5')}
          >
            {FG_KEYS.map((key) => (
              <option key={key} value={key}>
                {optionLabel(key)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-[1_1_10rem]">
          <label htmlFor="ck-bg" className="mb-1 block text-[0.8125rem] font-semibold text-tx">
            배경 (표면)
          </label>
          <select
            id="ck-bg"
            value={ckBg}
            onChange={(e): void => onCkBg(e.target.value as PaletteKey)}
            className={cx(INPUT_BASE, 'w-full px-2.5')}
          >
            {BG_KEYS.map((key) => (
              <option key={key} value={key}>
                {optionLabel(key)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-[1.125rem] flex flex-wrap items-center gap-4">
        <p className="m-0 font-mono text-[2.625rem] font-bold tracking-[-0.02em] text-tx tabular-nums">
          {formatRatio(ratio)}
          <span className="text-[1.125rem] font-medium text-tx3"> : 1</span>
        </p>
        <div
          aria-hidden="true"
          className="rounded-lg border border-bd px-4 py-3 text-[1.0625rem] font-semibold"
          style={{ background: bg.hex, color: fg.hex }}
        >
          가나다 Aa 123
        </div>
      </div>
      <ul className="mb-0 mt-4 flex list-none flex-wrap gap-2 p-0">
        {chips.map((chip) => (
          <li key={chip.text}>
            <Chip
              tone={chip.pass ? 'ok' : chip.warnish ? 'warn' : 'danger'}
              text={chip.text}
            />
          </li>
        ))}
      </ul>
      {suggestion && (
        <div className="mt-[1.125rem] rounded-[10px] border border-bds bg-sf2 px-4 py-3.5">
          <p className="mb-1.5 mt-0 text-[0.8125rem] font-bold text-tx">
            자동 보정 제안 — 명도(L)만 조정
          </p>
          <p className="m-0 flex flex-wrap items-center gap-2 font-mono text-[0.8125rem] text-tx">
            <span
              className="inline-block h-7 w-7 flex-none rounded-md border border-bd"
              style={{ background: suggestion.hex }}
            />
            {suggestion.hex} · {formatRatio(contrastRatio(suggestion.hex, bg.hex))}:1
            <span className="font-sans text-tx2">
              색상·채도는 유지되어 브랜드가 지켜집니다.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
