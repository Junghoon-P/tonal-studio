'use client';

import { useEffect } from 'react';
import type { ViewId } from '@/components/viewTypes';

interface ShortcutHandlers {
  disabled: boolean;
  onView: (view: ViewId) => void;
  onToggleDark: () => void;
  onToggleHc: () => void;
}

const VIEW_BY_KEY: Record<string, ViewId> = {
  '1': 'palette',
  '2': 'check',
  '3': 'export',
  '4': 'spec',
};

// 1~4 화면 이동 · T 테마 · C 고대비 — 입력 필드와 모달에서는 무시
export const useKeyboardShortcuts = ({
  disabled,
  onView,
  onToggleDark,
  onToggleHc,
}: ShortcutHandlers): void => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      )
        return;
      if (disabled) return;
      const key = e.key.toLowerCase();
      const view = VIEW_BY_KEY[key];
      if (view) onView(view);
      else if (key === 't') onToggleDark();
      else if (key === 'c') onToggleHc();
    };
    window.addEventListener('keydown', onKeyDown);
    return (): void => window.removeEventListener('keydown', onKeyDown);
  }, [disabled, onView, onToggleDark, onToggleHc]);
};
