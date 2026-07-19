'use client';

import type { JSX } from 'react';
import { ContrastChecker } from '@/components/views/ContrastChecker';
import { CvdSimulation } from '@/components/views/CvdSimulation';
import { MatrixTable } from '@/components/views/MatrixTable';
import type { SimId } from '@/components/viewTypes';
import type { PaletteKey } from '@/lib/color/types';

interface CheckViewProps {
  ckFg: PaletteKey;
  ckBg: PaletteKey;
  onCkFg: (key: PaletteKey) => void;
  onCkBg: (key: PaletteKey) => void;
  sim: SimId;
  onSim: (sim: SimId) => void;
}

export const CheckView = ({
  ckFg,
  ckBg,
  onCkFg,
  onCkBg,
  sim,
  onSim,
}: CheckViewProps): JSX.Element => (
  <section aria-labelledby="h-check">
    <div className="mb-5 mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-2">
      <h2
        id="h-check"
        className="m-0 text-[1.375rem] font-bold tracking-[-0.02em] text-tx"
      >
        검사
      </h2>
      <p className="m-0 text-[0.9375rem] text-tx2">
        대비는 WCAG 상대 휘도 공식으로 실시간 계산 — 추정값이 아닙니다.
      </p>
    </div>
    <div className="flex flex-wrap items-stretch gap-5">
      <ContrastChecker
        ckFg={ckFg}
        ckBg={ckBg}
        onCkFg={onCkFg}
        onCkBg={onCkBg}
        sim={sim}
      />
      <CvdSimulation sim={sim} onSim={onSim} />
      <MatrixTable />
    </div>
  </section>
);
