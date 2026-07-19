type LinearRgb = [number, number, number];

const oklchToLinearRgb = (L: number, C: number, H: number): LinearRgb => {
  const rad = (H * Math.PI) / 180;
  const a = C * Math.cos(rad);
  const b = C * Math.sin(rad);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const inGamut = (rgb: LinearRgb): boolean =>
  rgb.every((v) => v >= -0.0005 && v <= 1.0005);

const encodeChannel = (value: number): number => {
  const v = Math.min(1, Math.max(0, value));
  const gamma = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(gamma * 255);
};

// 가멋 밖이면 명도·색상을 유지한 채 채도만 줄여 들어올 때까지 클램프한다
export const oklchToHex = (L: number, C: number, H: number): string => {
  let chroma = Math.max(0, C);
  let rgb = oklchToLinearRgb(L, chroma, H);
  while (chroma > 0 && !inGamut(rgb)) {
    chroma -= 0.004;
    rgb = oklchToLinearRgb(L, chroma, H);
  }
  return `#${rgb
    .map((v) => encodeChannel(v).toString(16).padStart(2, '0').toUpperCase())
    .join('')}`;
};
