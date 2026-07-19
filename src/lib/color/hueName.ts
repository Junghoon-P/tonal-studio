const HUE_NAMES: ReadonlyArray<readonly [number, string]> = [
  [15, '레드'],
  [42, '오렌지'],
  [75, '앰버'],
  [105, '옐로그린'],
  [150, '그린'],
  [185, '틸'],
  [225, '시안'],
  [265, '블루'],
  [300, '인디고'],
  [330, '퍼플'],
  [360, '핑크'],
];

export const hueName = (h: number): string => {
  for (const [max, name] of HUE_NAMES) {
    if (h < max) return name;
  }
  return '레드';
};
