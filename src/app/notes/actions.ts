'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { insertNote, insertReply } from '@/lib/db';
import { sendNoteNotification } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

export async function addNote(formData: FormData) {
  const title = formData.get('title') as string || null;
  const episode_id = formData.get('episode_id') as string || null;
  const author_name = formData.get('author_name') as string || null;
  const content = formData.get('content') as string;

  if (!content || content.trim().length === 0) {
    throw new Error('Content is required');
  }

  // Check if user is admin
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('role')?.value;
  const isAdmin = adminCookie === 'admin';

  const author_type = isAdmin ? 'admin' : 'community';
  const status = isAdmin ? 'published' : 'pending';

  const id = uuidv4();

  try {
    insertNote.run(id, title, episode_id, author_name, author_type, content.trim(), status);

    // Send email notification for new notes
    await sendNoteNotification({
      contributorName: author_name || undefined,
      content: content.trim(),
      episodeId: episode_id || undefined,
      noteId: id,
    });

    revalidatePath('/notes');
  } catch (error) {
    console.error('Error inserting note:', error);
    throw new Error('Failed to add note');
  }
}

export async function addReply(formData: FormData) {
  const note_id = formData.get('note_id') as string;
  const author_name = formData.get('author_name') as string || null;
  const content = formData.get('content') as string;

  console.log('addReply called with:', { note_id, author_name, content: content?.substring(0, 50) });

  if (!note_id || !content || content.trim().length === 0) {
    console.error('Validation failed:', { note_id: !!note_id, content: !!content, contentLength: content?.length });
    throw new Error('Note ID and content are required');
  }

  // Check if user is admin
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('role')?.value;
  const isAdmin = adminCookie === 'admin';

  const author_type = isAdmin ? 'admin' : 'community';
  const id = uuidv4();

  try {
    console.log('Attempting to insert reply:', { id, note_id, author_name, author_type, content: content.trim() });
    insertReply.run(id, note_id, author_name, author_type, content.trim());
    console.log('Reply inserted successfully');
    revalidatePath('/notes');
  } catch (error) {
    console.error('Error inserting reply:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      stack: error.stack
    });
    throw new Error('Failed to add reply');
  }
}

export async function getReplies(noteId: string) {
  try {
    return getNoteReplies.all(noteId);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return [];
  }
}