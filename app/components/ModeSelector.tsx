'use client';

import { RewriteMode, REWRITE_MODES } from '@/app/types/mode-types';

interface ModeSelectorProps {
  mode: RewriteMode;
  onChange: (mode: RewriteMode) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1 text-[0.7rem]">
      {REWRITE_MODES.map((m) => {
        const isActive = m === mode;
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={[
              'rounded-full px-3 py-1 transition-transform duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 focus-visible:ring-offset-black',
              isActive
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'bg-transparent text-gray-300 hover:bg-white/10 hover:text-white active:scale-95',
            ].join(' ')}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}
