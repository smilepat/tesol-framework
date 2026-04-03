/**
 * SSR-safe localStorage wrapper.
 * Returns no-ops on the server to prevent `ReferenceError: localStorage is not defined`.
 */
export const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};
