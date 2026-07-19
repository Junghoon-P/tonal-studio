'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { Chip } from '@/components/ui/Chip';
import {
  MATRIX_BGS,
  MATRIX_FGS,
} from '@/components/views/MatrixTable';
import { CARD, CARD_TITLE, cx, SEG_BASE, SEG_GROUP, SEG_ON } from '@/components/ui/styles';
import { contrastRatio } from '@/lib/color/contrast';
import { formatRatio } from '@/lib/color/format';
import { statusLightnessGap } from '@/lib/color/statusGap';
import { buildExportCode, type ExportTab } from '@/lib/export/codegen';

interface ExportViewProps {
  tab: ExportTab;
  onTab: (tab: ExportTab) => void;
  copied: boolean;
  onCopy: () => void;
  hue: number;
  warm: number;
}

interface ReportItem {
  lv: string;
  t: string;
  d: string;
  state: 'ok' | 'partial' | 'fail';
}

const TABS: ReadonlyArray<readonly [ExportTab, string]> = [
  ['css', 'CSS 변수'],
  ['tw', 'Tailwind'],
  ['sh', 'shadcn/ui'],
];

export const ExportView = ({
  tab,
  onTab,
  copied,
  onCopy,
  hue,
  warm,
}: ExportViewProps): JSX.Element => {
  const { palette, dark, hc, aaa } = useStudio();
  const ratios = MATRIX_FGS.flatMap((fg) =>
    MATRIX_BGS.map((bg) => contrastRatio(palette[fg].hex, palette[bg].hex)),
  );
  const total = ratios.length;
  const min = Math.min(...ratios);
  const aaaCount = ratios.filter((r) => r >= 7).length;
  const fcR = contrastRatio(palette.fc.hex, palette.bg.hex);
  const bdsR = contrastRatio(palette.bds.hex, palette.sf.hex);
  const gap = statusLightnessGap(palette);
  const themeName = `${dark ? '다크' : '라이트'}${hc ? ' · 고대비' : ''}`;
  const report: ReportItem[] = [
    {
      lv: 'AA',
      t: '1.4.3 대비 (최소)',
      d: `텍스트×표면 ${total}쌍 전부 ≥ 4.5:1 — 최저 ${formatRatio(min)}:1`,
      state: min >= 4.5 ? 'ok' : 'fail',
    },
    {
      lv: 'AAA',
      t: '1.4.6 대비 (향상)',
      d: `${aaaCount}/${total}쌍 ≥ 7:1${aaa || hc ? ' — AAA 목표 활성' : ' — AA 목표로 생성됨'}`,
      state: aaaCount === total ? 'ok' : aaaCount > total * 0.6 ? 'partial' : 'fail',
    },
    {
      lv: 'AA',
      t: '1.4.11 비텍스트 대비',
      d: `구분 경계 ${formatRatio(bdsR)}:1 · 포커스 링 ${formatRatio(fcR)}:1 (기준 3:1)`,
      state: bdsR >= 3 && fcR >= 3 ? 'ok' : 'fail',
    },
    {
      lv: 'A',
      t: '1.4.1 색상만으로 전달 금지',
      d: `상태는 아이콘+라벨 병행, 명도 간격 ΔL ≥ ${gap} — 흑백에서도 구분`,
      state: gap >= 8 ? 'ok' : 'fail',
    },
    {
      lv: 'AA',
      t: '2.4.7 포커스 가시성',
      d: '모든 인터랙티브 요소에 2px 링 + 2px 오프셋 — 숨기지 않고 브랜드 요소로 디자인',
      state: 'ok',
    },
    {
      lv: '보조',
      t: '색각 시뮬레이션',
      d: 'P형·D형·T형·흑백 근사 행렬 내장 — 검사 화면에서 실시간 확인',
      state: 'ok',
    },
  ];
  const code = buildExportCode(tab, { hue, warm, aaa });
  return (
    <section aria-labelledby="h-export">
      <div className="mb-5 mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2
          id="h-export"
          className="m-0 text-[1.375rem] font-bold tracking-[-0.02em] text-tx"
        >
          내보내기
        </h2>
        <p className="m-0 text-[0.9375rem] text-tx2">
          검증 리포트와 함께, 다크·고대비가 토큰 스왑 하나로 해결되는 코드로
          출고합니다.
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-5">
        <div className={cx('min-w-0 flex-[1_1_360px]', CARD)}>
          <h3 className={cx(CARD_TITLE, 'mb-4')}>
            검증 리포트 — WCAG 2.2 · {themeName}
          </h3>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {report.map((item) => (
              <li key={item.t} className="flex items-start gap-3">
                <Chip
                  tone={item.state === 'ok' ? 'ok' : item.state === 'partial' ? 'warn' : 'danger'}
                  text={item.state === 'ok' ? '통과' : item.state === 'partial' ? '부분' : '미달'}
                />
                <span className="min-w-0 flex-1">
                  <strong className="block text-[0.9375rem] font-semibold text-tx">
                    {item.t}{' '}
                    <span className="rounded-[5px] border border-bd px-[0.3125rem] py-px align-[0.0625rem] font-mono text-xs font-semibold text-tx3">
                      {item.lv}
                    </span>
                  </strong>
                  <span className="mt-0.5 block text-[0.8125rem] leading-[1.55] text-tx2">
                    {item.d}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cx('min-w-0 flex-[1.4_1_420px]', CARD)}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label="내보내기 형식" className={SEG_GROUP}>
              {TABS.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={tab === id}
                  onClick={(): void => onTab(id)}
                  className={cx(SEG_BASE, tab === id && SEG_ON)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-bds bg-transparent px-4 text-[0.875rem] font-semibold text-tx transition-colors hover:bg-sf2 active:scale-[0.985]"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x={5.5} y={5.5} width={8} height={8} rx={1.5} />
                <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
              </svg>
              {copied ? '복사됨 ✓' : '클립보드에 복사'}
            </button>
          </div>
          <pre className="m-0 max-h-[30rem] overflow-auto rounded-[10px] border border-bd bg-sf2 p-4 font-mono text-[0.8125rem] leading-[1.6] text-tx">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
