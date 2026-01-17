# Local Development Setup Guide

This guide will help you set up the BaseCompose project locally for development.

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **pnpm**: 8.0.0 or higher
- **MongoDB**: 7.0.0 or higher (for local development)
- **Git**: Latest version

### Install Prerequisites

#### On macOS (using Homebrew)
```bash
brew install node pnpm mongodb-community git
```

#### On Ubuntu/Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

curl -fsSL https://get.pnpm.io/install.sh | sh -
sudo apt-get install -y git

# MongoDB
curl -fsSL https://www.mongodb.com/try/download/community | \
  tar xvz && sudo mv mongodb-linux-*/bin/* /usr/local/bin/
```

#### On Windows
```bash
# Using Chocolatey
choco install nodejs pnpm git mongodb-community
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/icancodefyi/basecompose.git
cd basecompose
```

## Step 2: Install Dependencies

```bash
pnpm install
```

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# AI APIs
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# NextAuth Configuration
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB
MONGODB_URI=mongodb://localhost:27017/basecompose
```

### Getting API Keys

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Copy your API key

**GROQ API Key:**
1. Visit [GROQ Console](https://console.groq.com)
2. Sign up/login
3. Create a new API key

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

## Step 4: Start MongoDB (Local Development)

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows (with MongoDB Community Server installed)
mongod
```

Verify MongoDB is running:
```bash
mongosh
# You should see the MongoDB shell prompt
# Type 'exit' to quit
```

## Step 5: Start the Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 6: Verify Everything is Working

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the BaseCompose landing page
3. Try signing in with Google
4. Create a new project and send a message

## Project Structure

```
basecompose/
├── app/                          # Next.js application
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── chat/                 # Chat endpoint
│   │   ├── generate/             # Stack generation endpoint
│   │   ├── projects/             # Project management
│   │   └── chat/history/         # Chat history management
│   ├── chat/                     # Chat pages
│   │   ├── page.tsx              # Main chat page
│   │   └── [projectId]/page.tsx  # Project-specific chat
│   ├── components/               # React components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions
│   │   ├── mongodb.ts            # MongoDB connection
│   │   ├── auth-utils.ts         # Auth utilities
│   │   └── utils.ts              # General utilities
│   └── layout.tsx                # Root layout
│
├── packages/                     # pnpm workspaces
│   ├── engine/                   # Generation engine
│   │   ├── generate.ts           # Main generation logic
│   │   ├── copy.ts               # File operations
│   │   ├── emit/                 # Output generation
│   │   └── types.ts              # Type definitions
│   └── types/                    # Shared types
│       ├── blueprint.ts          # StackBlueprint type
│       └── stack-config.ts       # Stack options
│
├── templates/                    # Template files
│   ├── frameworks/nextjs/        # Next.js scaffold
│   ├── databases/mongodb/        # MongoDB addon
│   ├── auth/authjs/              # Auth.js addon
│   ├── demo/                     # Demo addon
│   └── shared/                   # Shared configs
│
├── lib/                          # Root-level utilities
├── components/                   # Root-level components
├── public/                       # Static assets
├── .github/                      # GitHub templates
├── scripts/                      # Development scripts
└── [config files]                # TypeScript, ESLint, etc.
```

## Available Scripts

```bash
# Development
pnpm dev           # Start dev server
pnpm dev:watch     # Start with watch mode

# Building
pnpm build         # Build for production
pnpm start         # Start production server

# Linting & Formatting
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix ESLint issues

# Type Checking
pnpm typecheck     # Run TypeScript type checking

# Testing
pnpm test          # Run tests (when available)
pnpm test:watch    # Run tests in watch mode
```

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
mongod                                  # Manual start
```

### Missing Environment Variables
```
Error: Missing NEXTAUTH_SECRET
```
**Solution:** Create `.env.local` with all required variables (see Step 3)

### pnpm install fails
```bash
# Clear pnpm cache and reinstall
pnpm store prune
pnpm install
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows (find PID and kill)
```

## Debugging

### Enable Verbose Logging
```bash
DEBUG=* pnpm dev
```

### Check TypeScript Errors
```bash
pnpm tsc --noEmit
```

### MongoDB Shell Access
```bash
mongosh
# List databases
show dbs

# Use basecompose database
use basecompose

# List collections
show collections

# Query data
db.projects.find()
db.chat_messages.find()
```

## Next Steps

1. **Read the Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
2. **Check the Architecture**: [DEVELOPMENT.md](DEVELOPMENT.md)
3. **View Chat History Guide**: [CHAT_HISTORY_IMPLEMENTATION.md](CHAT_HISTORY_IMPLEMENTATION.md)
4. **Explore Issues**: Look for [good first issues](https://github.com/icancodefyi/basecompose/labels/good%20first%20issue)

## Need Help?

- **Questions**: Open a [Discussion](https://github.com/icancodefyi/basecompose/discussions)
- **Bugs**: Report on [Issues](https://github.com/icancodefyi/basecompose/issues)
- **Security**: Email maintainers (see SECURITY.md)

Happy coding! 🚀
