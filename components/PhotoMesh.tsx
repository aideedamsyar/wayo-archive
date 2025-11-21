'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface PhotoMeshProps {
  photo: {
    id: string;
    url: string;
    placeName: string;
    city: string;
    country: string;
  };
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  onClick: () => void;
  animated?: boolean;
}

export default function PhotoMesh({
  photo,
  position,
  rotation,
  scale,
  onClick,
  animated = true
}: PhotoMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);

  // Load texture with CORS enabled
  const texture = useLoader(TextureLoader, photo.url, (loader) => {
    loader.crossOrigin = 'anonymous';
  });

  useEffect(() => {
    if (texture) {
      setLoaded(true);
    }
  }, [texture]);

  // Animate scale changes
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth scale animation for hover
    const targetScale = hovered ? 1.1 : 1;
    setCurrentScale(prev => {
      const diff = targetScale - prev;
      return prev + diff * 0.1;
    });

    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale);
    }

    // Floating animation
    if (animated) {
      const time = state.clock.getElapsedTime();

      // Gentle floating motion
      meshRef.current.position.y = position.y + Math.sin(time * 0.3 + position.x) * 0.2;

      // Subtle rotation
      if (!hovered) {
        meshRef.current.rotation.y = rotation.y + Math.sin(time * 0.2 + position.z) * 0.05;
      }
    }
  });

  // Calculate aspect ratio for proper photo display
  const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
  const width = scale * aspectRatio;
  const height = scale;

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Photo plane */}
        <planeGeometry args={[width, height]} />

        {/* Material with texture */}
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent
          opacity={loaded ? 1 : 0}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Frame border (white border around photo) */}
      <mesh position={[position.x, position.y, position.z - 0.01]} rotation={rotation}>
        <planeGeometry args={[width + 0.2, height + 0.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Shadow plane underneath when hovered */}
      {hovered && (
        <mesh
          position={[position.x, position.y - height / 2 - 0.5, position.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[width * 0.8, width * 0.8]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
}