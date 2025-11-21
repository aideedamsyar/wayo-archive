'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import * as THREE from 'three';
import PhotoMeshLocal, { type ScreenPosition } from './PhotoMeshLocal';

interface Photo {
  id: string;
  url?: string;
  color?: string;
  placeName: string;
  city: string;
  country: string;
  description?: string;
  whySpecial?: string;
  authorName?: string | null;
}

interface Gallery3DLocalProps {
  photos: Photo[];
  selectedCountry?: string;
  onPhotoClick: (photo: Photo, screenPosition?: ScreenPosition) => void;
}

export default function Gallery3DLocal({ photos, selectedCountry, onPhotoClick }: Gallery3DLocalProps) {
  const controlsRef = useRef<any>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Filter photos by country if selected
  const filteredPhotos = selectedCountry && selectedCountry !== 'all'
    ? photos.filter(p => p.country.toLowerCase() === selectedCountry.toLowerCase())
    : photos;

  // Generate random positions for photos - better 3D distribution
  const getRandomPosition = (index: number, total: number) => {
    // Use golden ratio for better distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    // Create a 3D sphere-like distribution
    const angle = index * angleIncrement;

    // Vary the radius to create depth layers
    const radiusVariation = [10, 14, 18, 12, 16][index % 5];

    // Much more vertical distribution
    const verticalSpread = 12;
    const y = (Math.random() - 0.5) * verticalSpread + Math.sin(index * 0.5) * 3;

    // Position in a sphere-like pattern
    const x = Math.cos(angle) * radiusVariation + (Math.random() - 0.5) * 4;
    const z = Math.sin(angle) * radiusVariation + (Math.random() - 0.5) * 4;

    return new THREE.Vector3(x, y, z);
  };

  // Generate random rotation for natural scattered look
  const getRandomRotation = (index: number) => {
    return new THREE.Euler(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.1
    );
  };

  // Generate size variation - make them a bit bigger
  const getRandomScale = (index: number) => {
    const baseScale = 4 + (index % 3) * 1.5; // Sizes between 4 and 7
    return baseScale + Math.random() * 0.5;
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full"
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping
        }}
        shadows
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 20]}
          fov={60}
          near={0.1}
          far={100}
        />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
        />
        <pointLight position={[-10, -10, -5]} intensity={0.4} />

        {/* Fog for depth */}
        <fog attach="fog" args={['#ffffff', 30, 80]} />

        <Suspense fallback={null}>
          {/* Photo meshes */}
          <group>
            {filteredPhotos.map((photo, index) => {
              const position = getRandomPosition(index, filteredPhotos.length);
              const rotation = getRandomRotation(index);
              const scale = getRandomScale(index);

              return (
                <PhotoMeshLocal
                  key={photo.id}
                  photo={{
                    id: photo.id,
                    url: photo.url || '',
                    placeName: photo.placeName,
                    city: photo.city,
                    country: photo.country,
                  }}
                  position={position}
                  rotation={rotation}
                  scale={scale}
                  onClick={(screenPosition) => onPhotoClick(photo, screenPosition)}
                  animated={!isUserInteracting}
                />
              );
            })}
          </group>
        </Suspense>

        {/* Orbit controls for drag-to-rotate */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={10}
          maxDistance={35}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          autoRotate={!isUserInteracting}
          autoRotateSpeed={0.5}
          onStart={() => setIsUserInteracting(true)}
          onEnd={() => setTimeout(() => setIsUserInteracting(false), 2000)}
        />
      </Canvas>

      {/* Loading indicator */}
      {filteredPhotos.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-gray-500">No photos to display</div>
        </div>
      )}
    </div>
  );
}
