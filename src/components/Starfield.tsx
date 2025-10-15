
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
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame: number;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const nextProgress = Math.min(elapsed / duration, 1);
      setProgress(nextProgress);
      if (nextProgress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        onFinished();
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, onFinished]);
  // Interpolate position
  const current: [number, number, number] = [
    start[0] + (end[0] - start[0]) * progress,
    start[1] + (end[1] - start[1]) * progress,
    start[2] + (end[2] - start[2]) * progress,
  ];
  return (
    <Line
      ref={ref}
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
  
  // Generate random star positions with depth layers
  const particles = useMemo(() => {
    const count = 1200; // Lowered for performance
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Create stars in a larger sphere with depth layers
      const depth = Math.random();
      const radius = (Math.random() * 25 + 5) * (0.5 + depth * 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      // Add subtle color variation
      colors[i3] = 1;
      colors[i3 + 1] = 1;
      colors[i3 + 2] = 1;
    }
    return { positions, colors };
  }, []);

  // Animate stars with parallax based on mouse and scroll
  useFrame((state, delta) => {
    if (ref.current) {
      // Smoother base rotation
      ref.current.rotation.x -= delta / 18;
      ref.current.rotation.y -= delta / 22;
      // Smoother parallax effect from mouse
      const targetRotationX = mousePosition.y * 0.0005;
      const targetRotationY = mousePosition.x * 0.0005;
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.025;
      ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.025;
      // Subtle movement based on scroll
      ref.current.position.z = Math.sin(scrollY * 0.001) * 0.5;
    }
  });

  // Parse theme color for subtle tinting
  const starColor = themeColor || '#ffffff';
  // Twinkle effect: animate opacity
  const [twinkle, setTwinkle] = useState(0.8);
  useEffect(() => {
    const interval = setInterval(() => {
      setTwinkle(0.7 + Math.random() * 0.3);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <Points ref={ref} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={starColor}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={twinkle}
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
