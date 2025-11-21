'use client';

import { useState, useRef, useEffect } from 'react';

interface Photo {
  id: string;
  color: string;
  placeName: string;
  city: string;
  country: string;
  description?: string;
  whySpecial?: string;
  authorName?: string | null;
  height?: number; // For varying heights
}

interface MasonryGalleryProps {
  photos: Photo[];
  selectedCountry?: string;
  onPhotoClick: (photo: Photo) => void;
}

export default function MasonryGallery({ photos, selectedCountry, onPhotoClick }: MasonryGalleryProps) {
  const [columns, setColumns] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter photos by country
  const filteredPhotos = selectedCountry && selectedCountry !== 'all'
    ? photos.filter(p => p.country.toLowerCase() === selectedCountry.toLowerCase())
    : photos;

  // Calculate columns based on screen width
  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width < 640) setColumns(2);
        else if (width < 1024) setColumns(3);
        else if (width < 1536) setColumns(4);
        else setColumns(5);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute photos across columns
  const getColumns = () => {
    const cols: Photo[][] = Array(columns).fill(null).map(() => []);

    filteredPhotos.forEach((photo, index) => {
      const columnIndex = index % columns;
      cols[columnIndex].push({
        ...photo,
        height: Math.random() * 200 + 150 // Random heights between 150-350px
      });
    });

    return cols;
  };

  const photoColumns = getColumns();

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto p-4 bg-white">
      <div className="flex gap-4 justify-center">
        {photoColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4 flex-1 max-w-[300px]">
            {column.map((photo) => (
              <div
                key={photo.id}
                className="relative cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
                onClick={() => onPhotoClick(photo)}
                style={{ height: `${photo.height}px` }}
              >
                {/* Photo placeholder with color */}
                <div
                  className="w-full h-full rounded-sm overflow-hidden relative group"
                  style={{ backgroundColor: photo.color }}
                >
                  {/* Hover overlay with info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h3 className="text-white font-semibold text-sm">{photo.placeName}</h3>
                    <p className="text-white/80 text-xs">{photo.city}</p>
                  </div>

                  {/* Centered place name (visible when no hover) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/90 font-medium text-center px-2">
                      {photo.placeName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
