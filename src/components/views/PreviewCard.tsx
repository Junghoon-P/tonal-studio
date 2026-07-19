'use client';

import type { JSX } from 'react';
import { Chip } from '@/components/ui/Chip';
import { ICON_CHECK, ICON_WARN, ICON_X } from '@/components/ui/icons';
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD,
  CARD_TITLE,
  cx,
  INPUT_BASE,
} from '@/components/ui/styles';

// 생성된 토큰만으로 그린 샘플 UI — 상태는 색이 아니라 아이콘·라벨·명도로 구분
export const PreviewCard = (): JSX.Element => (
  <div
    className={cx(
      'flex min-h-0 max-w-[420px] flex-[1.2_1_300px] flex-col overflow-y-auto',
      CARD,
    )}
  >
    <h3 className={cx(CARD_TITLE, 'mb-4')}>라이브 미리보기</h3>
    <div className="rounded-[10px] border border-bd bg-bg p-5 transition-colors">
      <h4 className="m-0 text-[1.0625rem] font-bold tracking-[-0.01em] text-tx">
        프로젝트 설정
      </h4>
      <p className="mb-4 mt-1 text-[0.875rem] leading-normal text-tx2">
        변경 사항은 팀 전체에 즉시 적용됩니다.{' '}
        <a
          href="#main"
          className="font-semibold text-acT underline-offset-[0.1875rem]"
        >
          권한 안내
        </a>
      </p>
      <label
        htmlFor="pv-name"
        className="mb-1 block text-[0.8125rem] font-semibold text-tx"
      >
        프로젝트 이름
      </label>
      <input
        id="pv-name"
        type="text"
        defaultValue="브랜드 리뉴얼 2026"
        className={cx(INPUT_BASE, 'w-full text-[0.9375rem]')}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRIMARY}>
          저장
        </button>
        <button type="button" className={BTN_SECONDARY}>
          취소
        </button>
        <button
          type="button"
          disabled
          className="min-h-11 cursor-not-allowed rounded-lg border border-dashed border-bds bg-transparent px-[1.125rem] text-[0.9375rem] font-semibold text-tx3"
        >
          비활성
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Chip tone="ok" text="동기화됨" iconD={ICON_CHECK} size="md" />
        <Chip
          tone="warn"
          text="2건 확인 필요"
          iconD={ICON_WARN}
          size="md"
          strokeWidth={1.75}
        />
        <Chip tone="danger" text="연결 실패" iconD={ICON_X} size="md" />
      </div>
    </div>
    <p className="mb-0 mt-auto pt-3.5 text-[0.8125rem] leading-[1.55] text-tx2">
      이 미리보기는 생성된 토큰만 사용합니다. 상태는 색이 아니라
      아이콘·라벨·명도로 구분됩니다.
    </p>
  </div>
);
