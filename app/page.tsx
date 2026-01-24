'use client';

import BulletForm from './components/BulletForm';
import OutputCard from './components/OutputCard';
import HistorySidebar from './components/HistorySidebar';
import { useEffect, useState } from 'react';
import { RewriteEntry } from '@/lib/rewrite-entry';
import { AsyncState } from '@/lib/async-state';

export default function Home() {
  const [currEntry, setCurrEntry] = useState<RewriteEntry>();
  const [history, setHistory] = useState<RewriteEntry[]>([]);
  const [bulletFormState, setBulletFormState] = useState<AsyncState>({
    type: 'idle',
  });
  const [outputCardState, setOutputCardState] = useState<AsyncState>({
    type: 'idle',
  });
  const [selectedHistoricalEntry, setSelectedHistoricalEntry] =
    useState<RewriteEntry | null>(null);

  const MAX_HISTORY_LENGTH = 10;

  useEffect(() => {
    // Initialize history and make the most recent entry the current one
    const storedHistory = localStorage.getItem('rewriteHistory');
    if (storedHistory) {
      const parsedEntries: RewriteEntry[] = JSON.parse(storedHistory);
      // eslint-disable-next-line
      setCurrEntry(parsedEntries?.at(0));
      setHistory(parsedEntries);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rewriteHistory', JSON.stringify(history));
  }, [history]);

  function addEntry(entry: RewriteEntry) {
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
