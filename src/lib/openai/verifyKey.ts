export type KeyErrorKind = 'format' | 'auth' | 'quota' | 'network';
export type KeyVerifyResult = 'ok' | KeyErrorKind;

export const KEY_FORMAT = /^sk-[A-Za-z0-9_-]{20,}$/;

const TIMEOUT_MS = 8000;

// 실제 핑(GET /v1/models)으로 키 유효성을 확인한다 — 브라우저 → OpenAI 직송
export const verifyOpenAiKey = async (key: string): Promise<KeyVerifyResult> => {
  if (!KEY_FORMAT.test(key)) return 'format';
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) return 'ok';
    if (res.status === 401 || res.status === 403) return 'auth';
    if (res.status === 429) return 'quota';
    return 'network';
  } catch {
    return 'network';
  }
};
