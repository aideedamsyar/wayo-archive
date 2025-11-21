# Cloudflare R2 Setup Guide for Wayo Gallery

## Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage** in the left sidebar
3. Click **Create bucket**
4. Name: `wayo-gallery`
5. Location: **Automatic** (or choose closest to your users)
6. Click **Create bucket**

## Step 2: Generate API Tokens

1. In R2 dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Token name: `wayo-web-uploads`
4. Permissions:
   - **Object Read & Write** (for uploads)
   - **Admin Read & Write** (optional, for managing buckets)
5. TTL: Choose **Forever** or set expiration
6. Click **Create API token**
7. **SAVE THESE CREDENTIALS** (shown only once):
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (format: `https://<account_id>.r2.cloudflarestorage.com`)

## Step 3: Get Account ID

1. In Cloudflare dashboard, look at the URL or top-right corner
2. Account ID format: `abc123def456...` (32 characters)
3. Or find it in **R2 → Settings**

## Step 4: Setup Custom Domain (Optional but Recommended)

### Option A: Use R2.dev Subdomain (Quick, Free)
1. Go to your bucket settings
2. Enable **Public Access**
3. You'll get a URL like: `https://pub-xxxx.r2.dev`
4. Use this as your `NEXT_PUBLIC_R2_PUBLIC_URL`

### Option B: Custom Domain (Recommended for Production)
1. Go to bucket → **Settings** → **Custom Domains**
2. Click **Connect Domain**
3. Enter your domain: `gallery.wayo.com`
4. Add CNAME record to your DNS:
   ```
   gallery.wayo.com CNAME <bucket-name>.<account-id>.r2.cloudflarestorage.com
   ```
5. Wait for DNS propagation (~5-10 minutes)
6. Use `https://gallery.wayo.com` as your `NEXT_PUBLIC_R2_PUBLIC_URL`

## Step 5: Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cd /Users/deedsofaraway/Desktop/wayo/web-app
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
# From Step 2
CLOUDFLARE_ACCOUNT_ID=your_account_id_from_step_3
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_from_step_2
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key_from_step_2

# From Step 1
CLOUDFLARE_R2_BUCKET_NAME=wayo-gallery

# From Step 4
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxx.r2.dev  # or https://gallery.wayo.com
```

## Step 6: Test Upload

Restart your dev server:

```bash
npm run dev -- -p 3001
```

Test the upload by using the `ImageUploader` component in any page.

## CORS Configuration (If Needed)

If you get CORS errors when uploading from browser:

1. Go to R2 bucket → **Settings** → **CORS Policy**
2. Add this configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3001",
      "https://wayo.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

## Usage Example

```tsx
import ImageUploader from '@/components/ImageUploader';

export default function MyPage() {
  const handleUpload = (url: string) => {
    console.log('Uploaded image URL:', url);
    // Save to database, update state, etc.
  };

  return (
    <ImageUploader
      onUploadComplete={handleUpload}
      maxFiles={5}
    />
  );
}
```

## Cost Estimate

**Cloudflare R2 Pricing:**
- Storage: **$0.015/GB/month**
- Class A Operations (write): **$4.50/million**
- Class B Operations (read): **$0.36/million**
- **No egress fees!** (Unlike S3)

**Example costs for 1000 photos:**
- Photos: 1000 × 2MB = 2GB storage = **$0.03/month**
- Uploads: 1000 writes = **$0.0045**
- Views: 10,000 reads = **$0.0036**
- **Total: ~$0.04/month** for 1000 photos with 10k views

Very cheap! 🎉

## Security Best Practices

1. ✅ **Pre-signed URLs** - We use these (already implemented)
2. ✅ **File type validation** - Only images allowed (already implemented)
3. ✅ **Size limits** - Set max file size in upload component
4. 🔄 **Virus scanning** - Consider adding Cloudflare Images or external scanning
5. 🔄 **Rate limiting** - Add rate limits to `/api/upload-url` endpoint
6. 🔄 **Authentication** - Add Supabase auth check before generating upload URLs

## Next Steps

1. Get credentials from Cloudflare (Steps 1-3)
2. Add to `.env.local` (Step 5)
3. Update your gallery to use real image URLs instead of color placeholders
4. Deploy to Vercel (remember to add env vars there too!)

---

**Questions?** Check Cloudflare R2 docs: https://developers.cloudflare.com/r2/
