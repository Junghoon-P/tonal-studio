import { z } from 'zod';

export interface PaletteSuggestion {
  hue: number;
  warm: number;
  reason: string;
}

export type SuggestError = 'auth' | 'quota' | 'network';

export type SuggestResult =
  | { ok: true; value: PaletteSuggestion }
  | { ok: false; error: SuggestError };

const responseSchema = z.object({
  choices: z
    .array(z.object({ message: z.object({ content: z.string() }) }))
    .min(1),
});

const suggestionSchema = z.object({
  hue: z.coerce.number(),
  warm: z.coerce.number(),
  reason: z.string().optional(),
});

const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, Math.round(v)));

const SYSTEM_PROMPT =
  'You pick accessible palette settings for a design tool. Reply JSON {"hue":0-359,"warm":0-100,"reason":"Korean, max 40 chars"}. hue = OKLCH accent hue. warm = neutral temperature (0 cool, 100 warm).';

// AI는 hue·warm을 "제안"만 한다 — 대비 보장은 여전히 결정론적 생성기의 몫
export const suggestPalette = async (
  key: string,
  mood: string,
): Promise<SuggestResult> => {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: mood },
        ],
      }),
    });
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: 'auth' };
    if (res.status === 429) return { ok: false, error: 'quota' };
    if (!res.ok) return { ok: false, error: 'network' };
    const body = responseSchema.parse(await res.json());
    const raw: unknown = JSON.parse(body.choices[0].message.content);
    const parsed = suggestionSchema.parse(raw);
    return {
      ok: true,
      value: {
        hue: clamp(parsed.hue, 0, 359),
        warm: clamp(parsed.warm, 0, 100),
        reason: parsed.reason ?? '적용됨',
      },
    };
  } catch {
    return { ok: false, error: 'network' };
  }
};
