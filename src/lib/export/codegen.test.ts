import { describe, expect, it } from 'vitest';
import { buildExportCode } from './codegen';

const INPUT = { hue: 254, warm: 55, aaa: true };

describe('buildExportCode', () => {
  it('CSS 탭은 4개 모드 블록과 22개 변수를 포함한다', () => {
    const css = buildExportCode('css', INPUT);
    expect(css).toContain(':root {');
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain('@media (prefers-contrast: more)');
    expect(css.match(/--on-danger-soft:/g)).toHaveLength(4);
    expect(css).toContain('액센트 254°');
    expect(css).toContain('AAA 7:1');
  });

  it('Tailwind 탭은 CSS 변수 참조만 사용한다', () => {
    const tw = buildExportCode('tw', INPUT);
    expect(tw).toContain("'var(--accent)'");
    expect(tw).not.toMatch(/#[0-9A-F]{6}/);
  });

  it('shadcn 탭은 라이트·다크 매핑을 포함한다', () => {
    const sh = buildExportCode('sh', INPUT);
    expect(sh).toContain(':root {');
    expect(sh).toContain('.dark {');
    expect(sh).toContain('--ring:');
    expect(sh).toContain('(AAA 검증값)');
  });
});
