'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import type { ViewId } from '@/components/viewTypes';
import { CARD_TITLE } from '@/components/ui/styles';
import { statusLightnessGap } from '@/lib/color/statusGap';

interface Note {
  n: number;
  t: string;
  b: string;
}

const notesFor = (view: ViewId, target: number, lGapText: string): Note[] => {
  const map: Record<ViewId, Note[]> = {
    palette: [
      {
        n: 1,
        t: '계산으로 보장되는 대비',
        b: `텍스트 토큰은 목표(${target}:1)를 만족할 때까지 OKLCH 명도를 자동 보정해 생성합니다. 대비값은 추정이 아니라 WCAG 상대 휘도 공식의 계산 결과입니다.`,
      },
      {
        n: 2,
        t: '차갑지 않은 미니멀',
        b: '중성색에 1% 미만의 색조만 허용해 온도를 조절합니다. 위계는 크기가 아니라 weight와 명도 차이로 만들어 200% 확대에도 유지됩니다.',
      },
      {
        n: 3,
        t: '고대비 = 토큰 스왑',
        b: '고대비는 별도 테마가 아니라 같은 시맨틱 토큰의 값 교체입니다. 구조가 같으니 컴포넌트 코드는 한 벌이면 됩니다.',
      },
    ],
    check: [
      {
        n: 1,
        t: '적록에 기대지 않기',
        b: `상태 축은 청록·호박·주홍(Okabe-Ito 계열)이고, 명도 간격(${lGapText})을 강제해 흑백 변환에도 구분됩니다.`,
      },
      {
        n: 2,
        t: '시뮬레이션은 근사치',
        b: '색각 행렬은 검증 보조 도구입니다. 진짜 안전장치는 색에 의존하지 않는 아이콘·라벨·명도 구조입니다.',
      },
      {
        n: 3,
        t: '보정은 명도만',
        b: '대비 미달 시 색상(H)·채도(C)는 유지하고 명도(L)만 조정합니다. 접근성과 브랜드 정체성은 상충하지 않습니다.',
      },
    ],
    export: [
      {
        n: 1,
        t: '레벨별 체크리스트',
        b: 'WCAG 2.2 성공 기준을 A/AA/AAA로 구분해 검증하고, 통과 여부를 색이 아니라 아이콘+라벨로 표기합니다.',
      },
      {
        n: 2,
        t: '시맨틱 토큰으로 출고',
        b: 'shadcn/Tailwind가 그대로 소비하는 CSS 변수 — 다크·고대비가 셀렉터 스왑 하나로 해결됩니다.',
      },
    ],
    spec: [
      {
        n: 1,
        t: '발견형 온보딩',
        b: '첫 진입을 키 입력 모달로 막지 않습니다. AI 기능을 처음 만나는 지점의 잠금 배지가 자연스럽게 입력을 유도합니다.',
      },
      {
        n: 2,
        t: '신뢰는 위치와 함께',
        b: '저장 위치(localStorage)·전송 범위(브라우저→OpenAI 직송)·삭제 방법을 입력 지점 바로 옆에 명시합니다.',
      },
      {
        n: 3,
        t: '오류는 원인별로',
        b: '형식/인증/쿼터/네트워크를 구분해 각각 해결 힌트를 제공합니다. 아이콘+텍스트 병행, 색 단독 금지.',
      },
    ],
  };
  return map[view];
};

export const NotesAside = ({ view }: { view: ViewId }): JSX.Element => {
  const { palette, target } = useStudio();
  const lGapText = `ΔL ≥ ${statusLightnessGap(palette)}`;
  return (
    <aside
      aria-label="설계 주석"
      className="sticky top-20 flex max-w-[340px] flex-[1_1_260px] flex-col gap-4 rounded-xl border border-dashed border-bds p-5"
    >
      <h2 className={CARD_TITLE}>설계 주석 — 왜 이렇게 했나</h2>
      {notesFor(view, target, lGapText).map((note) => (
        <div key={note.n} className="flex items-start gap-2.5">
          <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-md border border-bds font-mono text-xs font-bold text-tx">
            {note.n}
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-[0.875rem] font-semibold text-tx">
              {note.t}
            </strong>
            <span className="mt-0.5 block text-[0.8125rem] leading-[1.55] text-tx2">
              {note.b}
            </span>
          </span>
        </div>
      ))}
    </aside>
  );
};
