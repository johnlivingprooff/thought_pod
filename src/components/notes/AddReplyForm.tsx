'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NoteReply } from '@/types';
import { addReply } from '@/app/notes/actions';

interface AddReplyFormProps {
  noteId: string;
  onReplyAdded: (reply: NoteReply) => void;
}

export default function AddReplyForm({ noteId, onReplyAdded }: AddReplyFormProps) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('note_id', noteId);
      formData.set('content', content.trim());
      if (authorName.trim()) {
        formData.set('author_name', authorName.trim());
      }

      await addReply(formData);

      // Create a temporary reply object for immediate UI update
      const newReply: NoteReply = {
        id: `temp-${Date.now()}`, // Temporary ID
        note_id: noteId,
        author_name: authorName.trim() || undefined,
        author_type: 'community', // Assume community for now
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      onReplyAdded(newReply);
      setContent('');
      setAuthorName('');
      router.refresh();
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="author_name" className="block text-sm font-medium text-white/70 mb-2">
          Your Name (optional)
        </label>
        <input
          type="text"
          id="author_name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Anonymous"
          className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-white/70 mb-2">
          Your Reply
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm resize-vertical"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-6 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
        >
          {isSubmitting ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
}