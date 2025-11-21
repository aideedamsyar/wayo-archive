'use client';

import { useState, useEffect, useRef } from 'react';
import Gallery3DScattered from '@/components/Gallery3DScattered';
import PhotoLightbox from '@/components/PhotoLightbox';
import PlaceSubmissionForm from '@/components/PlaceSubmissionForm';
import { TextAnimate } from '@/components/TextAnimate';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

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

interface ScreenPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [clickPosition, setClickPosition] = useState<ScreenPosition | undefined>();
  const [activeFramePosition, setActiveFramePosition] = useState<ScreenPosition | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoActive, setInfoActive] = useState(false);
  const [infoTab, setInfoTab] = useState<'intro' | 'cities'>('intro');
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [citiesFetched, setCitiesFetched] = useState(false);
  const [citiesReveal, setCitiesReveal] = useState(false);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[] | null>(null);
  const [filteredCity, setFilteredCity] = useState<string | null>(null);
  const [filteredLoading, setFilteredLoading] = useState(false);
  const [filteredError, setFilteredError] = useState<string | null>(null);
  const [filterFetchTick, setFilterFetchTick] = useState(0);
  const infoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch real photos from Supabase on mount
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery-photos');
      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        setPhotos(data.photos);
      } else {
        console.warn('No photos returned from API');
      }
    } catch (error) {
      console.error('Error fetching gallery photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (showInfo && !citiesFetched && !citiesLoading && !citiesError) {
      const fetchCities = async () => {
        try {
          setCitiesLoading(true);
          setCitiesError(null);
          const response = await fetch('/api/cities');
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch cities');
          }

          setCities(data.cities || []);
          setCitiesFetched(true);
          requestAnimationFrame(() => setCitiesReveal(true));
        } catch (error) {
          setCitiesError((error as Error)?.message || 'Failed to fetch cities');
        } finally {
          setCitiesLoading(false);
        }
      };

      fetchCities();
    }
  }, [showInfo, citiesFetched, citiesLoading, citiesError]);

  const getFallbackScreenPosition = () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    width: window.innerWidth * 0.2,
    height: (window.innerWidth * 0.2) / 1.5,
    rotation: 0
  });

  const handlePhotoClick = (photo: Photo, screenPosition?: ScreenPosition) => {
    const initialPosition = screenPosition ?? getFallbackScreenPosition();
    setClickPosition(initialPosition);
    setActiveFramePosition(initialPosition);
    setSelectedPhoto(photo);

    // Track photo click
    if (window.gtag) {
      window.gtag('event', 'photo_click', {
        photo_id: photo.id,
        city: photo.city,
        country: photo.country
      });
    }
  };

  const handleActiveFrameUpdate = (screenPosition: ScreenPosition) => {
    setActiveFramePosition((prev) => {
      if (!prev) return screenPosition;
      const delta =
        Math.abs(prev.x - screenPosition.x) +
        Math.abs(prev.y - screenPosition.y) +
        Math.abs(prev.width - screenPosition.width) +
        Math.abs(prev.height - screenPosition.height) +
        Math.abs(prev.rotation - screenPosition.rotation);

      return delta < 0.5 ? prev : screenPosition;
    });
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
    setClickPosition(undefined);
    setActiveFramePosition(undefined);
  };

  const openInfo = () => {
    setShowInfo(true);
    requestAnimationFrame(() => setInfoActive(true));
    // Track info drawer open
    if (window.gtag) {
      window.gtag('event', 'info_open', {
        content_type: 'about_wayo'
      });
    }
  };

  const closeInfo = () => {
    setInfoActive(false);
    if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
    infoTimerRef.current = setTimeout(() => setShowInfo(false), 600);
  };

  const handleCitySelect = (city: string) => {
    setFilterCity(city.trim());
    setFilteredError(null);
    setFilterFetchTick((t) => t + 1);
    closeInfo();
    // Track city filter
    if (window.gtag) {
      window.gtag('event', 'city_filter', {
        city: city.trim()
      });
    }
  };

  const retryCitiesFetch = () => {
    setCitiesError(null);
    setCitiesFetched(false);
    setCitiesReveal(false);
  };

  useEffect(() => {
    if (!filterCity) {
      setFilteredPhotos(null);
      setFilteredCity(null);
      setFilteredLoading(false);
      setFilteredError(null);
      return;
    }

    const targetCity = filterCity.trim();
    setFilteredLoading(true);
    setFilteredError(null);
    setFilteredPhotos(null);

    const fetchFiltered = async () => {
      try {
        const response = await fetch(`/api/gallery-photos?city=${encodeURIComponent(targetCity)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch filtered photos');
        }

        // Ignore if city changed mid-flight
        if (filterCity !== targetCity) return;

        setFilteredPhotos(data.photos || []);
        setFilteredCity(targetCity);
      } catch (error) {
        if (filterCity !== targetCity) return;
        setFilteredError((error as Error)?.message || 'Failed to fetch filtered photos');
      } finally {
        if (filterCity === targetCity) {
          setFilteredLoading(false);
        }
      }
    };

    fetchFiltered();
  }, [filterCity, filterFetchTick]);

  const retryFilteredFetch = () => {
    if (filterCity) {
      setFilteredError(null);
      setFilteredPhotos(null);
      setFilteredLoading(false);
      setFilteredCity(null);
      setFilterFetchTick((t) => t + 1);
    }
  };

  const displayedPhotos = filterCity ? filteredPhotos || [] : photos;

  useEffect(() => {
    return () => {
      if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
    };
  }, []);

  return (
    <main className="relative w-full h-screen bg-white overflow-hidden">
      {/* Gallery Section - slides up when form is shown */}
      <div
        className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
          showForm ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20 px-8 pt-4 pb-5 flex justify-between items-center">
          <div className="h-14 md:h-16 min-w-[130px] overflow-hidden flex items-center">
            <img
              src="https://assets.withwayo.com/gallery/1763628951379-xdork-wayo-07.png"
              alt="Wayo"
              className="h-[170%] md:h-[180%] w-auto translate-y-0 object-contain"
            />
          </div>
          <button
            onClick={openInfo}
            aria-label="About Wayo"
            className="text-black hover:text-gray-600 transition-colors border border-black px-2 py-1 flex items-center justify-center"
          >
            <span className="text-lg font-medium leading-none">i</span>
          </button>
        </header>

        {/* 3D Scattered Gallery */}
        <div className="w-full h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-600 text-xl font-light tracking-wide uppercase tracking-[0.3em]">
                Preparing the archive…
              </div>
            </div>
          ) : filterCity && filteredLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-600 text-xl font-light tracking-wide uppercase tracking-[0.3em]">
                Loading {filterCity}…
              </div>
            </div>
          ) : filterCity && filteredError ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="text-gray-500 text-lg font-medium">Could not load {filterCity} just now.</div>
              <button
                onClick={retryFilteredFetch}
                className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors"
              >
                Retry
              </button>
            </div>
          ) : displayedPhotos.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 text-2xl font-light tracking-wide">
                {filterCity ? `No photos yet for ${filterCity}` : 'No photos to display yet'}
              </div>
            </div>
          ) : (
            <Gallery3DScattered
              photos={displayedPhotos}
              onPhotoClick={handlePhotoClick}
              activePhotoId={selectedPhoto?.id ?? undefined}
              onActivePhotoPositionChange={handleActiveFrameUpdate}
            />
          )}
        </div>

        {/* CTA Section - Clean and Professional */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 pb-8 md:pb-16 bg-gradient-to-t from-white via-white/95 to-transparent">
          <div className="max-w-md mx-auto text-center space-y-6">
            {/* Title */}
            <TextAnimate
              animation="blurIn"
              as="h1"
              className="text-4xl md:text-5xl font-bold tracking-wider text-black"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 700, lineHeight: '0.95' }}
            >
              {`Wayo
Archive
Project`}
            </TextAnimate>

            {/* Button */}
            <button
              onClick={() => {
                setShowForm(true);
                // Track CTA click
                if (window.gtag) {
                  window.gtag('event', 'cta_click', {
                    button_text: 'dont_click_here',
                    action: 'open_submission_form'
                  });
                }
              }}
              className="w-full max-w-sm mx-auto bg-black text-white py-5 px-8 rounded-full text-xl font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ letterSpacing: '0' }}
            >
              Don&apos;t Click Here
            </button>
          </div>
        </div>
      </div>

      {/* Form Section - revealed when gallery slides up */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          showForm ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <PlaceSubmissionForm
          onClose={() => setShowForm(false)}
          onSubmitSuccess={fetchPhotos}
        />
      </div>

      {filterCity && !showForm && (
        <div className="pointer-events-none absolute top-16 left-0 right-0 z-30 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-3 bg-black text-white px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-semibold tracking-wide">{filterCity}</span>
            <button
              onClick={() => setFilterCity(null)}
              className="h-7 w-7 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              aria-label="Clear city filter"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Cinematic Lightbox */}
      <PhotoLightbox
        photo={selectedPhoto}
        onClose={handleCloseLightbox}
        clickPosition={clickPosition}
        activeFramePosition={activeFramePosition}
      />

      {/* Info Drawer (bottom sheet, full width, no dim) */}
      {showInfo && (
        <div className="fixed inset-0 pointer-events-none z-50" role="dialog" aria-modal="true">
          <div className="relative w-full h-full">
            <button
              aria-label="Close info"
              onClick={closeInfo}
              className="pointer-events-auto absolute inset-0 bg-transparent"
            />
            <div
              className="pointer-events-auto absolute bottom-0 left-0 right-0 h-[72vh] bg-black text-white border-t border-white/10 shadow-[0_-20px_80px_rgba(0,0,0,0.45)] flex flex-col z-10"
              style={{
                transform: infoActive ? 'translateY(0%)' : 'translateY(100%)',
                transition: `transform ${infoActive ? 900 : 550}ms ${
                  infoActive ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : 'cubic-bezier(0.55, 0.03, 0.67, 0.17)'
                }`,
                willChange: 'transform'
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-3">
                  <div className="text-xl tracking-[0.2em] uppercase">wayo archive</div>
                  <button
                    onClick={closeInfo}
                    className="h-10 w-10 flex items-center justify-center border border-white/40 text-white hover:bg-white hover:text-black transition-colors"
                    aria-label="Close info"
                  >
                    ✕
                  </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pb-3 flex gap-3">
                  {(['intro', 'cities'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setInfoTab(tab);
                        if (tab === 'cities') {
                          setCitiesReveal(false);
                          requestAnimationFrame(() => setCitiesReveal(true));
                        }
                      }}
                      className={`px-4 py-2 border text-sm uppercase tracking-[0.18em] transition-colors ${
                        infoTab === tab ? 'border-white text-white' : 'border-white/30 text-white/70 hover:text-white'
                      }`}
                    >
                      {tab === 'intro' ? 'Intro' : 'Cities'}
                    </button>
                  ))}
                </div>

                {/* Body */}
                <div
                  className="px-6 pb-8 space-y-4 flex-1 overflow-y-auto"
                  style={{ fontFamily: 'var(--font-jost)', lineHeight: '1.05' }}
                >
                  {infoTab === 'intro' ? (
                    <>
                      <p
                        className="text-4xl font-semibold text-white/95"
                        style={{ lineHeight: '1.05', fontSize: 'clamp(28px, 6vw, 34px)' }}
                      >
                        Welcome to the Wayo Archive — a digital exhibition of meaningful places shared by people who love them.
                      </p>
                      <p
                        className="text-3xl font-semibold text-white/90"
                        style={{ lineHeight: '1.05', fontSize: 'clamp(24px, 5vw, 30px)' }}
                      >
                        Every card in the gallery is a real submission answering two questions:
                        where they&apos;d take a friend, and why it matters. Tap a photo to read the story in full.
                      </p>
                      <p
                        className="text-3xl font-semibold text-white/85"
                        style={{ lineHeight: '1.05', fontSize: 'clamp(24px, 5vw, 30px)' }}
                      >
                        We&apos;re curating an intimate collection of places that feel personal, authentic, and worth discovering.
                        Explore the gallery or share your own hidden gem to add to the archive.
                      </p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {citiesLoading ? (
                        <div className="text-white/70 text-sm">Loading cities…</div>
                      ) : citiesError ? (
                        <div className="flex flex-col gap-2 text-sm text-red-200">
                          <span>Couldn&apos;t load cities.</span>
                          <button
                            onClick={retryCitiesFetch}
                            className="self-start px-3 py-1 border border-white/30 text-white/90 hover:text-white hover:border-white transition-colors"
                          >
                            Retry
                          </button>
                        </div>
                      ) : cities.length === 0 ? (
                        <div className="text-white/70 text-sm">No cities yet — submit a place to start the list.</div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {cities.map((city) => (
                            <button
                              key={city}
                              onClick={() => handleCitySelect(city)}
                              className="w-full border border-white/30 text-white/90 hover:text-white hover:border-white px-3 py-2 text-sm font-semibold tracking-[0.05em] text-left transition-colors"
                              style={{
                                opacity: citiesReveal ? 1 : 0,
                                transform: citiesReveal ? 'translateY(0px)' : 'translateY(26px)',
                                transition: 'opacity 450ms ease, transform 450ms ease',
                                transitionDelay: `${citiesReveal ? cities.indexOf(city) * 35 : 0}ms`
                              }}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
