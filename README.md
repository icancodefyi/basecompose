# BaseCompose

AI-powered stack generator for full-stack applications. Chat with AI to configure your stack, get Docker Compose files instantly.

## Features

- 🤖 **AI-Powered**: Natural language stack configuration using Gemini AI
- 📦 **Full Stack Templates**: Frontend, backend, database, auth — all pre-configured
- 🐳 **Docker Ready**: Generates production-ready docker-compose.yml files
- ⚡ **Instant Download**: Get your complete stack as a ZIP file
- 🎯 **Smart Resolution**: Automatically resolves dependencies (e.g., auth requires database)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment

Create `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting!

## Architecture

This is a **pnpm monorepo** with internal packages:

```
BaseCompose/
├── app/                    # Next.js application
│   ├── api/chat/          # AI chat endpoint
│   ├── api/generate/      # Stack generator endpoint
│   └── page.tsx           # Main UI
└── packages/
    ├── engine/            # Stack generation logic
    │   ├── resolve.ts     # Dependency resolution
    │   ├── generate.ts    # File orchestration
    │   └── emit/          # File generators
    └── types/             # Shared types & config
        ├── blueprint.ts   # Stack type definitions
        └── stack-config.ts # Technology catalog
```

## Available Stacks

- **Frontend**: Next.js
- **Backend**: Node.js, FastAPI
- **Database**: PostgreSQL
- **Auth**: Auth.js

## Contributing

Want to add support for React, Go, MySQL, or other technologies? Check out [CONTRIBUTING.md](CONTRIBUTING.md) for a step-by-step guide.

All stack options are centralized in [`packages/types/stack-config.ts`](packages/types/stack-config.ts) — adding new tech is as simple as adding an object to the config!

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS 4
- **AI**: Google Gemini 2.5 Flash
- **Monorepo**: pnpm workspaces
- **Language**: TypeScript (strict mode)
