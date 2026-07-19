'use client';

import { useEffect, useState } from 'react';
import {
  getStoredKey,
  removeStoredKey,
  storeKey,
} from '@/lib/openai/keyStorage';
import {
  verifyOpenAiKey,
  type KeyErrorKind,
  type KeyVerifyResult,
} from '@/lib/openai/verifyKey';

export type KeyPhase = 'idle' | 'checking' | 'valid' | 'error';

export interface ApiKeyState {
  phase: KeyPhase;
  errKind: KeyErrorKind | null;
  last4: string;
}

interface UseApiKeyResult extends ApiKeyState {
  verify: (draft: string) => Promise<KeyVerifyResult>;
  deleteKey: () => void;
  resetToIdle: () => void;
  markAuthError: () => void;
}

export const useApiKey = (): UseApiKeyResult => {
  const [state, setState] = useState<ApiKeyState>({
    phase: 'idle',
    errKind: null,
    last4: '',
  });

  useEffect(() => {
    const stored = getStoredKey();
    if (stored)
      // localStorage는 SSR에서 읽을 수 없어 마운트 후 1회 복원이 필요하다
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ phase: 'valid', errKind: null, last4: stored.slice(-4) });
  }, []);

  const verify = async (draft: string): Promise<KeyVerifyResult> => {
    const key = draft.trim();
    setState((s) => ({ ...s, phase: 'checking', errKind: null }));
    const result = await verifyOpenAiKey(key);
    if (result === 'ok') {
      storeKey(key);
      setState({ phase: 'valid', errKind: null, last4: key.slice(-4) });
    } else {
      setState((s) => ({ ...s, phase: 'error', errKind: result }));
    }
    return result;
  };

  return {
    ...state,
    verify,
    deleteKey: (): void => {
      removeStoredKey();
      setState({ phase: 'idle', errKind: null, last4: '' });
    },
    resetToIdle: (): void =>
      setState((s) => ({ ...s, phase: 'idle', errKind: null })),
    // 사용 중 401을 만나면 배지를 "재확인 필요"로 강등
    markAuthError: (): void =>
      setState((s) => ({ ...s, phase: 'error', errKind: 'auth' })),
  };
};
