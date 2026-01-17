# BaseCompose Development Documentation

## System Architecture

BaseCompose is a **template-based** project generator that creates complete, production-ready Next.js applications with selected technology stacks.

### How It Works

1. **User Selection** - User selects stack components via the UI (Next.js + optional MongoDB, Auth.js)
2. **Blueprint Creation** - Selections converted to `StackBlueprint` object
3. **API Generation** - POST to `/api/generate` with blueprint
4. **Generation Pipeline** - Server-side generation orchestrates:
   - Copy framework base (Next.js scaffold)
   - Copy addon files (MongoDB client, Auth.js config, Demo component)
   - Merge Docker Compose files (dev and prod variants)
   - Generate environment variables documentation
   - Create setup guide
   - Archive as tar.gz
5. **Download** - User downloads ready-to-run project

## Project Structure

```
/
├── app/
│   ├── page.tsx              # Stack builder UI
│   ├── api/generate/         # Generation API endpoint
│   └── components/           # UI components
│
├── packages/
│   ├── engine/               # Generation orchestration
│   │   ├── generate.ts       # Main pipeline
│   │   ├── copy.ts           # File operations
│   │   ├── types.ts          # Type definitions
│   │   └── emit/
│   │       ├── docker.ts     # Docker Compose generation
│   │       └── env.ts        # Environment variable collection
│   │
│   └── types/                # Shared type definitions
│       ├── blueprint.ts      # StackBlueprint type
│       └── stack-config.ts   # Available stack options
│
└── templates/                # Template files copied during generation
    ├── frameworks/nextjs/    # Next.js base scaffold
    ├── databases/mongodb/    # MongoDB addon files
    ├── auth/authjs/          # Auth.js addon files
    ├── demo/                 # Feature showcase addon
    └── shared/               # Shared configs (docker-compose, setup guide)
```

## Key Files & Responsibilities

### Generation Engine

**`packages/engine/generate.ts`** (Main Orchestrator)
- Creates temporary directory for generation
- Coordinates 7-step pipeline
- Handles file cleanup
- Returns tar.gz buffer

**`packages/engine/copy.ts`** (File Operations)
- `copyFrameworkBase()` - Copies Next.js scaffold + Dockerfile
- `copyAddonFiles()` - Places addon files in correct locations
- Handles recursive directory copying

**`packages/engine/emit/docker.ts`** (Docker Compose)
- `mergeDockerComposeDev()` - Creates dev compose with:
  - `command: pnpm dev` for explicit dev mode
  - Volume mounts (`.:/app`, `/app/node_modules`) for hot reload
  - No authentication (dev defaults)
  - `depends_on` for service startup order
- `mergeDockerComposeProd()` - Creates prod compose with:
  - Authentication enabled
  - `restart: always` policies
  - Environment variable configuration
- `writeDockerCompose()` - Writes both dev and prod files

**`packages/engine/emit/env.ts`** (Environment Variables)
- Parses addon `env.ts` files
- Generates `.env.example` file
- Documents required and optional variables

### Templates

**Next.js Base** (`templates/frameworks/nextjs/base/`)
- Complete Next.js App Router scaffold
- Includes Tailwind CSS, TypeScript, ESLint
- `package.json` with MongoDB and Next-auth dependencies
- Imports demo component in `app/page.tsx`

**MongoDB Addon** (`templates/databases/mongodb/`)
- `client.ts` - MongoDB connection helper
- `env.ts` - Environment variable definitions
- `docker/docker-compose.mongo.yml` - Service fragment
- `README.md` - Setup documentation

**Auth.js Addon** (`templates/auth/authjs/`)
- `config.ts` - NextAuth configuration with GitHub OAuth
- `routes/[...nextauth].ts` - Route handler
- `env.ts` - GitHub OAuth and NextAuth env vars
- `README.md` - OAuth setup instructions

**Demo Addon** (`templates/demo/`)
- `api/health.ts` - Health check endpoint
- `ui/page.tsx` - DemoHero component (integrated into homepage)
- Shows feature availability (Next.js ✅, Database status, Auth status)

**Shared** (`templates/shared/`)
- `docker-compose.dev.yml` - Development environment
- `docker-compose.prod.yml` - Production environment
- `README_SETUP.md` - Comprehensive setup guide

## Development & Production Modes

### Development (`docker-compose.dev.yml`)
```yaml
- Command: pnpm dev (explicit dev command)
- Volume Mounts: .:/app, /app/node_modules (hot reload)
- MongoDB: No authentication
- Depends On: Ensures service startup order
- Best For: Quick iteration, testing locally
```

### Production (`docker-compose.prod.yml`)
```yaml
- Environment: NODE_ENV=production
- Restart: always (auto-recovery)
- MongoDB: With authentication (username/password)
- Database Persistence: mongo_data volume
- Best For: Deployment, testing production setup
```

## API Usage

### Generate Project

**Endpoint:** `POST /api/generate`

**Request:**
```json
{
  "intent": "saas",
  "framework": "nextjs",
  "database": "mongodb",
  "auth": "authjs"
}
```

**Response:**
- 200: tar.gz file (application/gzip)
- 500: Error with message

## Environment Variables

Generated projects include `.env.example` with:

**MongoDB:**
- `MONGODB_URI` - Connection string
- `MONGODB_ROOT_USERNAME` - Database user
- `MONGODB_ROOT_PASSWORD` - Database password

**Auth.js:**
- `GITHUB_ID` - GitHub OAuth application ID
- `GITHUB_SECRET` - GitHub OAuth secret
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Session encryption key

## Testing the System

1. **Start Development Server:**
   ```bash
   pnpm dev
   ```

2. **Open UI:**
   ```
   http://localhost:3000
   ```

3. **Generate Project:**
   - Select stack components
   - Click "Generate & Download"
   - Extract downloaded tar.gz

4. **Run Generated Project:**
   ```bash
   cd extracted-project
   
   # Development Mode
   pnpm install
   pnpm dev
   # OR
   docker compose -f docker-compose.dev.yml up
   
   # Production Mode
   docker compose -f docker-compose.prod.yml up --build
   ```

## Common Issues & Solutions

### Hot Reload Not Working
- Ensure using `docker-compose.dev.yml` (not prod)
- Check volume mounts in compose file
- Try: `docker compose restart app`

### MongoDB Connection Failed
- Check `MONGODB_URI` matches compose service name: `mongodb://mongodb:27017`
- Verify MongoDB container is running: `docker compose ps`
- View logs: `docker compose logs mongodb`

### Port Already in Use
- Change port in docker-compose.yml: `app.ports: ["3001:3000"]`
- Or stop other containers using the port

### Container Filesystem Issues
- Stop and remove containers: `docker compose -f docker-compose.dev.yml down -v`
- Restart: `docker compose -f docker-compose.dev.yml up`

## Future Enhancements

- [ ] PostgreSQL + Prisma support
- [ ] Redis caching addon
- [ ] Elasticsearch integration
- [ ] Multiple framework options (Astro, Remix)
- [ ] Cloud deployment presets (Vercel, Railway, Render)
- [ ] Email service integration
- [ ] Payment processing (Stripe)
- [ ] Analytics integration

## Tech Stack

- **Framework:** Next.js 16+ (App Router, TypeScript)
- **Package Manager:** pnpm
- **Templating:** File-based (not AI code generation)
- **Docker:** Development and production configurations
- **Archiving:** tar.gz for project distribution
- **Types:** TypeScript with strict mode
