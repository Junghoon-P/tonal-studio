import { hueName } from './hueName';
import type { ColorToken } from './types';

const lightnessWord = (L: number): string => {
  if (L >= 0.9) return '매우 밝은';
  if (L >= 0.7) return '밝은';
  if (L >= 0.45) return '중간 밝기의';
  if (L >= 0.25) return '어두운';
  return '매우 어두운';
};

const chromaWord = (C: number): string => {
  if (C < 0.02) return '무채색에 가까운';
  if (C < 0.08) return '은은한';
  return '선명한';
};

// 색을 보지 못해도 판단할 수 있도록 스와치·수치와 동등한 언어적 묘사를 만든다
export const describeColor = (token: ColorToken): string => {
  const family = token.C < 0.02 ? '회색' : hueName(token.H);
  return `${lightnessWord(token.L)} ${chromaWord(token.C)} ${family} 계열`;
};
