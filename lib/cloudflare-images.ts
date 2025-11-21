/**
 * Cloudflare Image Transformations
 * Optimizes images for mobile devices with fast loading
 * Docs: https://developers.cloudflare.com/images/transform-images/
 */

interface CloudflareImageOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'json';
}

/**
 * Transform an R2 image URL using Cloudflare's image transformation
 * @param imageUrl - The original R2 image URL
 * @param options - Transformation options for mobile optimization
 * @returns Transformed image URL
 */
export function transformImage(
  imageUrl: string,
  options: CloudflareImageOptions = {}
): string {
  if (!imageUrl) return '';

  // Default mobile-optimized settings
  const {
    width = 800, // Good for mobile retina displays
    height,
    fit = 'scale-down',
    quality = 85, // Balance between quality and file size
    format = 'auto', // Let Cloudflare choose best format (WebP/AVIF)
  } = options;

  // Build transformation parameters
  const params = new URLSearchParams();

  params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  params.append('fit', fit);
  params.append('quality', quality.toString());
  params.append('format', format);

  // Cloudflare image transformation URL format
  // https://developers.cloudflare.com/images/transform-images/transform-via-url/
  const transformedUrl = `${imageUrl}?${params.toString()}`;

  return transformedUrl;
}

/**
 * Presets for common use cases
 */
export const ImagePresets = {
  // For 3D gallery thumbnails (small, fast loading)
  galleryThumbnail: (url: string) =>
    transformImage(url, {
      width: 400,
      fit: 'cover',
      quality: 80,
      format: 'auto',
    }),

  // For lightbox full view (higher quality)
  lightboxFull: (url: string) =>
    transformImage(url, {
      width: 1200,
      fit: 'scale-down',
      quality: 90,
      format: 'auto',
    }),

  // For very small preview (fastest loading)
  tinyPreview: (url: string) =>
    transformImage(url, {
      width: 200,
      fit: 'cover',
      quality: 70,
      format: 'auto',
    }),
};
