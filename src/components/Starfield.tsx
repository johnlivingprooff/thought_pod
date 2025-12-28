
'use client';

import ThoughtCapsuleModal from './ThoughtCapsuleModal';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
// Shooting star component
interface ShootingStarProps {
  start: [number, number, number];
  end: [number, number, number];
  duration: number;
  color: string;
  onFinished: () => void;
}

function ShootingStar({ start, end, duration, color, onFinished }: ShootingStarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    let frame: number;

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = t * t; // acceleration
      setProgress(eased);

      if (t < 1) frame = requestAnimationFrame(animate);
      else onFinished();
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, onFinished]);

  const current: [number, number, number] = [
    start[0] + (end[0] - start[0]) * progress,
    start[1] + (end[1] - start[1]) * progress - progress * 0.6, // subtle curve
    start[2],
  ];

  return (
    <Line
      points={[start, current]}
      color={color}
      lineWidth={2}
      transparent
      opacity={1 - progress}
    />
  );
}

import * as THREE from 'three';

interface StarsProps {
  mousePosition: { x: number; y: number };
  scrollY: number;
  themeColor?: string;
}

function Stars({ mousePosition, scrollY, themeColor }: StarsProps) {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const depths = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * 40 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const depth = Math.random(); // 0 = far, 1 = near
      depths[i] = depth;

      positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      sizes[i] = 0.02 + depth * 0.06; // near stars slightly larger
    }

    return { positions, sizes, depths };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;

    // Very subtle drift — not rotation
    ref.current.rotation.y += delta * 0.005;

    // Parallax from mouse
    const parallaxX = mousePosition.y * 0.00015;
    const parallaxY = mousePosition.x * 0.00015;

    ref.current.rotation.x += (parallaxX - ref.current.rotation.x) * 0.03;
    ref.current.rotation.y += (parallaxY - ref.current.rotation.y) * 0.03;

    // Gentle depth breathing on scroll
    ref.current.position.z = -scrollY * 0.0003;
  });

  return (
    <Points ref={ref} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={themeColor || '#ffffff'}
        size={0.04}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}


interface StarfieldProps {
  themeColor?: string;
}

export default function Starfield({ themeColor }: StarfieldProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  type ShootingStarState = { id: number, start: [number, number, number], end: [number, number, number], duration: number, color: string };
  const [shootingStars, setShootingStars] = useState<ShootingStarState[]>([]);
  const [modalEpisode, setModalEpisode] = useState<{
    title: string;
    excerpt: string;
    soundbiteUrl?: string;
    fullEpisodeUrl?: string;
  } | undefined>(undefined);
  // Randomly spawn shooting stars
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.5) { // 50% chance every 2s
        const start: [number, number, number] = [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 18,
          -2 + Math.random() * 2
        ];
        const end: [number, number, number] = [
          start[0] + (Math.random() * 4 + 2),
          start[1] + (Math.random() * 2 - 1),
          start[2]
        ];
        setShootingStars(stars => [
          ...stars,
          {
            id: Date.now() + Math.random(),
            start,
            end,
            duration: 900 + Math.random() * 600,
            color: '#fff'
          }
        ]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Remove finished shooting stars by id
  const handleShootingStarFinished = (id: number) => {
    setShootingStars(stars => stars.filter(s => s.id !== id));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

    return (
      <>
        <div
          className="fixed inset-0 -z-50 bg-black pointer-events-none"
          aria-label="Cosmic starfield background"
          role="img"
          tabIndex={0}
          // Remove modal trigger from background for now to avoid accidental overlays
        >
          <Canvas 
            camera={{ position: [0, 0, 1], fov: 75 }}
            gl={{ antialias: false }}
            dpr={[1, 2]}
            style={{ filter: 'blur(1.2px)' }}
          >
            <color attach="background" args={['#000000']} />
            <Stars 
              mousePosition={mousePosition} 
              scrollY={scrollY}
              themeColor={themeColor}
            />
            {/* Shooting stars */}
            {shootingStars.map(star => (
              <ShootingStar key={star.id} {...star} onFinished={() => handleShootingStarFinished(star.id)} />
            ))}
          </Canvas>
        </div>
  <ThoughtCapsuleModal open={!!modalEpisode} onClose={() => setModalEpisode(undefined)} episode={modalEpisode} />
      </>
  );
}
