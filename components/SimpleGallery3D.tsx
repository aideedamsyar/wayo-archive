'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { Suspense } from 'react';

export default function SimpleGallery3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />

        <Suspense fallback={null}>
          {/* Simple test cubes instead of photos */}
          <Box position={[-2, 0, 0]} args={[1, 1, 1]}>
            <meshStandardMaterial color="red" />
          </Box>

          <Box position={[0, 0, 0]} args={[1, 1, 1]}>
            <meshStandardMaterial color="green" />
          </Box>

          <Box position={[2, 0, 0]} args={[1, 1, 1]}>
            <meshStandardMaterial color="blue" />
          </Box>
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  );
}