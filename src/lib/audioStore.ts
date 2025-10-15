import { create } from 'zustand';
import { Howl } from 'howler';
import { Thought } from '@/types';

interface AudioState {
  currentEpisode: Thought | null;
  sound: Howl | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  
  // Actions
  playEpisode: (episode: Thought) => void;
  pause: () => void;
  resume: () => void;
  togglePlayPause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  setVolume: (volume: number) => void;
  playNext: (episodes: Thought[]) => void;
  playPrevious: (episodes: Thought[]) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentEpisode: null,
  sound: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,

  playEpisode: (episode: Thought) => {
    const { sound: currentSound, volume } = get();
    
    // Crossfade if there's a currently playing sound
    if (currentSound && currentSound.playing()) {
      // Fade out current sound
      currentSound.fade(volume, 0, 500);
      setTimeout(() => {
        currentSound.stop();
        currentSound.unload();
      }, 500);
    } else if (currentSound) {
      // Just stop and unload if not playing
      currentSound.stop();
      currentSound.unload();
    }

    // Create new Howl instance
    const newSound = new Howl({
      src: [episode.audio],
      html5: true,
      volume: 0, // Start at 0 for fade in
      onplay: () => {
        // Fade in new sound
        newSound.fade(0, get().volume, 500);
        set({ isPlaying: true });
        
        // Update current time periodically
        const updateTime = setInterval(() => {
          const sound = get().sound;
          if (sound && sound.playing()) {
            set({ 
              currentTime: sound.seek() as number,
              duration: sound.duration()
            });
          } else {
            clearInterval(updateTime);
          }
        }, 1000);
      },
      onpause: () => set({ isPlaying: false }),
      onstop: () => set({ isPlaying: false, currentTime: 0 }),
      onend: () => set({ isPlaying: false, currentTime: 0 }),
      onload: () => {
        set({ duration: newSound.duration() });
      },
      onloaderror: (id, error) => {
        console.error('Error loading audio:', error);
      }
    });

    newSound.play();
    set({ 
      currentEpisode: episode, 
      sound: newSound,
      currentTime: 0
    });
  },

  pause: () => {
    const { sound } = get();
    if (sound) {
      sound.pause();
      set({ isPlaying: false });
    }
  },

  resume: () => {
    const { sound } = get();
    if (sound) {
      sound.play();
      set({ isPlaying: true });
    }
  },

  togglePlayPause: () => {
    const { isPlaying, sound } = get();
    if (sound) {
      if (isPlaying) {
        get().pause();
      } else {
        get().resume();
      }
    }
  },

  stop: () => {
    const { sound } = get();
    if (sound) {
      sound.stop();
      set({ isPlaying: false, currentTime: 0, currentEpisode: null });
    }
  },

  seek: (time: number) => {
    const { sound } = get();
    if (sound) {
      sound.seek(time);
      set({ currentTime: time });
    }
  },

  skipForward: (seconds: number = 15) => {
    const { sound, currentTime } = get();
    if (sound) {
      const newTime = Math.min(currentTime + seconds, sound.duration());
      get().seek(newTime);
    }
  },

  skipBackward: (seconds: number = 15) => {
    const { sound, currentTime } = get();
    if (sound) {
      const newTime = Math.max(currentTime - seconds, 0);
      get().seek(newTime);
    }
  },

  setVolume: (volume: number) => {
    const { sound } = get();
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (sound) {
      sound.volume(clampedVolume);
    }
    set({ volume: clampedVolume });
  },

  playNext: (episodes: Thought[]) => {
    const { currentEpisode } = get();
    if (currentEpisode && episodes.length > 0) {
      const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
      const nextIndex = (currentIndex + 1) % episodes.length;
      get().playEpisode(episodes[nextIndex]);
    }
  },

  playPrevious: (episodes: Thought[]) => {
    const { currentEpisode } = get();
    if (currentEpisode && episodes.length > 0) {
      const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
      const prevIndex = currentIndex === 0 ? episodes.length - 1 : currentIndex - 1;
      get().playEpisode(episodes[prevIndex]);
    }
  }
}));
