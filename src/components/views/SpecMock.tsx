'use client';

import type { JSX } from 'react';
import {
  ICON_CHECK,
  ICON_EYE,
  ICON_KEY,
  ICON_LOCK,
  ICON_TRASH,
  ICON_WARN,
  ICON_X,
} from '@/components/ui/icons';
import type { SpecMockKind } from '@/components/views/specData';

const Icon = ({
  d,
  size = 12,
  strokeWidth = 1.75,
}: {
  d: string;
  size?: number;
  strokeWidth?: number;
}): JSX.Element => (
  <svg
    width={size}
    height={size}
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

const CHIP =
  'inline-flex items-center gap-1 rounded-full px-[0.5625rem] py-[0.1875rem] text-xs font-semibold';
const BTN_GHOST =
  'inline-flex min-h-10 items-center gap-[0.4375rem] rounded-lg border border-bds px-3.5 text-[0.8125rem] font-semibold text-tx';

const LockMock = (): JSX.Element => (
  <>
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.875rem] font-semibold text-tx">AI 팔레트 추천</span>
      <span className={`${CHIP} border border-bds bg-sf2 text-tx2`}>
        <Icon d={ICON_LOCK} />
        잠금 — 키 필요
      </span>
    </div>
    <span className={`${BTN_GHOST} self-start`}>
      <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden="true">
        <circle cx={5} cy={11} r={3.25} />
        <path d={ICON_KEY} />
      </svg>
      OpenAI 키 연결
    </span>
  </>
);

const InputMock = (): JSX.Element => (
  <>
    <span className="text-[0.8125rem] font-semibold text-tx">API 키</span>
    <div className="flex gap-2">
      <span className="flex min-h-10 flex-1 items-center rounded-lg border border-bds bg-sf px-3 font-mono text-[0.8125rem] tracking-[0.14em] text-tx">
        ●●●●●●●●●●●●
      </span>
      <span className="inline-flex min-h-10 w-10 items-center justify-center rounded-lg border border-bds text-tx2">
        <Icon d={ICON_EYE} size={15} strokeWidth={1.5} />
      </span>
    </div>
    <span className="text-xs text-tx3">&apos;sk-&apos;로 시작하는 키를 붙여넣으세요</span>
  </>
);

const CheckingMock = (): JSX.Element => (
  <>
    <div className="flex gap-2">
      <span className="flex min-h-10 flex-1 items-center rounded-lg border border-bd bg-sf2 px-3 font-mono text-[0.8125rem] tracking-[0.14em] text-tx3">
        ●●●●●●●●
      </span>
      <span className="inline-flex min-h-10 items-center gap-[0.4375rem] rounded-lg bg-ac px-3.5 text-[0.8125rem] font-semibold text-oac">
        <span className="inline-block h-3 w-3 animate-tonal-spin rounded-full border-2 border-current border-t-transparent" />
        확인 중…
      </span>
    </div>
    <span className="text-xs text-tx2">키를 확인하는 중 — GET /v1/models</span>
  </>
);

const ValidMock = (): JSX.Element => (
  <>
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${CHIP} bg-okS text-okF`}>
        <Icon d={ICON_CHECK} strokeWidth={2} />
        연결됨
      </span>
      <span className="font-mono text-[0.8125rem] text-tx">sk-••••A1b2</span>
      <span className="text-xs text-tx3">방금 확인됨</span>
    </div>
    <div className="flex gap-2">
      <span className="inline-flex min-h-10 items-center rounded-lg border border-bds px-3.5 text-[0.8125rem] font-semibold text-tx">
        교체
      </span>
      <span className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-bds px-3.5 text-[0.8125rem] font-semibold text-dgT">
        <Icon d={ICON_TRASH} size={13} />
        삭제
      </span>
    </div>
  </>
);

const ErrorMock = (): JSX.Element => (
  <>
    {[
      ['warn', '형식 오류', "— 'sk-' 시작 아님 · 요청 전 차단"],
      ['danger', '인증 실패', '— 401·403 · 키 취소/오타'],
      ['warn', '한도 초과', '— 429 · 결제 설정 확인'],
    ].map(([tone, title, desc]) => (
      <div key={title} className="flex items-start gap-2">
        <span
          className={`inline-flex h-[1.375rem] w-[1.375rem] flex-none items-center justify-center rounded-md ${
            tone === 'warn' ? 'bg-wnS text-wnF' : 'bg-dgS text-dgF'
          }`}
        >
          <Icon d={tone === 'warn' ? ICON_WARN : ICON_X} strokeWidth={2} />
        </span>
        <span className="text-[0.8125rem] text-tx">
          <strong className="font-bold">{title}</strong> {desc}
        </span>
      </div>
    ))}
  </>
);

const UnlockedMock = (): JSX.Element => (
  <>
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.875rem] font-semibold text-tx">AI 팔레트 추천</span>
      <span className={`${CHIP} bg-okS text-okF`}>
        <Icon d={ICON_CHECK} strokeWidth={2} />
        연결됨
      </span>
    </div>
    <span className="flex min-h-10 items-center rounded-lg border border-bds bg-sf px-3 text-[0.8125rem] text-tx">
      차분한 핀테크, 정밀하고 신뢰감 있게
    </span>
    <span className="inline-flex min-h-10 items-center self-start rounded-lg bg-ac px-3.5 text-[0.8125rem] font-semibold text-oac">
      추천 받기
    </span>
  </>
);

const MOCKS: Record<SpecMockKind, () => JSX.Element> = {
  lock: LockMock,
  input: InputMock,
  checking: CheckingMock,
  valid: ValidMock,
  error: ErrorMock,
  unlocked: UnlockedMock,
};

export const SpecMock = ({ kind }: { kind: SpecMockKind }): JSX.Element => {
  const Body = MOCKS[kind];
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-2.5 rounded-[10px] border border-bd bg-bg p-4 transition-colors"
    >
      <Body />
    </div>
  );
};
