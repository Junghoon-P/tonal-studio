'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { Chip } from '@/components/ui/Chip';
import { MoodKeywords } from '@/components/views/MoodKeywords';
import { useMoodKeywords } from '@/hooks/useMoodKeywords';
import {
  ICON_CHECK,
  ICON_KEY,
  ICON_LOCK,
  ICON_WARN,
  ICON_X,
} from '@/components/ui/icons';
import { BTN_PRIMARY, BTN_SECONDARY, cx, INPUT_BASE } from '@/components/ui/styles';
import type { KeyPhase } from '@/hooks/useApiKey';
import type { KeyErrorKind } from '@/lib/openai/verifyKey';
import type { AiMsg } from '@/components/views/PaletteView';

interface AiSuggestProps {
  keyPhase: KeyPhase;
  keyErrKind: KeyErrorKind | null;
  onOpenKey: () => void;
  aiPrompt: string;
  onAiPrompt: (value: string) => void;
  aiBusy: boolean;
  aiMsg: AiMsg | null;
  onRunAI: (mood: string) => void;
}

const KeyIcon = ({ d }: { d: string }): JSX.Element => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx={5} cy={11} r={3.25} />
    <path d={d} />
  </svg>
);

const Spinner = (): JSX.Element => (
  <span
    className="inline-block h-3.5 w-3.5 animate-tonal-spin rounded-full border-2 border-current border-t-transparent"
    aria-hidden="true"
  />
);

const MSG_COLOR: Record<AiMsg['kind'], string> = {
  ok: 'text-okT',
  warn: 'text-wnT',
  err: 'text-dgT',
};

const MSG_ICON: Record<AiMsg['kind'], string> = {
  ok: ICON_CHECK,
  warn: ICON_WARN,
  err: ICON_X,
};

// BYOK 진입점 — 키가 없어도 "고장"이 아니라 "잠금 해제 대기"로 보여준다
export const AiSuggest = ({
  keyPhase,
  keyErrKind,
  onOpenKey,
  aiPrompt,
  onAiPrompt,
  aiBusy,
  aiMsg,
  onRunAI,
}: AiSuggestProps): JSX.Element => {
  const { announce } = useStudio();
  const valid = keyPhase === 'valid';
  const keywords = useMoodKeywords(valid, announce);
  // 최종 무드 = 선택 키워드들 + 자유 입력 텍스트
  const mood = [...keywords.selected, aiPrompt.trim()]
    .filter(Boolean)
    .join(', ');
  const badge = valid ? (
    <Chip tone="ok" text="연결됨" iconD={ICON_CHECK} size="md" />
  ) : keyPhase === 'error' && keyErrKind === 'auth' ? (
    <Chip tone="warn" text="재확인 필요" size="md" strokeWidth={1.75} />
  ) : (
    <span className="inline-flex items-center gap-[0.3125rem] whitespace-nowrap rounded-full border border-bds bg-sf2 px-2.5 py-1 text-[0.8125rem] font-semibold text-tx2">
      <svg
        width={13}
        height={13}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={ICON_LOCK} />
      </svg>
      잠금 — 키 필요
    </span>
  );
  return (
    <div className="flex flex-col gap-2.5 border-t border-bd pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-[0.9375rem] font-semibold text-tx">AI 팔레트 추천</p>
        {badge}
      </div>
      {!valid && (
        <>
          <p className="m-0 text-[0.8125rem] leading-[1.55] text-tx2">
            무드를 설명하면 색상·온도를 제안합니다. OpenAI 키를 연결하면 열립니다
            — 키는 이 브라우저에만 저장됩니다.
          </p>
          <button
            type="button"
            onClick={onOpenKey}
            className={cx(BTN_SECONDARY, 'self-start px-4 text-[0.875rem]')}
          >
            <KeyIcon d={ICON_KEY} />
            OpenAI 키 연결
          </button>
        </>
      )}
      {valid && (
        <>
          <label htmlFor="ai-mood" className="text-[0.8125rem] font-semibold text-tx">
            브랜드 무드
          </label>
          <MoodKeywords
            selected={keywords.selected}
            extra={keywords.extra}
            busy={keywords.busy}
            disabled={aiBusy}
            onToggle={keywords.toggle}
          />
          <p className="m-0 text-xs leading-[1.55] text-tx3">
            키워드를 고르면 AI가 더 세부적인 연관 키워드를 이어서 제안합니다.
            직접 입력과 함께 조합됩니다.
          </p>
          <input
            id="ai-mood"
            type="text"
            value={aiPrompt}
            onChange={(e): void => onAiPrompt(e.target.value)}
            disabled={aiBusy}
            placeholder="예: 차분한 핀테크, 정밀하고 신뢰감 있게"
            className={cx(INPUT_BASE, 'w-full')}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(): void => onRunAI(mood)}
              disabled={aiBusy}
              className={cx(BTN_PRIMARY, 'px-4 text-[0.875rem]')}
            >
              {aiBusy && <Spinner />}
              {aiBusy ? '생성 중…' : '추천 받기'}
            </button>
            <button
              type="button"
              onClick={onOpenKey}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-transparent bg-transparent px-3.5 text-[0.875rem] font-semibold text-tx2 transition-colors hover:bg-sf2 hover:text-tx"
            >
              키 관리
            </button>
          </div>
          {aiMsg && (
            <p
              className={cx(
                'm-0 flex items-start gap-1.5 text-[0.8125rem] font-semibold leading-normal',
                MSG_COLOR[aiMsg.kind],
              )}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 flex-none"
              >
                <path d={MSG_ICON[aiMsg.kind]} />
              </svg>
              {aiMsg.text}
            </p>
          )}
        </>
      )}
    </div>
  );
};
