# 🚀 Upload to GitHub - Step by Step

## Option 1: Using GitHub CLI (Fastest)

```bash
# Install GitHub CLI if not installed
brew install gh

# Login to GitHub
gh auth login

# Create repository and push
gh repo create email-onebox --public --source=. --remote=origin --push

# Your GitHub repo will be at: https://github.com/YOUR_USERNAME/email-onebox
```

## Option 2: Using GitHub Website (Manual)

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `email-onebox`
3. Description: `AI-Powered Email Management System with Smart Categorization`
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click **Create repository**

### Step 2: Push Your Code

Copy and run these commands in your terminal:

```bash
cd "/Users/gautamijambotkar/Desktop/ai intern/EMAIL copy/email-onebox"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/email-onebox.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Verify Upload

Visit: `https://github.com/YOUR_USERNAME/email-onebox`

You should see all your files uploaded!

---

## ✅ After Upload - Get Live Link

### Deploy Frontend to Vercel:

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable: `VITE_API_URL=http://localhost:3000/api`
5. Click **Deploy**

**Your live link:** `https://email-onebox.vercel.app` (or similar)

### Deploy Backend to Railway:

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables (from backend/.env.example)
6. Click **Deploy**

**Your backend API:** `https://your-app.railway.app`

---

## 📝 Important Notes

- **Sensitive Data**: Never commit `.env` files with real credentials
- **node_modules**: Already excluded via `.gitignore`
- **Build Files**: `dist/` folders are excluded

---

## 🎯 Quick Commands Reference

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## ✅ Success!

Once uploaded, your repository will be at:
**https://github.com/YOUR_USERNAME/email-onebox**

Share this link for your submission! 🎉
