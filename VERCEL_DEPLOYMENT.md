# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [https://vercel.com](https://vercel.com)
2. **GitHub Account**: Push your project to GitHub
3. **Environment Variables Ready**: API keys and secrets

## Step 1: Push Project to GitHub

```bash
cd /Users/gautamijambotkar/Desktop/BDA/email-onebox-main

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Email Onebox project"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/email-onebox.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Click **"Import"**
5. Configure build settings (should auto-detect):
   - **Framework**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
6. Add environment variables (see Step 3)
7. Click **"Deploy"**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd /Users/gautamijambotkar/Desktop/BDA/email-onebox-main
vercel --prod
```

## Step 3: Environment Variables

Add these to Vercel project settings:

```
OPENAI_API_KEY=sk-your-key-here
GMAIL_EMAIL_1=your-email@gmail.com
GMAIL_PASSWORD_1=your-app-password
GMAIL_EMAIL_2=second-email@gmail.com
GMAIL_PASSWORD_2=second-app-password
DATABASE_URL=your-mongodb-url (if using cloud DB)
SLACK_WEBHOOK_URL=your-webhook-url (optional)
```

## Step 4: Database & External Services

### Elasticsearch
- **Option 1**: Use Elastic Cloud (https://www.elastic.co/cloud)
- **Option 2**: Set `ES_HOST` environment variable to your Elasticsearch endpoint

### Qdrant Vector DB
- **Option 1**: Use Qdrant Cloud (https://cloud.qdrant.io)
- **Option 2**: Deploy separately and update `QDRANT_URL` env variable

### MongoDB (for persistent storage)
- Sign up on MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Add as `DATABASE_URL` environment variable

## Step 5: Post-Deployment

1. **Test the deployment**:
   ```bash
   curl https://your-app.vercel.app/health
   ```

2. **Check logs**:
   - Go to Vercel dashboard
   - Select your project
   - View real-time logs

3. **Configure custom domain** (optional):
   - Vercel dashboard → Settings → Domains
   - Add your custom domain

## Important Notes

⚠️ **Limitations on Vercel Free Plan**:
- Cold starts may cause timeouts for email sync
- IMAP IDLE connections might disconnect
- Recommended: Use cron jobs or scheduled functions for email syncing

### Recommended Setup for Production:

1. **Backend**: Deploy on Render, Railway, or Heroku (for persistent connections)
2. **Frontend**: Deploy on Vercel (static build)
3. **Databases**: Use managed cloud services (MongoDB Atlas, Elastic Cloud, Qdrant Cloud)

## Troubleshooting

### Build Fails
- Check Node.js version: `node -v` (should be 18+)
- Clear cache: `vercel build --prod --force`

### Deployment Shows "Cannot Find Module"
- Ensure all dependencies are in `package.json`
- Run `npm install` locally and commit `package-lock.json`

### Environment Variables Not Working
- Redeploy after adding env vars: `vercel --prod`
- Check Vercel dashboard for correct variable names

### CORS Errors
- Update `CORS_ORIGIN` in backend to include Vercel URL
- Update API endpoints in frontend to use `/api` instead of `http://localhost:3000`

## Deployment on Multiple Platforms (Recommended)

```bash
# For better performance, consider:
# Frontend: Vercel (static builds)
# Backend: Render.com or Railway.app (better for Node.js)
# Database: MongoDB Atlas + Elastic Cloud + Qdrant Cloud
```

For detailed instructions, see the project's GitHub repository.
