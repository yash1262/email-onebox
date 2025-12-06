# Backend Setup & Deployment Guide

## Overview

The Email Onebox project uses a **hybrid setup** where:
- **Frontend**: Deployed on Vercel (https://email-onebox-main.vercel.app)
- **Backend**: Can run locally or be deployed to any server
- **API Proxy**: Vercel's API routes (`/api/index.ts`) proxy requests to the backend

## Development Setup (Local Backend)

### 1. Start Backend Locally

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3000`

### 2. Start Frontend Locally

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be at `http://localhost:5173` and automatically connects to `http://localhost:3000/api`

### 3. Or Run Both Together

From root directory:

```bash
npm install:all
npm run dev
```

This starts:
- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173`

## Production Deployment

### For Vercel Deployment with Local Backend

The Vercel deployment is already configured to work with a local backend!

**How it works:**
1. Frontend deployed at https://email-onebox-main.vercel.app
2. Vercel's API routes forward requests to backend via `/api` proxy
3. During development, it proxies to `http://localhost:3000` (default)

**To use a different backend URL in production:**

Set the `BACKEND_URL` environment variable in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   - **Name**: `BACKEND_URL`
   - **Value**: `https://your-backend-url.com` (or keep empty for localhost during development)
5. Redeploy

### For Production Backend Deployment

If you want to deploy the backend separately:

#### Option 1: Vercel Backend (Serverless)

```bash
# Create a backend-only project on Vercel
vercel --cwd backend
```

Then set `BACKEND_URL` to the Vercel backend URL.

#### Option 2: Railway, Render, Heroku, or Similar

1. Deploy backend to your chosen platform
2. Get the deployed URL (e.g., `https://your-backend.railway.app`)
3. Set `BACKEND_URL` environment variable on Vercel to this URL

#### Option 3: Keep Backend on Local Machine

1. Expose backend using ngrok:
   ```bash
   npm install -g ngrok
   npm run dev  # Start backend
   ngrok http 3000  # Creates public URL
   ```
2. Set `BACKEND_URL` on Vercel to the ngrok URL
3. Note: ngrok URLs change each time, so set a permanent backend URL once you choose a hosting option

## Environment Variables

### Backend (.env file)

Located in `backend/.env`:

```env
# Email Accounts
EMAIL1_USER=your-email@gmail.com
EMAIL1_PASSWORD=your-app-password
EMAIL2_USER=another-email@university.edu
EMAIL2_PASSWORD=another-app-password

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Gemini
GEMINI_API_KEY=...

# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Databases
ELASTICSEARCH_NODE=http://localhost:9200
QDRANT_URL=http://localhost:6333

# Server
PORT=3000
NODE_ENV=development
```

### Vercel Environment Variables

Set in Vercel Dashboard or via CLI:

```bash
vercel env add BACKEND_URL
```

**Available variables:**
- `BACKEND_URL` - Backend API URL (default: http://localhost:3000)

## API Proxy Mechanism

The proxy is handled by `api/index.ts`:

```typescript
// Forwards all requests to backend
/api/emails      → http://localhost:3000/emails
/api/accounts    → http://localhost:3000/accounts
/api/search      → http://localhost:3000/search
/api/ai          → http://localhost:3000/ai
/api/send        → http://localhost:3000/send
```

## Troubleshooting

### Frontend shows "Backend service unavailable"

**Causes:**
- Backend not running locally
- Wrong `BACKEND_URL` set on Vercel
- Backend URL not accessible from Vercel

**Solutions:**
1. Start backend: `cd backend && npm run dev`
2. Check environment variable: `BACKEND_URL` should be empty or correct
3. Test backend directly: `curl http://localhost:3000/api/emails`

### CORS Errors in Frontend

**Cause:** Backend CORS not configured for Vercel domain

**Solution:** Backend already has CORS configured for all origins in `backend/src/app.ts`

### API requests timeout

**Cause:** Backend taking too long to respond

**Solution:**
1. Check backend logs for errors
2. Ensure Elasticsearch and Qdrant are running (if local)
3. Increase timeout in `frontend/src/services/api.ts` (default 30s)

## Docker Setup

To run the entire stack with Docker:

```bash
npm run docker:up
npm run dev
```

This starts:
- Elasticsearch (9200)
- Qdrant Vector DB (6333)
- Plus your frontend/backend services

## Testing the Setup

1. **Test Backend API:**
   ```bash
   curl http://localhost:3000/api/emails
   ```

2. **Test Frontend in Dev:**
   - Open http://localhost:5173
   - Should show real emails from configured accounts

3. **Test Frontend on Vercel:**
   - Open https://email-onebox-main.vercel.app
   - Should show real emails (if backend is accessible)

## Security Notes

⚠️ **Important for Production:**

1. Never expose app passwords in source code
2. Use environment variables for all secrets
3. Don't commit `.env` files to git (use `.env.example`)
4. Use HTTPS for all API calls in production
5. Configure CORS properly to only allow your frontend domain
6. Set `NODE_ENV=production` in production backend

## Next Steps

1. **Keep backend local** → Just push frontend changes to Vercel
2. **Deploy backend** → Choose hosting platform and set `BACKEND_URL`
3. **Monitor emails** → Backend logs show real email processing
4. **Test AI features** → Generate replies from frontend

For questions, check the logs:
```bash
# Backend logs
cd backend && npm run dev

# Frontend build logs
cd frontend && npm run build
```
