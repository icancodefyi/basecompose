#!/bin/bash

# BaseCompose development setup script
# This script automates the setup process for new developers

set -e

echo "🚀 BaseCompose Development Setup"
echo "=================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.0.0 or higher."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ Node.js $(node --version) found"
echo "✅ pnpm $(pnpm --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local..."
    cat > .env.local << 'EOF'
# Gemini API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_api_key_here

# GROQ API Key (get from https://console.groq.com)
GROQ_API_KEY=your_groq_api_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB
MONGODB_URI=mongodb://localhost:27017/basecompose
EOF
    echo "✅ Created .env.local (edit with your API keys)"
else
    echo "✅ .env.local already exists"
fi
echo ""

# Check MongoDB
echo "🗄️  Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB is not installed"
    echo "   Install MongoDB Community Server: https://www.mongodb.com/try/download/community"
fi
echo ""

# Summary
echo "✨ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Edit .env.local with your API keys:"
echo "      - Gemini: https://makersuite.google.com/app/apikey"
echo "      - GROQ: https://console.groq.com"
echo "      - Google OAuth: https://console.cloud.google.com"
echo "   2. Start MongoDB: brew services start mongodb-community"
echo "   3. Run development server: pnpm dev"
echo "   4. Open http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - Development Setup: DEVELOPMENT_SETUP.md"
echo "   - Contributing Guide: CONTRIBUTING.md"
echo "   - Architecture: DEVELOPMENT.md"
echo "   - Chat History: CHAT_HISTORY_IMPLEMENTATION.md"
echo ""
echo "Happy coding! 🚀"
