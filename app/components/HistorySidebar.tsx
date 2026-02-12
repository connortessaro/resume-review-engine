import { StoredEntry } from '@/app/types/resume-types';
import { useState, MouseEvent } from 'react';

interface HistorySidebarProps {
  history: StoredEntry[];
  onSelectHistoricalEntry: (entry: StoredEntry) => void;
}

export default function HistorySidebar({
  history,
  onSelectHistoricalEntry,
}: HistorySidebarProps) {
  const [selectedEntry, setSelectedEntry] = useState<StoredEntry>();

  const handleButtonClick = (
    e: MouseEvent<HTMLButtonElement>,
    entry: StoredEntry,
  ) => {
    e.stopPropagation();
    setSelectedEntry(entry);
    onSelectHistoricalEntry(entry);
  };

  // TODO: Line 45 create ai header 

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[0.7rem] font-semibold tracking-[0.18em] text-gray-400 uppercase">
          History
        </h2>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.65rem] text-gray-400">
          {/* Limit to 10 entries; newest at the top (see addEntry in page.tsx) */}
          {history.length}/10
        </span>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto pt-1 pr-1">
        <ul className="max-h-full space-y-1">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="group history-entry rounded-md border border-white/20 bg-white/5 p-2 text-[0.68rem] text-gray-200 shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-150 hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-white/10 hover:shadow-[0_10px_25px_rgba(15,23,42,0.7)]"
            >
              <div className="line-clamp-2">{entry.improved.slice(0, 120)}</div>
              <div className="mt-1 flex items-center justify-between text-[0.6rem] text-gray-500">
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[0.58rem] tracking-[0.16em] uppercase">
                  {entry.mode}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleButtonClick(e, entry)}
                  className={
                    'cursor-pointer rounded-full bg-sky-900 px-1 py-0.5 text-[0.60rem] text-sky-300 opacity-0 transition-[opacity,transform,box-shadow] duration-200 group-hover:opacity-100 hover:bg-sky-800 active:scale-95 active:shadow-[0_0_0_5px_rgba(56,189,248,0.15)]' +
                    ' ' +
                    (selectedEntry?.id === entry.id
                      ? 'bg-sky-800 opacity-100'
                      : '')
                  }
                >
                  View
                </button>
              </div>
            </li>
          ))}

          {history.length === 0 && (
            <li className="rounded-md border border-dashed border-white/10 bg-black/20 p-3 text-[0.7rem] text-gray-500">
              Your rewrites will appear here. Run your first rewrite to start
              building history.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
