'use client';

import { useState } from 'react';

export default function SyncEpisodesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    timestamp: string;
    episodes?: { synced: number; skipped: number; errors: number };
    notes?: { synced: number; errors: number };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/sync-episodes', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Sync failed');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sync Episodes and Notes</h1>

        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <p className="text-white/70 mb-4">
            This syncs episodes from RSS, then syncs official Markdown notes from
            `public/episode-notes-md` into the database.
          </p>

          <button
            onClick={handleSync}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Syncing...' : 'Sync Episodes + Notes'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-red-400 mb-2">Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <h3 className="font-bold text-green-400 mb-2">Success</h3>
            <p className="text-green-300 mb-2">{result.message}</p>
            {result.episodes && (
              <p className="text-sm text-green-400/80 mb-1">
                Episodes: {result.episodes.synced} synced, {result.episodes.skipped} skipped, {result.episodes.errors} errors
              </p>
            )}
            {result.notes && (
              <p className="text-sm text-green-400/80 mb-1">
                Notes: {result.notes.synced} synced, {result.notes.errors} errors
              </p>
            )}
            <p className="text-sm text-green-400/70">
              Synced at: {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
