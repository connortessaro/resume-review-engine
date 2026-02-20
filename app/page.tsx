'use client';

import BulletForm from './components/BulletForm';
import OutputCard from './components/OutputCard';
import HistorySidebar from './components/HistorySidebar';
import { useEffect, useState } from 'react';
import { StoredEntry } from '@/app/types/resume-types';
import { AsyncState } from '@/app/types/async-state';

export default function Home() {
  const [currEntry, setCurrEntry] = useState<StoredEntry>();
  const [history, setHistory] = useState<StoredEntry[]>([]);
  const [bulletFormState, setBulletFormState] = useState<AsyncState>({
    type: 'idle',
  });
  const [outputCardState, setOutputCardState] = useState<AsyncState>({
    type: 'idle',
  });
  const [selectedHistoricalEntry, setSelectedHistoricalEntry] =
    useState<StoredEntry | null>(null);

  const MAX_HISTORY_LENGTH = 10;

  useEffect(() => {
    // Initialize history and keep the app resilient to malformed localStorage.
    const storedHistory = localStorage.getItem('rewriteHistory');
    if (!storedHistory) return;

    try {
      const parsedEntries = JSON.parse(storedHistory);
      if (!Array.isArray(parsedEntries)) return;

      const validEntries = parsedEntries.filter(
        (entry): entry is StoredEntry =>
          typeof entry === 'object' &&
          entry != null &&
          typeof entry.id === 'number' &&
          typeof entry.timestamp === 'string' &&
          typeof entry.mode === 'string',
      );

      if (validEntries.length === 0) return;
      const nextHistory = validEntries.slice(0, MAX_HISTORY_LENGTH);
      const timer = window.setTimeout(() => {
        setCurrEntry(nextHistory[0]);
        setHistory(nextHistory);
      }, 0);
      return () => window.clearTimeout(timer);
    } catch {
      localStorage.removeItem('rewriteHistory');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rewriteHistory', JSON.stringify(history));
  }, [history]);

  function addEntry(entry: StoredEntry) {
    setCurrEntry(entry);
    setHistory((prev) => {
      const next = [entry, ...prev];
      if (prev.length >= MAX_HISTORY_LENGTH) next.pop();
      return next;
    });
  }

  function addExplanationToEntry(explanation: string) {
    if (currEntry == undefined) return;
    const updatedEntry = { ...currEntry, explanation };
    setCurrEntry(updatedEntry);
    setHistory((prev) => {
      const index = prev.findIndex((e) => e.id === currEntry.id);
      if (index === -1) return prev;
      const next = [...prev];
      next[index] = updatedEntry;
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-800 to-slate-900 font-sans text-gray-100">
      <header className="border-b border-white/5 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="bg-linear-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Resume Review Engine
            </span>
          </h1>
          <span className="hidden text-xs text-gray-400 sm:inline">v1</span>
        </div>
      </header>

      <div className="flex w-full">
        <aside className="hidden h-[calc(100vh-65px)] w-64 shrink-0 border-r border-white/5 bg-black/30 p-3 backdrop-blur md:block">
          <HistorySidebar
            history={history}
            onSelectHistoricalEntry={setSelectedHistoricalEntry}
          />
        </aside>

        <div className="flex flex-1 justify-center px-3 py-6 sm:px-4 sm:py-8">
          <main className="flex w-full max-w-5xl flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.75)] backdrop-blur-lg sm:px-6 sm:py-6">
            <BulletForm
              onCreateEntry={addEntry}
              state={bulletFormState}
              onState={setBulletFormState}
            />
            {bulletFormState?.type === 'error' && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[0.7rem] font-medium text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                {bulletFormState.errorMessage}
              </div>
            )}
            <OutputCard
              currEntry={currEntry}
              state={outputCardState}
              onState={setOutputCardState}
              selectedHistoricalEntry={selectedHistoricalEntry}
              onDeselectHistoricalEntry={setSelectedHistoricalEntry}
              onCreateExplanation={addExplanationToEntry}
            />
            {outputCardState?.type === 'error' && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[0.7rem] font-medium text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                {outputCardState.errorMessage}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
