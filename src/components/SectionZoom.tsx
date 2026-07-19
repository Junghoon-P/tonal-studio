'use client';

import {
  useEffect,
  useRef,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useStudio } from '@/components/StudioContext';
import { ICON_X } from '@/components/ui/icons';
import { BTN_SECONDARY } from '@/components/ui/styles';

interface SectionZoomProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const FOCUSABLE =
  'button, select, input, a[href], [tabindex]:not([tabindex="-1"])';

// 검사 영역 하나를 화면 가득 키워 저시력 사용자가 크게 검사하는 확대 모달
export const SectionZoom = ({
  title,
  onClose,
  children,
}: SectionZoomProps): JSX.Element => {
  const { announce } = useStudio();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    announce(`${title} 영역을 크게 표시합니다. 닫으려면 Escape 키를 누르세요.`);
    setTimeout(() => closeRef.current?.focus(), 60);
    return (): void => {
      if (opener?.focus) setTimeout(() => opener.focus(), 60);
    };
    // 여는 순간 1회만 낭독한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const nodes = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((node) => !node.hasAttribute('disabled'));
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,14,12,0.48)] p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} 크게 보기`}
        onKeyDown={onKeyDown}
        onClick={(e): void => e.stopPropagation()}
        className="flex max-h-[94vh] w-[min(96vw,80rem)] flex-col gap-4 rounded-[14px] border border-bds bg-sf p-5 shadow-[0_24px_64px_rgba(10,8,6,0.3)]"
      >
        <div className="flex flex-none items-center justify-between gap-3">
          <h3 className="m-0 text-[1.0625rem] font-bold tracking-[-0.01em] text-tx">
            {title} — 크게 보기
          </h3>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className={BTN_SECONDARY}
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d={ICON_X} />
            </svg>
            닫기
          </button>
        </div>
        {/* zoom으로 레이아웃째 확대 — rem 고정 크기 텍스트·칩까지 함께 커진다 */}
        <div className="min-h-0 flex-1 overflow-auto" style={{ zoom: 1.35 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
