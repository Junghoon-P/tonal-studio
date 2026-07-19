const STORAGE_KEY = 'tonal-openai-key';

// 키는 이 브라우저의 localStorage에만 보관되고 서버로 전송되지 않는다
export const getStoredKey = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const storeKey = (key: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // 저장 불가 환경(사생활 보호 모드 등)에서는 세션 한정으로만 동작
  }
};

export const removeStoredKey = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 접근 불가면 지울 것도 없다
  }
};
