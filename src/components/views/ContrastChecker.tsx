'use client';

import type { CSSProperties, JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { Chip } from '@/components/ui/Chip';
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD,
  CARD_TITLE,
  cx,
  INPUT_BASE,
} from '@/components/ui/styles';
import { contrastRatio, relativeLuminance } from '@/lib/color/contrast';
import { describeColor } from '@/lib/color/describe';
import { fitForeground } from '@/lib/color/fit';
import { formatRatio, levelOf } from '@/lib/color/format';
import { tokenLabel } from '@/lib/color/tokenMeta';
import type { ColorToken, PaletteKey } from '@/lib/color/types';
import type { SimId } from '@/components/viewTypes';

export const CHECKER_FG_KEYS: PaletteKey[] = [
  'tx', 'tx2', 'tx3', 'acT', 'okT', 'wnT', 'dgT', 'ac', 'oac', 'fc', 'bds',
];
export const CHECKER_BG_KEYS: PaletteKey[] = [
  'bg', 'sf', 'sf2', 'ac', 'okS', 'wnS', 'dgS',
];

interface ContrastCheckerProps {
  ckFg: PaletteKey;
  ckBg: PaletteKey;
  onCkFg: (key: PaletteKey) => void;
  onCkBg: (key: PaletteKey) => void;
  sim: SimId;
  onApplySuggestion: (key: PaletteKey, token: ColorToken) => void;
  overriddenCount: number;
  onResetOverrides: () => void;
}

// 결과를 "보여주는" 카드가 아니라 저시력·색각이상 사용자가 직접 "검사하는" 확대 검사기
const nextKey = (
  keys: PaletteKey[],
  current: PaletteKey,
  dir: 1 | -1,
): PaletteKey => keys[(keys.indexOf(current) + dir + keys.length) % keys.length];

const STEP_BTN =
  'inline-flex min-h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-lg border border-bds bg-transparent text-tx2 transition-colors hover:bg-sf2 hover:text-tx';

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

export const ContrastChecker = ({
  ckFg,
  ckBg,
  onCkFg,
  onCkBg,
  sim,
  onApplySuggestion,
  overriddenCount,
  onResetOverrides,
}: ContrastCheckerProps): JSX.Element => {
  const { palette, target, announce } = useStudio();
  // 선택이 바뀌는 즉시 결과를 낭독 — 화면을 보지 않아도 검사가 완결된다
  const announcePair = (fgKey: PaletteKey, bgKey: PaletteKey): void => {
    const r = contrastRatio(palette[fgKey].hex, palette[bgKey].hex);
    const lv = levelOf(r);
    const verdict = lv === '미달' ? '기준 미달' : `${lv} 수준 통과`;
    announce(
      `전경 ${tokenLabel(fgKey)}, ${describeColor(palette[fgKey])}. 배경 ${tokenLabel(bgKey)}. 대비 ${formatRatio(r)} 대 1, ${verdict}`,
    );
  };
  const changeFg = (key: PaletteKey): void => {
    onCkFg(key);
    announcePair(key, ckBg);
  };
  const changeBg = (key: PaletteKey): void => {
    onCkBg(key);
    announcePair(ckFg, key);
  };
  const fg = palette[ckFg];
  const bg = palette[ckBg];
  const ratio = contrastRatio(fg.hex, bg.hex);
  const chips: Array<{ text: string; pass: boolean; warnish: boolean }> = [
    { text: '본문 AA 4.5', pass: ratio >= 4.5, warnish: false },
    { text: '본문 AAA 7.0', pass: ratio >= 7, warnish: ratio >= 4.5 },
    { text: '대형 텍스트 3.0', pass: ratio >= 3, warnish: false },
    { text: 'UI 요소 3.0', pass: ratio >= 3, warnish: false },
  ];
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
  const sampleFilter: CSSProperties =
    sim === 'none' ? {} : { filter: `url(#cvd-${sim})` };
  return (
    <div
      className={cx(
        'min-h-0 min-w-0 overflow-y-auto lg:flex-[1.4_1_460px]',
        CARD,
      )}
    >
      <h3 className={cx(CARD_TITLE, 'mb-4')}>확대 검사기</h3>
      <div className="flex flex-wrap gap-3">
        <div className="flex-[1_1_13rem]">
          <label htmlFor="ck-fg" className="mb-1 block text-[0.875rem] font-semibold text-tx">
            전경 (텍스트)
          </label>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="이전 전경 토큰"
              onClick={(): void => changeFg(nextKey(CHECKER_FG_KEYS, ckFg, -1))}
              className={STEP_BTN}
            >
              <Chevron dir={-1} />
            </button>
            <select
              id="ck-fg"
              value={ckFg}
              onChange={(e): void => changeFg(e.target.value as PaletteKey)}
              className={cx(INPUT_BASE, 'min-w-0 flex-1 px-2.5 text-[0.9375rem]')}
            >
              {CHECKER_FG_KEYS.map((key) => (
                <option key={key} value={key}>
                  {optionLabel(key)}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label="다음 전경 토큰"
              onClick={(): void => changeFg(nextKey(CHECKER_FG_KEYS, ckFg, 1))}
              className={STEP_BTN}
            >
              <Chevron dir={1} />
            </button>
          </div>
        </div>
        <div className="flex-[1_1_13rem]">
          <label htmlFor="ck-bg" className="mb-1 block text-[0.875rem] font-semibold text-tx">
            배경 (표면)
          </label>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="이전 배경 토큰"
              onClick={(): void => changeBg(nextKey(CHECKER_BG_KEYS, ckBg, -1))}
              className={STEP_BTN}
            >
              <Chevron dir={-1} />
            </button>
            <select
              id="ck-bg"
              value={ckBg}
              onChange={(e): void => changeBg(e.target.value as PaletteKey)}
              className={cx(INPUT_BASE, 'min-w-0 flex-1 px-2.5 text-[0.9375rem]')}
            >
              {CHECKER_BG_KEYS.map((key) => (
                <option key={key} value={key}>
                  {optionLabel(key)}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label="다음 배경 토큰"
              onClick={(): void => changeBg(nextKey(CHECKER_BG_KEYS, ckBg, 1))}
              className={STEP_BTN}
            >
              <Chevron dir={1} />
            </button>
          </div>
        </div>
      </div>
      <p className="mb-0 mt-1.5 text-xs text-tx3">
        좌우 버튼으로 토큰을 하나씩 넘기며 검사할 수 있고, 바뀔 때마다 결과가
        낭독됩니다.
      </p>
      <div
        aria-hidden="true"
        className="mt-4 flex flex-col gap-2 rounded-[10px] border border-bd p-6"
        style={{ background: bg.hex, color: fg.hex, ...sampleFilter }}
      >
        <span className="text-[0.875rem]">
          보조 설명 크기 — 가나다라마바사 0123456789
        </span>
        <span className="text-[1.0625rem] font-semibold">
          본문 크기 — 색을 보지 않아도 검사할 수 있습니다
        </span>
        <span className="text-[1.75rem] font-bold leading-tight">
          대형 텍스트 — 계산으로 보장
        </span>
        <span className="text-[3.25rem] font-extrabold leading-none tracking-[-0.02em]">
          Aa 가나 123
        </span>
      </div>
      <p className="mb-0 mt-1.5 text-xs text-tx3">
        선택한 색각 시뮬레이션이 위 샘플에 함께 적용됩니다.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <p className="m-0 font-mono text-[3.25rem] font-bold tracking-[-0.02em] text-tx tabular-nums">
          {formatRatio(ratio)}
          <span className="text-[1.25rem] font-medium text-tx3"> : 1</span>
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {chips.map((chip) => (
            <li key={chip.text}>
              <Chip
                tone={chip.pass ? 'ok' : chip.warnish ? 'warn' : 'danger'}
                text={chip.text}
                size="md"
              />
            </li>
          ))}
        </ul>
      </div>
      <dl className="mb-0 mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-bd pt-3 text-[0.9375rem]">
        <dt className="font-semibold text-tx">전경</dt>
        <dd className="m-0 text-tx2">
          <span className="font-mono">{tokenLabel(ckFg)} · {fg.hex}</span> —{' '}
          {describeColor(fg)}
        </dd>
        <dt className="font-semibold text-tx">배경</dt>
        <dd className="m-0 text-tx2">
          <span className="font-mono">{tokenLabel(ckBg)} · {bg.hex}</span> —{' '}
          {describeColor(bg)}
        </dd>
      </dl>
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
              {describeColor(suggestion)} — 색상·채도는 유지되어 브랜드가 지켜집니다.
            </span>
          </p>
          <button
            type="button"
            onClick={(): void => onApplySuggestion(ckFg, suggestion)}
            className={cx(BTN_PRIMARY, 'mt-3 px-4 text-[0.875rem]')}
          >
            이 값으로 {tokenLabel(ckFg)} 교체
          </button>
          <p className="mb-0 mt-2 text-xs text-tx3">
            AI가 아닌 결정론적 계산값입니다 — API 키 없이 즉시 적용되고, 적용
            직후 전체 매트릭스가 재검증됩니다.
          </p>
        </div>
      )}
      {overriddenCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-bd pt-3.5">
          <Chip tone="neutral" text={`수동 보정 ${overriddenCount}건 적용 중`} />
          <button
            type="button"
            onClick={onResetOverrides}
            className={cx(BTN_SECONDARY, 'px-4 text-[0.875rem]')}
          >
            생성값으로 초기화
          </button>
        </div>
      )}
    </div>
  );
};
