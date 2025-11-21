'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadFileToR2 } from '@/lib/r2-upload';
import { createClient } from '@supabase/supabase-js';
import { COUNTRIES } from '@/app/api/cities/data/countries';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BlurFade } from '@/components/ui/blur-fade';
import confetti from 'canvas-confetti';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PlaceSubmissionFormProps {
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function PlaceSubmissionForm({ onClose, onSubmitSuccess }: PlaceSubmissionFormProps) {
  // Form data
  const [placeName, setPlaceName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [whySpecial, setWhySpecial] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [countryOpen, setCountryOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const totalPages = 6;

  // Background colors for each page
  const pageBackgrounds = {
    1: 'rgb(0, 0, 0)',        // Black background for name page
    2: 'rgb(244, 239, 201)',
    3: 'rgb(228, 238, 250)',
    4: 'rgb(2, 68, 66)',
    5: 'rgb(255, 255, 255)',
    6: 'rgb(255, 255, 255)',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };


  const goToNextPage = () => {
    setSlideDirection('left');
    setCurrentPage((prev) => {
      const nextPage = Math.min(prev + 1, totalPages);
      // Track page progression
      if (window.gtag) {
        window.gtag('event', 'form_page_view', {
          page_number: nextPage,
          form_name: 'place_submission'
        });
      }
      return nextPage;
    });
  };

  const goToPreviousPage = () => {
    setSlideDirection('right');
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePage1Next = () => {
    if (!placeName || !city || !country) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);
    goToNextPage();
  };

  const handlePage3Next = () => {
    if (!whySpecial) {
      setError('Please share why this place matters to you');
      return;
    }
    setError(null);
    goToNextPage();
  };

  const handlePage4Submit = async () => {
    if (!selectedFile) {
      setError('Please upload a photo');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Upload photo to R2
      const photoUrl = await uploadFileToR2(selectedFile);

      // 2. Save to Supabase
      const { data, error: dbError } = await supabase
        .from('place_submissions')
        .insert([
          {
            place_name: placeName,
            city: city,
            country: country,
            name: name || null,
            why_special: whySpecial,
            photo_url: photoUrl,
            email: null, // Email comes later
          }
        ])
        .select('id')
        .single();

      if (dbError) throw dbError;

      // Store submission ID for email update later
      setSubmissionId(data.id);

      // Track successful submission
      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          form_name: 'place_submission',
          city: city,
          country: country
        });
      }

      // Trigger refresh in parent component
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      // Success! Go to email page
      goToNextPage();

    } catch (err) {
      console.error('Submission error:', err);
      setError((err as Error).message || 'Failed to submit. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePage5Next = async () => {
    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setError(null);

    // Update email if provided
    if (email && submissionId) {
      console.log('Attempting to update email:', { email, submissionId });
      try {
        const { data, error: updateError } = await supabase
          .from('place_submissions')
          .update({ email })
          .eq('id', submissionId)
          .select();

        if (updateError) {
          console.error('Failed to update email:', updateError);
          // Don't block progression if email update fails
        } else {
          console.log('Email updated successfully:', data);
          // Track email collection
          if (window.gtag) {
            window.gtag('event', 'email_collected', {
              form_name: 'place_submission'
            });
          }
        }
      } catch (err) {
        console.error('Email update error:', err);
        // Don't block progression
      }
    } else {
      console.log('Skipping email update:', { email, submissionId });
    }

    goToNextPage();
  };

  const handleCopyLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      confetti({
        spread: 90,
        particleCount: 100,
        origin: { y: 0.6 }
      });
      // Track link share
      if (window.gtag) {
        window.gtag('event', 'share', {
          method: 'copy_link',
          content_type: 'submission_complete'
        });
      }
    });
  };

  // Track form open on mount
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'form_start', {
        form_name: 'place_submission'
      });
    }
  }, []);

  return (
    <div
      className="w-full h-full overflow-hidden relative transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: pageBackgrounds[currentPage as keyof typeof pageBackgrounds] }}
    >
      {/* Close Button - Always visible */}
      <button
        onClick={onClose}
        className={`absolute top-4 left-4 md:top-6 md:left-6 z-50 transition-colors ${
          currentPage === 1 || currentPage === 4 ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-black'
        }`}
      >
        <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Page Indicator - Always visible except on email and thank you pages */}
      {currentPage <= 4 && (
        <div className={`absolute top-4 right-4 md:top-6 md:right-6 z-50 text-xs md:text-sm tracking-widest transition-colors ${
          currentPage === 1 || currentPage === 4 ? 'text-white/60' : 'text-gray-400'
        }`}>
          {currentPage}/4
        </div>
      )}

      {/* Page Container */}
      <div className="relative w-full h-full">
        {/* Page 1: Name */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            currentPage === 1
              ? 'translate-x-0'
              : currentPage > 1
              ? slideDirection === 'left'
                ? '-translate-x-full'
                : 'translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl space-y-4 md:space-y-8">
              <div>
                <label className="block text-xl md:text-3xl text-white mb-4 md:mb-8 font-bold leading-relaxed" style={{ fontFamily: 'var(--font-jost)' }}>
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-0 py-6 border-0 border-b-2 border-white bg-transparent outline-none text-xl md:text-2xl font-light text-white placeholder:text-white/40"
                />
              </div>

              <button
                onClick={goToNextPage}
                className="w-full bg-white text-black py-5 text-lg md:text-xl font-medium hover:bg-gray-200 transition-colors rounded-full"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Page 2: Place Name + City/Country */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            currentPage === 2
              ? 'translate-x-0'
              : currentPage > 2
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl space-y-4 md:space-y-8">
              <div>
                <label className="block text-xl md:text-3xl text-black mb-4 md:mb-8 font-bold leading-relaxed" style={{ fontFamily: 'var(--font-jost)' }}>
                  If your best friend visited your city, where&apos;s the one place you&apos;d take them? *
                </label>
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="e.g., A hidden café in Montmartre"
                  className="w-full px-0 py-6 border-0 border-b-2 border-black outline-none text-3xl md:text-4xl font-light transition-colors mb-8 placeholder:text-gray-500"
                />

                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-0 py-6 border-0 border-b-2 border-black outline-none text-lg font-light transition-colors placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex-1">
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          role="combobox"
                          aria-expanded={countryOpen}
                          className="w-full flex items-center justify-between border-0 border-b-2 border-black rounded-none px-0 py-6 bg-transparent focus:outline-none transition-colors"
                        >
                          <span className={`text-lg font-light ${country ? 'text-black' : 'text-gray-500'}`}>
                            {country || 'Country'}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search countries..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {COUNTRIES.map((c) => (
                                <CommandItem
                                  key={c.code}
                                  value={c.name}
                                  onSelect={(currentValue) => {
                                    setCountry(currentValue === country ? '' : currentValue);
                                    setCountryOpen(false);
                                  }}
                                >
                                  {c.name}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      country === c.name ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={goToPreviousPage}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-6 text-xl font-medium hover:border-gray-400 transition-colors rounded-full"
                >
                  Back
                </button>
                <button
                  onClick={handlePage1Next}
                  className="flex-1 bg-black text-white py-6 text-xl font-medium hover:bg-gray-800 transition-colors rounded-full"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page 3: Why Special */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            currentPage === 3
              ? 'translate-x-0'
              : currentPage > 3
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl space-y-4 md:space-y-8">
              <div>
                <label className="block text-xl md:text-3xl text-black mb-4 md:mb-8 font-bold leading-relaxed" style={{ fontFamily: 'var(--font-jost)' }}>
                  Why does this place matter to you? *
                </label>
                <textarea
                  value={whySpecial}
                  onChange={(e) => setWhySpecial(e.target.value)}
                  placeholder="A memory, a feeling, a moment..."
                  rows={8}
                  className="w-full px-0 py-6 border-0 border-b-2 border-black outline-none text-xl md:text-2xl font-light transition-colors resize-none leading-relaxed placeholder:text-gray-500"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={goToPreviousPage}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-6 text-xl font-medium hover:border-gray-400 transition-colors rounded-full"
                >
                  Back
                </button>
                <button
                  onClick={handlePage3Next}
                  className="flex-1 bg-black text-white py-6 text-xl font-medium hover:bg-gray-800 transition-colors rounded-full"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page 4: Photo Upload + Submit */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            currentPage === 4
              ? 'translate-x-0'
              : currentPage > 4
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl space-y-4 md:space-y-8">
              <div>
                <label className="block text-xl md:text-3xl text-white mb-4 md:mb-8 font-bold leading-relaxed" style={{ fontFamily: 'var(--font-jost)' }}>
                  Upload a photo that captures its essence *
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="photo-upload"
                  className={`block w-full aspect-[4/3] border-2 border-dashed rounded-lg cursor-pointer overflow-hidden transition-all ${
                    previewUrl
                      ? 'border-white'
                      : 'border-white/40 hover:border-white/60'
                  } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg font-light">Click to upload</span>
                    </div>
                  )}
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={goToPreviousPage}
                  className="flex-1 border-2 border-white/40 text-white py-6 text-xl font-medium hover:border-white/60 transition-colors rounded-full"
                  disabled={uploading}
                >
                  Back
                </button>
                <button
                  onClick={handlePage4Submit}
                  disabled={uploading}
                  className="flex-1 bg-white text-black py-6 text-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 rounded-full"
                >
                  {uploading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page 5: Email Collection */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            currentPage === 5
              ? 'translate-x-0'
              : currentPage > 5
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl space-y-4 md:space-y-8">
              <div className="text-center mb-6 md:mb-12">
                <BlurFade delay={0.2} duration={0.6}>
                  <p className="text-xl md:text-3xl text-gray-800 font-bold leading-relaxed">
                    Somewhere in the world, someone feels just like you. Don&apos;t you wonder what their favorite place is? We&apos;ll bring you together.
                  </p>
                </BlurFade>
              </div>

              <div className="mb-8">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-0 py-6 border-0 border-b-2 border-gray-200 focus:border-black outline-none text-2xl md:text-3xl font-light transition-colors text-center placeholder:text-gray-500"
                />
                <p className="mt-3 text-center text-sm text-gray-400 font-light">
                  We&apos;ll send you the result to this email
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handlePage5Next}
                className="w-full bg-black text-white py-6 text-xl font-medium hover:bg-gray-800 transition-colors rounded-full"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Page 6: Thank You */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            currentPage === 6 ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl text-center space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 tracking-wide" style={{ fontFamily: 'var(--font-jost)', fontWeight: 900 }}>
                Thank You!
              </h2>

              <div className="my-4 md:my-6">
                <img
                  src="https://assets.withwayo.com/gallery/1763710183360-htmxwk-friendship.png"
                  alt="Thank you"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>

              <p className="text-lg md:text-2xl text-gray-600 font-light leading-relaxed mb-4 md:mb-6">
                Your place will become part of someone else&apos;s journey.
              </p>

              <div className="space-y-3 md:space-y-4">
                <button
                  onClick={handleCopyLink}
                  className="w-full max-w-sm mx-auto bg-black text-white py-4 md:py-6 px-6 md:px-8 text-lg md:text-xl font-medium hover:bg-gray-800 transition-colors rounded-full"
                >
                  Copy Link to Share
                </button>

                {linkCopied && (
                  <p className="text-base md:text-lg text-green-600 font-medium animate-in fade-in duration-300">
                    Link copied! Send to your friends 🎉
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
