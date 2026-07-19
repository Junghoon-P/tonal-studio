// WCAG 2.x 상대 휘도 — https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
export const relativeLuminance = (hex: string): number => {
  const n = parseInt(hex.slice(1), 16);
  const linear = (raw: number): number => {
    const v = raw / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * linear((n >> 16) & 255) +
    0.7152 * linear((n >> 8) & 255) +
    0.0722 * linear(n & 255)
  );
};

export const contrastRatio = (a: string, b: string): number => {
  const x = relativeLuminance(a);
  const y = relativeLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
