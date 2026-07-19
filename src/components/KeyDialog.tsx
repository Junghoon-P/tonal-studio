'use client';

import {
  useEffect,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent,
} from 'react';
import { useStudio } from '@/components/StudioContext';
import {
  ICON_CHECK,
  ICON_EYE,
  ICON_SHIELD,
  ICON_TRASH,
  ICON_WARN,
  ICON_X,
} from '@/components/ui/icons';
import { BTN_PRIMARY, BTN_SECONDARY, cx } from '@/components/ui/styles';
import type { KeyPhase } from '@/hooks/useApiKey';
import { KEY_FORMAT, type KeyErrorKind, type KeyVerifyResult } from '@/lib/openai/verifyKey';

interface KeyDialogProps {
  phase: KeyPhase;
  errKind: KeyErrorKind | null;
  last4: string;
  onClose: () => void;
  onVerify: (draft: string) => Promise<KeyVerifyResult>;
  onDelete: () => void;
  onResetToIdle: () => void;
}

const ERROR_COPY: Record<KeyErrorKind, { t: string; m: string; d: string }> = {
  format: {
    t: '형식 오류',
    m: "OpenAI 키는 'sk-'로 시작합니다. 대시보드에서 복사한 키 전체를 붙여넣으세요.",
    d: ICON_WARN,
  },
  auth: {
    t: '인증 실패',
    m: '키가 취소되었거나 잘못 입력되었습니다. OpenAI 대시보드에서 키 상태를 확인한 뒤 교체하세요.',
    d: ICON_X,
  },
  quota: {
    t: '사용량 한도 초과',
    m: '이 키의 쿼터가 소진되었습니다. 결제 설정을 확인하거나 다른 키를 연결하세요.',
    d: ICON_WARN,
  },
  network: {
    t: '네트워크 오류',
    m: '연결에 실패했습니다. 인터넷 연결을 확인하고 다시 시도하세요.',
    d: ICON_WARN,
  },
};

const RESULT_ANNOUNCE: Record<KeyVerifyResult, string> = {
  ok: 'API 키가 확인되어 연결되었습니다',
  format: '오류: 키 형식이 올바르지 않습니다. sk-로 시작하는 키를 붙여넣으세요',
  auth: '오류: 인증에 실패했습니다. 키 상태를 확인하세요',
  quota: '오류: 사용량 한도를 초과했습니다',
  network: '오류: 네트워크 연결에 실패했습니다',
};

const focusKeyInput = (): void => {
  setTimeout(() => document.getElementById('key-in')?.focus(), 80);
};

export const KeyDialog = ({
  phase,
  errKind,
  last4,
  onClose,
  onVerify,
  onDelete,
  onResetToIdle,
}: KeyDialogProps): JSX.Element => {
  const { announce } = useStudio();
  const [draft, setDraft] = useState('');
  const [showKey, setShowKey] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const checking = phase === 'checking';
  const valid = phase === 'valid';
  const error = phase === 'error' ? ERROR_COPY[errKind ?? 'network'] : null;

  // 열릴 때 첫 입력으로 포커스, 닫힐 때 열었던 요소로 복원
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    setTimeout(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const first =
        dialog.querySelector<HTMLElement>('input:not([disabled])') ??
        dialog.querySelector<HTMLElement>('button');
      first?.focus();
    }, 90);
    return (): void => {
      if (opener?.focus) setTimeout(() => opener.focus(), 60);
    };
  }, []);

  const trapKey = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>('button,input,a[href],select,textarea'),
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const verify = async (): Promise<void> => {
    if (KEY_FORMAT.test(draft.trim())) announce('키를 확인하는 중입니다');
    const result = await onVerify(draft);
    announce(RESULT_ANNOUNCE[result]);
    if (result === 'ok') setDraft('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(16,14,12,0.48)] p-4"
    >
      <div
        ref={dialogRef}
        id="key-dlg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="key-title"
        aria-describedby="key-desc"
        onKeyDown={trapKey}
        onClick={(e): void => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-[31rem] flex-col gap-4 overflow-y-auto rounded-[14px] border border-bds bg-sf p-6 shadow-[0_24px_64px_rgba(10,8,6,0.3)]"
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 id="key-title" className="m-0 text-[1.1875rem] font-bold tracking-[-0.02em] text-tx">
              OpenAI API 키
            </h2>
            <p id="key-desc" className="mb-0 mt-1 text-[0.875rem] leading-normal text-tx2">
              AI 팔레트 추천에만 사용됩니다. 키 없이도 나머지 기능은 모두 동작합니다.
            </p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="inline-flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent text-tx2 transition-colors hover:bg-sf2 hover:text-tx"
          >
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden="true">
              <path d={ICON_X} />
            </svg>
          </button>
        </div>
        <div className="flex gap-2.5 rounded-[10px] border border-bd bg-sf2 px-4 py-3.5">
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 flex-none text-tx2">
            <path d={ICON_SHIELD} />
          </svg>
          <p className="m-0 text-[0.8125rem] leading-[1.55] text-tx2">
            <strong className="font-semibold text-tx">이 브라우저에만 저장됩니다.</strong>{' '}
            키는 localStorage에 보관되고, 요청은 브라우저에서 api.openai.com으로
            직접 전송됩니다. 그 외 서버로는 나가지 않으며, 아래 삭제 버튼으로
            언제든 제거할 수 있습니다.
          </p>
        </div>
        {!valid && (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="key-in" className="text-[0.875rem] font-semibold text-tx">
                API 키
              </label>
              <div className="flex gap-2">
                <input
                  id="key-in"
                  type={showKey ? 'text' : 'password'}
                  value={draft}
                  onChange={(e): void => {
                    setDraft(e.target.value);
                    if (phase === 'error') onResetToIdle();
                  }}
                  disabled={checking}
                  aria-describedby={error ? 'key-hint key-err' : 'key-hint'}
                  aria-invalid={phase === 'error' ? 'true' : undefined}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="sk-…"
                  className="min-h-11 min-w-0 flex-1 rounded-lg border border-bds bg-sf px-3 py-2 font-mono text-[0.9375rem] text-tx"
                />
                <button
                  type="button"
                  aria-pressed={showKey}
                  aria-label={showKey ? 'API 키 숨기기' : 'API 키 표시'}
                  onClick={(): void => {
                    setShowKey(!showKey);
                    announce(!showKey ? '키가 화면에 표시됩니다' : '키가 숨겨졌습니다');
                  }}
                  disabled={checking}
                  className="inline-flex min-h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-lg border border-bds bg-transparent text-tx2 transition-colors hover:bg-sf2 hover:text-tx"
                >
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={`${ICON_EYE}${showKey ? 'M2.5 2 13.5 14' : ''}`} />
                  </svg>
                </button>
              </div>
              <p id="key-hint" className="m-0 text-[0.8125rem] text-tx3">
                &apos;sk-&apos;로 시작하는 키를 붙여넣으세요 — platform.openai.com › API keys
              </p>
            </div>
            {error && (
              <div id="key-err" className="flex gap-2.5 rounded-[10px] border border-dgF bg-dgS px-4 py-3.5">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="var(--dgF)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 flex-none">
                  <path d={error.d} />
                </svg>
                <p className="m-0 text-[0.8125rem] leading-[1.55] text-dgF">
                  <strong className="font-bold">{error.t}.</strong> {error.m}
                </p>
              </div>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" onClick={onClose} className={BTN_SECONDARY}>
                취소
              </button>
              <button
                type="button"
                onClick={(): void => void verify()}
                disabled={checking}
                className={BTN_PRIMARY}
              >
                {checking && (
                  <span
                    className="inline-block h-3.5 w-3.5 animate-tonal-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                )}
                {checking ? '확인 중…' : '연결 확인'}
              </button>
            </div>
          </>
        )}
        {valid && (
          <>
            <div className="flex flex-wrap items-center gap-2.5 rounded-[10px] border border-okF bg-okS px-4 py-3.5">
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="var(--okF)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
                <path d={ICON_CHECK} />
              </svg>
              <p className="m-0 text-[0.875rem] text-okF">
                <strong className="font-bold">연결됨</strong> ·{' '}
                <span className="font-mono">sk-••••{last4}</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={(): void => {
                  onResetToIdle();
                  setDraft('');
                  setShowKey(false);
                  focusKeyInput();
                }}
                className={BTN_SECONDARY}
              >
                교체
              </button>
              <button
                type="button"
                onClick={onDelete}
                className={cx(BTN_SECONDARY, 'text-dgT hover:bg-dgS')}
              >
                <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={ICON_TRASH} />
                </svg>
                삭제
              </button>
              <button type="button" onClick={onClose} className={BTN_PRIMARY}>
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
