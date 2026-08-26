# YOKAI

YOKAI is a dependency-free cinematic frontend prototype. It is ready to publish as a static website: upload the repository contents (not the parent folder) to any static host.

## Run locally

```bash
npm start
```

Open `http://localhost:4173`. Every screen can be opened directly with a hash, for example `/#characters`, `/#chat`, and `/#profile`.

## Verify before publishing

```bash
npm run build
```

The build command performs syntax and deployment checks; there is no asset compilation step or package installation required.

## Publish

### Netlify / Cloudflare Pages / Vercel

Create a static-site project and deploy the repository root. Use these settings:

- **Build command:** `npm run build` (optional but recommended)
- **Publish directory:** `.`

### GitHub Pages

Deploy the repository root with GitHub Pages. All application asset links are relative, so it works from a repository subpath. The application uses hash navigation, so no rewrite rule is required.

## Included production safeguards

- Responsive mobile layout and a reduced-motion setting.
- A `404.html` fallback styled to match YOKAI.
- Metadata, web manifest, and a deploy-time validation script.
- Relative asset paths suitable for root-domain and subpath static hosting.

## Scope

This repository is a static frontend. Authentication, databases, image storage, real-time presence, and production AI require a separate backend and credentials; none are represented as a live service here.
