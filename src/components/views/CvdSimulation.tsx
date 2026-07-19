'use client';

import type { CSSProperties, JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { Chip } from '@/components/ui/Chip';
import { ICON_CHECK, ICON_WARN, ICON_X } from '@/components/ui/icons';
import { CARD, CARD_TITLE, cx } from '@/components/ui/styles';
import { statusLightnessGap } from '@/lib/color/statusGap';
import { tokenLabel } from '@/lib/color/tokenMeta';
import type { PaletteKey } from '@/lib/color/types';
import type { SimId } from '@/components/viewTypes';

const SIM_OPTIONS: ReadonlyArray<readonly [SimId, string]> = [
  ['none', '원본'],
  ['prot', '적색맹 P형'],
  ['deut', '녹색맹 D형'],
  ['trit', '청색맹 T형'],
  ['gray', '흑백'],
];

const STRIP_KEYS: PaletteKey[] = [
  'bg', 'sf', 'sf2', 'tx', 'tx2', 'ac', 'okT', 'wnT', 'dgT',
];

interface CvdSimulationProps {
  sim: SimId;
  onSim: (sim: SimId) => void;
}

export const CvdSimulation = ({ sim, onSim }: CvdSimulationProps): JSX.Element => {
  const { palette, announce } = useStudio();
  const okL = Math.round(palette.okT.L * 100);
  const wnL = Math.round(palette.wnT.L * 100);
  const dgL = Math.round(palette.dgT.L * 100);
  const lGapText = `ΔL ≥ ${statusLightnessGap(palette)}`;
  const filterStyle: CSSProperties =
    sim === 'none' ? {} : { filter: `url(#cvd-${sim})` };
  return (
    <div className={cx('min-w-0 flex-[1_1_380px]', CARD)}>
      <h3 className={cx(CARD_TITLE, 'mb-1.5')}>색각 시뮬레이션</h3>
      <fieldset className="mb-4 flex flex-wrap gap-x-4 gap-y-0.5 border-0 p-0">
        <legend className="sr-only">색각 시뮬레이션 유형 선택</legend>
        {SIM_OPTIONS.map(([id, label]) => (
          <label
            key={id}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-[0.875rem] font-medium text-tx"
          >
            <input
              type="radio"
              name="cvd"
              checked={sim === id}
              onChange={(): void => {
                onSim(id);
                announce(`${label} 시뮬레이션 적용됨`);
              }}
              className="m-0 h-[1.125rem] w-[1.125rem] accent-ac"
            />
            {label}
          </label>
        ))}
      </fieldset>
      <div className="pt-1" style={filterStyle}>
        <div className="flex flex-wrap gap-1.5" aria-hidden="true">
          {STRIP_KEYS.map((key) => (
            <span key={key} className="flex flex-col items-center gap-1">
              <span
                className="inline-block h-[2.375rem] w-[2.375rem] rounded-lg border border-bd"
                style={{ background: palette[key].hex }}
              />
              <span className="font-mono text-[0.6875rem] text-tx3">
                {tokenLabel(key).replace('--', '')}
              </span>
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip tone="ok" text={`성공 L${okL}`} iconD={ICON_CHECK} size="md" />
          <Chip tone="warn" text={`경고 L${wnL}`} iconD={ICON_WARN} size="md" strokeWidth={1.75} />
          <Chip tone="danger" text={`오류 L${dgL}`} iconD={ICON_X} size="md" />
        </div>
      </div>
      <p className="mb-0 mt-4 border-t border-bd pt-3.5 text-[0.8125rem] leading-[1.55] text-tx2">
        상태 색상은 청록·호박·주홍 축(Okabe-Ito 계열)이며 명도 간격 {lGapText}를
        유지합니다. 시뮬레이션은 근사치 — 진짜 안전장치는 색에 의존하지 않는
        아이콘·라벨·명도입니다.
      </p>
    </div>
  );
};
