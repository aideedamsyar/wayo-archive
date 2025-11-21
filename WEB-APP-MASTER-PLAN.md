# WAYO ARCHIVING PROJECT - Web App

**Project:** Wayo Archiving Project - One place. One story. One photo.
**Timeline:** Week 1-3 (November 18-30, 2024)
**Status:** 🟢 In Development
**Parent Project:** [Wayo Platform](/MASTER-PLAN.md) (Control Tower)

---

## 💫 THE CONCEPT

> **"If your best friend visited your city, where's the one place you'd take them?"**

We're not just collecting places. We're archiving **meaningful moments** and **personal connections** to spaces that matter.

### What We're Building

A beautiful, intimate platform where people share:
- **One place** they truly love
- **One story** about why it matters to them (a memory, a feeling, a moment)
- **One photo** that captures its essence

This isn't a travel guide. It's a **human archive** of places that hold meaning.

### The Vision

**Share the place you love, and let it become part of someone else's journey.**

We're curating a collection of places that feel personal, authentic, and emotionally resonant. Each submission becomes part of a growing archive - a map of meaningful spaces across the world, told through the lens of real people and their stories.

Early participants join an **intimate circle** - they'll be the first to see what emerges, and discover places shared by people who feel like them.

---

## 🎯 WHAT WE'RE BUILDING (Technical)

A beautiful **Next.js landing page** with:
1. **3D Photo Gallery** - Scattered photos in 3D space, each one a window into someone's meaningful place
2. **Cinematic Lightbox** - Smooth zoom animations revealing the story behind each place
3. **Thoughtful Submission Form** - Two questions + one photo
4. **R2 Photo Upload** - Direct client-side uploads to Cloudflare R2

**Goal:** Collect 100-500 heartfelt place submissions to build the Wayo Archive.

---

## 🚫 WHAT WE'RE NOT BUILDING (Yet)

- ❌ User authentication (optional email only)
- ❌ Complex workflows or review systems
- ❌ Mobile app (this is web-only)
- ❌ Payment systems
- ❌ Social features
- ❌ Admin dashboard (manual review for now)

**Keep it simple!** This is a data collection tool, not the full platform.

---

## 📊 DATABASE SCHEMA (Simplified)

### Current State:
- ✅ `place_submissions` table has 9 essential columns
- ✅ Includes `why_special` field for stories (migration applied Nov 18)
- ✅ Includes `name` field for optional attribution (added Nov 20)
- ✅ Focused on capturing the story, not just the place

### Schema (Updated for Stories):

```sql
-- Drop the complex table and recreate with story focus
DROP TABLE IF EXISTS place_submissions CASCADE;

CREATE TABLE place_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The Two Questions
  place_name TEXT NOT NULL,          -- "Where's the one place you'd take your best friend?"
  why_special TEXT NOT NULL,         -- "Why does this place matter to you?"

  -- Location context
  city TEXT NOT NULL,
  country TEXT NOT NULL,

  -- The one photo
  photo_url TEXT NOT NULL,           -- Single R2 URL from direct upload

  -- Optional follow-up
  name TEXT,                         -- Optional name for attribution
  email TEXT,                        -- For featuring their story

  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE place_submissions ENABLE ROW LEVEL SECURITY;

-- Public can submit stories (no auth required)
CREATE POLICY "Anyone can share their place"
  ON place_submissions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Only service role can read"
  ON place_submissions FOR SELECT
  USING (auth.role() = 'service_role');

-- Create index for faster queries
CREATE INDEX idx_submissions_created ON place_submissions(submitted_at DESC);
CREATE INDEX idx_submissions_status ON place_submissions(status);
```

**Why this structure?**
- ✅ **9 columns** - focused on what matters
- ✅ `why_special` captures the memory, feeling, or moment
- ✅ One photo tells the visual story
- ✅ Name and email are optional (anonymous sharing welcome)
- ✅ Simple approval workflow for curation

---

## 🏗️ TECH STACK

### Frontend
- **Next.js 15** (App Router) - `/web-app/`
- **React Three Fiber** - 3D gallery
- **Tailwind CSS** - Styling (Luma aesthetic)
- **Framer Motion** - Animations & Magic UI components
- **Fonts:** Didact Gothic (body), Jost (headings)

### Storage
- **Cloudflare R2** - Photo uploads
- **Supabase** - Database (shared with KOPLE)

### Deployment
- **Vercel** - Automatic deploys from git

---

## 📁 PROJECT STRUCTURE

```
/web-app/                                   # This project
├── WEB-APP-MASTER-PLAN.md                 # 📍 THIS FILE
├── R2-SETUP-GUIDE.md                      # R2 configuration guide
├── R2-BUCKET-SETUP-WALKTHROUGH.md         # Detailed R2 walkthrough
│
├── app/
│   ├── page.tsx                           # ✅ 3D Gallery + Lightbox
│   ├── upload-test/page.tsx               # ✅ R2 upload testing
│   └── api/
│       └── upload-url/route.ts            # ✅ Pre-signed URL generation
│
├── components/
│   ├── Gallery3DScattered.tsx             # ✅ 3D photo gallery
│   ├── PhotoMeshLocal.tsx                 # ✅ Individual 3D photo
│   ├── PhotoLightbox.tsx                  # ✅ Cinematic lightbox
│   ├── ImageUploader.tsx                  # ✅ R2 upload component
│   └── PlaceSubmissionForm.tsx            # ✅ Submission form with R2 upload
│
├── lib/
│   └── r2-upload.ts                       # ✅ R2 upload utilities
│
└── .env.local                             # ✅ Configured with R2 keys
```

---

## ✅ WHAT'S DONE (Updated: Nov 20, 2024)

### Core Infrastructure
- ✅ Next.js 15 project setup with Turbopack
- ✅ Cloudflare R2 configured with CORS
- ✅ Supabase database simplified (9 columns including name and email)
- ✅ Environment variables configured (.env.local)
- ✅ R2 upload infrastructure (direct client-side uploads)

### 3D Gallery
- ✅ React Three Fiber 3D photo gallery
- ✅ Scattered photos in 3D space (deterministic positioning)
- ✅ Billboard effect (photos face camera at all angles)
- ✅ Subtle photo tilts (±2° for artistic effect)
- ✅ Cinematic vortex rotation (slow floating animation)
- ✅ Smooth zoom lightbox with varying velocity
- ✅ Fast close animation (400ms)

### Typography & Design System
- ✅ Primary font: Didact Gothic (400 weight) for body text
- ✅ Heading font: Jost (400, 500, 600, 700, 900 weights) for titles
- ✅ Improved typography scale with larger, clearer fonts
- ✅ Enhanced readability: letter-spacing, line-height, antialiasing
- ✅ Responsive font sizes across mobile and desktop

### Submission Flow
- ✅ Professional CTA section with "Wayo Archive Project" title
- ✅ Jost font with blur-in animation (Magic UI TextAnimate)
- ✅ Black button "Add Your Place" with rounded corners
- ✅ Smooth push-up animation (gallery slides up)
- ✅ Story submission form with enhanced typography:
  - Photo upload (R2 direct upload)
  - Question 1: "Where would you take your best friend?" (place name, city, country)
  - Question 2: "Why does this place matter to you?" (story textarea)
  - Optional name field for attribution
  - Optional email field
  - Success/error states with meaningful copy
  - All inputs enlarged to text-3xl for better readability
- ✅ Form saves to Supabase `place_submissions` table (including `why_special` and `name`)
- ✅ Auto-close after successful submission

### Branding
- ✅ Logo image replaced text logo (https://assets.withwayo.com/gallery/1763628951379-xdork-wayo-07.png)
- ✅ Logo sized at h-14 md:h-18 with proper cropping

---

## 📝 TODO LIST

### ~~Phase 1: Simplify Database~~ ✅ COMPLETED (Nov 18)
- ✅ Drop existing `place_submissions` table
- ✅ Create simplified 7-column version
- ✅ Apply migration via Supabase MCP
- ✅ Test insert with sample data

### ~~Phase 2: Build Story Submission Form~~ ✅ COMPLETED (Nov 18)
- ✅ Create `PlaceSubmissionForm.tsx` component
- ✅ Two questions: Place + Why it matters
- ✅ Fields: Place Name, City, Country, Story, Photo Upload, Email (optional)
- ✅ Integrate with R2 upload
- ✅ Submit to Supabase
- ✅ Success/error states with meaningful copy

### ~~Phase 3: Integrate Form with Gallery~~ ✅ COMPLETED (Nov 18-20)
- ✅ Add "Share Your Hidden Gem" CTA button in gallery
- ✅ Smooth push-up animation (no modal, full-screen transition)
- ✅ Editorial aesthetic with minimal design
- ✅ Test end-to-end flow (working!)
- ✅ Update form to include "Why special?" story field
- ✅ Add `why_special` column to database (migration applied Nov 18)
- ✅ Add `name` column to database for optional attribution (migration applied Nov 20)
- ✅ Update `PlaceSubmissionForm.tsx` with story textarea and name field
- ✅ Update form copy to reflect intimate questions
- ✅ Update all documentation to reflect "Wayo Archiving Project" concept

### Phase 4: Upload Real Content & Polish (Week 1 - Day 6-7) 🎯 CURRENT
- [ ] Upload 12-20 real photos with their stories
- [ ] Update SAMPLE_PHOTOS with real R2 URLs and stories
- [ ] Add image texture loading in Three.js
- [x] Update lightbox to display story text
- [x] Replace lightbox with drawer-style detail view (see spec below)
- [ ] Test gallery with real images and stories
- [ ] Mobile responsive design polish
- [ ] SEO optimization (meta tags, Open Graph)
- [ ] Performance optimization (image loading, lazy loading)

### Phase 5: Deploy & Launch (Week 2 - Day 1-3)
- [ ] Deploy to Vercel
- [ ] Setup custom domain (wayo.com or similar)
- [ ] Test on real devices (mobile, tablet, desktop)
- [ ] Soft launch to friends/family
- [ ] Monitor submissions (Supabase dashboard)
- [ ] Fix bugs based on feedback

### Phase 6: Marketing & Growth (Week 2-3)
- [ ] Prepare ad campaigns (Meta, Google)
- [ ] Create social media assets
- [ ] Launch paid ads ($500-1000 budget)
- [ ] Monitor metrics (visits, submissions, conversion rate)
- [ ] Iterate based on data

---

## 🎨 USER JOURNEY

```
1. Landing
   └─ User sees 3D gallery of meaningful places, each with its story
   └─ Gentle floating animation creates sense of discovery

2. Curiosity
   └─ User clicks a photo
   └─ Cinematic zoom reveals the place and why it matters to someone
   └─ Reads a personal memory: "I brought my grandmother here on her 80th birthday..."

3. Inspired
   └─ User clicks "Share Your Hidden Gem"
   └─ Gallery smoothly slides up, revealing thoughtful form

4. Reflection
   User answers two questions:
   ├─ "Where's the one place you'd take your best friend?"
   │   └─ Place name, city, country
   ├─ "Why does this place matter to you?"
   │   └─ A memory, a feeling, a moment (text area)
   ├─ Uploads one photo that captures its essence
   └─ Optionally shares their name and email

5. Connection
   ├─ Photo uploads to R2
   ├─ Story saves to archive
   └─ "Thanks for sharing. Your place will become part of someone's journey."

6. Curation
   └─ We manually review for authenticity and emotional resonance
   └─ Approved stories join the growing archive
```

---

## 🔧 DEVELOPMENT WORKFLOW

### Run Dev Server
```bash
cd /Users/deedsofaraway/Desktop/wayo/web-app
npm run dev -- -p 3001

# Visit:
# - http://localhost:3001 (main gallery)
# - http://localhost:3001/upload-test (R2 testing)
```

### Apply Database Changes
```bash
# Use Supabase MCP tools
mcp__supabase__apply_migration --name "simplify_place_submissions" --query "..."
mcp__supabase__list_tables  # Verify
```

### Deploy to Vercel
```bash
# Automatic on git push to main
git add .
git commit -m "feat: add submission form"
git push origin main

# Or manual
vercel --prod
```

---

## 📊 SUCCESS METRICS

**Week 1-2 (Development):**
- ✅ Simplified database schema
- ✅ Working submission form
- ✅ Real photos in gallery
- ✅ Deployed to Vercel

**Week 3-4 (Soft Launch to Intimate Circle):**
- 🎯 50+ heartfelt stories submitted
- 🎯 100+ unique visitors from personal networks
- 🎯 <2% form abandonment rate (meaningful engagement)
- 🎯 Zero critical bugs
- 🎯 High-quality stories with emotional resonance

**Month 2 (Thoughtful Growth):**
- 🎯 500+ curated submissions (not just quantity)
- 🎯 1000+ visitors who resonate with the concept
- 🎯 10%+ submission rate (people feel compelled to share)
- 🎯 <$0.50 cost per meaningful submission
- 🎯 Building an archive that feels personal and authentic

---

## 🔐 ENVIRONMENT VARIABLES

**Already configured in `.env.local`:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dpawuocnpwjwnwmmztkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=f1b1d96b8f9550638a5e93bd58a2ce6e
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=wayo
NEXT_PUBLIC_R2_PUBLIC_URL=...
```

---

## 🚨 IMPORTANT NOTES

### Relationship to Parent Project
- **This web-app** = Landing page for data collection
- **Parent Wayo Platform** = Full creator marketplace (mobile app + AI + social)
- **KOPLE** = Separate trip game (keep running, don't break)

### What Happens to Shared Stories?
1. **Short term:** We read each submission and select ones with authentic emotional resonance
2. **Medium term:** Approved stories appear in the 3D gallery for others to discover
3. **Long term:** These meaningful places become the foundation of the Wayo creator marketplace

### Security
- ✅ Anonymous submissions allowed (no auth)
- ✅ RLS policies prevent public reads (only admins)
- ✅ R2 pre-signed URLs (direct client upload)
- ⚠️ Add spam protection before ads (rate limiting, honeypot)

---

## 🔗 RELATED DOCS

- **Parent:** [/MASTER-PLAN.md](/MASTER-PLAN.md) - Control tower for entire Wayo platform
- **Reference:** `/wayo-webapp/wayo-game/` - KOPLE codebase (GPS, missions, Supabase)
- **Setup:** `R2-SETUP-GUIDE.md` - Cloudflare R2 configuration
- **Walkthrough:** `R2-BUCKET-SETUP-WALKTHROUGH.md` - Step-by-step R2 setup

---

## 🎯 NEXT IMMEDIATE STEPS

1. **Upload real photos** - 12-20 places with their stories and names
2. **Update SAMPLE_PHOTOS** - Replace color placeholders with real R2 URLs, stories, and author names
3. **Add image texture loading** - Load actual photos in Three.js gallery
4. **Ship drawer redesign** - ✅ Implemented bottom drawer with PT Serif story text and name header
5. **Update lightbox content** - ✅ Story text (PT Serif), photo, caption (place + city/country), name fallback
6. **Test with real data** - Ensure gallery displays real submissions beautifully
7. **Mobile responsive polish** - Optimize for phone/tablet viewing
8. **SEO optimization** - Meta tags, Open Graph, proper titles
9. **Deploy** - Push to Vercel for soft launch

---

## 🎨 LIGHTBOX → DRAWER REDESIGN (IN PROGRESS)

- **Reference look:** Match the foam drawer vibe from the provided screenshot — dark backdrop, bottom-up drawer, centered content, luxe typography.
- **Animation:** Drawer slides up from the bottom (ease-out ~650ms). Stagger the story copy so it slides horizontally into place after the drawer begins to open. Close animates back down.
- **Story typography:** Render `place_submissions.why_special` in PT Serif only inside this drawer. Add the Google font link (see below) scoped to the drawer or via `next/font` (no global change). Default body stays on Jost.
- **Image placement:** Photo sits below the story. Load via `photo_url` with a Cloudflare transform for quick fetch, e.g. append `?width=1200&quality=80&format=auto&fit=cover`. Rounded corners and soft shadow.
- **Caption:** Under the photo, use Jost for `place_name` and below it `(city, country)` in smaller/light weight. Keep capitalization tasteful (no forced all-caps).
- **Layout:** Drawer spans full width, ~75vh height, generous padding (top close icon, breathing room above story). Background: near-black with subtle gradient; blur/dim the gallery behind.
- **Close affordance:** Keep top-left/right close “X” plus backdrop click to dismiss. Ensure focus trap and ESC close for accessibility.
- **Files to touch:** `components/PhotoLightbox.tsx` (layout + animation), `app/layout.tsx` or `app/globals.css` for font import/scoping.
- **Font include:**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  ```
  Use class helpers for PT Serif (regular/bold/italic) only on the drawer story text.

### Implementation checklist
- [x] Swap lightbox for drawer container with backdrop blur/dim (bottom slide, 75vh height)
- [x] Animate drawer slide + staggered text slide-in
- [x] Apply PT Serif to `why_special` only; keep other text on Jost
- [x] Load photo via `photo_url` with Cloudflare transform
- [x] Add caption: `place_name` then `(city, country)` in Jost
- [x] Wire ESC/backdrop/close button interactions
- [ ] Test on mobile + desktop for smoothness and readability

---

## 📋 SESSION SUMMARY (Nov 20, 2024 - Typography & UI Polish)

### Database Updates
- ✅ Added `name` field to `place_submissions` table (nullable TEXT)
- ✅ Applied migration via Supabase MCP
- ✅ Updated form to collect optional user names for attribution

### Typography Overhaul
- ✅ Implemented **Didact Gothic** as primary body font (400 weight)
- ✅ Added **Jost** font for headings (400, 500, 600, 700, 900 weights)
- ✅ Increased base font size from 16px to 18px
- ✅ Enhanced readability with improved letter-spacing and line-height
- ✅ Applied font-smoothing (antialiased) across all text
- ✅ Scaled up all form inputs to text-3xl for better UX
- ✅ Enlarged all labels, buttons, and helper text

### UI/UX Improvements
- ✅ Redesigned CTA section:
  - Changed title from "Share Your Hidden Gem" to "Wayo Archive Project"
  - Split title into 3 lines (Wayo / Archive / Project)
  - Applied Jost bold (700) with line-height 0.95
  - Added **Magic UI blur-in animation** to title
- ✅ Replaced elaborate animation with clean black button "Add Your Place"
- ✅ Button: rounded-full, responsive width, smooth hover effects
- ✅ Removed subtitle text for cleaner design

### Branding
- ✅ Replaced text logo "wayo" with image logo
- ✅ Logo URL: https://assets.withwayo.com/gallery/1763628951379-xdork-wayo-07.png
- ✅ Properly sized and cropped logo (h-14 md:h-18)

### Technical Additions
- ✅ Created `TextAnimate.tsx` component (Magic UI style)
- ✅ Installed dependencies: `clsx`, `tailwind-merge`
- ✅ Created `lib/utils.ts` for className utilities
- ✅ Integrated Framer Motion animations

### Files Modified
- `app/layout.tsx` - Added Didact Gothic and Jost fonts
- `app/globals.css` - Enhanced typography scale and readability
- `app/page.tsx` - Redesigned CTA section, added logo, integrated TextAnimate
- `components/PlaceSubmissionForm.tsx` - Added name field, enlarged all inputs
- `components/TextAnimate.tsx` - NEW: Blur-in animation component
- `lib/utils.ts` - NEW: Utility functions

**Progress:** ~87% Complete (Typography & branding complete, need drawer redesign + real photos)

---

**Last Updated:** November 20, 2024 (End of Session)
**Owner:** Web Team
**Status:** ✅ Phase 1-3 Complete (Story & Name Fields Added!) | 🎯 Phase 4 - Real Content & Polish
**Next Session:** Drawer redesign with PT Serif + real photo uploads
