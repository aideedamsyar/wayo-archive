'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ImagePresets } from '@/lib/cloudflare-images';

export interface ScreenPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface PhotoMeshLocalProps {
  photo: {
    id: string;
    url: string; // Real image URL from R2
    placeName: string;
    city: string;
    country: string;
  };
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  onClick: (screenPosition: ScreenPosition) => void;
  animated?: boolean;
  isActive?: boolean;
  onScreenPositionChange?: (screenPosition: ScreenPosition) => void;
  onReady?: () => void;
}

export default function PhotoMeshLocal({
  photo,
  position,
  rotation,
  scale,
  onClick,
  animated = true,
  isActive = false,
  onScreenPositionChange,
  onReady
}: PhotoMeshLocalProps) {
  const DEFAULT_ASPECT = 1.5; // Same as the placeholder cards
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT);
  const placeholderTexture = useMemo(() => {
    const data = new Uint8Array([225, 225, 225, 255]); // light gray
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);
  const [texture, setTexture] = useState<THREE.Texture | null>(placeholderTexture);
  const { camera, size } = useThree(); // Get camera and viewport size
  const lastReportRef = useRef(0);
  const notifiedReadyRef = useRef(false);

  // Load a small gallery-only thumbnail; no raw fallback to avoid huge decodes
  const imageUrl = ImagePresets.galleryThumbnail(photo.url);
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    // reset to placeholder when URL changes
    setTexture(placeholderTexture);
    setAspectRatio(DEFAULT_ASPECT);
    notifiedReadyRef.current = false;

    const promoteTexture = (source: HTMLImageElement) => {
      if (!isMounted) return;
      const tex = new THREE.Texture(source);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);

      const naturalWidth = source.naturalWidth || source.width;
      const naturalHeight = source.naturalHeight || source.height;
      if (naturalWidth && naturalHeight) {
        const ratio = naturalWidth / naturalHeight;
        if (Number.isFinite(ratio) && ratio > 0.01) {
          setAspectRatio(ratio);
        }
      }

      if (!notifiedReadyRef.current) {
        notifiedReadyRef.current = true;
        onReady?.();
      }
    };

    img.onload = async () => {
      // defer decode to avoid blocking main thread
      try {
        if (img.decode) {
          await img.decode();
        }
      } catch (err) {
        // ignore decode errors; we'll still promote
      }
      promoteTexture(img);
    };

    img.onerror = () => {
      if (!isMounted) return;
      if (!notifiedReadyRef.current) {
        notifiedReadyRef.current = true;
        onReady?.();
      }
    };

    img.src = imageUrl;

    return () => {
      isMounted = false;
    };
  }, [imageUrl, onReady, placeholderTexture]);

  // Ensure material updates when texture arrives
  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
    }
  }, [texture]);

  // Store the custom tilt (persistent across renders)
  const tiltRef = useRef(rotation.z); // Use the Z rotation from parent as tilt

  // Animate scale changes and billboard effect
  useFrame((state) => {
    if (!groupRef.current) return;

    // 1. Billboard effect - make photos face camera
    groupRef.current.lookAt(state.camera.position);

    // 2. Apply tilt AFTER billboard (this is what FOAM does)
    groupRef.current.rotateZ(tiltRef.current);

    // Smooth scale animation for hover
    const targetScale = hovered ? 1.05 : 1; // Subtle scale on hover
    setCurrentScale(prev => {
      const diff = targetScale - prev;
      return prev + diff * 0.1;
    });

    groupRef.current.scale.setScalar(currentScale);

    if (isActive && onScreenPositionChange) {
      const elapsed = state.clock.getElapsedTime();
      if (elapsed - lastReportRef.current > 0.08) {
        const screenData = computeScreenPosition();
        if (screenData) {
          lastReportRef.current = elapsed;
          onScreenPositionChange(screenData);
        }
      }
    }
  });

  // Keep visible area consistent while respecting the real aspect ratio
  const targetArea = DEFAULT_ASPECT * scale * scale;
  const height = Math.sqrt(targetArea / aspectRatio);
  const width = height * aspectRatio;

  const computeScreenPosition = (): ScreenPosition | null => {
    if (!groupRef.current) return null;

    groupRef.current.updateWorldMatrix(true, false);
    const worldPosition = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPosition);

    const screenPosition = worldPosition.project(camera);
    const x = (screenPosition.x * 0.5 + 0.5) * size.width;
    const y = (-(screenPosition.y * 0.5) + 0.5) * size.height;

    const localCorners = [
      new THREE.Vector3(-width / 2, -height / 2, 0),
      new THREE.Vector3(width / 2, -height / 2, 0),
      new THREE.Vector3(width / 2, height / 2, 0),
      new THREE.Vector3(-width / 2, height / 2, 0)
    ];

    const screenCorners = localCorners.map((corner) => {
      const worldCorner = corner.clone().applyMatrix4(groupRef.current!.matrixWorld);
      const projected = worldCorner.project(camera);
      return {
        x: (projected.x * 0.5 + 0.5) * size.width,
        y: (-(projected.y * 0.5) + 0.5) * size.height
      };
    });

    const xs = screenCorners.map((corner) => corner.x);
    const ys = screenCorners.map((corner) => corner.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const widthPx = maxX - minX;
    const heightPx = maxY - minY;

    const topEdge = {
      x: screenCorners[1].x - screenCorners[0].x,
      y: screenCorners[1].y - screenCorners[0].y
    };
    const rotation = Math.atan2(topEdge.y, topEdge.x);

    return {
      x,
      y,
      width: widthPx,
      height: heightPx,
      rotation
    };
  };

  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();

          const screenData = computeScreenPosition();
          if (screenData) {
            onClick(screenData);
          }
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
        {/* Photo plane with real image texture */}
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture || null}
          side={THREE.DoubleSide}
          toneMapped={false}
          color={texture ? undefined : '#dcdcdc'}
        />
      </mesh>
    </group>
  );
}
