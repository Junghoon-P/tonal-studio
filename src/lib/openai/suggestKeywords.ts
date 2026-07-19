import { z } from 'zod';
import type { SuggestError } from '@/lib/openai/suggestPalette';

export type KeywordsResult =
  | { ok: true; value: string[] }
  | { ok: false; error: SuggestError };

const responseSchema = z.object({
  choices: z
    .array(z.object({ message: z.object({ content: z.string() }) }))
    .min(1),
});

const keywordsSchema = z.object({ keywords: z.array(z.string()).min(1) });

const SYSTEM_PROMPT =
  'You refine brand-mood keywords for a color design tool. Given selected Korean mood keywords, reply JSON {"keywords":[...]} with exactly 5 more specific, distinct Korean keywords (each 2-8 characters) that narrow the mood toward a concrete color direction. Never repeat the given keywords.';

// 키워드 → 더 세부적인 연관 키워드 체인. 팔레트 판정과 무관한 "탐색" 전용 AI
export const suggestKeywords = async (
  key: string,
  selected: string[],
): Promise<KeywordsResult> => {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: selected.join(', ') },
        ],
      }),
    });
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: 'auth' };
    if (res.status === 429) return { ok: false, error: 'quota' };
    if (!res.ok) return { ok: false, error: 'network' };
    const body = responseSchema.parse(await res.json());
    const raw: unknown = JSON.parse(body.choices[0].message.content);
    const parsed = keywordsSchema.parse(raw);
    const cleaned = parsed.keywords
      .map((k) => k.trim())
      .filter((k) => k.length > 0 && k.length <= 12)
      .slice(0, 5);
    if (cleaned.length === 0) return { ok: false, error: 'network' };
    return { ok: true, value: cleaned };
  } catch {
    return { ok: false, error: 'network' };
  }
};
