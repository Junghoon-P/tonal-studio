'use client';

import type { JSX } from 'react';
import { ICON_EXPAND } from '@/components/ui/icons';

interface ExpandButtonProps {
  label: string;
  onClick: () => void;
}

// 카드 영역 전체를 모달로 키우는 진입 버튼 — 저시력 사용자용 확대 어포던스
export const ExpandButton = ({ label, onClick }: ExpandButtonProps): JSX.Element => (
  <button
    type="button"
    aria-label={`${label} 크게 보기`}
    title={`${label} 크게 보기`}
    onClick={onClick}
    className="inline-flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-lg border border-bds bg-transparent text-tx2 transition-colors hover:bg-sf2 hover:text-tx"
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
      <path d={ICON_EXPAND} />
    </svg>
  </button>
);
