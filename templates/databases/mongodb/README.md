# MongoDB Addon

## What it adds

- MongoDB 7 Docker service
- Client connection helper
- Environment variable configuration

## Environment variables required

```env
MONGODB_URI=mongodb://root:example@localhost:27017
MONGODB_ROOT_USERNAME=root
MONGODB_ROOT_PASSWORD=example
```

## Files injected

- `docker/docker-compose.mongo.yml` - Mergeable MongoDB service fragment
- `client.ts` - MongoDB connection helper
- `env.ts` - Environment variable definitions

## Usage

1. Merge `docker-compose.mongo.yml` into your app's docker-compose.yml
2. Import `connectMongo()` from `client.ts` in your API routes
3. Add env vars from `env.ts` to `.env.local`
