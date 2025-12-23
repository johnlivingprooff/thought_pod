'use client';

import { useState } from 'react';
import { Episode } from '@/types';
import AddNoteForm from './AddNoteForm';

interface AddNoteToggleProps {
  episodes: Episode[];
  narrow?: boolean;
}

export default function AddNoteToggle({ episodes, narrow = false }: AddNoteToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isExpanded) {
    return (
      <div className="mt-8">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
        <AddNoteForm episodes={episodes} onSuccess={() => setIsExpanded(false)} narrow={narrow} />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsExpanded(true)}
      className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add Your Thoughts
    </button>
  );
}