'use client';

import { useState, type JSX } from 'react';
import { SectionZoom } from '@/components/SectionZoom';
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

type ZoomArea = 'checker' | 'cvd' | 'matrix';

const ZOOM_TITLES: Record<ZoomArea, string> = {
  checker: '확대 검사기',
  cvd: '색각 시뮬레이션',
  matrix: '전 조합 매트릭스',
};

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
}: CheckViewProps): JSX.Element => {
  const [zoomed, setZoomed] = useState<ZoomArea | null>(null);
  const checkerProps = {
    ckFg,
    ckBg,
    onCkFg,
    onCkBg,
    sim,
    onApplySuggestion,
    overriddenCount,
    onResetOverrides,
  };
  return (
    <section aria-labelledby="h-check" className="h-full">
      <div className="flex flex-col gap-5 lg:h-full">
        {/* 검사기·시뮬레이션은 내용 높이 그대로, 매트릭스가 남은 높이를 차지해 내부 스크롤 */}
        <div className="flex flex-none flex-col gap-5 lg:flex-row lg:items-stretch">
          <ContrastChecker
            {...checkerProps}
            onExpand={(): void => setZoomed('checker')}
          />
          <CvdSimulation
            sim={sim}
            onSim={onSim}
            onExpand={(): void => setZoomed('cvd')}
          />
        </div>
        <MatrixTable onExpand={(): void => setZoomed('matrix')} />
      </div>
      {zoomed && (
        <SectionZoom
          title={ZOOM_TITLES[zoomed]}
          onClose={(): void => setZoomed(null)}
        >
          {zoomed === 'checker' ? (
            <ContrastChecker {...checkerProps} />
          ) : zoomed === 'cvd' ? (
            <CvdSimulation sim={sim} onSim={onSim} />
          ) : (
            <MatrixTable />
          )}
        </SectionZoom>
      )}
    </section>
  );
};
