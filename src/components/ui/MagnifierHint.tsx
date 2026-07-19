import type { JSX } from 'react';
import { ICON_NAV_CHECK } from '@/components/ui/icons';

// 색상칩 호버·포커스 시 나타나는 돋보기 — "눌러서 크게 볼 수 있다"는 어포던스.
// 어떤 스와치 색 위에서도 보이도록 흰 원 배지에 검정 아이콘을 쓴다.
// 부모 버튼에 `group relative`가 필요하다.
export const MagnifierHint = ({ size = 24 }: { size?: number }): JSX.Element => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
  >
    <span
      className="flex items-center justify-center rounded-full bg-white/90 text-black shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={ICON_NAV_CHECK} />
      </svg>
    </span>
  </span>
);
