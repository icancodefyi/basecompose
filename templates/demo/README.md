# Demo Addon

## What it adds

- **Health check API** at `/api/health` that reports stack features
- **Hero component** integrated into homepage that displays:
  - Frontend status (Next.js)
  - Database status (MongoDB, if selected)
  - Authentication status (Auth.js, if selected)

## Files injected

- `api/health/route.ts` - API endpoint that checks feature availability
- `lib/components/demo-hero.tsx` - Reusable hero component for homepage

## How it works

The demo addon provides:

1. **Backend health check**: Verifies which addons are properly configured
2. **Frontend visualization**: Shows feature cards on the homepage indicating what's enabled

The component automatically detects:
- ✅ Next.js (always enabled)
- 🗄️ Database (MongoDB if connected)
- 🔐 Authentication (Auth.js if available)

## Usage in generated app

The home page automatically imports and displays the `DemoHero` component in the hero section. It calls `/api/health` on load to determine which features are available and displays them as feature cards.
