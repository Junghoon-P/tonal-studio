import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tonal — WCAG 대비를 계산으로 보장하는 컬러 토큰 스튜디오',
  description:
    '목표 대비를 만족할 때까지 OKLCH 명도를 자동 보정해 토큰을 생성합니다 — 검사가 아니라 보장.',
};

const extensionHydrationGuard = `
(() => {
  const clean = () => {
    document.getElementById('__endic_crx__')?.remove();
    document.head?.removeAttribute('data-locator-hook-status-message');
    document.head
      ?.querySelectorAll('[data-wxt-integrated]')
      .forEach((node) => {
        node.removeAttribute('data-wxt-integrated');
        if (node instanceof HTMLElement) node.hidden = true;
      });
  };

  clean();

  const observer = new MutationObserver(clean);
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  window.addEventListener('load', () => {
    window.setTimeout(() => observer.disconnect(), 1000);
  }, { once: true });
})();
`;

const RootLayout = ({
  children,
}: Readonly<{ children: ReactNode }>): React.JSX.Element => (
  <html lang="ko" suppressHydrationWarning>
    <head suppressHydrationWarning>
      {process.env.NODE_ENV === 'development' ? (
        <Script
          id="extension-hydration-guard"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: extensionHydrationGuard }}
        />
      ) : null}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
      />
    </head>
    {/* 브라우저 확장이 주입한 속성의 하이드레이션 경고를 억제한다. */}
    <body className="antialiased" suppressHydrationWarning>
      {children}
    </body>
  </html>
);

export default RootLayout;
