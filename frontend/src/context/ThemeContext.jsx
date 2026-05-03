import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';

export const THEME_STORAGE_KEY = 'eep-theme';

const ThemeContext = createContext(null);

function readPreference() {
  if (typeof window === 'undefined') return 'system';
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'system';
  } catch {
    return 'system';
  }
}

function subscribePreference(cb) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', cb);
  window.addEventListener('eep-theme-change', cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener('eep-theme-change', cb);
  };
}

function subscribeSystem(cb) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function systemPrefersDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }) {
  const preferenceRaw = useSyncExternalStore(
    subscribePreference,
    readPreference,
    () => 'system'
  );
  const systemDark = useSyncExternalStore(subscribeSystem, systemPrefersDark, () => false);

  const normalized =
    preferenceRaw === 'light' || preferenceRaw === 'dark' ? preferenceRaw : 'system';

  const resolvedDark = normalized === 'dark' || (normalized === 'system' && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedDark);
    document.documentElement.style.colorScheme = resolvedDark ? 'dark' : 'light';
  }, [resolvedDark]);

  const setPreference = (next) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event('eep-theme-change'));
  };

  const value = useMemo(
    () => ({
      preference: normalized,
      setPreference,
      resolved: resolvedDark ? 'dark' : 'light',
    }),
    [normalized, resolvedDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}
