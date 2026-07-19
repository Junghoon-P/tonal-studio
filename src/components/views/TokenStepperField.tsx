'use client';

import type { JSX } from 'react';
import { cx, INPUT_BASE } from '@/components/ui/styles';
import type { PaletteKey } from '@/lib/color/types';

interface TokenStepperFieldProps {
  id: string;
  label: string;
  /** 스테퍼 버튼 낭독용 짧은 이름 — 예: "전경" */
  shortLabel: string;
  keys: PaletteKey[];
  value: PaletteKey;
  onChange: (key: PaletteKey) => void;
  optionLabel: (key: PaletteKey) => string;
}

const STEP_BTN =
  'inline-flex min-h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-lg border border-bds bg-transparent text-tx2 transition-colors hover:bg-sf2 hover:text-tx';

const nextKey = (
  keys: PaletteKey[],
  current: PaletteKey,
  dir: 1 | -1,
): PaletteKey => keys[(keys.indexOf(current) + dir + keys.length) % keys.length];

const Chevron = ({ dir }: { dir: 1 | -1 }): JSX.Element => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === -1 ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'} />
  </svg>
);

// 셀렉트를 못 다뤄도 좌우 버튼만으로 토큰을 순환하며 검사하는 스테퍼 필드
export const TokenStepperField = ({
  id,
  label,
  shortLabel,
  keys,
  value,
  onChange,
  optionLabel,
}: TokenStepperFieldProps): JSX.Element => (
  <div className="flex-[1_1_13rem]">
    <label
      htmlFor={id}
      className="mb-1 block text-[0.875rem] font-semibold text-tx"
    >
      {label}
    </label>
    <div className="flex gap-1">
      <button
        type="button"
        aria-label={`이전 ${shortLabel} 토큰`}
        onClick={(): void => onChange(nextKey(keys, value, -1))}
        className={STEP_BTN}
      >
        <Chevron dir={-1} />
      </button>
      <select
        id={id}
        value={value}
        onChange={(e): void => onChange(e.target.value as PaletteKey)}
        className={cx(INPUT_BASE, 'min-w-0 flex-1 px-2.5 text-[0.9375rem]')}
      >
        {keys.map((key) => (
          <option key={key} value={key}>
            {optionLabel(key)}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-label={`다음 ${shortLabel} 토큰`}
        onClick={(): void => onChange(nextKey(keys, value, 1))}
        className={STEP_BTN}
      >
        <Chevron dir={1} />
      </button>
    </div>
  </div>
);
