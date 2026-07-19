// 대비율 표기 — 반올림으로 기준을 넘겨 보이지 않도록 항상 내림
export const formatRatio = (r: number): string =>
  (Math.floor(r * 100) / 100).toFixed(2);

export const levelOf = (r: number): string => {
  if (r >= 7) return 'AAA';
  if (r >= 4.5) return 'AA';
  if (r >= 3) return '3:1';
  return '미달';
};
