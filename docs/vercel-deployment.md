## Vercel Deployment - Episode Sync Setup

### Option 1: Automatic Sync (Recommended)

The app will automatically sync episodes on the first request if the database is empty. No manual intervention needed.

### Option 2: Manual Pre-deployment Sync

Before deploying to Vercel, sync episodes locally:

```bash
# 1. Set up your database
npm run db:setup

# 2. Sync episodes from RSS
npm run db:sync-episodes

# 3. Deploy to Vercel
# Your episodes will be in the database
```

### Option 3: Post-deployment Admin Sync

After deployment, use the admin endpoint:

```bash
# Call the sync API (requires admin login)
curl -X POST https://your-app.vercel.app/api/sync-episodes \
  -H "Cookie: admin-session=your-session-cookie"
```

### Environment Variables

Make sure these are set in Vercel:

```
DATABASE_URL=your_postgres_connection_string
# Other env vars...
```

### Database Persistence

Since you're using PostgreSQL (Neon), your data persists between deployments. Episodes will stay synced unless you need to refresh them.

### Admin Access

The sync endpoint requires admin authentication. Make sure you have admin login set up in your deployment.