'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import PhotoMeshLocal, { type ScreenPosition } from './PhotoMeshLocal';

THREE.Cache.enabled = true;

// Animated gallery group component
function AnimatedGalleryGroup({ children, isUserInteracting }: { children: React.ReactNode, isUserInteracting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || isUserInteracting) return;

    const time = state.clock.getElapsedTime();

    // Faster horizontal orbit for livelier motion
    groupRef.current.rotation.y = time * 0.12;

    // Gentle floating up and down
    groupRef.current.position.y = Math.sin(time * 0.3) * 0.5;

    // Slight breathing effect (scale pulsing)
    const breathe = 1 + Math.sin(time * 0.4) * 0.02;
    groupRef.current.scale.set(breathe, breathe, breathe);
  });

  return <group ref={groupRef}>{children}</group>;
}

interface Photo {
  id: string;
  url: string; // Real image URL from R2
  placeName: string;
  city: string;
  country: string;
  description?: string;
  whySpecial?: string;
  authorName?: string | null;
}

interface Gallery3DScatteredProps {
  photos: Photo[];
  selectedCountry?: string;
  onPhotoClick: (photo: Photo, screenPosition?: ScreenPosition) => void;
  activePhotoId?: string;
  onActivePhotoPositionChange?: (screenPosition: ScreenPosition) => void;
}

export default function Gallery3DScattered({
  photos,
  selectedCountry,
  onPhotoClick,
  activePhotoId,
  onActivePhotoPositionChange
}: Gallery3DScatteredProps) {
  const controlsRef = useRef<any>(null);
  const galleryGroupRef = useRef<THREE.Group>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [dispersionProgress, setDispersionProgress] = useState(0);
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  // Filter photos by country if selected
  const filteredPhotos = selectedCountry && selectedCountry !== 'all'
    ? photos.filter(p => p.country.toLowerCase() === selectedCountry.toLowerCase())
    : photos;

  // Play lift + spread animation when photos are ready
  useEffect(() => {
    if (filteredPhotos.length === 0) {
      setDispersionProgress(0);
      return;
    }

    let raf: number | null = null;
    const duration = 2200; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.max(0, Math.min(1, elapsed / duration));
      const eased = easeOutCubic(t);
      setDispersionProgress((prev) => (Math.abs(prev - eased) > 0.0005 ? eased : prev));

      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      }
    };

    setDispersionProgress(0);
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [filteredPhotos.length]);

  // Generate scattered positions - tighter spacing
  const getScatteredPosition = (index: number, total: number) => {
    // Deterministic narrow column with slight offsets (closer to FOAM stack)
    const seed = index * 1.618;
    const x = Math.sin(seed) * 6 + Math.cos(seed * 2.3) * 3.5; // slightly tighter horizontal orbit
    const columnLift = 9 + Math.max(0, total - 8) * 0.6; // lift column slightly
    const y = columnLift - index * 2.6 + Math.sin(seed * 0.9) * 0.8; // more separation to prevent overlap
    const z = Math.cos(seed * 1.4) * 4.2; // more depth separation

    return new THREE.Vector3(x, y, z);
  };

  // Very subtle tilt rotations (mostly upright with slight artistic tilt)
  const getScatteredRotation = (index: number) => {
    const seed = index * 1.7;
    // Most photos upright, some with very subtle ±2° tilt
    return new THREE.Euler(
      0, // No X tilt
      0, // No Y rotation (billboard handles this)
      THREE.MathUtils.degToRad((Math.sin(seed * 0.8) - 0.5) * 4)  // ±2° subtle tilt
    );
  };

  // Much smaller sizes for better overview
  const getScatteredScale = (index: number) => {
    const scales = [1.9, 2.7, 2.3, 3.3, 2.9, 3.6, 2.2, 3.0, 2.5, 3.3, 2.0, 3.1];
    return scales[index % scales.length];
  };

  return (
    <div className="w-full h-full relative bg-white">
      <Canvas
        className="w-full h-full"
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping
        }}
        dpr={[1, 1.4]}
        shadows
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 30]} // Slight top-down angle to keep stack centered in view
          fov={55}
          near={0.1}
          far={100}
        />

        {/* Lighting - soft gallery style */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={0.5}
          castShadow
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.3}
        />

        {/* White background */}
        <color attach="background" args={['#ffffff']} />

        <Suspense fallback={null}>
          {/* Animated gallery group with vortex effect */}
          <AnimatedGalleryGroup isUserInteracting={isUserInteracting}>
            {filteredPhotos.map((photo, index) => {
              const position = getScatteredPosition(index, filteredPhotos.length);
              const rotation = getScatteredRotation(index);
              const eased = dispersionProgress;
              const startYOffset = -8; // lift from just below view

              // Two-phase: lift (cluster rises) then spread (positions radiate)
              const liftProgress = Math.min(1, eased / 0.35); // first ~35% timeline
              const spreadProgress = eased <= 0.1 ? 0 : Math.min(1, (eased - 0.1) / 0.9);

              const origin = new THREE.Vector3(0, startYOffset, 0);
              const lifted = origin.clone().lerp(new THREE.Vector3(0, position.y, 0), liftProgress);

              const positionInterpolated = new THREE.Vector3(
                position.x * spreadProgress,
                lifted.y,
                position.z * spreadProgress
              );

              const scaleBase = getScatteredScale(index);
              const scale = scaleBase * (0.35 + 0.65 * Math.max(liftProgress, spreadProgress));

              return (
                <PhotoMeshLocal
                  key={photo.id}
                  photo={photo}
                  position={positionInterpolated}
                  rotation={rotation} // Tilt rotation applied AFTER billboard
                  scale={scale}
                  onClick={(screenPos) => onPhotoClick(photo, screenPos)}
                  isActive={photo.id === activePhotoId}
                  onScreenPositionChange={(screenPos) => {
                    if (photo.id === activePhotoId && onActivePhotoPositionChange) {
                      onActivePhotoPositionChange(screenPos);
                    }
                  }}
                  animated={false} // No floating, static like gallery
                />
              );
            })}
          </AnimatedGalleryGroup>
        </Suspense>

        {/* Orbit controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={40}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
          autoRotate={false} // No auto rotation for gallery feel
          onStart={() => setIsUserInteracting(true)}
          onEnd={() => setIsUserInteracting(false)}
        />
      </Canvas>
    </div>
  );
}
