'use client';

import { useState } from 'react';

export default function SyncEpisodesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; timestamp: string } | null>(null);
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
        <h1 className="text-3xl font-bold mb-8">Sync Episodes from RSS</h1>

        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <p className="text-white/70 mb-4">
            This will sync all episodes from the RSS feed to the database.
            Existing episodes will be skipped.
          </p>

          <button
            onClick={handleSync}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Syncing...' : 'Sync Episodes'}
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
            <p className="text-sm text-green-400/70">
              Synced at: {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}