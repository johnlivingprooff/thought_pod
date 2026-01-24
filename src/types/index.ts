export interface Thought {
  id: string;
  title: string;
  description: string;
  audio: string;
  pubDate: string;
  theme: 'Capacity' | 'Connection' | 'Condition' | 'Commission';
  slug: string;
}

export interface CoreConcept {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  color: string;
}

export interface Note {
  id: string;
  title?: string;
  episode_id?: string;
  author_name?: string;
  author_type: 'admin' | 'community';
  content: string;
  status: 'published' | 'pending' | 'flagged';
  is_official: boolean;
  created_at: string;
}

export interface RawNote {
  id: string;
  title?: string;
  episode_id?: string;
  author_name?: string;
  author_type: 'admin' | 'community';
  content: string;
  status: 'published' | 'pending' | 'flagged';
  is_official: number; // 0 or 1 from database
  created_at: string;
}

export interface NoteReply {
  id: string;
  note_id: string;
  author_name?: string;
  author_type: 'admin' | 'community';
  content: string;
  created_at: string;
}

export interface Episode {
  id: string;
  title: string;
  slug: string;
  published_at?: string;
  created_at: string;
}
