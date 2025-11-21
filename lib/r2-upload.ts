import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 is S3-compatible, so we use AWS SDK
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'wayo-gallery';
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

/**
 * Generate a pre-signed URL for direct client-side uploads
 * This is more secure - client uploads directly to R2 without going through our server
 */
export async function getUploadUrl(fileName: string, fileType: string): Promise<{
  uploadUrl: string;
  publicUrl: string;
  key: string;
}> {
  // Generate unique filename to prevent collisions
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const key = `gallery/${timestamp}-${randomString}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  // Pre-signed URL valid for 5 minutes
  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

  // Public URL for accessing the uploaded file
  const publicUrl = `${PUBLIC_URL}/${key}`;

  return { uploadUrl, publicUrl, key };
}

/**
 * Upload file directly from server (use for smaller files or when pre-signed URLs aren't needed)
 */
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  fileType: string
): Promise<string> {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const key = `gallery/${timestamp}-${randomString}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: fileType,
  });

  await r2Client.send(command);

  return `${PUBLIC_URL}/${key}`;
}

/**
 * Client-side upload helper (use this in your React components)
 */
export async function uploadFileToR2(file: File): Promise<string> {
  // Step 1: Get pre-signed URL from API route
  const response = await fetch('/api/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get upload URL');
  }

  const { uploadUrl, publicUrl } = await response.json();

  // Step 2: Upload directly to R2 using pre-signed URL
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file');
  }

  return publicUrl;
}
