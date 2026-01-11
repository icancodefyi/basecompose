# Auth.js (NextAuth) Addon

## What it adds

- Next.js Auth.js integration (GitHub OAuth)
- Route handler for authentication
- Environment variable configuration

## Environment variables required

```env
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_app_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Files injected

- `routes/[...nextauth].ts` - Auth.js route handler
- `config.ts` - Auth.js configuration
- `env.ts` - Environment variable definitions

## Usage

1. Create a GitHub OAuth app at https://github.com/settings/developers
2. Add `GITHUB_ID`, `GITHUB_SECRET`, and `NEXTAUTH_SECRET` to `.env.local`
3. Use NextAuth in your app via `useSession()` hook
