export interface Thought {
  id: string;
  title: string;
  description: string;
  audio: string;
  pubDate: string;
  theme: 'Capacity' | 'Connection' | 'Condition' | 'Commission';
}

export interface CoreConcept {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  color: string;
}
