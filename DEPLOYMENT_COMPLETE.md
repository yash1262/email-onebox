# 🚀 Email Onebox - Complete Deployment Guide

## Quick Start (2 Minutes)

```bash
# Run automated deployment
cd /Users/gautamijambotkar/Desktop/BDA/email-onebox-main
./auto-deploy.sh
```

---

## Architecture Options

### Option 1: Vercel Full Stack (Simplest)
- **Frontend**: Vercel static build
- **Backend**: Vercel serverless functions
- **Pros**: Easy setup, free tier available
- **Cons**: Cold starts, limited for real-time features

### Option 2: Vercel + Render (Recommended)
- **Frontend**: Vercel
- **Backend**: Render.com (persistent server)
- **Databases**: Cloud providers (MongoDB, Elastic, Qdrant)
- **Pros**: Best performance, persistent connections for IMAP
- **Cons**: More configuration

### Option 3: Full Stack (Railway/Heroku Alternative)
- Everything on one platform

---

## Detailed Deployment Steps

### Phase 1: Prepare Project (5 min)

#### 1.1 Build Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder
```

#### 1.2 Verify Build
```bash
# Check that dist folder exists and has content
ls -la dist/
# Should see index.html and other assets
```

#### 1.3 Git Commit
```bash
git add .
git commit -m "Pre-deployment build"
git push origin main
```

---

### Phase 2: Deploy to Vercel

#### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 2.2 Login to Vercel
```bash
vercel login
# Opens browser for authentication
# Then returns to terminal
```

#### 2.3 Deploy Frontend
```bash
cd frontend
vercel --prod
# Follow prompts:
# - Link to existing project? No (first time)
# - Project name: email-onebox
# - Directory: . (current)
# - Build command: npm run build
# - Output directory: dist
```

#### 2.4 Deploy Backend (API)
```bash
cd ..  # Back to root
vercel --prod
# This deploys the api/ folder
# Uses vercel.json at root for routing
```

---

### Phase 3: Configure Environment Variables

#### 3.1 In Vercel Dashboard
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add the following:

```
OPENAI_API_KEY=sk-proj-your-key
GMAIL_EMAIL_1=your-gmail@gmail.com
GMAIL_PASSWORD_1=your-app-password
GMAIL_EMAIL_2=second-email@gmail.com
GMAIL_PASSWORD_2=second-app-password
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
ELASTICSEARCH_URL=https://your-es-instance.cloud.es.io
QDRANT_URL=https://your-qdrant.qdrant.io
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

#### 3.2 Redeploy After Adding Env Vars
```bash
vercel --prod
# Redeploy to pick up new environment variables
```

---

### Phase 4: Set Up External Services

#### 4.1 MongoDB Atlas (Database)
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Get connection string
4. Add to Vercel as `DATABASE_URL`

#### 4.2 Elasticsearch Cloud
1. Sign up: https://www.elastic.co/cloud
2. Create deployment
3. Get endpoint URL
4. Add to Vercel as `ELASTICSEARCH_URL`

#### 4.3 Qdrant Cloud (Vector DB)
1. Sign up: https://cloud.qdrant.io
2. Create instance
3. Get API key and URL
4. Add to Vercel as `QDRANT_URL` and `QDRANT_API_KEY`

#### 4.4 OpenAI API Key
1. Get from: https://platform.openai.com/api-keys
2. Add to Vercel as `OPENAI_API_KEY`

---

### Phase 5: Test Deployment

#### 5.1 Check Frontend
```bash
# Open in browser:
https://your-project.vercel.app
# Should see the Email Onebox interface
```

#### 5.2 Check Backend
```bash
curl https://your-project.vercel.app/api/health
# Should return 200 OK
```

#### 5.3 View Logs
1. Vercel Dashboard → Your Project → Functions
2. Check logs for any errors

---

## Alternative: Deploy Backend to Render.com

### Why Render for Backend?
- Always-on servers (no cold starts)
- Better for persistent IMAP connections
- Simpler environment variable setup

### Steps:

#### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub

#### 2. Connect Repository
- Click "New +"
- Select "Web Service"
- Choose your GitHub repository

#### 3. Configure Service
```
Name: email-onebox-backend
Environment: Node
Build Command: npm install && npm run build
Start Command: npm start
Region: Choose closest to you
Instance Type: Free (or Starter Pro)
```

#### 4. Add Environment Variables
- In Render dashboard
- Add same vars as Vercel (see Phase 3)

#### 5. Deploy
- Click "Create Web Service"
- Render auto-deploys on git push

#### 6. Update Frontend API URL
In Vercel environment variables:
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Complete Architecture After Full Deployment

```
┌─────────────────────────────────────┐
│         Frontend (Vercel)           │
│  https://your-project.vercel.app    │
└──────────────┬──────────────────────┘
               │
        Makes API calls
               │
     ┌─────────▼──────────┐
     │                    │
     │ API Routes (Vercel)│
     │ /api/*            │
     │                    │
     └─────────┬──────────┘
               │
     ┌─────────▼──────────────────┐
     │  Backend (Render/Railway)   │
     │  https://backend.onrender.com
     │                            │
     │  - Email Sync              │
     │  - AI Processing           │
     │  - Search                  │
     └─────────┬──────────────────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
 MongoDB   Elastic     Qdrant    OpenAI
  Atlas     Cloud      Cloud      API
```

---

## Monitoring & Maintenance

### Monitor Logs
```bash
# Vercel
vercel logs --tail

# Render
# Go to dashboard → Service → Logs
```

### Update Project
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Auto-deploys to Vercel & Render
```

### Common Issues & Fixes

#### Cold Start Timeouts
- Use Render for backend (always-on)
- Or upgrade Vercel to Pro plan

#### Environment Variables Not Working
```bash
# Redeploy after adding vars
vercel --prod
# or
render deploy
```

#### CORS Errors
- Update backend CORS settings
- Add Vercel domain to allowed origins

#### Database Connection Issues
- Check `DATABASE_URL` format
- Verify IP whitelist in MongoDB Atlas
- Test connection locally first

---

## Cost Estimation (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Frontend | ✅ Free | $0 |
| Vercel API | ✅ Free | $0 |
| Render Backend | ❌ Sleep after 15min | $7-25 |
| MongoDB Atlas | ✅ 512MB | $0-57 |
| Elasticsearch Cloud | ❌ Paid | $15-100 |
| Qdrant Cloud | ✅ Free | $0-25 |
| OpenAI API | ❌ Pay as used | $5-50 |

**Total: $27-257/month** depending on usage

---

## Security Checklist

- [ ] API keys stored in Vercel env vars (not in code)
- [ ] Database credentials in env vars
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Auth tokens expire properly
- [ ] Sensitive logs don't expose secrets

---

## Rollback & Recovery

### Rollback Deployment
```bash
# Vercel
vercel list        # List deployments
vercel promote <URL>  # Promote old deployment

# Render
# Go to Render dashboard → Deployments
# Click "Redeploy" on previous version
```

### Database Backup
- MongoDB Atlas: Automatic backups (free tier)
- Manual backup before major changes

---

## Next Steps After Deployment

1. **Configure Custom Domain**
   - Vercel: Settings → Domains
   - Render: Settings → Custom Domain

2. **Set Up Monitoring**
   - Enable error tracking (Sentry)
   - Set up uptime monitoring

3. **Create CI/CD Pipeline**
   - Automatic tests on push
   - Staging environment

4. **Document API**
   - Generate API docs
   - Create postman collection

---

## Support & Troubleshooting

For issues, check:
- `VERCEL_DEPLOYMENT.md` (basic guide)
- `STARTUP.md` (local development)
- Project README.md

Or get help in:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Discord Community: [Link to project community]

---

**Successfully Deployed!** 🎉

Your Email Onebox is now live on the internet!
