'use client';

import { AsyncState } from '@/lib/async-state';
import { giveExplanation } from '../api/resume-actions';
import { useRef, useState } from 'react';
import { RewriteEntry } from '@/lib/rewrite-entry';
import { useEffect } from 'react';

interface OutputCardProps {
  currEntry: RewriteEntry | undefined;
  state: AsyncState;
  onState: (state: AsyncState) => void;
  selectedHistoricalEntry: RewriteEntry | null;
  onDeselectHistoricalEntry: (entry: RewriteEntry | null) => void;
  onCreateExplanation: (e: string) => void;
}

export default function OutputCard({
  currEntry,
  state,
  onState,
  selectedHistoricalEntry,
  onDeselectHistoricalEntry,
  onCreateExplanation,
}: OutputCardProps) {
  const prevResume = useRef<RewriteEntry | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    if (prevResume.current?.id !== currEntry?.id) {
      onDeselectHistoricalEntry(null);
      prevResume.current = currEntry ?? null;
    }
  }, [currEntry, onDeselectHistoricalEntry]);

  const selectedEntry: RewriteEntry =
    selectedHistoricalEntry != null ? selectedHistoricalEntry : currEntry!;
  const explanation = selectedEntry?.explanation ?? '';

  if (!currEntry && !selectedHistoricalEntry) {
    return (
      <section className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-gray-500 backdrop-blur-sm">
        <p className="mb-1">
          Your improved resume will appear here after you run a rewrite.
        </p>
        <p className="text-xs text-gray-400">
          Try pasting a short section of your resume to see how the AI improves
          clarity and impact.
        </p>
      </section>
    );
  }

  async function onButtonClick() {
    try {
      onState({ type: 'loading' });
      // Generate an explanation for the currently selected entry
      const explanation = await giveExplanation(
        selectedEntry.original,
        selectedEntry.improved,
      );
      // Persist explanation onto the entry in page-level history
      onCreateExplanation(explanation);
      onState({ type: 'success' });
    } catch (error) {
      onState({
        type: 'error',
        errorMessage:
          error instanceof Error
            ? error.message
            : 'An unknown error occurred while generating explanation.',
      });
    }
  }

  async function handleCopyImproved() {
    try {
      await navigator.clipboard.writeText(selectedEntry.improved);
    } catch {
      // swallow copy errors silently
    }
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black/35 p-4 shadow-inner backdrop-blur md:p-5">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-50">Results</h2>
        <span className="text-xs text-gray-400">Improved resume</span>
      </header>
      {/* improved always visible */}
      <div className="flex flex-col gap-2 rounded-lg border border-sky-500/40 bg-linear-to-br from-sky-950/60 via-sky-900/40 to-indigo-950/60 p-3 shadow-[0_14px_30px_rgba(8,47,73,0.75)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.7rem] font-semibold tracking-[0.16em] text-sky-300 uppercase">
            Improved
          </h3>
          <button
            type="button"
            onClick={handleCopyImproved}
            className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[0.65rem] text-sky-100 hover:bg-sky-500/30"
          >
            Copy
          </button>
        </div>
        <pre className="max-h-[260px] overflow-auto text-xs whitespace-pre-wrap text-sky-50">
          {selectedEntry.improved}
        </pre>
      </div>
      {/* toggle + collapsible original */}
      <button
        type="button"
        onClick={() => setShowOriginal((v) => !v)}
        className="inline-flex items-center gap-2 self-start rounded-full bg-white/5 px-3 py-1 text-[0.7rem] text-gray-300 transition hover:bg-white/10"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        {showOriginal ? 'Hide original' : 'Show original'}
      </button>
      {showOriginal && (
        <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/60 p-3 shadow-sm">
          <h3 className="text-[0.7rem] font-semibold tracking-[0.16em] text-gray-400 uppercase">
            Original
          </h3>
          <pre className="max-h-[220px] overflow-auto text-xs whitespace-pre-wrap text-gray-200">
            {selectedEntry.original}
          </pre>
        </div>
      )}
      {state.type === 'loading' ? (
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500/80 px-4 py-2 text-xs font-medium text-white shadow-md shadow-sky-500/30 disabled:cursor-not-allowed"
        >
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300/80 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-sky-300" />
          </span>
          Generating…
        </button>
      ) : (
        <button
          type="button"
          onClick={onButtonClick}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-medium text-white shadow-md shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          Why these changes?
        </button>
      )}

      {/* explanation output */}
      {explanation && (
        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-emerald-500/40 bg-emerald-800/40 p-3">
          <h3 className="text-[0.7rem] font-semibold tracking-[0.16em] text-emerald-300 uppercase">
            Explanation
          </h3>
          <pre className="max-h-[220px] overflow-auto text-xs whitespace-pre-wrap text-emerald-50">
            {explanation}
          </pre>
        </div>
      )}
    </section>
  );
}
