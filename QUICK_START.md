# 🎯 Quick Start: Backend + Frontend Integration

## Current Status

✅ **API Proxy Configured**: Vercel now proxies `/api/*` requests to your backend  
✅ **Backend Running**: http://localhost:3000 (processing real emails)  
✅ **Frontend Built**: Ready for Vercel deployment  
✅ **All Changes Pushed**: Available on GitHub main branch

## How It Works Now

```
User Browser
    ↓
https://email-onebox-main.vercel.app (Frontend)
    ↓ (all /api/* requests)
Vercel API Routes (/api/index.ts)
    ↓ (forwards via http-proxy)
http://localhost:3000 (Backend)
    ↓
Real Emails from Your Accounts
    ↓
Back to Frontend
```

## Test It Out

### Step 1: Start Backend (if not already running)

```bash
cd backend
npm run dev
```

Wait for the logs to show email processing.

### Step 2: Test Backend API Directly

```bash
curl 'http://localhost:3000/api/emails?limit=1'
```

You should see real emails from your configured accounts.

### Step 3: Run Frontend Locally (Dev Mode)

In another terminal:

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

**Expected Result**: Frontend shows real emails from your backend (not just demo emails)

### Step 4: Deploy to Vercel

The frontend is already built. Just push to GitHub (already done):

```bash
git push origin main
```

Vercel will auto-deploy when it detects changes.

## Check Vercel Deployment Status

1. Go to https://vercel.com/dashboard
2. Select "email-onebox" project
3. Watch the deployment complete
4. Once live, go to https://email-onebox-main.vercel.app

**Note**: Frontend will try to reach backend at http://localhost:3000 through the Vercel proxy. As long as backend is running on your local machine, it should work!

## For Production Backend Deployment

When you're ready to deploy the backend permanently:

1. **Choose a hosting platform** (Railway, Render, Heroku, etc.)
2. **Deploy backend** to get a public URL
3. **Set environment variable** on Vercel:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `BACKEND_URL=https://your-backend-url.com`
   - Redeploy frontend
4. **Done**: Frontend will now use your production backend

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend shows "Backend unavailable" | Make sure backend is running: `npm run dev` in backend folder |
| No emails appearing | Check backend logs for errors: `tail -f /tmp/backend_test.log` |
| CORS errors | Backend already has CORS enabled - check network tab in browser |
| API timeout | Backend might be slow - check Elasticsearch/Qdrant are running |

## Key Files Changed

- `api/index.ts` - Now proxies requests via http-proxy
- `vercel.json` - Added BACKEND_URL environment variable
- `BACKEND_SETUP.md` - Complete deployment guide
- `package.json` - Added http-proxy dependency

## What's Next?

1. **Test locally** with backend running
2. **Check Vercel deployment** at https://email-onebox-main.vercel.app
3. **Choose backend hosting** when ready to deploy permanently
4. **Set production backend URL** when ready

## Files You Need to Know

```
/api/index.ts                    ← Vercel API proxy
/backend/src/app.ts              ← Backend Express app
/frontend/src/services/api.ts    ← Frontend API client
/vercel.json                      ← Vercel configuration
/BACKEND_SETUP.md                ← Detailed setup guide
```

---

**Status**: ✅ Ready to test end-to-end with local backend
