import { afterEach, describe, expect, it, vi } from 'vitest';
import { getStoredKey, removeStoredKey, storeKey } from './keyStorage';
import { suggestPalette } from './suggestPalette';
import { KEY_FORMAT, verifyOpenAiKey } from './verifyKey';

const VALID_KEY = 'sk-abcdefghijklmnopqrstuvwxyz';

const mockFetch = (status: number, body?: unknown): void => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    }),
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('KEY_FORMAT', () => {
  it('sk- 접두사와 20자 이상 본문만 허용한다', () => {
    expect(KEY_FORMAT.test(VALID_KEY)).toBe(true);
    expect(KEY_FORMAT.test('abc-123')).toBe(false);
    expect(KEY_FORMAT.test('sk-short')).toBe(false);
  });
});

describe('verifyOpenAiKey', () => {
  it('형식 오류는 요청 전에 차단한다', async () => {
    vi.stubGlobal('fetch', vi.fn());
    expect(await verifyOpenAiKey('abc-123')).toBe('format');
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    [200, 'ok'],
    [401, 'auth'],
    [403, 'auth'],
    [429, 'quota'],
    [500, 'network'],
  ])('HTTP %i → %s', async (status, expected) => {
    mockFetch(status);
    expect(await verifyOpenAiKey(VALID_KEY)).toBe(expected);
  });

  it('네트워크 예외는 network로 분류한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await verifyOpenAiKey(VALID_KEY)).toBe('network');
  });
});

describe('suggestPalette', () => {
  it('정상 응답의 hue·warm을 범위로 클램프해 반환한다', async () => {
    mockFetch(200, {
      choices: [
        { message: { content: '{"hue":400,"warm":-5,"reason":"차분한 블루"}' } },
      ],
    });
    const res = await suggestPalette(VALID_KEY, '차분한 핀테크');
    expect(res).toEqual({
      ok: true,
      value: { hue: 359, warm: 0, reason: '차분한 블루' },
    });
  });

  it.each([
    [401, 'auth'],
    [429, 'quota'],
    [500, 'network'],
  ])('HTTP %i → 오류 %s', async (status, error) => {
    mockFetch(status);
    const res = await suggestPalette(VALID_KEY, '무드');
    expect(res).toEqual({ ok: false, error });
  });

  it('파싱 불가 응답은 network 오류로 처리한다', async () => {
    mockFetch(200, { choices: [{ message: { content: 'not-json' } }] });
    const res = await suggestPalette(VALID_KEY, '무드');
    expect(res).toEqual({ ok: false, error: 'network' });
  });
});

describe('keyStorage', () => {
  it('localStorage가 없는 환경에서도 예외 없이 동작한다', () => {
    expect(getStoredKey()).toBeNull();
    expect(() => storeKey(VALID_KEY)).not.toThrow();
    expect(() => removeStoredKey()).not.toThrow();
  });

  it('localStorage가 있으면 저장·조회·삭제가 된다', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string): string | null => store.get(k) ?? null,
      setItem: (k: string, v: string): void => void store.set(k, v),
      removeItem: (k: string): void => void store.delete(k),
    });
    storeKey(VALID_KEY);
    expect(getStoredKey()).toBe(VALID_KEY);
    removeStoredKey();
    expect(getStoredKey()).toBeNull();
  });
});
