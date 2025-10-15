'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CoreConcept, Thought } from '@/types';

interface FourCsProps {
  selectedTheme: Thought['theme'] | null;
  onThemeSelect: (theme: Thought['theme'] | null) => void;
}

const coreConcepts: CoreConcept[] = [
  {
    id: 'capacity',
    title: 'Capacity',
    description: 'Building the ability to grow, learn, and expand our potential',
    longDescription: 'Capacity is about developing your inner strength and capabilities. It\'s the journey of continuous learning, pushing boundaries, and expanding what you thought was possible. Through building capacity, we unlock new levels of understanding and performance in all areas of life.',
    color: '#60A5FA' // blue-400
  },
  {
    id: 'connection',
    title: 'Connection',
    description: 'Fostering authentic relationships and meaningful bonds',
    longDescription: 'Connection explores the profound impact of genuine human relationships. It\'s about vulnerability, empathy, and creating deep bonds that enrich our lives. True connection transcends surface-level interactions and creates communities of support, understanding, and shared growth.',
    color: '#4ADE80' // green-400
  },
  {
    id: 'condition',
    title: 'Condition',
    description: 'Understanding and accepting our present state',
    longDescription: 'Condition is the practice of honest self-assessment and acceptance. It\'s about recognizing where you are right now without judgment, understanding your current circumstances, and using that awareness as a foundation for intentional growth. Accepting your condition is the first step to transformation.',
    color: '#C084FC' // purple-400
  },
  {
    id: 'commission',
    title: 'Commission',
    description: 'Embracing our purpose and calling in the world',
    longDescription: 'Commission is about discovering and living out your unique purpose. It\'s the recognition that you have a specific role to play in the world, with gifts and perspectives that only you can offer. Embracing your commission means stepping boldly into your calling and making your mark on the world.',
    color: '#FB923C' // orange-400
  }
];

export default function FourCs({ selectedTheme, onThemeSelect }: FourCsProps) {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  const handleConceptClick = (theme: Thought['theme']) => {
    // Toggle: if already selected, deselect (null), otherwise select the theme
    onThemeSelect(selectedTheme === theme ? null : theme);
  };

  const handleInfoClick = (e: React.MouseEvent, conceptId: string) => {
    e.stopPropagation(); // Prevent concept click
    setExpandedConcept(expandedConcept === conceptId ? null : conceptId);
  };

  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          The Fundamentals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreConcepts.map((concept, index) => {
            const isSelected = selectedTheme === concept.title;
            const isExpanded = expandedConcept === concept.id;
            
            return (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleConceptClick(concept.title as Thought['theme'])}
              className={`
                relative group cursor-pointer rounded-2xl
                ${isSelected ? 'ring-2' : ''}
              `}
              style={isSelected ? {
                borderColor: concept.color,
                boxShadow: `0 0 20px ${concept.color}60`
              } : {}}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-white/30 h-full flex flex-col">
                {/* Info Button */}
                <motion.button
                  onClick={(e) => handleInfoClick(e, concept.id)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 z-10"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="More information"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.button>

                {/* Icon/Visual with parallax effect */}
                <motion.div
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 rounded-full mb-6 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${concept.color}40, ${concept.color}20)`,
                    border: `2px solid ${concept.color}60`
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: concept.color }}
                  />
                  {/* Subtle rotating ring on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, ${concept.color}00, ${concept.color}80, ${concept.color}00)`
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.5 }}
                  />
                </motion.div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: concept.color }}
                >
                  {concept.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed flex-grow">
                  {concept.description}
                </p>

                {/* Hover Effect - Glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  style={{
                    background: `radial-gradient(circle at center, ${concept.color}20, transparent 70%)`,
                    filter: 'blur(20px)'
                  }}
                />
              </div>

              {/* Expanded Info Popup */}
              <AnimatePresence>
                {isExpanded && concept.longDescription && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute top-full left-0 right-0 mt-2 p-6 bg-black/90 backdrop-blur-md rounded-xl border z-20 shadow-2xl"
                    style={{
                      borderColor: concept.color + '60',
                      boxShadow: `0 10px 40px ${concept.color}40`
                    }}
                  >
                    <div className="relative">
                      <div 
                        className="absolute -top-3 left-8 w-6 h-6 bg-black/90 rotate-45 border-t border-l"
                        style={{ borderColor: concept.color + '60' }}
                      />
                      <p className="text-white/90 text-sm leading-relaxed relative z-10">
                        {concept.longDescription}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
          })}
        </div>
      </motion.div>
    </section>
  );
}
