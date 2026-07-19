'use client';

import { createContext, useContext } from 'react';
import type { Palette } from '@/lib/color/types';

export interface StudioContextValue {
  palette: Palette;
  dark: boolean;
  hc: boolean;
  aaa: boolean;
  /** 본문 대비 목표 — 고대비·AAA면 7, 아니면 4.5 */
  target: number;
  /** aria-live 낭독 메시지 갱신 */
  announce: (message: string) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export const StudioProvider = StudioContext.Provider;

export const useStudio = (): StudioContextValue => {
  const value = useContext(StudioContext);
  if (!value) throw new Error('useStudio는 StudioProvider 안에서만 사용 가능');
  return value;
};
