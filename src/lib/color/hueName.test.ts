import { describe, expect, it } from 'vitest';
import { hueName } from './hueName';

describe('hueName', () => {
  it.each([
    [0, '레드'],
    [30, '오렌지'],
    [60, '앰버'],
    [130, '그린'],
    [254, '블루'],
    [290, '인디고'],
    [340, '핑크'],
    [359, '핑크'],
  ])('%i° → %s', (h, name) => {
    expect(hueName(h)).toBe(name);
  });
});
