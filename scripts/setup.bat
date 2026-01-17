@echo off
REM BaseCompose development setup script for Windows
REM This script automates the setup process for new developers

echo.
echo 🚀 BaseCompose Development Setup
echo ==================================
echo.

REM Check Node.js
echo 📋 Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18.0.0 or higher.
    exit /b 1
)

REM Check pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ pnpm is not installed. Installing pnpm...
    npm install -g pnpm
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('pnpm --version') do set PNPM_VERSION=%%i

echo ✅ Node.js %NODE_VERSION% found
echo ✅ pnpm %PNPM_VERSION% found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call pnpm install
echo ✅ Dependencies installed
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo ⚙️  Creating .env.local...
    (
        echo # Gemini API Key (get from https://makersuite.google.com/app/apikey
        echo GEMINI_API_KEY=your_api_key_here
        echo.
        echo # GROQ API Key (get from https://console.groq.com
        echo GROQ_API_KEY=your_groq_api_key_here
        echo.
        echo # NextAuth Configuration
        echo NEXTAUTH_SECRET=your_nextauth_secret_here
        echo NEXTAUTH_URL=http://localhost:3000
        echo.
        echo # Google OAuth (get from https://console.cloud.google.com
        echo GOOGLE_CLIENT_ID=your_google_client_id
        echo GOOGLE_CLIENT_SECRET=your_google_client_secret
        echo.
        echo # MongoDB
        echo MONGODB_URI=mongodb://localhost:27017/basecompose
    ) > .env.local
    echo ✅ Created .env.local (edit with your API keys
) else (
    echo ✅ .env.local already exists
)
echo.

REM Summary
echo ✨ Setup complete!
echo.
echo 📖 Next steps:
echo    1. Edit .env.local with your API keys:
echo       - Gemini: https://makersuite.google.com/app/apikey
echo       - GROQ: https://console.groq.com
echo       - Google OAuth: https://console.cloud.google.com
echo    2. Start MongoDB Community Server
echo    3. Run development server: pnpm dev
echo    4. Open http://localhost:3000
echo.
echo 📚 Documentation:
echo    - Development Setup: DEVELOPMENT_SETUP.md
echo    - Contributing Guide: CONTRIBUTING.md
echo    - Architecture: DEVELOPMENT.md
echo    - Chat History: CHAT_HISTORY_IMPLEMENTATION.md
echo.
echo Happy coding! 🚀
echo.
pause
