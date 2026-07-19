'use client';

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
} from 'react';
import { Header } from '@/components/Header';
import { KeyDialog } from '@/components/KeyDialog';
import { NotesAside } from '@/components/NotesAside';
import { StudioProvider } from '@/components/StudioContext';
import { CheckView } from '@/components/views/CheckView';
import { ExportView } from '@/components/views/ExportView';
import { PaletteView, type AiMsg } from '@/components/views/PaletteView';
import { SpecView } from '@/components/views/SpecView';
import {
  focusHeading,
  VIEW_HEADING_ID,
  VIEW_LABEL,
  type SimId,
  type ViewId,
} from '@/components/viewTypes';
import { useApiKey } from '@/hooks/useApiKey';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';
import { hueName } from '@/lib/color/hueName';
import { buildPalette } from '@/lib/color/palette';
import { tokenLabel } from '@/lib/color/tokenMeta';
import { PALETTE_KEYS, type PaletteKey } from '@/lib/color/types';
import { buildExportCode, type ExportTab } from '@/lib/export/codegen';
import { getStoredKey } from '@/lib/openai/keyStorage';
import { suggestPalette } from '@/lib/openai/suggestPalette';

const CVD_FILTERS: ReadonlyArray<readonly [string, string]> = [
  ['cvd-prot', '0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0'],
  ['cvd-deut', '0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0'],
  ['cvd-trit', '0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0'],
  ['cvd-gray', '0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0 0 0 1 0'],
];

const KBD =
  'rounded-md border border-bds bg-sf px-[0.4375rem] py-0.5 font-mono text-xs text-tx';

export const TonalStudio = (): JSX.Element => {
  const [view, setView] = useState<ViewId>('palette');
  const { dark, hc, setDark, setHc } = useTheme();
  const [hue, setHue] = useState(254);
  const [warm, setWarm] = useState(55);
  const [aaa, setAaa] = useState(true);
  const [notes, setNotes] = useState(true);
  const [announce, setAnnounce] = useState('');
  const [ckFg, setCkFg] = useState<PaletteKey>('tx2');
  const [ckBg, setCkBg] = useState<PaletteKey>('sf');
  const [sim, setSim] = useState<SimId>('none');
  const [tab, setTab] = useState<ExportTab>('css');
  const [copied, setCopied] = useState(false);
  const [keyModal, setKeyModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState<AiMsg | null>(null);
  const apiKey = useApiKey();
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const palette = useMemo(
    () => buildPalette({ dark, hc, hue, warm, aaa }),
    [dark, hc, hue, warm, aaa],
  );
  const cssVars = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const k of PALETTE_KEYS) vars[`--${k}`] = palette[k].hex;
    return vars as CSSProperties;
  }, [palette]);
  const target = hc || aaa ? 7 : 4.5;

  const goView = useCallback((next: ViewId): void => {
    setView(next);
    setAnnounce(`${VIEW_LABEL[next]} 화면`);
    focusHeading(VIEW_HEADING_ID[next]);
  }, []);
  const toggleDark = useCallback((): void => {
    setDark(!dark);
    setAnnounce(!dark ? '다크 테마 적용됨' : '라이트 테마 적용됨');
  }, [dark, setDark]);
  const toggleHc = useCallback((): void => {
    setHc(!hc);
    setAnnounce(
      !hc ? '고대비 모드 켜짐 — 모든 토큰이 AAA 기준으로 재생성됨' : '고대비 모드 꺼짐',
    );
  }, [hc, setHc]);

  useKeyboardShortcuts({
    disabled: keyModal,
    onView: goView,
    onToggleDark: toggleDark,
    onToggleHc: toggleHc,
  });

  // 토큰 테이블의 "크게 검사" — 해당 토큰을 미리 선택한 채 확대 검사기로 이동
  const inspectToken = (key: PaletteKey): void => {
    if (key === 'bg' || key === 'sf' || key === 'sf2') {
      setCkBg(key);
    } else if (key === 'ac') {
      setCkFg('oac');
      setCkBg('ac');
    } else {
      setCkFg(key);
    }
    setView('check');
    setAnnounce(`${tokenLabel(key)} 토큰 확대 검사로 이동`);
    focusHeading(VIEW_HEADING_ID.check);
  };

  const openKey = (): void => {
    setKeyModal(true);
    setAnnounce('API 키 설정 대화상자 열림');
  };
  const closeKey = (): void => {
    setKeyModal(false);
    setAnnounce('대화상자 닫힘');
  };

  const runAI = async (): Promise<void> => {
    const key = getStoredKey();
    if (!key) {
      openKey();
      return;
    }
    const mood = aiPrompt.trim();
    if (!mood) {
      setAiMsg({ kind: 'warn', text: '무드를 한 줄 입력하세요 — 예: 차분한 핀테크, 정밀함' });
      setAnnounce('무드 설명이 필요합니다');
      return;
    }
    setAiBusy(true);
    setAiMsg(null);
    setAnnounce('AI가 팔레트 설정을 제안하는 중입니다');
    const res = await suggestPalette(key, mood);
    setAiBusy(false);
    if (!res.ok) {
      if (res.error === 'auth') {
        apiKey.markAuthError();
        setAiMsg({ kind: 'err', text: '키 인증이 만료되었거나 취소되었습니다 — 키 관리에서 교체하세요' });
        setAnnounce('오류: 키 인증 실패');
      } else if (res.error === 'quota') {
        setAiMsg({ kind: 'err', text: '사용량 한도 초과 — OpenAI 결제 설정을 확인하세요' });
        setAnnounce('오류: 한도 초과');
      } else {
        setAiMsg({ kind: 'err', text: '네트워크 오류 — 연결을 확인하고 다시 시도하세요' });
        setAnnounce('오류: 네트워크 실패');
      }
      return;
    }
    const { hue: h, warm: w, reason } = res.value;
    setHue(h);
    setWarm(w);
    setAiMsg({ kind: 'ok', text: `${reason} — ${hueName(h)} ${h}°` });
    setAnnounce(`AI 제안이 적용되었습니다: ${hueName(h)} ${h}도`);
  };

  const copyCode = (): void => {
    try {
      void navigator.clipboard.writeText(buildExportCode(tab, { hue, warm, aaa }));
    } catch {
      // 클립보드 미지원 환경 — 코드 블록에서 직접 선택 복사 가능
    }
    setCopied(true);
    setAnnounce('코드가 클립보드에 복사되었습니다');
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <StudioProvider
      value={{ palette, dark, hc, aaa, target, announce: setAnnounce }}
    >
      <div
        style={cssVars}
        className="min-h-screen bg-bg font-sans text-base leading-normal tracking-[-0.011em] text-tx transition-colors"
      >
        <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
          <defs>
            {CVD_FILTERS.map(([id, values]) => (
              <filter id={id} key={id}>
                <feColorMatrix type="matrix" values={values} />
              </filter>
            ))}
          </defs>
        </svg>
        <a
          href="#main"
          className="fixed left-3 top-3 z-[99] -translate-y-[400%] rounded-lg bg-tx px-4 py-2.5 text-[0.9375rem] font-semibold text-bg no-underline transition-transform focus:translate-y-0"
        >
          본문으로 건너뛰기
        </a>
        <div role="status" className="sr-only">
          {announce}
        </div>
        <Header
          view={view}
          dark={dark}
          hc={hc}
          notes={notes}
          onView={goView}
          onDark={(d): void => {
            setDark(d);
            setAnnounce(d ? '다크 테마 적용됨' : '라이트 테마 적용됨');
          }}
          onToggleHc={toggleHc}
          onToggleNotes={(): void => {
            setNotes(!notes);
            setAnnounce(!notes ? '설계 주석 표시' : '설계 주석 숨김');
          }}
        />
        <main
          id="main"
          className="mx-auto flex max-w-[1600px] flex-wrap items-start gap-6 px-[clamp(1rem,3vw,2rem)] pb-10 pt-6"
        >
          <div className="min-w-0 flex-[1_1_640px]">
            {view === 'palette' && (
              <PaletteView
                hue={hue}
                warm={warm}
                onHue={setHue}
                onWarm={setWarm}
                onAaa={(next): void => {
                  setAaa(next);
                  setAnnounce(next ? '대비 목표 AAA 7 대 1' : '대비 목표 AA 4.5 대 1');
                }}
                keyPhase={apiKey.phase}
                keyErrKind={apiKey.errKind}
                onOpenKey={openKey}
                aiPrompt={aiPrompt}
                onAiPrompt={setAiPrompt}
                aiBusy={aiBusy}
                aiMsg={aiMsg}
                onRunAI={(): void => void runAI()}
                onInspect={inspectToken}
              />
            )}
            {view === 'check' && (
              <CheckView
                ckFg={ckFg}
                ckBg={ckBg}
                onCkFg={setCkFg}
                onCkBg={setCkBg}
                sim={sim}
                onSim={setSim}
              />
            )}
            {view === 'export' && (
              <ExportView
                tab={tab}
                onTab={setTab}
                copied={copied}
                onCopy={copyCode}
                hue={hue}
                warm={warm}
              />
            )}
            {view === 'spec' && <SpecView />}
          </div>
          {notes && <NotesAside view={view} />}
        </main>
        {keyModal && (
          <KeyDialog
            phase={apiKey.phase}
            errKind={apiKey.errKind}
            last4={apiKey.last4}
            onClose={closeKey}
            onVerify={apiKey.verify}
            onDelete={(): void => {
              apiKey.deleteKey();
              setAiMsg(null);
              setAnnounce('API 키가 이 브라우저에서 삭제되었습니다');
            }}
            onResetToIdle={apiKey.resetToIdle}
          />
        )}
        <footer className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-3 border-t border-bd px-[clamp(1rem,3vw,2rem)] pb-8 pt-4 text-[0.8125rem] text-tx2">
          <p className="m-0 flex flex-wrap items-center gap-1.5">
            <kbd className={KBD}>1</kbd>
            <kbd className={KBD}>2</kbd>
            <kbd className={KBD}>3</kbd>
            <kbd className={KBD}>4</kbd> 화면 이동
            <span aria-hidden="true" className="text-tx3">·</span>
            <kbd className={KBD}>T</kbd> 라이트/다크
            <span aria-hidden="true" className="text-tx3">·</span>
            <kbd className={KBD}>C</kbd> 고대비
          </p>
          <p className="m-0 ml-auto">
            모든 대비값은 WCAG 2.2 상대 휘도 공식으로 실시간 계산됩니다
          </p>
        </footer>
      </div>
    </StudioProvider>
  );
};
