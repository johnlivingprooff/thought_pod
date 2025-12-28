'use client';

import { motion } from 'framer-motion';

export default function RotatingGlobe() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute"
        style={{
          top: '5vh',
          right: '-25vw',
          width: '1000px',
          height: '1000px',
          perspective: '2200px',
        }}
      >
        {/* ================= STATIC LIT SPHERE ================= */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(
                circle at 28% 30%,
                rgba(230,186,43,0.32) 0%,
                rgba(230,186,43,0.14) 32%,
                rgba(0,0,0,0.85) 62%,
                rgba(0,0,0,1) 100%
              )
            `,
            boxShadow: `
              inset -110px -110px 240px rgba(0,0,0,0.95),
              inset 80px 80px 160px rgba(255,255,255,0.12),
              0 0 260px rgba(255,255,255,0.06)
            `,
          }}
        >
          {/* Fixed terminator */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 18% 50%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,1) 100%)',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {/* ================= ROTATING GEOMETRY SPHERE ================= */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* X-axis ring (vertical) */}
          <motion.div
            className="absolute inset-[-20%] rounded-full"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.48)',
              transform: 'rotateX(90deg)',
              filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.45))',
            }}
            animate={{ rotateZ: 360 }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Y-axis ring (horizontal) */}
          <motion.div
            className="absolute inset-[-25%] rounded-full"
            style={{
              border: '1px solid rgba(240,232,73,0.48)',
              transform: 'rotateX(0deg)',
              filter: 'drop-shadow(0 0 16px rgba(255,255,255,0.35))',
            }}
            animate={{ rotateZ: -360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
