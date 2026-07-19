'use client';

import { useRef, useState } from 'react';
import { getStoredKey } from '@/lib/openai/keyStorage';
import { suggestKeywords } from '@/lib/openai/suggestKeywords';

export const SEED_KEYWORDS: string[] = [
  '따뜻한', '차분한', '신뢰감', '미니멀', '테크', '플레이풀', '자연', '럭셔리',
];

interface UseMoodKeywords {
  selected: string[];
  extra: string[];
  busy: boolean;
  toggle: (keyword: string) => void;
}

// 키워드를 고를 때마다 AI가 더 세부적인 연관 키워드를 이어서 제안하는 체인
export const useMoodKeywords = (
  enabled: boolean,
  announce: (msg: string) => void,
): UseMoodKeywords => {
  const [selected, setSelected] = useState<string[]>([]);
  const [extra, setExtra] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const reqId = useRef(0);

  const expand = async (next: string[]): Promise<void> => {
    const key = getStoredKey();
    if (!enabled || !key) return;
    const id = ++reqId.current;
    setBusy(true);
    const res = await suggestKeywords(key, next);
    // 연타로 선택이 바뀌었으면 낡은 응답은 버린다
    if (id !== reqId.current) return;
    setBusy(false);
    if (!res.ok) {
      announce('연관 키워드를 불러오지 못했습니다');
      return;
    }
    const known = new Set([...SEED_KEYWORDS, ...next]);
    const fresh = res.value.filter((k) => !known.has(k));
    setExtra(fresh);
    if (fresh.length > 0)
      announce(`연관 키워드 ${fresh.length}개 추가: ${fresh.join(', ')}`);
  };

  const toggle = (keyword: string): void => {
    const on = selected.includes(keyword);
    const next = on
      ? selected.filter((k) => k !== keyword)
      : [...selected, keyword];
    setSelected(next);
    announce(`키워드 ${keyword} ${on ? '해제됨' : '선택됨'}`);
    if (!on) void expand(next);
  };

  return { selected, extra, busy, toggle };
};
