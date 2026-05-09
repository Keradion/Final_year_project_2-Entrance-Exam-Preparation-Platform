import React, { useEffect, useRef, useState } from 'react';
import { Moon, Monitor, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LABELS = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export default function ThemeToggle({ className = '' }) {
  const { preference, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const Icon =
    preference === 'dark' ? Moon : preference === 'light' ? Sun : Monitor;

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Theme: ${LABELS[preference]}. Open choices.`}
        title={`Theme: ${LABELS[preference]} — click for options`}
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 shrink-0"
      >
        <Icon size={18} aria-hidden />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-outline/10 bg-surface shadow-xl z-[60] overflow-hidden py-1">
          {[
            ['light', Sun],
            ['dark', Moon],
            ['system', Monitor],
          ].map(([key, IconCmp]) => {
            const selected = preference === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPreference(key);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  selected
                    ? 'bg-primary-container/15 text-primary-container'
                    : 'text-on-surface hover:bg-primary-container/5'
                }`}
              >
                <IconCmp size={16} aria-hidden />
                {LABELS[key]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
