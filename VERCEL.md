# Vercel Deployment

## Runtime

- Framework: Node.js serverless function on Vercel
- Entry point: `api/index.js`
- Express app: `src/app.js`
- Local server entry: `index.js`

## Database Packages In Use

- `mongoose`: primary MongoDB ODM for application models
- `mongodb`: used directly for `GridFSBucket` file storage
- `redis`: optional response caching layer

## Vercel Compatibility Notes

- MongoDB is supported on Vercel. Use MongoDB Atlas or another externally reachable MongoDB instance.
- GridFS works because files are stored in MongoDB, not on the Vercel filesystem.
- Redis is treated as optional. If `REDIS_URL` is not set, caching is skipped.
- `node-cron` is not started in the Vercel serverless function. Scheduled background cleanup should be moved to Vercel Cron or another worker if needed.

## Required Environment Variables

- `MONGO_URL`
- `secret_key`
- `JWT_EXPIRES_IN`
- `BASE_URL`
- `CORS_ORIGINS`
- `RAZOR_KEY`
- `RAZOR_SECRET`
- `REDIS_URL` (optional)

## Deploy

1. Import the repository into Vercel.
2. Set the environment variables in the Vercel project.
3. Deploy.

## Recommended Follow-up

- Move the booking expiry cleanup to Vercel Cron.
- Fix the existing auth/CSRF/user lookup defects before production release.
- Fix the payment schema and webhook issues before enabling live payments.
