# Quick Start Guide - Layered Stack Generator

## Installation & Setup

### Prerequisites
- Node.js 20+ (required for Next.js 16)
- pnpm (package manager)
- Docker & Docker Compose (optional, for containerized testing)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:3000
```

## Using Layered

### Step 1: Generate a Project

1. Open http://localhost:3000
2. Select stack components:
   - **Framework:** Next.js (required)
   - **Database:** MongoDB (optional)
   - **Authentication:** Auth.js (optional)
3. Click **"Generate & Download"**
4. Browser downloads: `layered-stack.tar.gz`

### Step 2: Extract & Setup

```bash
# Extract the archive
tar -xzf layered-stack.tar.gz
cd project

# View setup instructions
cat SETUP.md

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Fill in any required values (OAuth, secrets, etc.)
```

### Step 3: Development

**Option A: Local Development (Recommended for fast iteration)**

```bash
pnpm dev
# Visit http://localhost:3000
# Hot reload enabled, changes reflect immediately
```

**Option B: Docker Development (Isolated environment)**

```bash
docker compose -f docker-compose.dev.yml up
# Visit http://localhost:3000
# Includes MongoDB, hot reload via volume mounts
```

### Step 4: Production Testing

```bash
# Build and run production image
docker compose -f docker-compose.prod.yml up --build
# Visit http://localhost:3000
# All features enabled with security hardening
```

## Troubleshooting

### Port 3000 Already in Use

**Option 1: Change port in docker-compose**
```yaml
# In docker-compose.dev.yml or docker-compose.prod.yml
services:
  app:
    ports:
      - "3001:3000"  # Use 3001 instead of 3000
```

**Option 2: Stop other services**
```bash
# List services using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker compose ps

# View MongoDB logs
docker compose logs mongodb

# Reset MongoDB (caution: deletes data)
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up

# Check connection string in .env.local
# Should be: mongodb://mongodb:27017/layered (in Docker)
# Or: mongodb://localhost:27017/layered (local MongoDB)
```

### Hot Reload Not Working

```bash
# Ensure using dev compose file (not prod)
docker compose -f docker-compose.dev.yml up

# Restart container
docker compose -f docker-compose.dev.yml restart app

# Verify volume mounts
docker inspect <container-id> | grep -A 10 "Mounts"

# Check app logs
docker compose logs app
```

### Authentication Issues

```bash
# GitHub OAuth not configured?
# 1. Create OAuth app at: https://github.com/settings/developers
# 2. Add GITHUB_ID and GITHUB_SECRET to .env.local
# 3. Set NEXTAUTH_SECRET: openssl rand -hex 32
# 4. Restart app: docker compose restart app
```

### Missing Dependencies

```bash
# Reinstall if node_modules corrupted
rm -rf node_modules .next
pnpm install
pnpm dev

# In Docker:
docker compose down -v
docker compose -f docker-compose.dev.yml up --build
```

## Common Commands

### Development

```bash
# Install dependencies
pnpm install

# Start dev server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Docker

```bash
# Development setup
docker compose -f docker-compose.dev.yml up        # Start
docker compose -f docker-compose.dev.yml down      # Stop
docker compose -f docker-compose.dev.yml down -v   # Stop + remove volumes

# Production setup
docker compose -f docker-compose.prod.yml up --build
docker compose -f docker-compose.prod.yml down

# View logs
docker compose logs app           # App logs only
docker compose logs mongodb       # MongoDB logs only
docker compose logs -f            # Follow all logs

# Execute commands in container
docker compose exec app pnpm build
docker compose exec mongodb mongosh  # MongoDB shell
```

## File Structure Reference

```
Generated Project
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth].ts    (if Auth.js selected)
│   │   └── health.ts                (demo feature check)
│   ├── lib/
│   │   ├── components/
│   │   │   └── demo-hero.tsx        (feature showcase)
│   │   ├── db/
│   │   │   └── mongodb.ts           (if MongoDB selected)
│   │   └── auth/
│   │       └── config.ts            (if Auth.js selected)
│   ├── layout.tsx
│   └── page.tsx                     (homepage with DemoHero)
├── public/                          (static files)
├── .env.example                     (environment template)
├── .env.local                       (create from .env.example)
├── .gitignore
├── Dockerfile                       (production image)
├── docker-compose.dev.yml          (development environment)
├── docker-compose.prod.yml         (production environment)
├── docker-compose.yml              (default = dev)
├── SETUP.md                        (comprehensive setup guide)
├── package.json                    (dependencies)
├── tsconfig.json
└── README.md                       (project README)
```

## Development Modes

### Local Development (pnpm dev)
- **Best for:** Rapid iteration, debugging
- **Startup:** Instant
- **Hot Reload:** Yes
- **Database:** External or local MongoDB
- **Docker:** Not used
- **Command:** `pnpm dev`

### Docker Development (docker-compose.dev.yml)
- **Best for:** Testing with exact production setup
- **Startup:** ~5-10 seconds (pull images, start containers)
- **Hot Reload:** Yes (volume mounts)
- **Database:** MongoDB in container
- **Docker:** Required
- **Command:** `docker compose -f docker-compose.dev.yml up`

### Docker Production (docker-compose.prod.yml)
- **Best for:** Final testing before deployment
- **Startup:** ~30-60 seconds (build + start)
- **Hot Reload:** No
- **Database:** MongoDB with authentication
- **Docker:** Required
- **Command:** `docker compose -f docker-compose.prod.yml up --build`

## Feature Checklist

Each generated project includes:

- [x] Next.js with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS styling
- [x] ESLint configuration
- [x] Docker support (dev & prod)
- [x] Environment variables setup
- [x] Feature showcase (DemoHero component)
- [x] Health check endpoint (api/health)

Optional features (if selected):

- [ ] MongoDB (document database)
- [ ] Auth.js (authentication with GitHub OAuth)

## Next Steps After Generation

1. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Fill in required values (OAuth tokens, secrets, etc.)
   ```

2. **Start Development**
   ```bash
   pnpm install
   pnpm dev
   # Visit http://localhost:3000
   ```

3. **Build Your Features**
   - Add routes in `app/api/`
   - Create components in `app/components/`
   - Build database models in `app/lib/db/` (if MongoDB)
   - Implement authentication flows (if Auth.js)

4. **Deploy**
   - For Vercel: `git push` (automatic)
   - For Docker: `docker build -t myapp . && docker run -p 3000:3000 myapp`
   - For other platforms: Follow their Next.js deployment guides

## Support & Documentation

- **SETUP.md** - Comprehensive setup guide in every generated project
- **DEVELOPMENT.md** - Detailed system architecture in this repo
- **GENERATION_FLOW.md** - Complete generation pipeline visualization
- **SYSTEM_STATUS.md** - Feature checklist and status

## Reporting Issues

When reporting issues, include:

1. What you're trying to do
2. What error you see
3. Command you ran
4. Your environment (OS, Node version, Docker version)
5. Generated project structure (for addon-specific issues)

## Getting Help

- Check SETUP.md in your generated project first
- Review troubleshooting section above
- Check generated .env.example for required variables
- Verify Docker/MongoDB are running if using containers
- Check logs: `docker compose logs`
