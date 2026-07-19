'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tonal-theme';

interface ThemeState {
  dark: boolean;
  hc: boolean;
}

interface UseThemeResult extends ThemeState {
  setDark: (dark: boolean) => void;
  setHc: (hc: boolean) => void;
}

const readStored = (): ThemeState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    return { dark: Boolean(record.dark), hc: Boolean(record.hc) };
  } catch {
    return null;
  }
};

export const useTheme = (): UseThemeResult => {
  const [theme, setTheme] = useState<ThemeState>({ dark: false, hc: false });
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      // localStorage는 SSR에서 읽을 수 없어 마운트 후 1회 복원이 필요하다
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(stored);
    } else {
      // 첫 방문이면 OS 설정을 따른다
      const dark = matchMedia('(prefers-color-scheme: dark)').matches;
      const hc = matchMedia('(prefers-contrast: more)').matches;
      if (dark || hc) setTheme({ dark, hc });
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      // 저장 불가 환경에서는 세션 한정으로 동작
    }
  }, [theme, restored]);

  return {
    ...theme,
    setDark: (dark: boolean): void => setTheme((t) => ({ ...t, dark })),
    setHc: (hc: boolean): void => setTheme((t) => ({ ...t, hc })),
  };
};
