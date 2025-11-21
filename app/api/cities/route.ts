import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('place_submissions')
      .select('city')
      .eq('status', 'approved')
      .not('city', 'is', null)
      .neq('city', '');

    if (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }

    const cities =
      data
        ?.map((row) => row.city?.trim())
        .filter((city): city is string => Boolean(city))
        .reduce<string[]>((unique, city) => {
          if (!unique.includes(city)) unique.push(city);
          return unique;
        }, [])
        .sort((a, b) => a.localeCompare(b)) || [];

    return NextResponse.json({ cities });
  } catch (err) {
    console.error('Cities fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch cities', cities: [] }, { status: 500 });
  }
}
