'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import {
  ICON_CHECK_DOUBLE,
  ICON_DASH,
  ICON_WARN,
  ICON_X,
} from '@/components/ui/icons';
import { formatRatio, levelOf } from '@/lib/color/format';

export type ChipTone = 'ok' | 'warn' | 'danger' | 'neutral';

interface ChipProps {
  tone: ChipTone;
  text: string;
  /** 기본 아이콘(톤별) 대신 쓸 SVG 패스 */
  iconD?: string;
  size?: 'sm' | 'md';
  strokeWidth?: number;
}

const TONE_CLASS: Record<ChipTone, string> = {
  ok: 'bg-okS text-okF',
  warn: 'bg-wnS text-wnF',
  danger: 'bg-dgS text-dgF',
  neutral: 'bg-sf2 text-tx2',
};

const TONE_ICON: Record<ChipTone, string> = {
  ok: ICON_CHECK_DOUBLE,
  warn: ICON_WARN,
  danger: ICON_X,
  neutral: ICON_DASH,
};

export const Chip = ({
  tone,
  text,
  iconD,
  size = 'sm',
  strokeWidth = 2,
}: ChipProps): JSX.Element => {
  const { hc } = useStudio();
  // 고대비에서는 소프트 표면 대신 전경색 테두리로 형태를 보강한다
  const border =
    tone === 'neutral'
      ? 'border-bd'
      : hc
        ? 'border-current'
        : 'border-transparent';
  const sizeClass =
    size === 'sm'
      ? 'gap-[0.3125rem] px-[0.5625rem] py-[0.1875rem] text-xs'
      : 'gap-[0.3125rem] px-2.5 py-1 text-[0.8125rem]';
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border font-semibold tabular-nums ${TONE_CLASS[tone]} ${border} ${sizeClass}`}
    >
      <svg
        width={13}
        height={13}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={iconD ?? TONE_ICON[tone]} />
      </svg>
      {text}
    </span>
  );
};

interface RatioChipProps {
  ratio: number;
  required: number;
  label?: string;
  /** true면 "4.52" 숫자만 표기 (매트릭스 셀) */
  bare?: boolean;
}

// 대비율 판정 칩 — 통과/미달을 아이콘+수치+레벨로 표기
export const RatioChip = ({
  ratio,
  required,
  label,
  bare = false,
}: RatioChipProps): JSX.Element => {
  const pass = ratio >= required;
  const text = bare
    ? formatRatio(ratio)
    : `${label ? `${label} ` : ''}${formatRatio(ratio)}:1 · ${levelOf(ratio)}`;
  return <Chip tone={pass ? 'ok' : 'danger'} text={text} />;
};
