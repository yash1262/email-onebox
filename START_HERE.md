# 🚀 Quick Start Guide

## ⚠️ Node.js Not Found

Node.js is **required** but not currently installed on your system.

---

## Step 1: Install Node.js

### Option A: Install via Homebrew (Recommended for Mac)

```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js
brew install node
```

### Option B: Direct Download

1. Visit: **https://nodejs.org/en/download/**
2. Download the **LTS version** for macOS
3. Run the installer
4. Restart your terminal

---

## Step 2: Verify Installation

After installing Node.js, verify it worked:

```bash
node -v    # Should show: v18.x.x or higher
npm -v     # Should show: 9.x.x or higher
```

---

## Step 3: Run the Project

Once Node.js is installed, run:

```bash
cd "/Users/gautamijambotkar/Desktop/ai intern/EMAIL copy/email-onebox"
./RUN_PROJECT.sh
```

The script will:
- ✅ Install all dependencies
- ✅ Start Docker services (Elasticsearch + Qdrant)
- ✅ Configure environment files
- ✅ Launch backend (port 3000) and frontend (port 5173)

---

## Alternative: Manual Setup

If you prefer to run commands manually:

```bash
# 1. Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# 2. Start Docker services
cd docker
docker-compose up -d
cd ..

# 3. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

echo "VITE_API_URL=http://localhost:3000/api" > frontend/.env

# 4. Start the application
npm run dev
```

---

## What You Need to Configure

Before the app works, you need to add to `backend/.env`:

1. **Email Credentials** (minimum 2 accounts):
   - Gmail: Use App Passwords, not regular password
   - Get from: https://myaccount.google.com/apppasswords

2. **OpenAI API Key**:
   - Get from: https://platform.openai.com/api-keys

3. **(Optional) Slack Webhook**:
   - For notifications

---

## Troubleshooting

### "Docker not found"
Install Docker Desktop from: https://www.docker.com/products/docker-desktop

### "Cannot find module"
Run: `npm install` in the correct directory

### "Port already in use"
Kill the process using the port:
```bash
lsof -ti:3000 | xargs kill -9   # Backend
lsof -ti:5173 | xargs kill -9   # Frontend
```

---

## 📚 Documentation

- **Full Setup Guide**: `SETUP_GUIDE.md`
- **All Changes Made**: `CHANGES_MADE.md`
- **Errors Fixed**: `ERRORS_FIXED.md`

---

## Quick Commands

```bash
# Run everything
./RUN_PROJECT.sh

# Or manually
npm run dev              # Start both frontend & backend
npm run docker:up        # Start Docker services only
npm run docker:down      # Stop Docker services
```

---

**Need Help?** Check `SETUP_GUIDE.md` for detailed instructions.
