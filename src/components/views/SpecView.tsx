'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { RatioChip } from '@/components/ui/Chip';
import { SpecMock } from '@/components/views/SpecMock';
import { SPEC_CARDS } from '@/components/views/specData';
import { CARD, CARD_TITLE, cx } from '@/components/ui/styles';
import { contrastRatio } from '@/lib/color/contrast';

export const SpecView = (): JSX.Element => {
  const { palette, hc, target } = useStudio();
  const r = (a: string, b: string): number => contrastRatio(a, b);
  const pairs: Array<{ label: string; ratio: number; required: number }> = [
    { label: '잠금 배지 · --text-2/--surface-2', ratio: r(palette.tx2.hex, palette.sf2.hex), required: target },
    { label: '입력 값 · --text/--surface', ratio: r(palette.tx.hex, palette.sf.hex), required: 7 },
    { label: '필드 경계 · --border-strong/--surface', ratio: r(palette.bds.hex, palette.sf.hex), required: hc ? 4.5 : 3 },
    { label: '연결 확인 버튼 · --on-accent/--accent', ratio: r(palette.oac.hex, palette.ac.hex), required: hc ? 7 : 4.5 },
    { label: '오류 박스 · --on-danger-soft/--danger-soft', ratio: r(palette.dgF.hex, palette.dgS.hex), required: hc ? 7 : 4.5 },
    { label: '포커스 링 · --focus-ring/--bg', ratio: r(palette.fc.hex, palette.bg.hex), required: hc ? 4.5 : 3 },
  ];
  return (
    <section aria-labelledby="h-spec" className="flex h-full flex-col">
      <div className={cx('mb-5 flex-none', CARD)}>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={CARD_TITLE}>대비 실측 — 현재 테마</h3>
          <span className="text-[0.8125rem] text-tx3">
            테마를 바꾸면 즉시 재계산됩니다
          </span>
        </div>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(19rem,100%),1fr))] gap-x-6 gap-y-2 p-0">
          {pairs.map((pair) => (
            <li
              key={pair.label}
              className="flex min-w-0 items-center justify-between gap-3"
            >
              <span className="text-[0.8125rem] text-tx2">{pair.label}</span>
              <RatioChip ratio={pair.ratio} required={pair.required} />
            </li>
          ))}
        </ul>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] gap-5 overflow-y-auto">
        {SPEC_CARDS.map((card) => (
          <article key={card.n} className={cx('flex flex-col gap-3.5', CARD)}>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="font-mono text-xs font-bold text-tx3">
                {card.n}
              </span>
              <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-tx">
                {card.name}
              </h3>
              <span className="ml-auto font-mono text-[0.6875rem] text-tx3">
                {card.when}
              </span>
            </div>
            <SpecMock kind={card.mock} />
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {card.pts.map((pt) => (
                <li
                  key={pt}
                  className="flex gap-2 text-[0.8125rem] leading-[1.55] text-tx2"
                >
                  <span aria-hidden="true" className="flex-none text-tx3">
                    —
                  </span>
                  <span className="min-w-0 flex-1">{pt}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
