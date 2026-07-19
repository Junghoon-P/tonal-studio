'use client';

import type { JSX } from 'react';
import { useStudio } from '@/components/StudioContext';
import { Chip, RatioChip } from '@/components/ui/Chip';
import { CARD, CARD_TITLE, cx, TH_COL } from '@/components/ui/styles';
import { contrastRatio } from '@/lib/color/contrast';
import { tokenLabel } from '@/lib/color/tokenMeta';
import type { Palette, PaletteKey } from '@/lib/color/types';

interface GroupRow {
  kind: 'group';
  label: string;
}

interface TokenRow {
  kind: 'token';
  key: PaletteKey;
  role: string;
  ratio: number | null;
  required: number;
  reqLabel: string;
}

type Row = GroupRow | TokenRow;

const buildRows = (p: Palette, hc: boolean, T: number): Row[] => {
  const r = (a: PaletteKey, b: PaletteKey): number =>
    contrastRatio(p[a].hex, p[b].hex);
  const t3 = hc ? 4.5 : 3;
  const tBtn = hc ? 7 : 4.5;
  return [
    { kind: 'group', label: '배경 · 표면' },
    { kind: 'token', key: 'bg', role: '페이지 캔버스', ratio: r('tx', 'bg'), required: 7, reqLabel: 'vs --text · 기준 7:1' },
    { kind: 'token', key: 'sf', role: '카드 · 패널', ratio: r('tx', 'sf'), required: 7, reqLabel: 'vs --text · 기준 7:1' },
    { kind: 'token', key: 'sf2', role: '삽입 영역 · 코드 블록', ratio: r('tx', 'sf2'), required: 7, reqLabel: 'vs --text · 기준 7:1' },
    { kind: 'group', label: '경계' },
    { kind: 'token', key: 'bd', role: '장식 헤어라인 — 정보 전달 없음', ratio: null, required: 0, reqLabel: 'WCAG 1.4.11 비대상' },
    { kind: 'token', key: 'bds', role: '입력 필드 · 구분 필수 경계', ratio: r('bds', 'sf'), required: t3, reqLabel: `vs --surface · 기준 ${t3}:1` },
    { kind: 'group', label: '텍스트' },
    { kind: 'token', key: 'tx', role: '본문 · 제목', ratio: r('tx', 'bg'), required: 7, reqLabel: 'vs --bg · 기준 7:1' },
    { kind: 'token', key: 'tx2', role: '보조 설명', ratio: r('tx2', 'sf2'), required: T, reqLabel: `최저 표면 기준 ${T}:1` },
    { kind: 'token', key: 'tx3', role: '캡션 · 자리표시자', ratio: r('tx3', 'sf2'), required: tBtn, reqLabel: `최저 표면 기준 ${tBtn}:1` },
    { kind: 'group', label: '액센트 · 포커스' },
    { kind: 'token', key: 'ac', role: '주요 버튼 채움', ratio: r('oac', 'ac'), required: tBtn, reqLabel: `vs --on-accent · 기준 ${tBtn}:1` },
    { kind: 'token', key: 'acT', role: '링크 · 강조 텍스트', ratio: r('acT', 'sf2'), required: T, reqLabel: `최저 표면 기준 ${T}:1` },
    { kind: 'token', key: 'fc', role: '포커스 링 (2px + 오프셋)', ratio: r('fc', 'bg'), required: t3, reqLabel: `vs --bg · 기준 ${t3}:1` },
    { kind: 'group', label: '상태 — 아이콘·라벨 병행 필수' },
    { kind: 'token', key: 'okT', role: `성공 · 명도 L${Math.round(p.okT.L * 100)}`, ratio: r('okT', 'sf2'), required: T, reqLabel: `최저 표면 기준 ${T}:1` },
    { kind: 'token', key: 'wnT', role: `경고 · 명도 L${Math.round(p.wnT.L * 100)}`, ratio: r('wnT', 'sf2'), required: T, reqLabel: `최저 표면 기준 ${T}:1` },
    { kind: 'token', key: 'dgT', role: `오류 · 명도 L${Math.round(p.dgT.L * 100)}`, ratio: r('dgT', 'sf2'), required: T, reqLabel: `최저 표면 기준 ${T}:1` },
  ];
};

export const TokenTable = (): JSX.Element => {
  const { palette, dark, hc, aaa, target } = useStudio();
  const themeName = `${dark ? '다크' : '라이트'}${hc ? ' · 고대비' : ''}`;
  const targetLabel = `${target}:1${aaa || hc ? ' (AAA)' : ' (AA)'}`;
  return (
    <div className={cx('min-w-0 flex-[2.2_1_420px]', CARD)}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className={CARD_TITLE}>시맨틱 토큰</h3>
        <span className="font-mono text-[0.8125rem] text-tx2">
          {themeName} · 목표 {targetLabel}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse">
          <caption className="sr-only">
            생성된 시맨틱 컬러 토큰과 각 토큰의 대비 검증 결과
          </caption>
          <thead>
            <tr>
              <th scope="col" className={cx(TH_COL, 'pr-3')}>토큰</th>
              <th scope="col" className={cx(TH_COL, 'px-3')}>값</th>
              <th scope="col" className={TH_COL}>대비 검증</th>
            </tr>
          </thead>
          <tbody>
            {buildRows(palette, hc, target).map((row) =>
              row.kind === 'group' ? (
                <tr key={`g-${row.label}`}>
                  <th
                    colSpan={3}
                    scope="colgroup"
                    className="pb-1.5 pt-[1.125rem] text-left text-xs font-bold uppercase tracking-[0.08em] text-tx3"
                  >
                    {row.label}
                  </th>
                </tr>
              ) : (
                <tr key={row.key}>
                  <th
                    scope="row"
                    className="border-b border-bd py-2 pr-3 text-left align-top font-normal"
                  >
                    <span className="block font-mono text-[0.8125rem] font-semibold text-tx">
                      {tokenLabel(row.key)}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-tx2">
                      {row.role}
                    </span>
                  </th>
                  <td className="border-b border-bd px-3 py-2 align-top">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-7 w-7 flex-none rounded-md border border-bd"
                        style={{ background: palette[row.key].hex }}
                      />
                      <span className="font-mono text-[0.8125rem] text-tx">
                        {palette[row.key].hex}
                      </span>
                    </span>
                  </td>
                  <td className="border-b border-bd py-2 align-top">
                    {row.ratio === null ? (
                      <Chip tone="neutral" text="장식용 · 기준 없음" />
                    ) : (
                      <RatioChip ratio={row.ratio} required={row.required} />
                    )}
                    <span className="mt-1 block text-xs text-tx3">
                      {row.reqLabel}
                    </span>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
