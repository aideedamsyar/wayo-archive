# Complete R2 Bucket Setup Walkthrough (Step-by-Step)

## Part 1: Create Cloudflare R2 Bucket

### Step 1: Access Cloudflare Dashboard
1. Go to https://dash.cloudflare.com/
2. Log in with your Cloudflare account
3. You'll see your dashboard with all your domains

### Step 2: Navigate to R2
1. In the **left sidebar**, look for **R2 Object Storage**
2. If you don't see it, click **Workers & Pages** dropdown → **R2**
3. Or go directly to: https://dash.cloudflare.com/?to=/:account/r2

### Step 3: Create Your First Bucket (If First Time)
1. If this is your first bucket, you'll see a welcome screen
2. Click **Create bucket** or **Get Started**
3. If you already have buckets, click **Create bucket** button (top right)

### Step 4: Configure Bucket Settings
```
Bucket name: wayo-gallery
├─ Must be unique across all Cloudflare R2
├─ Use lowercase, hyphens allowed
└─ Cannot be changed after creation

Location: Automatic (Recommended)
├─ Let Cloudflare choose optimal location
└─ Or pick specific region (APAC for Korean users)

Storage Class: Standard (default)
└─ Only option for now
```

5. Click **Create bucket** ✅

---

## Part 2: Make Bucket Publicly Accessible

### Step 5: Enable Public Access
1. Click on your newly created `wayo-gallery` bucket
2. Go to **Settings** tab
3. Scroll to **Public access** section
4. Click **Allow Access** button
5. **Important:** This generates a public R2.dev URL

You'll now see:
```
Public R2.dev bucket URL:
https://pub-abc123def456.r2.dev
```

**Save this URL!** You'll use it as `NEXT_PUBLIC_R2_PUBLIC_URL` (if not using custom domain)

---

## Part 3: Setup Custom Domain (Recommended)

### Why Custom Domain?
✅ Professional look: `gallery.wayo.com` vs `pub-abc123.r2.dev`
✅ SEO benefits
✅ Branding consistency
✅ Can migrate to different storage later without changing URLs

### Step 6: Prerequisites
You need:
- A domain registered (e.g., `wayo.com`)
- Domain's DNS managed by Cloudflare (or ability to add CNAME records)

### Step 7: Add Domain to Cloudflare (If Not Already)
If `wayo.com` is not yet on Cloudflare:

1. Dashboard → **Websites** → **Add a site**
2. Enter your domain: `wayo.com`
3. Choose plan (Free works fine)
4. Cloudflare will scan your DNS records
5. Update your domain registrar's nameservers to Cloudflare's:
   ```
   nameserver1.cloudflare.com
   nameserver2.cloudflare.com
   ```
6. Wait for activation (~5 minutes to 24 hours)

### Step 8: Connect Custom Domain to R2 Bucket
1. Go back to your R2 bucket: `wayo-gallery`
2. Click **Settings** tab
3. Scroll to **Custom Domains** section
4. Click **Connect Domain** button

### Step 9: Enter Your Subdomain
```
Domain: gallery.wayo.com
```

**Naming suggestions:**
- `gallery.wayo.com` (for gallery photos)
- `cdn.wayo.com` (general CDN)
- `media.wayo.com` (all media files)
- `images.wayo.com` (images only)

Click **Continue**

### Step 10: Add DNS Record
Cloudflare will show you instructions:

```
Add a CNAME record in your DNS settings:

Name:   gallery
Type:   CNAME
Target: wayo-gallery.abc123def456.r2.cloudflarestorage.com
Proxy:  Yes (Orange cloud)
TTL:    Auto
```

**Two ways to add this:**

#### Option A: Automatic (If domain is on Cloudflare)
- Cloudflare will offer to **add record automatically**
- Click **Add DNS record** → Done! ✅

#### Option B: Manual (If you need to do it yourself)
1. Go to your domain in Cloudflare Dashboard
2. Click **DNS** → **Records**
3. Click **Add record**
4. Fill in:
   - **Type:** CNAME
   - **Name:** gallery (will become gallery.wayo.com)
   - **Target:** `wayo-gallery.abc123def456.r2.cloudflarestorage.com` (from R2 settings)
   - **Proxy status:** Proxied (orange cloud icon ON)
   - **TTL:** Auto
5. Click **Save**

### Step 11: Verify Domain Connection
1. Back in R2 bucket → **Settings** → **Custom Domains**
2. You should see:
   ```
   ✅ gallery.wayo.com - Active
   ```
3. If showing "Pending", wait 5-10 minutes for DNS propagation

### Step 12: Test Your Custom Domain
Open browser and test:
```
https://gallery.wayo.com/
```

Should show:
- ✅ No error = Working!
- ❌ 404 or bucket empty = Normal (no files yet)
- ❌ DNS error = Wait longer or check DNS records

---

## Part 4: Generate API Credentials

### Step 13: Create R2 API Token
1. In R2 Dashboard, click **Manage R2 API Tokens** (top right)
2. Or go to: Account → **R2** → **API Tokens**
3. Click **Create API token**

### Step 14: Configure Token
```
Token Name: wayo-web-uploads
├─ Descriptive name for your records
└─ You can create multiple tokens for different apps

Permissions:
├─ ✅ Object Read & Write
└─ ℹ️ This allows uploading and reading files

Specify bucket (Optional but Recommended):
├─ Select: wayo-gallery
└─ Limits token to only this bucket (more secure)

TTL (Time to Live):
├─ Forever (easiest)
└─ Or set expiration (more secure, need to rotate)
```

Click **Create API token**

### Step 15: Save Credentials (IMPORTANT!)
⚠️ **These are shown ONLY ONCE - copy them now!**

You'll see:
```
Access Key ID:      abc123def456...
Secret Access Key:  xyz789ghi012...

S3 Endpoint:
https://abc123def456.r2.cloudflarestorage.com

Token ID: xxxxxxxx (for management only)
```

**Copy these to a safe place immediately!**

---

## Part 5: Configure Your Web App

### Step 16: Find Your Account ID
Your Account ID is in the endpoint URL:
```
https://[THIS-IS-YOUR-ACCOUNT-ID].r2.cloudflarestorage.com
```

Or find it:
1. Cloudflare Dashboard → Click your profile (top right)
2. Any R2 page URL will have it: `dash.cloudflare.com/:account/r2`
3. The `:account` part is your Account ID

### Step 17: Create `.env.local` File
```bash
cd /Users/deedsofaraway/Desktop/wayo/web-app
cp .env.example .env.local
```

### Step 18: Fill in Environment Variables
Edit `.env.local`:

```env
# From Step 16 (Account ID)
CLOUDFLARE_ACCOUNT_ID=abc123def456

# From Step 15 (API Token credentials)
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_from_step_15
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key_from_step_15

# From Step 4 (Bucket name)
CLOUDFLARE_R2_BUCKET_NAME=wayo-gallery

# From Step 9 (Custom domain) - NO TRAILING SLASH!
NEXT_PUBLIC_R2_PUBLIC_URL=https://gallery.wayo.com
```

**Important:**
- No quotes needed
- No trailing slash in URL
- Keep `.env.local` in `.gitignore` (never commit!)

### Step 19: Restart Dev Server
```bash
# Kill old server (Ctrl+C)
npm run dev -- -p 3001
```

---

## Part 6: Test Upload

### Step 20: Test with ImageUploader Component
Create a test page:

```tsx
// app/test-upload/page.tsx
'use client';

import ImageUploader from '@/components/ImageUploader';

export default function TestUploadPage() {
  const handleUpload = (url: string) => {
    console.log('✅ Uploaded to:', url);
    alert(`Image uploaded! ${url}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test R2 Upload</h1>
      <ImageUploader
        onUploadComplete={handleUpload}
        maxFiles={3}
      />
    </div>
  );
}
```

Visit: http://localhost:3001/test-upload

### Step 21: Upload Test Image
1. Click the upload area
2. Select an image from your computer
3. Wait for upload (should be fast!)
4. Check console for uploaded URL
5. Click the URL to verify image loads

If successful, you'll see your image at:
```
https://gallery.wayo.com/gallery/1732012345-abc123-test.jpg
```

---

## Part 7: Configure CORS (If Needed)

### Step 22: Add CORS Policy (If Getting CORS Errors)
1. Go to R2 bucket → **Settings**
2. Scroll to **CORS policy**
3. Click **Add CORS policy** or **Edit**
4. Paste this JSON:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://wayo.com",
      "https://*.wayo.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

5. Click **Save**

**What this does:**
- Allows uploads from localhost and your domain
- Permits all standard HTTP methods
- Caches CORS check for 1 hour
- Exposes useful headers

---

## Troubleshooting

### Issue: "Bucket name already exists"
**Solution:** Bucket names are globally unique. Try:
- `wayo-gallery-prod`
- `wayo-images-2024`
- `[yourname]-wayo-gallery`

### Issue: Custom domain shows "Not secure" or SSL error
**Solution:**
- Make sure Cloudflare proxy is ON (orange cloud)
- Wait 15-30 minutes for SSL certificate provisioning
- Check bucket has **Public Access** enabled

### Issue: Upload fails with 403 Forbidden
**Solution:**
- Verify API token has "Object Read & Write" permission
- Check token is scoped to correct bucket
- Ensure `.env.local` credentials are correct
- Restart dev server after changing env vars

### Issue: Upload succeeds but image doesn't load
**Solution:**
- Check `NEXT_PUBLIC_R2_PUBLIC_URL` has no trailing slash
- Verify bucket has **Public Access** enabled
- Try accessing image URL directly in browser
- Check CORS policy if loading from different domain

### Issue: "Account ID not found" error
**Solution:**
- Account ID is in the R2 endpoint URL
- Format: 32 character alphanumeric string
- Copy from Cloudflare dashboard URL or R2 settings

---

## Security Checklist

Before going to production:

- [ ] API tokens stored in `.env.local` (not committed to git)
- [ ] Added `.env.local` to `.gitignore`
- [ ] File type validation enabled (images only)
- [ ] File size limits enforced (10MB max recommended)
- [ ] CORS policy restricts to your domains only
- [ ] Consider adding rate limiting to upload API route
- [ ] Consider adding authentication (Supabase) before allowing uploads
- [ ] Setup Cloudflare Images for automatic optimization (optional)
- [ ] Enable virus scanning for user uploads (optional)

---

## Next Steps

✅ **You're ready to replace color placeholders with real images!**

Update your gallery component to use real URLs:
```tsx
const SAMPLE_PHOTOS = [
  {
    id: '1',
    imageUrl: 'https://gallery.wayo.com/gallery/photo1.jpg', // Real R2 URL
    placeName: 'Shibuya Sky',
    // ...
  },
];
```

---

## Quick Reference

**Cloudflare Dashboard URLs:**
- R2 Home: https://dash.cloudflare.com/?to=/:account/r2
- DNS Settings: https://dash.cloudflare.com/?to=/:account/:zone/dns
- API Tokens: https://dash.cloudflare.com/?to=/:account/r2/api-tokens

**Environment Variables:**
```bash
CLOUDFLARE_ACCOUNT_ID=         # From dashboard
CLOUDFLARE_R2_ACCESS_KEY_ID=   # From API token
CLOUDFLARE_R2_SECRET_ACCESS_KEY= # From API token
CLOUDFLARE_R2_BUCKET_NAME=wayo-gallery
NEXT_PUBLIC_R2_PUBLIC_URL=https://gallery.wayo.com
```

**Useful Commands:**
```bash
# Test upload
curl -X POST http://localhost:3001/api/upload-url \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","fileType":"image/jpeg"}'

# Check environment variables loaded
npm run dev -- -p 3001
# Visit http://localhost:3001/api/upload-url (should return error about missing params)
```

---

**Need Help?**
- Cloudflare R2 Docs: https://developers.cloudflare.com/r2/
- Cloudflare Discord: https://discord.gg/cloudflaredev
