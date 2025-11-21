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

interface Gallery3DGridProps {
  photos: Photo[];
  selectedCountry?: string;
  onPhotoClick: (photo: Photo, screenPosition?: ScreenPosition) => void;
}

export default function Gallery3DGrid({ photos, selectedCountry, onPhotoClick }: Gallery3DGridProps) {
  const controlsRef = useRef<any>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Filter photos by country if selected
  const filteredPhotos = selectedCountry && selectedCountry !== 'all'
    ? photos.filter(p => p.country.toLowerCase() === selectedCountry.toLowerCase())
    : photos;

  // Generate grid-like positions with depth variation (like standing cards)
  const getGridPosition = (index: number, total: number) => {
    // Create a grid layout with depth
    const columns = 4;
    const col = index % columns;
    const row = Math.floor(index / columns);

    // Spacing between photos
    const xSpacing = 6;
    const zSpacing = 8;

    // Center the grid
    const xOffset = -(columns - 1) * xSpacing / 2;
    const zOffset = -row * zSpacing;

    // Add slight randomness for organic feel
    const randomX = (Math.random() - 0.5) * 1.5;
    const randomZ = (Math.random() - 0.5) * 2;
    const randomY = Math.random() * 1 - 0.5; // Slight vertical variation

    return new THREE.Vector3(
      col * xSpacing + xOffset + randomX,
      randomY, // Keep photos mostly at same height level
      zOffset + randomZ
    );
  };

  // Slight rotation variation for more natural look
  const getGridRotation = (index: number) => {
    return new THREE.Euler(
      0, // No tilt forward/back
      (Math.random() - 0.5) * 0.15, // Slight Y rotation variation
      0  // No Z rotation (keep upright)
    );
  };

  // Varying sizes like in the reference
  const getGridScale = (index: number) => {
    const scales = [4, 5, 3.5, 4.5, 6, 4, 5.5, 3, 4.5];
    return scales[index % scales.length] + Math.random() * 0.5;
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
        shadows
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 2, 15]}
          fov={50}
          near={0.1}
          far={100}
        />

        {/* Lighting - gallery style */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-5, 8, -5]}
          intensity={0.3}
        />

        {/* White background */}
        <color attach="background" args={['#ffffff']} />

        <Suspense fallback={null}>
          {/* Photo grid */}
          <group position={[0, 0, -5]}>
            {filteredPhotos.map((photo, index) => {
              const position = getGridPosition(index, filteredPhotos.length);
              const rotation = getGridRotation(index);
              const scale = getGridScale(index);

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
                  animated={false} // No floating for gallery feel
                />
              );
            })}
          </group>

          {/* Floor plane (invisible but receives shadows) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.1} />
          </mesh>
        </Suspense>

        {/* Orbit controls for drag-to-rotate */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 + 0.1} // Prevent going below floor
          minPolarAngle={0.2} // Prevent going too high
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
          autoRotate={!isUserInteracting}
          autoRotateSpeed={0.3}
          target={[0, 0, -5]}
          onStart={() => setIsUserInteracting(true)}
          onEnd={() => setTimeout(() => setIsUserInteracting(false), 3000)}
        />
      </Canvas>
    </div>
  );
}
