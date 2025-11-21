# Fix R2 CORS Error - Quick Guide

## Problem
```
Access to fetch at 'https://wayo.f1b1d96b8f9550638a5e93bd58a2ce6e.r2.cloudflarestorage.com/...'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## Solution: Add CORS Policy to R2 Bucket

### Step 1: Go to Cloudflare R2
1. Open https://dash.cloudflare.com/
2. Click **R2 Object Storage** in sidebar
3. Click on your bucket: **wayo**

### Step 2: Add CORS Policy
1. Click **Settings** tab
2. Scroll to **CORS policy** section
3. Click **Add CORS policy** (or **Edit** if one exists)

### Step 3: Paste This JSON

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://wayo.com",
      "https://*.wayo.com",
      "https://*.vercel.app"
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

### Step 4: Save
Click **Save** or **Add CORS policy**

### Step 5: Test
1. Go back to http://localhost:3001/upload-test
2. Try uploading again - should work now! ✅

---

## What This Does

- **AllowedOrigins**: Permits uploads from localhost and your domains
- **AllowedMethods**: Allows all HTTP methods needed for upload
- **AllowedHeaders**: Accepts all request headers
- **ExposeHeaders**: Makes ETag and Content-Length accessible
- **MaxAgeSeconds**: Caches CORS check for 1 hour

---

## If Still Not Working

### Clear Browser Cache
```
Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Check Bucket Name
Make sure you're editing the correct bucket: **wayo**

### Wait 1-2 Minutes
CORS changes can take a moment to propagate

---

**After fixing, refresh the page and try uploading again!**
