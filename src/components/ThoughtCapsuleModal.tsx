import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThoughtCapsuleModalProps {
  open: boolean;
  onClose: () => void;
  episode?: {
    title: string;
    excerpt: string;
    soundbiteUrl?: string;
    fullEpisodeUrl?: string;
  };
}

const ThoughtCapsuleModal: React.FC<ThoughtCapsuleModalProps> = ({ open, onClose, episode }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative flex flex-col items-center"
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={onClose}
              aria-label="Close modal"
            >
              &times;
            </button>
            {episode ? (
              <>
                <h2 className="text-2xl font-bold mb-2 text-center">{episode.title}</h2>
                <p className="text-lg text-gray-700 mb-4 text-center">{episode.excerpt}</p>
                {episode.soundbiteUrl && (
                  <audio controls src={episode.soundbiteUrl} className="mb-4 w-full" aria-label="Episode soundbite" />
                )}
                {episode.fullEpisodeUrl && (
                  <a
                    href={episode.fullEpisodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-full shadow hover:bg-gray-800 transition"
                  >
                    Listen to Full Episode
                  </a>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500">No episode selected.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThoughtCapsuleModal;
