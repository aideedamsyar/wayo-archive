'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import PhotoMesh from './PhotoMesh';

interface Photo {
  id: string;
  url: string;
  placeName: string;
  city: string;
  country: string;
  description?: string;
  whySpecial?: string;
  authorName?: string | null;
}

interface Gallery3DProps {
  photos: Photo[];
  selectedCountry?: string;
  onPhotoClick: (photo: Photo) => void;
}

export default function Gallery3D({ photos, selectedCountry, onPhotoClick }: Gallery3DProps) {
  const controlsRef = useRef<any>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Filter photos by country if selected
  const filteredPhotos = selectedCountry && selectedCountry !== 'all'
    ? photos.filter(p => p.country.toLowerCase() === selectedCountry.toLowerCase())
    : photos;

  // Pre-compute random values for consistent rendering
  // eslint-disable-next-line react-hooks/purity
  const randomValues = useMemo(() => {
    return photos.map(() => ({
      yOffset: (Math.random() - 0.5) * 5,
      rotation: {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.1,
      },
      scale: Math.random(),
    }));
  }, [photos]);

  // Generate random positions for photos
  const getRandomPosition = (index: number, total: number) => {
    const seed = index * 137.5; // Use golden angle for better distribution
    const radius = 15 + (index % 3) * 10; // Vary radius for depth
    const theta = (seed % 360) * (Math.PI / 180);
    const phi = ((index / total) * 180 - 90) * (Math.PI / 180);

    return new THREE.Vector3(
      radius * Math.cos(phi) * Math.cos(theta),
      radius * Math.sin(phi) + randomValues[index].yOffset,
      radius * Math.cos(phi) * Math.sin(theta)
    );
  };

  // Generate random rotation for natural scattered look
  const getRandomRotation = (index: number) => {
    const values = randomValues[index].rotation;
    return new THREE.Euler(values.x, values.y, values.z);
  };

  // Generate size variation
  const getRandomScale = (index: number) => {
    const baseScale = 3 + (index % 3) * 1.5; // Sizes between 3 and 6
    return baseScale + randomValues[index].scale;
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
          position={[0, 0, 30]}
          fov={50}
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
                <PhotoMesh
                  key={photo.id}
                  photo={photo}
                  position={position}
                  rotation={rotation}
                  scale={scale}
                  onClick={() => onPhotoClick(photo)}
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
          minDistance={15}
          maxDistance={50}
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
