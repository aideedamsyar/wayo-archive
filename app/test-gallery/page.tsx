'use client';

import SimpleGallery3D from '@/components/SimpleGallery3D';

export default function TestGalleryPage() {
  return (
    <div className="w-full h-screen bg-white">
      <h1 className="absolute top-4 left-4 text-2xl z-10">Simple 3D Gallery Test</h1>
      <SimpleGallery3D />
    </div>
  );
}