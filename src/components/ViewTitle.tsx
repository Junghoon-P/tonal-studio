'use client';

import type { JSX } from 'react';
import { VIEW_HEADING_ID, type ViewId } from '@/components/viewTypes';

const TITLES: Record<ViewId, { title: string; desc: string }> = {
  palette: {
    title: '팔레트 생성',
    desc: '목표 대비를 만족할 때까지 OKLCH 명도를 자동 보정해 토큰을 생성합니다 — 검사가 아니라 보장.',
  },
  check: {
    title: '검사',
    desc: '대비는 WCAG 상대 휘도 공식으로 실시간 계산 — 추정값이 아닙니다.',
  },
  export: {
    title: '내보내기',
    desc: '검증 리포트와 함께, 다크·고대비가 토큰 스왑 하나로 해결되는 코드로 출고합니다.',
  },
  spec: {
    title: 'BYOK — API 키 연결 스펙',
    desc: '키 없이도 툴 전체가 동작합니다. AI만 "잠금 해제 대기" — 아래 6개 상태가 전체 여정입니다.',
  },
};

// 타이틀 로우는 항상 전체 폭 — 설계 주석은 이 아래 카드 행에서 시작한다
export const ViewTitle = ({ view }: { view: ViewId }): JSX.Element => (
  <div className="mb-5 mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-2">
    <h2
      id={VIEW_HEADING_ID[view]}
      className="m-0 text-[1.375rem] font-bold tracking-[-0.02em] text-tx"
    >
      {TITLES[view].title}
    </h2>
    <p className="m-0 text-[0.9375rem] text-tx2">{TITLES[view].desc}</p>
  </div>
);
