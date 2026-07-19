'use client';

import type { JSX } from 'react';
import { ContrastChecker } from '@/components/views/ContrastChecker';
import { CvdSimulation } from '@/components/views/CvdSimulation';
import { MatrixTable } from '@/components/views/MatrixTable';
import type { SimId } from '@/components/viewTypes';
import type { ColorToken, PaletteKey } from '@/lib/color/types';

interface CheckViewProps {
  ckFg: PaletteKey;
  ckBg: PaletteKey;
  onCkFg: (key: PaletteKey) => void;
  onCkBg: (key: PaletteKey) => void;
  sim: SimId;
  onSim: (sim: SimId) => void;
  onApplySuggestion: (key: PaletteKey, token: ColorToken) => void;
  overriddenCount: number;
  onResetOverrides: () => void;
}

export const CheckView = ({
  ckFg,
  ckBg,
  onCkFg,
  onCkBg,
  sim,
  onSim,
  onApplySuggestion,
  overriddenCount,
  onResetOverrides,
}: CheckViewProps): JSX.Element => (
  <section aria-labelledby="h-check" className="h-full">
    <div className="flex h-full flex-col gap-5">
      <div className="flex min-h-0 flex-[3_1_0] flex-wrap items-stretch gap-5">
        <ContrastChecker
          ckFg={ckFg}
          ckBg={ckBg}
          onCkFg={onCkFg}
          onCkBg={onCkBg}
          sim={sim}
          onApplySuggestion={onApplySuggestion}
          overriddenCount={overriddenCount}
          onResetOverrides={onResetOverrides}
        />
        <CvdSimulation sim={sim} onSim={onSim} />
      </div>
      <MatrixTable />
    </div>
  </section>
);
