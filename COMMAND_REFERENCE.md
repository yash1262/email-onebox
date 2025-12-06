# 🚀 Email Onebox: Quick Command Reference

## Start Everything

### Development (Both Frontend + Backend)
```bash
npm run dev
```
- Frontend: http://localhost:5174
- Backend: http://localhost:3000
- Shows real emails from both accounts

### Just Backend
```bash
cd backend
npm run dev
```
Runs on http://localhost:3000

### Just Frontend  
```bash
cd frontend
npm run dev
```
Runs on http://localhost:5174 (tries 5173 first)

---

## Test Commands

### Test Backend API
```bash
curl 'http://localhost:3000/api/emails?limit=2'
```
Shows real emails with categories

### Check Backend Health
```bash
curl http://localhost:3000/api/emails
```
Returns `{"success": true, "data": [...], ...}`

### Check Backend Logs
```bash
tail -f /tmp/backend_test.log
```

---

## Build & Deploy

### Build Frontend for Production
```bash
npm run build
```
Output: `frontend/dist/`

### Push to GitHub (Auto-deploys to Vercel)
```bash
git push origin main
```

### Check Vercel Deployment Status
- Visit: https://vercel.com/dashboard
- Project: email-onebox
- Or visit: https://email-onebox-main.vercel.app

---

## Environment Configuration

### Backend .env (backend/.env)
```
EMAIL1_USER=yashjambotkar90@gmail.com
EMAIL2_USER=22u1948@students.git.edu
OPENAI_API_KEY=sk-proj-...
SMTP_HOST=smtp.gmail.com
PORT=3000
```

### Vercel Environment Variable
```
BACKEND_URL=http://localhost:3000  (default)
```
Or set to production URL when backend deployed.

---

## Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend Dev | 5174 | http://localhost:5174 |
| Backend | 3000 | http://localhost:3000 |
| Elasticsearch | 9200 | http://localhost:9200 |
| Qdrant | 6333 | http://localhost:6333 |

---

## Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/emails` | GET | Get all emails |
| `/api/emails/{id}` | GET | Get email details |
| `/api/accounts` | GET | List email accounts |
| `/api/search` | POST | Search emails |
| `/api/ai` | POST | Generate AI reply |
| `/api/send` | POST | Send email |

---

## Documentation Files

- **API_PROXY_SETUP.md** - Complete setup & deployment guide
- **BACKEND_SETUP.md** - Backend configuration details
- **QUICK_START.md** - Quick start guide
- **README.md** - Project overview

---

## Current Status

✅ **Development Ready**
- Backend: Processing 100+ real emails
- Frontend: Showing real data
- API Proxy: Configured and working
- Documentation: Complete

✅ **Production Ready**
- Vercel deployment: Automatic
- API proxy: Forwards to backend
- Environment variables: Configurable
- Ready to scale

---

## Common Issues

| Issue | Fix |
|-------|-----|
| "Port already in use" | Kill process: `lsof -i :5173` then `kill -9 <PID>` |
| No emails showing | Backend not running: `cd backend && npm run dev` |
| API timeout | Elasticsearch down: `npm run docker:up` |
| Build fails | Clear cache: `rm -rf node_modules && npm install` |

---

## Need Help?

1. Check logs: `tail -f /tmp/backend_test.log`
2. Read: `API_PROXY_SETUP.md`
3. Test API: `curl 'http://localhost:3000/api/emails'`
4. GitHub: https://github.com/yash1262/email-onebox

---

**Status**: ✅ Ready to develop and deploy!
