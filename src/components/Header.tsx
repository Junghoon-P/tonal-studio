'use client';

import type { JSX } from 'react';
import {
  ICON_MOON,
  ICON_NAV_CHECK,
  ICON_NAV_EXPORT,
  ICON_NAV_PALETTE,
  ICON_NAV_SPEC,
  ICON_NOTES,
  ICON_SUN,
} from '@/components/ui/icons';
import { cx, SEG_BASE, SEG_GROUP, SEG_ON } from '@/components/ui/styles';
import { VIEW_LABEL, type ViewId } from '@/components/viewTypes';

interface HeaderProps {
  view: ViewId;
  dark: boolean;
  hc: boolean;
  notes: boolean;
  onView: (view: ViewId) => void;
  onDark: (dark: boolean) => void;
  onToggleHc: () => void;
  onToggleNotes: () => void;
}

const NAV_ICON: Record<ViewId, string> = {
  palette: ICON_NAV_PALETTE,
  check: ICON_NAV_CHECK,
  export: ICON_NAV_EXPORT,
  spec: ICON_NAV_SPEC,
};

const NAV_BASE =
  'inline-flex items-center gap-2 min-h-11 px-4 rounded-lg border border-transparent bg-transparent text-tx2 text-[0.9375rem] font-semibold cursor-pointer transition-colors hover:text-tx active:scale-[0.985]';
const NAV_ON = 'bg-sf border-bds text-tx';

const TGL_BASE =
  'inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-lg border border-bds bg-transparent text-tx2 text-[0.875rem] font-semibold cursor-pointer transition-colors active:scale-[0.985]';
const TGL_ON = 'bg-tx text-bg border-tx';

const SmallIcon = ({
  d,
  strokeWidth = 1.75,
}: {
  d: string;
  strokeWidth?: number;
}): JSX.Element => (
  <svg
    width={15}
    height={15}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const Header = ({
  view,
  dark,
  hc,
  notes,
  onView,
  onDark,
  onToggleHc,
  onToggleNotes,
}: HeaderProps): JSX.Element => (
  <header className="sticky top-0 z-20 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-cbd bg-bg px-[clamp(1rem,3vw,2rem)] py-3 transition-colors">
    <div className="mr-2 flex items-center gap-2.5">
      <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden="true">
        <rect width={24} height={24} rx={7} fill="var(--ac)" />
        <path d="M12 5.5a6.5 6.5 0 0 1 0 13z" fill="var(--oac)" />
      </svg>
      <h1 className="m-0 text-[1.1875rem] font-extrabold tracking-[-0.03em] text-tx">
        Tonal
        <span className="sr-only">
          {' '}
          — WCAG 대비를 계산으로 보장하는 컬러 토큰 스튜디오
        </span>
      </h1>
      <span className="border-l border-cbd pl-2.5 text-[0.8125rem] font-medium text-tx3">
        WCAG 대비를 보장하는 컬러 토큰
      </span>
    </div>
    <nav aria-label="주 화면" className="flex gap-1">
      {(Object.keys(VIEW_LABEL) as ViewId[]).map((id) => (
        <button
          key={id}
          type="button"
          aria-current={view === id ? 'page' : undefined}
          onClick={(): void => onView(id)}
          className={cx(NAV_BASE, view === id && NAV_ON)}
        >
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
            <path d={NAV_ICON[id]} />
          </svg>
          {VIEW_LABEL[id]}
        </button>
      ))}
    </nav>
    <div className="ml-auto flex flex-wrap items-center gap-2">
      <div role="group" aria-label="밝기 테마" className={SEG_GROUP}>
        <button
          type="button"
          aria-pressed={!dark}
          onClick={(): void => onDark(false)}
          className={cx(SEG_BASE, !dark && SEG_ON)}
        >
          <SmallIcon d={`M8 4.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5z${ICON_SUN}`} />
          라이트
        </button>
        <button
          type="button"
          aria-pressed={dark}
          onClick={(): void => onDark(true)}
          className={cx(SEG_BASE, dark && SEG_ON)}
        >
          <SmallIcon d={ICON_MOON} />
          다크
        </button>
      </div>
      <button
        type="button"
        aria-pressed={hc}
        onClick={onToggleHc}
        className={cx(TGL_BASE, hc && TGL_ON)}
      >
        <svg width={15} height={15} viewBox="0 0 16 16" aria-hidden="true">
          <circle
            cx={8}
            cy={8}
            r={6.25}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
          />
          <path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" />
        </svg>
        고대비
      </button>
      <button
        type="button"
        aria-pressed={notes}
        onClick={onToggleNotes}
        className={cx(TGL_BASE, notes && TGL_ON)}
      >
        <SmallIcon d={ICON_NOTES} />
        설계 주석
      </button>
    </div>
  </header>
);
