import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tonal — WCAG 대비를 계산으로 보장하는 컬러 토큰 스튜디오',
  description:
    '목표 대비를 만족할 때까지 OKLCH 명도를 자동 보정해 토큰을 생성합니다 — 검사가 아니라 보장.',
};

const RootLayout = ({
  children,
}: Readonly<{ children: ReactNode }>): React.JSX.Element => (
  <html lang="ko">
    <head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
      />
    </head>
    {/* 브라우저 확장이 body에 주입하는 속성(cz-shortcut-listen 등)의 하이드레이션 경고 억제 */}
    <body className="antialiased" suppressHydrationWarning>
      {children}
    </body>
  </html>
);

export default RootLayout;
