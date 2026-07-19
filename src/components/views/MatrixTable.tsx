'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { Chip, RatioChip } from '@/components/ui/Chip';
import { ExpandButton } from '@/components/ui/ExpandButton';
import { CARD, CARD_TITLE, cx, TH_COL } from '@/components/ui/styles';
import { contrastRatio } from '@/lib/color/contrast';
import { formatRatio } from '@/lib/color/format';
import { tokenLabel } from '@/lib/color/tokenMeta';
import type { PaletteKey } from '@/lib/color/types';

export const MATRIX_FGS: PaletteKey[] = [
  'tx', 'tx2', 'tx3', 'acT', 'okT', 'wnT', 'dgT',
];
export const MATRIX_BGS: PaletteKey[] = ['bg', 'sf', 'sf2'];

export const matrixRequired = (
  fg: PaletteKey,
  hc: boolean,
  target: number,
): number => {
  if (fg === 'tx') return 7;
  if (fg === 'tx3') return hc ? 7 : 4.5;
  return target;
};

interface MatrixTableProps {
  onExpand?: () => void;
}

// 사람이 손으로 못 하는 전 조합 검사를 시스템이 대신한다
export const MatrixTable = ({ onExpand }: MatrixTableProps): JSX.Element => {
  const { palette, hc, target } = useStudio();
  const rows = MATRIX_FGS.map((fg) => ({
    fg,
    cells: MATRIX_BGS.map((bg) => ({
      bg,
      ratio: contrastRatio(palette[fg].hex, palette[bg].hex),
      required: matrixRequired(fg, hc, target),
    })),
  }));
  const min = Math.min(...rows.flatMap((row) => row.cells.map((c) => c.ratio)));
  const allPass = min >= 4.5;
  return (
    <div className={cx('flex min-h-0 flex-col lg:flex-1', CARD)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className={CARD_TITLE}>전 조합 매트릭스 — 텍스트 × 표면</h3>
        <div className="flex items-center gap-2">
          <Chip
            tone={allPass ? 'ok' : 'danger'}
            text={`21쌍 최저 ${formatRatio(min)}:1`}
          />
          {onExpand && (
            <ExpandButton label="전 조합 매트릭스" onClick={onExpand} />
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <caption className="sr-only">
            모든 텍스트 토큰과 표면 토큰 조합의 대비 비율
          </caption>
          <thead>
            <tr>
              <th scope="col" className={cx(TH_COL, 'pr-3')}>
                전경 ↓ 배경 →
              </th>
              {MATRIX_BGS.map((bg) => (
                <th
                  key={bg}
                  scope="col"
                  className="border-b border-bd px-3 py-2 text-left font-mono text-xs font-semibold normal-case text-tx2"
                >
                  {tokenLabel(bg)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.fg}>
                <th
                  scope="row"
                  className="border-b border-bd py-2 pr-3 text-left font-mono text-[0.8125rem] font-semibold text-tx"
                >
                  {tokenLabel(row.fg)}
                </th>
                {row.cells.map((cell) => (
                  <td key={cell.bg} className="border-b border-bd px-3 py-2">
                    <RatioChip ratio={cell.ratio} required={cell.required} bare />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
