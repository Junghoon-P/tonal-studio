'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { AiSuggest } from '@/components/views/AiSuggest';
import { PreviewCard } from '@/components/views/PreviewCard';
import { TokenTable } from '@/components/views/TokenTable';
import { CARD, CARD_TITLE, cx, SEG_BASE, SEG_GROUP, SEG_ON } from '@/components/ui/styles';
import { hueName } from '@/lib/color/hueName';
import type { KeyErrorKind } from '@/lib/openai/verifyKey';
import type { KeyPhase } from '@/hooks/useApiKey';

export interface AiMsg {
  kind: 'ok' | 'warn' | 'err';
  text: string;
}

interface PaletteViewProps {
  hue: number;
  warm: number;
  onHue: (hue: number) => void;
  onWarm: (warm: number) => void;
  onAaa: (aaa: boolean) => void;
  keyPhase: KeyPhase;
  keyErrKind: KeyErrorKind | null;
  onOpenKey: () => void;
  aiPrompt: string;
  onAiPrompt: (value: string) => void;
  aiBusy: boolean;
  aiMsg: AiMsg | null;
  onRunAI: () => void;
}

const warmLabel = (warm: number): string => {
  if (warm < 34) return `차갑게 · ${warm}`;
  if (warm < 67) return `중립 · ${warm}`;
  return `따뜻하게 · ${warm}`;
};

const SLIDER =
  'm-0 h-11 w-full accent-ac';

export const PaletteView = ({
  hue,
  warm,
  onHue,
  onWarm,
  onAaa,
  keyPhase,
  keyErrKind,
  onOpenKey,
  aiPrompt,
  onAiPrompt,
  aiBusy,
  aiMsg,
  onRunAI,
}: PaletteViewProps): JSX.Element => {
  const { hc, aaa } = useStudio();
  return (
    <section aria-labelledby="h-palette">
      <div className="mb-5 mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2
          id="h-palette"
          className="m-0 text-[1.375rem] font-bold tracking-[-0.02em] text-tx"
        >
          팔레트 생성
        </h2>
        <p className="m-0 text-[0.9375rem] text-tx2">
          목표 대비를 만족할 때까지 OKLCH 명도를 자동 보정해 토큰을 생성합니다 —
          검사가 아니라 보장.
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-5">
        <div className={cx('flex max-w-[340px] flex-[1_1_240px] flex-col gap-5', CARD)}>
          <h3 className={CARD_TITLE}>생성 설정</h3>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="hue" className="text-[0.9375rem] font-semibold text-tx">
                액센트 색상
              </label>
              <output htmlFor="hue" className="font-mono text-[0.8125rem] text-tx2">
                {hueName(hue)} · {hue}°
              </output>
            </div>
            <input
              id="hue"
              type="range"
              min={0}
              max={359}
              step={1}
              value={hue}
              onChange={(e): void => onHue(Number(e.target.value))}
              aria-valuetext={`${hueName(hue)} · ${hue}°`}
              className={SLIDER}
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="warm" className="text-[0.9375rem] font-semibold text-tx">
                중성색 온도
              </label>
              <output htmlFor="warm" className="font-mono text-[0.8125rem] text-tx2">
                {warmLabel(warm)}
              </output>
            </div>
            <input
              id="warm"
              type="range"
              min={0}
              max={100}
              step={1}
              value={warm}
              onChange={(e): void => onWarm(Number(e.target.value))}
              aria-valuetext={warmLabel(warm)}
              className={SLIDER}
            />
          </div>
          <div>
            <p id="lb-target" className="mb-1.5 mt-0 text-[0.9375rem] font-semibold text-tx">
              본문 대비 목표
            </p>
            <div role="group" aria-labelledby="lb-target" className={SEG_GROUP}>
              <button
                type="button"
                aria-pressed={!aaa && !hc}
                onClick={(): void => onAaa(false)}
                disabled={hc}
                className={cx(
                  SEG_BASE,
                  'flex-1 justify-center',
                  !aaa && !hc && SEG_ON,
                  hc && 'cursor-not-allowed opacity-50',
                )}
              >
                AA · 4.5:1
              </button>
              <button
                type="button"
                aria-pressed={aaa || hc}
                onClick={(): void => onAaa(true)}
                disabled={hc}
                className={cx(
                  SEG_BASE,
                  'flex-1 justify-center',
                  (aaa || hc) && SEG_ON,
                  hc && 'cursor-not-allowed opacity-50',
                )}
              >
                AAA · 7:1
              </button>
            </div>
            {hc && (
              <p className="mb-0 mt-2 text-[0.8125rem] text-tx2">
                고대비 모드에서는 AAA(7:1)로 고정됩니다.
              </p>
            )}
          </div>
          <AiSuggest
            keyPhase={keyPhase}
            keyErrKind={keyErrKind}
            onOpenKey={onOpenKey}
            aiPrompt={aiPrompt}
            onAiPrompt={onAiPrompt}
            aiBusy={aiBusy}
            aiMsg={aiMsg}
            onRunAI={onRunAI}
          />
          <p className="m-0 border-t border-bd pt-3.5 text-[0.8125rem] leading-[1.55] text-tx2">
            색상(H)과 채도(C)는 브랜드가 정하고, 명도(L)는 계산이 정합니다. 어떤
            설정에서도 기준 미달 토큰은 생성되지 않습니다.
          </p>
        </div>
        <TokenTable />
        <div className="flex max-w-[420px] flex-[1.2_1_300px] flex-col gap-5">
          <PreviewCard />
        </div>
      </div>
    </section>
  );
};
