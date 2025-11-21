'use client';

import { useState } from 'react';
import { uploadFileToR2 } from '@/lib/r2-upload';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  maxFiles?: number;
}

export default function ImageUploader({ onUploadComplete, maxFiles = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Check max files limit
    if (uploadedUrls.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload all files in parallel
      const uploadPromises = files.map((file) => uploadFileToR2(file));
      const urls = await Promise.all(uploadPromises);

      setUploadedUrls((prev) => [...prev, ...urls]);

      // Notify parent component
      urls.forEach((url) => onUploadComplete(url));
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
          multiple
          onChange={handleFileChange}
          disabled={uploading || uploadedUrls.length >= maxFiles}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`
            block w-full px-6 py-4 border-2 border-dashed rounded-lg text-center cursor-pointer
            transition-colors
            ${uploading || uploadedUrls.length >= maxFiles
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
            }
          `}
        >
          {uploading ? (
            <span className="text-gray-600">Uploading...</span>
          ) : uploadedUrls.length >= maxFiles ? (
            <span className="text-gray-600">Maximum {maxFiles} images reached</span>
          ) : (
            <div>
              <p className="text-blue-600 font-medium">Click to upload images</p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, WebP up to 10MB ({uploadedUrls.length}/{maxFiles})
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Preview Grid */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedUrls.map((url, index) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
