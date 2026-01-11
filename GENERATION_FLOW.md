# Layered Generation Flow - Complete Overview

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│ User Opens http://localhost:3000                            │
│ Sees Stack Builder UI with Technology Options              │
│                                                             │
│ Selects:                                                    │
│ - Framework: Next.js ✓                                      │
│ - Database: MongoDB (optional)                              │
│ - Auth: Auth.js (optional)                                  │
│ - Clicks "Generate & Download"                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend (app/page.tsx)                                      │
│ - Collects user selections into StackBlueprint              │
│ - Makes POST to /api/generate                               │
│ - Receives tar.gz file                                      │
│ - Triggers browser download                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ API Route (app/api/generate/route.ts)                       │
│ - Receives POST request with StackBlueprint JSON            │
│ - Calls generateProject(blueprint)                          │
│ - Returns tar.gz buffer with Content-Type: application/gzip │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Generation Pipeline (packages/engine/generate.ts)           │
│ Creates temp directory at: /tmp/layered-XXXXX/project       │
│                                                             │
│ Step 1: Copy Framework Base                                 │
│ ────────────────────────────────────────────────────────────│
│ packages/engine/copy.ts::copyFrameworkBase()                │
│ - Copies templates/frameworks/nextjs/base/* → /tmp/.../     │
│ - Copies templates/frameworks/nextjs/docker/* → /tmp/.../   │
│                                                             │
│ Project now has:                                            │
│   ├── app/                                                  │
│   ├── public/                                               │
│   ├── package.json (with mongodb, next-auth deps)          │
│   ├── Dockerfile                                            │
│   └── .dockerignore                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Apply Addons                                        │
│ ────────────────────────────────────────────────────────────│
│ packages/engine/copy.ts::copyAddonFiles()                   │
│                                                             │
│ For each selected addon:                                    │
│                                                             │
│ IF database == "mongodb":                                   │
│   - Copy templates/databases/mongodb/client.ts              │
│     → app/lib/db/mongodb.ts                                 │
│   - Addon state updated: selectedAddons += "mongodb"        │
│                                                             │
│ IF auth == "authjs":                                        │
│   - Copy templates/auth/authjs/config.ts                    │
│     → app/lib/auth/config.ts                                │
│   - Copy templates/auth/authjs/routes/[...nextauth].ts      │
│     → app/api/auth/[...nextauth].ts                         │
│   - Addon state updated: selectedAddons += "authjs"         │
│                                                             │
│ ALWAYS (demo):                                              │
│   - Copy templates/demo/ui/page.tsx                         │
│     → app/lib/components/demo-hero.tsx                      │
│   - Copy templates/demo/api/health.ts                       │
│     → app/api/health.ts                                     │
│   - Addon state updated: selectedAddons += "demo"           │
│                                                             │
│ app/page.tsx already imports DemoHero component             │
│ Files are now in place for generation                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Docker Compose Generation                           │
│ ────────────────────────────────────────────────────────────│
│ packages/engine/emit/docker.ts                              │
│                                                             │
│ collectDockerFragments(state):                              │
│   - For "mongodb" addon:                                    │
│     Load templates/databases/mongodb/docker/                │
│     docker-compose.mongo.yml                                │
│     Add to state.dockerFragments                            │
│                                                             │
│ collectDockerVolumes(state):                                │
│   - For "mongodb": add mongo_data volume                    │
│                                                             │
│ mergeDockerComposeDev(state):                               │
│   Base services:                                            │
│   ├── app:                                                  │
│   │   ├── build: {context: ., dockerfile: Dockerfile}       │
│   │   ├── command: pnpm dev                                 │
│   │   ├── ports: ["3000:3000"]                              │
│   │   ├── volumes: [.:/app, /app/node_modules]              │
│   │   ├── environment:                                      │
│   │   │   ├── NODE_ENV: development                         │
│   │   │   └── MONGODB_URI: mongodb://mongodb:27017/layered  │
│   │   └── depends_on: [mongodb]                             │
│   └── mongodb:                                              │
│       ├── image: mongo:7                                    │
│       ├── ports: ["27017:27017"]                            │
│       └── volumes: [mongo_data:/data/db]                    │
│                                                             │
│ mergeDockerComposeProd(state):                              │
│   Same base but with:                                       │
│   ├── restart: always                                       │
│   ├── MONGO_INITDB_ROOT_USERNAME: root                      │
│   ├── MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}         │
│   └── NODE_ENV: production                                  │
│                                                             │
│ writeDockerCompose(state):                                  │
│   - Write docker-compose.dev.yml                            │
│   - Write docker-compose.prod.yml                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Environment Variables                               │
│ ────────────────────────────────────────────────────────────│
│ packages/engine/emit/env.ts                                 │
│                                                             │
│ collectAddonEnv(state):                                     │
│   For each addon:                                           │
│   - Load addon/env.ts                                       │
│   - Parse export const env = {...}                          │
│   - Add to state.env                                        │
│                                                             │
│ MongoDB env.ts exports:                                     │
│   { MONGODB_URI, MONGODB_ROOT_USERNAME,                     │
│     MONGODB_ROOT_PASSWORD }                                 │
│                                                             │
│ writeEnvExample(state):                                     │
│   Create .env.example with all addon env vars:              │
│                                                             │
│   MONGODB_URI=mongodb://mongodb:27017/layered               │
│   MONGODB_ROOT_USERNAME=root                                │
│   MONGODB_ROOT_PASSWORD=example                             │
│   GITHUB_ID=                                                │
│   GITHUB_SECRET=                                            │
│   NEXTAUTH_URL=http://localhost:3000                        │
│   NEXTAUTH_SECRET=                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Additional Files                                    │
│ ────────────────────────────────────────────────────────────│
│                                                             │
│ Create .gitignore:                                          │
│   node_modules/                                             │
│   .next/                                                    │
│   .env.local                                                │
│   .env*.local                                               │
│   .DS_Store                                                 │
│                                                             │
│ Copy SETUP.md from templates/shared/README_SETUP.md         │
│   - Quick start instructions                                │
│   - Project structure overview                              │
│   - Development vs production modes                         │
│   - Common commands                                         │
│   - Troubleshooting guide                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Archive as tar.gz                                   │
│ ────────────────────────────────────────────────────────────│
│                                                             │
│ Using tar.create():                                         │
│   - Gzip compression enabled                                │
│   - Archive path: /tmp/layered-XXXXX/project.tar.gz         │
│   - Includes entire project directory                       │
│                                                             │
│ Read buffer into memory:                                    │
│   - fs.readFileSync(zipPath) → Buffer                       │
│                                                             │
│ Return to API route                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Final Response                                              │
│ ────────────────────────────────────────────────────────────│
│                                                             │
│ HTTP 200 OK                                                 │
│ Content-Type: application/gzip                              │
│ Content-Disposition: attachment; filename="layered-stack..."│
│ Body: tar.gz Buffer                                         │
│                                                             │
│ Browser downloads: layered-stack.tar.gz                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ User Extracts & Runs                                        │
│ ────────────────────────────────────────────────────────────│
│                                                             │
│ $ tar -xzf layered-stack.tar.gz                             │
│ $ cd project                                                │
│                                                             │
│ $ pnpm install                                              │
│ $ pnpm dev                                                  │
│                                                             │
│ OR                                                          │
│                                                             │
│ $ docker compose -f docker-compose.dev.yml up              │
│                                                             │
│ ✅ Running at http://localhost:3000                         │
│    with hot reload and all features enabled                │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Template-Based Generation (Not AI)
- **Why:** Reliable, reproducible, version-controlled
- **How:** Copy real files from templates/, merge configs
- **Benefit:** Users get guaranteed working projects

### 2. Separate Dev & Prod Docker Compose
- **Why:** Optimized for different use cases
- **Dev:** Hot reload, no auth, local development DX
- **Prod:** Secure, persistent, auto-recovery

### 3. File Placement Convention
- **MongoDB:** `app/lib/db/mongodb.ts`
- **Auth.js:** `app/api/auth/[...nextauth].ts`
- **Demo:** `app/lib/components/demo-hero.tsx`
- **Benefit:** Predictable, easy to extend

### 4. Environment Variable Pattern
- **Each addon exports:** `export const env = { ... }`
- **Generator parses and documents** in `.env.example`
- **User fills in values** before running

### 5. Setup Guide Inclusion
- **Every generated project** includes `SETUP.md`
- **Clear instructions** for dev and prod modes
- **Troubleshooting** for common issues

## Performance Characteristics

- **Generation Time:** ~500ms (framework copy + addons)
- **Archive Size:** ~20-30 MB tar.gz (includes node_modules)
- **Extraction Time:** ~2-5 seconds
- **First Dev Run:** ~10-15 seconds (pnpm install, Next.js prep)
- **First Docker Run:** ~30-60 seconds (build + startup)

## Error Handling

- **Template missing:** Warns but continues
- **Docker fragment parse error:** Warns but continues
- **Env.ts parse error:** Skips, documents in .env.example
- **File copy error:** Throws and stops generation
- **Archive error:** Throws to API (500 response)

## Extensibility

### Adding New Addons
1. Create `templates/category/addon-name/` folder
2. Add addon files in standard locations
3. Optionally add `docker/docker-compose.addon.yml`
4. Add `env.ts` with export const env = {...}
5. Update `stack-config.ts` to register addon
6. Update `determineAddons()` logic in generate.ts
7. Generator automatically includes it

### Adding New Frameworks
1. Create `templates/frameworks/framework-name/`
2. Create `base/` (scaffold) and `docker/` (container)
3. Update `copyFrameworkBase()` in copy.ts
4. Update type definitions to include framework
5. Generator ready for new framework

### Custom Generation Rules
1. Modify `determineAddons()` for business logic
2. Modify Docker merge functions for custom compose
3. Modify `copyAddonFiles()` for custom file placement
4. All changes in `packages/engine/`
