# Layered Generated Project

Your complete, runnable tech stack is ready! 🚀

## Quick Start

### Development Mode

```bash
# Install dependencies
pnpm install

# Run with hot reload (local)
pnpm dev
# Visit http://localhost:3000

# OR run with Docker (includes MongoDB)
docker compose -f docker-compose.dev.yml up
# Visit http://localhost:3000
```

### Production Mode

```bash
# Build and run with Docker
docker compose -f docker-compose.prod.yml up --build
# Visit http://localhost:3000
```

## Project Structure

```
.
├── app/                    # Next.js app
│   ├── api/               # API routes
│   ├── lib/               # Shared utilities
│   └── page.tsx           # Homepage
├── public/                # Static files
├── Dockerfile             # Container image
├── docker-compose.dev.yml # Development setup
├── docker-compose.prod.yml # Production setup
├── .env.example           # Environment variables template
├── .env.local             # Local env (create from .env.example)
└── package.json           # Dependencies
```

## What's Included

- ✅ **Next.js** (App Router, TypeScript)
- ✅ **MongoDB** (if selected)
- ✅ **Auth.js** (if selected)
- ✅ **Demo** (feature showcase on homepage)

## Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in required variables (optional for dev):
   - `MONGODB_URI` - Set if not using Docker
   - `GITHUB_ID` / `GITHUB_SECRET` - For Auth.js
   - `NEXTAUTH_SECRET` - For Auth.js
   - `NEXTAUTH_URL` - For Auth.js

## Common Commands

```bash
# Development
pnpm dev              # Local dev server
docker compose -f docker-compose.dev.yml up   # Dev with Docker

# Building
pnpm build           # Build for production
docker compose -f docker-compose.prod.yml build   # Build Docker image

# Cleanup
docker compose -f docker-compose.dev.yml down     # Stop dev containers
docker compose -f docker-compose.prod.yml down    # Stop prod containers
```

## Development Notes

### Local Development (pnpm dev)
- **Best for:** Quick iteration, no Docker overhead
- **Requirements:** Node.js 20+, pnpm
- **Database:** Use `.env.local` to connect to external MongoDB, or start MongoDB separately:
  ```bash
  docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo:7
  ```

### Docker Development (docker-compose.dev.yml)
- **Best for:** Testing with exact production setup
- **Features:** Hot reload, automatic MongoDB
- **Startup:** `docker compose -f docker-compose.dev.yml up`

### Production (docker-compose.prod.yml)
- **Optimized:** No dev dependencies, secure defaults
- **Database Auth:** Uses environment variable `MONGO_PASSWORD`
- **Startup:** `docker compose -f docker-compose.prod.yml up --build`

## Troubleshooting

**Port already in use:**
```bash
# Change port in docker-compose.yml
# app.ports: ["3001:3000"]
```

**MongoDB connection issues:**
- Check `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running
- Check logs: `docker compose logs mongodb`

**Hot reload not working:**
- Using Docker? Make sure you're using `docker-compose.dev.yml`
- Not seeing changes? Try `docker compose restart app`

**Need to reset MongoDB:**
```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up
```

## Next Steps

- Start coding in `app/page.tsx`
- Add API routes in `app/api/`
- Configure authentication in `app/lib/auth/`
- Connect MongoDB models in `app/lib/db/`

Happy coding! 🚀
