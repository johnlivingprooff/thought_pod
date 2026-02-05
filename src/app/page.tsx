'use client';

import { useState, useEffect } from 'react';
import Starfield from '@/components/Starfield';
import Landing from '@/components/Landing';
import BackgroundAmbientAudio from '@/components/BackgroundAmbientAudio';
import FourCs from '@/components/FourCs';
import EpisodeList from '@/components/EpisodeList';
import ThoughtPlayer from '@/components/ThoughtPlayer';
import Navigation from '@/components/Navigation';
import { Thought } from '@/types';

export default function Home() {
  const [episodes, setEpisodes] = useState<Thought[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Thought['theme'] | null>(null);

  // Fetch episodes on component mount
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch('/api/episodes');
        if (response.ok) {
          const data = await response.json();
          setEpisodes(data);
        }
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
      }
    };

    fetchEpisodes();
  }, []);

  const handleThemeSelect = (theme: Thought['theme'] | null) => {
    setSelectedTheme(theme);
    // Scroll to episodes list when theme is selected
    if (theme) {
      document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Map theme to color for starfield tinting
  const getThemeColor = (theme: Thought['theme'] | null): string | undefined => {
    const colors = {
      Capacity: '#60A5FA',
      Connection: '#4ADE80',
      Condition: '#C084FC',
      Commission: '#FB923C',
    };
    return theme ? colors[theme] : undefined;
  };

  return (
    <div className="min-h-screen relative flex flex-col gap-16 pt-8 pb-16">
      <Navigation />
      <Starfield themeColor={getThemeColor(selectedTheme)} />
      <BackgroundAmbientAudio />

      <Landing />



      <FourCs
        selectedTheme={selectedTheme}
        onThemeSelect={handleThemeSelect}
      />

      <EpisodeList
        episodes={episodes}
        selectedTheme={selectedTheme}
      />

      <ThoughtPlayer episodes={episodes} />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-white/50 text-sm">
          <p>&copy; 2025 Thought Podcast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


