# Thought Podcast - AI Coding Guidelines

## Project Overview
This is a Next.js 15 podcast website for "Thought Podcast" exploring Capacity, Connection, Condition, and Commission. It features immersive 3D starfield backgrounds, RSS-driven episode management, and sophisticated audio playback with crossfading.

## Architecture Patterns

### Audio Management
- **Global State**: Use `useAudioStore` (Zustand) for all audio operations - never create Howl instances directly in components
- **Crossfading**: Audio transitions use 500ms fade in/out - see `playEpisode` implementation in `src/lib/audioStore.ts`
- **Theme Integration**: Episodes have themes (Capacity/Connection/Condition/Commission) that affect UI colors and filtering

### Data Flow
- **RSS Parsing**: Episodes fetched from Anchor.fm RSS feed via `/api/episodes` route
- **Theme Detection**: Automatic categorization using keyword matching in `src/lib/rssParser.ts`
- **Local Storage**: Bookmarks persist using `useBookmarks` hook with localStorage

### Component Structure
- **Client Components**: All interactive components use `'use client'` directive
- **Path Aliases**: Import from `@/components`, `@/lib`, `@/types` - configured in `tsconfig.json`
- **Animation**: Framer Motion for all transitions, especially scroll-based storytelling sequences

## Key Files & Conventions

### Core Components
- `src/components/ThoughtPlayer.tsx`: Global audio player with progress, volume, skip controls
- `src/components/EpisodeList.tsx`: Theme-filtered episode grid with bookmarking
- `src/components/FourCs.tsx`: Interactive 4 Cs storytelling section
- `src/components/Starfield.tsx`: Three.js background that responds to theme colors

### Utilities
- `src/lib/audioStore.ts`: Zustand store for audio state management
- `src/lib/rssParser.ts`: RSS parsing with theme keyword detection
- `src/lib/useBookmarks.ts`: Local storage bookmark management

### Types
- `src/types/index.ts`: `Thought` interface (episodes) and `CoreConcept` interface

## Development Workflow

### Build & Run
```bash
npm run dev    # Turbopack dev server
npm run build  # Turbopack production build
npm run lint   # ESLint check
```

### Audio Integration
- Always test audio on mobile - use Howler's `html5: true` for better mobile support
- Volume defaults to 0.7, implement user preference persistence
- Handle audio loading errors gracefully

### Theme System
- Colors: Capacity(#60A5FA), Connection(#4ADE80), Condition(#C084FC), Commission(#FB923C)
- Apply theme colors to starfield tinting and UI accents
- Use keyword arrays in components for consistent theme detection

### Performance Considerations
- Three.js scenes optimized for mobile with minimal geometry
- Lazy load episode content and audio
- Use `framer-motion` for performant animations over CSS transitions

## Common Patterns

### Episode Handling
```typescript
// Fetch episodes
const episodes = await fetch('/api/episodes').then(r => r.json());

// Play episode (never call Howl directly)
const { playEpisode } = useAudioStore();
playEpisode(episode);
```

### Theme-Based Styling
```tsx
const themeColors = {
  Capacity: '#60A5FA',
  Connection: '#4ADE80',
  Condition: '#C084FC',
  Commission: '#FB923C'
};
```

### Scroll Interactions
- Use `scrollIntoView({ behavior: 'smooth' })` for navigation
- Implement theme selection with scroll-to-section behavior

## Testing Focus
- Audio playback across browsers/devices
- Theme filtering accuracy
- Mobile responsiveness with Three.js
- Local storage persistence
- RSS feed parsing reliability</content>
<parameter name="filePath">/home/johnlivingprooff/thought_pod/.github/copilot-instructions.md