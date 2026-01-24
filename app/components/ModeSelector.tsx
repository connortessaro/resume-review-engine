'use client';

const MODES = [
  { id: 'ats', label: 'ATS Optimized' },
  { id: 'concise', label: 'Concise' },
  { id: 'impact', label: 'Impact Focused' },
];

interface ModeSelectorProps {
  mode: string;
  onChange: (mode: string) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1 text-[0.7rem]">
      {MODES.map((m) => {
        const isActive = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={[
              'rounded-full px-3 py-1 transition-transform duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 focus-visible:ring-offset-black',
              isActive
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'bg-transparent text-gray-300 hover:bg-white/10 hover:text-white active:scale-95',
            ].join(' ')}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
