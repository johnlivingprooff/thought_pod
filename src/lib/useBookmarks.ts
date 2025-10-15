'use client';

import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('thought-bookmarks');
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        setBookmarkedIds(new Set(ids));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('thought-bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isBookmarked = (id: string) => bookmarkedIds.has(id);

  return { toggleBookmark, isBookmarked, bookmarkedIds };
}
