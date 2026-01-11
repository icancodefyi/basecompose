# Next.js Framework Template

## What it provides

- Clean Next.js App Router scaffold
- TypeScript configuration
- Docker setup for containerization

## Folders

- `base/` - Base Next.js application (created via create-next-app)
- `docker/` - Dockerfile and build configuration for containerization

## How it works

The `base/` folder contains the foundation Next.js app. The `docker/` folder provides the Dockerfile that containers this app for deployment.

When building a stack, the engine will:

1. Copy the contents of `base/` to the generated project
2. Overlay addons (MongoDB, Auth.js, Demo) as needed
3. Use the Dockerfile for containerization
