'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScreenPosition } from './PhotoMeshLocal';

interface Photo {
  id: string;
  url: string; // Real image URL
  placeName: string;
  city: string;
  country: string;
  description?: string;
  whySpecial?: string;
  authorName?: string | null;
}

interface PhotoLightboxProps {
  photo: Photo | null;
  onClose: () => void;
  clickPosition?: ScreenPosition;
  activeFramePosition?: ScreenPosition;
}

const DRAWER_DURATION = 650;
const DRAWER_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const BACKDROP_EASE = 'cubic-bezier(0.4, 0.0, 0.2, 1)';

const buildImageUrl = (src: string) => {
  if (!src) return '';
  const hasQuery = src.includes('?');
  const params = 'width=1200&quality=80&format=auto&fit=cover';
  return hasQuery ? `${src}&${params}` : `${src}?${params}`;
};

export default function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const storyDelayRef = useRef<number | null>(null);
  const contentDelayRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const handleClose = useCallback(() => {
    if (!photo || isClosing) return;
    if (storyDelayRef.current) {
      clearTimeout(storyDelayRef.current);
      storyDelayRef.current = null;
    }
    if (contentDelayRef.current) {
      clearTimeout(contentDelayRef.current);
      contentDelayRef.current = null;
    }
    setIsClosing(true);
    setStoryVisible(false);
    setContentVisible(false);
    setDrawerVisible(false);

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, DRAWER_DURATION + 120);
  }, [isClosing, onClose, photo]);

  useEffect(() => {
    if (!photo) return;

    setIsClosing(false);
    setDrawerVisible(false);
    setContentVisible(false);
    setStoryVisible(false);

    rafRef.current = requestAnimationFrame(() => {
      setDrawerVisible(true);
      contentDelayRef.current = window.setTimeout(() => setContentVisible(true), 140);
      storyDelayRef.current = window.setTimeout(() => setStoryVisible(true), 260);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (storyDelayRef.current) {
        clearTimeout(storyDelayRef.current);
        storyDelayRef.current = null;
      }
      if (contentDelayRef.current) {
        clearTimeout(contentDelayRef.current);
        contentDelayRef.current = null;
      }
    };
  }, [photo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };

    if (photo) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [photo, handleClose]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    };
  }, []);

  if (!photo) return null;

  const story = photo.whySpecial || photo.description;
  const imageUrl = buildImageUrl(photo.url);
  const displayName = (photo.authorName || '').trim() || 'Name hidden';

  return (
    <div className="fixed inset-0 z-50" onClick={handleClose}>
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        style={{
          opacity: drawerVisible && !isClosing ? 1 : 0,
          transition: `opacity ${DRAWER_DURATION}ms ${BACKDROP_EASE}`
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 35% 20%, rgba(255,255,255,0.08), transparent 24%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04), transparent 30%)',
          opacity: drawerVisible && !isClosing ? 1 : 0,
          transition: `opacity ${DRAWER_DURATION}ms ${BACKDROP_EASE}`
        }}
      />

      <div className="absolute inset-0 flex justify-center items-end pointer-events-none px-0 pb-0">
        <div
          className="relative w-full h-[75vh] pointer-events-auto shadow-[0_40px_140px_rgba(0,0,0,0.65)] overflow-hidden"
          style={{
            transform: drawerVisible && !isClosing ? 'translateY(0)' : 'translateY(105%)',
            opacity: drawerVisible && !isClosing ? 1 : 0,
            transition: `transform ${DRAWER_DURATION}ms ${DRAWER_EASE}, opacity ${DRAWER_DURATION}ms ${DRAWER_EASE}`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0d] via-[#070708] to-[#0b0b0c]" />
          <div className="absolute inset-0 opacity-70 mix-blend-screen" style={{ background: 'radial-gradient(circle at 25% 0%, rgba(255,255,255,0.09), transparent 42%)' }} />
          <div className="relative h-full overflow-y-auto px-6 sm:px-8 md:px-12 py-10 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div
                className="text-[11px] uppercase tracking-[0.32em] text-white/65"
                style={{ fontFamily: 'var(--font-jost)', letterSpacing: '0.32em' }}
              >
                {displayName}
              </div>
              <button
                onClick={handleClose}
                className="text-white/85 hover:text-white transition-colors duration-300 border border-white px-2 py-1"
                aria-label="Close drawer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div
              className="space-y-6 max-w-[220px] text-left mr-auto"
              style={{
                transform: storyVisible ? 'translateX(0)' : 'translateX(-18px)',
                opacity: storyVisible ? 1 : 0,
                transition: `transform 520ms ${DRAWER_EASE}, opacity 520ms ${DRAWER_EASE}`
              }}
            >
              {story ? (
                <p
                  className="font-pt-serif text-white/92"
                  style={{ fontSize: '1.4rem', lineHeight: 1.45, textAlign: 'left' }}
                >
                  {story}
                </p>
              ) : (
                <p
                  className="text-white/70"
                  style={{ fontFamily: 'var(--font-jost)' }}
                >
                  The story for this place will appear here.
                </p>
              )}
            </div>

            <div
              className="space-y-4 w-full max-w-[760px] mx-auto"
              style={{
                transform: contentVisible ? 'translateX(0)' : 'translateX(14px)',
                opacity: contentVisible ? 1 : 0,
                transition: `transform 480ms ${DRAWER_EASE}, opacity 480ms ${DRAWER_EASE}`
              }}
            >
              <div className="relative w-full overflow-hidden rounded-none bg-[#0a0a0b] border border-white/6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
                <div className="aspect-[3/4] md:aspect-[4/5]" />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={photo.placeName}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      filter: drawerVisible ? 'saturate(1.02)' : 'saturate(0.9)',
                      transform: drawerVisible ? 'scale(1)' : 'scale(1.02)',
                      transition: `transform 620ms ${DRAWER_EASE}, filter 620ms ${DRAWER_EASE}`
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/32 via-transparent to-white/6" />
              </div>

              <div className="text-white/90 text-center" style={{ fontFamily: 'var(--font-jost)' }}>
                <div className="text-xl tracking-[0.08em] leading-tight text-center">
                  {photo.placeName}
                </div>
                <div className="text-base text-white/65 mt-2 tracking-[0.05em] text-center">
                  ({photo.city}, {photo.country})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
