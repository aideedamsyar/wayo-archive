import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // Disable caching for fresh photos

interface PlaceSubmission {
  id: string;
  place_name: string;
  city: string;
  country: string;
  photo_url: string;
  why_special?: string | null;
  name?: string | null;
  is_featured: boolean;
  submitted_at: string;
  status: string;
}

/**
 * GET /api/gallery-photos
 * Fetches 20 photos for the 3D gallery:
 * - 10 admin-curated featured photos (or fewer if not enough)
 * - Remaining slots filled with latest approved submissions
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cityParam = searchParams.get('city')?.trim();

    if (cityParam) {
      const { data, error } = await supabase
        .from('place_submissions')
        .select('id, place_name, city, country, photo_url, is_featured, submitted_at, status, why_special, name')
        .ilike('city', cityParam)
        .eq('status', 'approved')
        .order('submitted_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching city-filtered photos:', error);
        throw error;
      }

      const formattedCityPhotos =
        data?.map((photo) => ({
          id: photo.id,
          url: photo.photo_url,
          placeName: photo.place_name,
          city: photo.city,
          country: photo.country,
          description: photo.why_special || `${photo.place_name} in ${photo.city}, ${photo.country}`,
          whySpecial: photo.why_special || undefined,
          authorName: photo.name || null,
          isFeatured: photo.is_featured,
          submittedAt: photo.submitted_at
        })) || [];

      return NextResponse.json({
        photos: formattedCityPhotos,
        stats: { total: formattedCityPhotos.length, featured: 0, latest: formattedCityPhotos.length }
      });
    }

    const TARGET_TOTAL = 20;
    const TARGET_FEATURED = 10;

    // Step 1: Fetch up to 10 featured photos (only approved)
    const { data: featuredPhotos, error: featuredError } = await supabase
      .from('place_submissions')
      .select('id, place_name, city, country, photo_url, is_featured, submitted_at, status, why_special, name')
      .eq('is_featured', true)
      .eq('status', 'approved')
      .order('submitted_at', { ascending: false })
      .limit(TARGET_FEATURED);

    if (featuredError) {
      console.error('Error fetching featured photos:', featuredError);
      throw featuredError;
    }

    const featuredCount = featuredPhotos?.length || 0;
    const remainingSlots = TARGET_TOTAL - featuredCount;

    // Step 2: Fetch latest photos to fill remaining slots
    // Exclude already-fetched featured photos
    const featuredIds = featuredPhotos?.map((p) => p.id) || [];

    let latestPhotosQuery = supabase
      .from('place_submissions')
      .select('id, place_name, city, country, photo_url, is_featured, submitted_at, status, why_special, name')
      .eq('status', 'approved')
      .order('submitted_at', { ascending: false })
      .limit(remainingSlots);

    // Only add the NOT IN filter if we have featured IDs
    if (featuredIds.length > 0) {
      latestPhotosQuery = latestPhotosQuery.not('id', 'in', `(${featuredIds.join(',')})`);
    }

    const { data: latestPhotos, error: latestError } = await latestPhotosQuery;

    if (latestError) {
      console.error('Error fetching latest photos:', latestError);
      throw latestError;
    }

    // Step 3: Combine featured + latest photos
    const allPhotos = [...(featuredPhotos || []), ...(latestPhotos || [])];

    // Step 4: Transform to match 3D gallery expected format
    const formattedPhotos = allPhotos.map((photo) => ({
      id: photo.id,
      url: photo.photo_url, // Real image URL from R2
      placeName: photo.place_name,
      city: photo.city,
      country: photo.country,
      description: photo.why_special || `${photo.place_name} in ${photo.city}, ${photo.country}`,
      whySpecial: photo.why_special || undefined,
      authorName: photo.name || null,
      isFeatured: photo.is_featured,
      submittedAt: photo.submitted_at,
    }));

    return NextResponse.json({
      photos: formattedPhotos,
      stats: {
        total: formattedPhotos.length,
        featured: featuredCount,
        latest: latestPhotos?.length || 0,
      },
    });
  } catch (error) {
    console.error('Gallery photos fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch gallery photos',
        photos: [],
        stats: { total: 0, featured: 0, latest: 0 },
      },
      { status: 500 }
    );
  }
}
