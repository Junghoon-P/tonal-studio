'use client';

import {
  useEffect,
  useRef,
  type CSSProperties,
  type JSX,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useStudio } from '@/components/StudioContext';
import { ICON_X } from '@/components/ui/icons';
import { BTN_SECONDARY } from '@/components/ui/styles';
import { describeColor } from '@/lib/color/describe';
import type { ColorToken } from '@/lib/color/types';

interface SwatchZoomProps {
  token: ColorToken;
  label: string;
  /** 색각 시뮬레이션에서 열었을 때 같은 필터를 유지 */
  filter?: CSSProperties;
  onClose: () => void;
}

// 저시력 사용자가 색 하나를 화면 가득 키워 직접 확인하는 확대 모달
export const SwatchZoom = ({
  token,
  label,
  filter,
  onClose,
}: SwatchZoomProps): JSX.Element => {
  const { announce } = useStudio();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    announce(`${label} 색상을 크게 표시합니다. ${describeColor(token)}`);
    setTimeout(() => closeRef.current?.focus(), 60);
    return (): void => {
      if (opener?.focus) setTimeout(() => opener.focus(), 60);
    };
    // 열리는 순간의 토큰 기준으로 1회만 낭독한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    // 포커스 가능한 요소가 닫기 버튼뿐이라 Tab을 가둔다
    if (e.key === 'Tab') {
      e.preventDefault();
      closeRef.current?.focus();
    }
  };

  // 영역 확대 모달(zoom 적용) 안에서 열려도 화면 기준으로 뜨도록 포털.
  // 색상 토큰 CSS 변수는 앱 루트에 주입되므로 body가 아닌 루트 안으로 옮긴다.
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(16,14,12,0.48)] p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${label} 색상 크게 보기`}
        onKeyDown={onKeyDown}
        onClick={(e): void => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-[44rem] flex-col gap-4 overflow-y-auto rounded-[14px] border border-bds bg-sf p-6 shadow-[0_24px_64px_rgba(10,8,6,0.3)]"
      >
        <div
          aria-hidden="true"
          className="h-[46vh] min-h-[14rem] w-full rounded-xl border border-bd"
          style={{ background: token.hex, ...filter }}
        />
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono text-[1.375rem] font-bold text-tx">
            {label}
          </span>
          <span className="font-mono text-[1.375rem] text-tx">{token.hex}</span>
          <span className="font-mono text-[0.9375rem] text-tx3">
            OKLCH L {token.L.toFixed(3)} · C {token.C.toFixed(3)} · H{' '}
            {Math.round(token.H)}°
          </span>
        </div>
        <p className="m-0 text-[1.0625rem] text-tx2">{describeColor(token)}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={`${BTN_SECONDARY} self-end`}
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
    </div>,
    document.getElementById('tonal-root') ?? document.body,
  );
};
