'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';

export default function UploadTestPage() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleUploadComplete = (url: string) => {
    console.log('✅ Uploaded:', url);
    setUploadedUrls((prev) => [...prev, url]);
  };

  const copyAllUrls = () => {
    const urlsText = uploadedUrls.join('\n');
    navigator.clipboard.writeText(urlsText);
    alert('URLs copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📸 R2 Upload Test
          </h1>
          <p className="text-gray-600">
            Upload your gallery photos to Cloudflare R2
          </p>
        </div>

        {/* Upload Component */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Photos</h2>
          <ImageUploader
            onUploadComplete={handleUploadComplete}
            maxFiles={20}
          />
        </div>

        {/* Uploaded URLs */}
        {uploadedUrls.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Uploaded URLs ({uploadedUrls.length})
              </h2>
              <button
                onClick={copyAllUrls}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                📋 Copy All URLs
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uploadedUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-mono text-gray-500 min-w-[30px]">
                    {index + 1}.
                  </span>
                  <code className="flex-1 text-sm text-gray-700 break-all">
                    {url}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      alert('URL copied!');
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    Copy
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>

            {/* JSON Format for Easy Copy-Paste */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">
                📝 Ready for Gallery (Copy & Paste)
              </h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`const SAMPLE_PHOTOS = [
${uploadedUrls.map((url, index) => `  {
    id: '${index + 1}',
    imageUrl: '${url}',
    placeName: 'Place Name ${index + 1}',
    city: 'City',
    country: 'Country',
    description: 'Add description here'
  }`).join(',\n')}
];`}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📌 Instructions:
          </h3>
          <ol className="text-blue-800 space-y-2 list-decimal list-inside">
            <li>Upload your gallery photos above</li>
            <li>Copy the generated code at the bottom</li>
            <li>Replace SAMPLE_PHOTOS in <code className="bg-blue-100 px-1 rounded">app/page.tsx</code></li>
            <li>Update placeName, city, country for each photo</li>
            <li>Refresh the gallery to see your real photos!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
