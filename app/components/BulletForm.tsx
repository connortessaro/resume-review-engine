'use client';

import { useRef, useState } from 'react';
import { StoredEntry } from '@/app/types/resume-types';
import { AsyncState } from '@/app/types/async-state';
import ModeSelector from './ModeSelector';
import { createResume } from '@/app/api/resume-actions';

interface BulletFormProps {
  // Called when a new rewrite is successfully created
  onCreateEntry: (entry: StoredEntry) => void;
  // Global async state for the form (idle/loading/error)
  state: AsyncState;
  onState: (state: AsyncState) => void;
}

export default function BulletForm({
  onCreateEntry,
  state,
  onState,
}: BulletFormProps) {
  const [mode, setMode] = useState('ats');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!textAreaRef.current) return;

    const text = textAreaRef.current.value.trim();
    if (!text) return;

    onState({ type: 'loading' });
    try {
      const result = await createResume(mode, text);

      const entry: StoredEntry = {
        id: Date.now(),
        original: text,
        improved: result,
        mode,
        timestamp: new Date().toISOString(),
      };

      onCreateEntry(entry);
      onState({ type: 'success' });
    } catch (err) {
      onState({
        type: 'error',
        errorMessage:
          err instanceof Error ? err.message : 'An unknown error occurred.',
      });
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4 shadow-inner backdrop-blur md:p-5">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-50">Input resume</h2>
          <p className="text-xs text-gray-400">
            Paste your resume and choose how you want it improved.
          </p>
        </div>
        <span className="mt-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-medium text-emerald-300">
          AI‑powered rewrite
        </span>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          ref={textAreaRef}
          disabled={state.type == 'loading'}
          placeholder="Paste your resume here. Bullet points, responsibilities, achievements…"
          className="min-h-[220px] w-full resize-y rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-gray-100 placeholder:text-gray-500 placeholder:italic focus:border-sky-400 focus:ring-1 focus:ring-sky-500 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-60"
          required
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ModeSelector mode={mode} onChange={setMode} />

          {state.type == 'loading' ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500/80 px-4 py-2 text-xs font-medium text-white shadow-md shadow-sky-500/30 disabled:cursor-not-allowed"
            >
              <span className="relative flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300/80 opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-sky-300" />
              </span>
              Processing…
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-medium text-white shadow-md shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Generate rewrite
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
