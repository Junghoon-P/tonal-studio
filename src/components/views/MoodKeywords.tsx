'use client';

import type { JSX } from 'react';
import { SEED_KEYWORDS } from '@/hooks/useMoodKeywords';
import { cx } from '@/components/ui/styles';

interface MoodKeywordsProps {
  selected: string[];
  extra: string[];
  busy: boolean;
  disabled: boolean;
  onToggle: (keyword: string) => void;
}

// AI 제안 칩은 점선 보더 — 설계 주석과 같은 "제안" 시각 언어
const chipClass = (on: boolean, ai: boolean): string =>
  cx(
    'inline-flex min-h-11 cursor-pointer items-center rounded-full border px-3.5 text-[0.8125rem] font-semibold transition-colors active:scale-[0.985] disabled:cursor-default disabled:opacity-60',
    ai && !on && 'border-dashed',
    on ? 'border-tx bg-tx text-bg' : 'border-bds bg-transparent text-tx2 hover:bg-sf2 hover:text-tx',
  );

export const MoodKeywords = ({
  selected,
  extra,
  busy,
  disabled,
  onToggle,
}: MoodKeywordsProps): JSX.Element => {
  // 방금 선택한 연관 키워드는 새 확장 응답이 오기 전까지 extra에도 남아 있다
  const chained = [
    ...selected.filter((k) => !SEED_KEYWORDS.includes(k)),
    ...extra.filter((k) => !selected.includes(k)),
  ];
  return (
    <div className="flex flex-col gap-2">
      <div role="group" aria-label="무드 키워드" className="flex flex-wrap gap-1.5">
        {SEED_KEYWORDS.map((keyword) => (
          <button
            key={keyword}
            type="button"
            aria-pressed={selected.includes(keyword)}
            disabled={disabled}
            onClick={(): void => onToggle(keyword)}
            className={chipClass(selected.includes(keyword), false)}
          >
            {keyword}
          </button>
        ))}
      </div>
      {(busy || chained.length > 0) && (
        <div
          role="group"
          aria-label="AI 연관 키워드"
          className="flex flex-wrap items-center gap-1.5"
        >
          {chained.map((keyword) => (
            <button
              key={keyword}
              type="button"
              aria-pressed={selected.includes(keyword)}
              disabled={disabled}
              onClick={(): void => onToggle(keyword)}
              className={chipClass(selected.includes(keyword), true)}
            >
              {keyword}
            </button>
          ))}
          {busy && (
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-tx3">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 animate-tonal-spin rounded-full border-2 border-current border-t-transparent"
              />
              연관 키워드 찾는 중…
            </span>
          )}
        </div>
      )}
    </div>
  );
};
