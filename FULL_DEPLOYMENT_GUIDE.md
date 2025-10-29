# 🚀 Full Deployment Guide - All Features Working

## Why This Approach?

Your app needs:
- ✅ Elasticsearch (for email search)
- ✅ Qdrant (for AI features)
- ✅ IMAP sync (persistent connections)

**Render free tier doesn't support these.** So we'll run backend locally with Docker and expose it via ngrok.

---

## 📋 Step-by-Step Setup

### Step 1: Start Docker Services

```bash
cd "/Users/gautamijambotkar/Desktop/ai intern/EMAIL copy/email-onebox"
docker-compose -f docker/docker-compose.yml up -d
```

Wait 30 seconds for services to start.

### Step 2: Start Backend

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:3000`

### Step 3: Expose Backend with ngrok

Open a NEW terminal and run:

```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

### Step 4: Update Frontend Environment Variable

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to: `https://YOUR-NGROK-URL.ngrok.io/api`
5. **Save** and **Redeploy**

### Step 5: Test Your Application

Visit: `https://email-onebox-frontend.vercel.app`

**Everything will work now!** ✅
- ✅ Emails load and sync
- ✅ Search works
- ✅ AI categorization works
- ✅ AI reply generation works

---

## 🔄 Daily Usage

Every time you want to use the app:

1. Start Docker: `docker-compose -f docker/docker-compose.yml up -d`
2. Start Backend: `cd backend && npm run dev`
3. Start ngrok: `ngrok http 3000`
4. Update Vercel env var with new ngrok URL (ngrok URL changes each time on free tier)
5. Redeploy frontend

---

## 💡 Alternative: ngrok Static Domain (Paid)

If you get ngrok Pro ($8/month), you get a static domain that never changes.
Then you only need to set the Vercel env var once!

---

## 🎯 Production Alternative: Deploy to VPS

For a permanent solution, deploy to:
- **DigitalOcean Droplet** ($6/month)
- **AWS EC2** (free tier for 1 year)
- **Linode** ($5/month)

These support Docker, so all features work!
