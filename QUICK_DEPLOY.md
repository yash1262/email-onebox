# 🚀 Quick Deployment Reference

## One-Command Deploy

```bash
cd /Users/gautamijambotkar/Desktop/BDA/email-onebox-main
./auto-deploy.sh
```

---

## Manual Step-by-Step (5 minutes)

### 1. Build Frontend
```bash
cd frontend && npm run build && cd ..
```

### 2. Login to Vercel
```bash
npm install -g vercel
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Add Environment Variables
- Go to: https://vercel.com/dashboard
- Select your project
- Settings → Environment Variables
- Add:
  - `OPENAI_API_KEY`
  - `GMAIL_EMAIL_1` & `GMAIL_PASSWORD_1`
  - `DATABASE_URL`
  - `ELASTICSEARCH_URL`
  - `QDRANT_URL`

### 5. Redeploy
```bash
vercel --prod
```

---

## Your Deployment Links

| Service | URL |
|---------|-----|
| Dashboard | https://vercel.com/dashboard |
| Frontend | https://your-project.vercel.app |
| API | https://your-project.vercel.app/api |
| Logs | `vercel logs --tail` |

---

## Environment Variables Needed

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Gmail Accounts (minimum 2)
GMAIL_EMAIL_1=email@gmail.com
GMAIL_PASSWORD_1=app-password
GMAIL_EMAIL_2=email2@gmail.com
GMAIL_PASSWORD_2=app-password

# Database
DATABASE_URL=mongodb+srv://...

# Search
ELASTICSEARCH_URL=https://...

# Vector DB
QDRANT_URL=https://...
QDRANT_API_KEY=...

# Optional
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

---

## Post-Deploy Checklist

- [ ] Frontend loads at https://your-project.vercel.app
- [ ] API responds to `/api/health`
- [ ] Logs show no errors
- [ ] Email sync working (check dashboard)
- [ ] Search functional
- [ ] AI features responding

---

## Helpful Commands

```bash
# Check logs
vercel logs --tail

# List deployments
vercel list

# Promote old deployment
vercel promote <deployment-url>

# Redeploy current
vercel --prod

# Remove project
vercel remove
```

---

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| "Cannot find module" | Run `npm install` and recommit |
| Env vars not working | Redeploy: `vercel --prod` |
| Cold start timeout | Use Render for backend instead |
| CORS errors | Update backend CORS config |
| Database connection fails | Check IP whitelist, credentials |
| Build fails | Check Node version (need 18+) |

---

## Alternative: Deploy Backend to Render

```bash
# 1. Go to https://render.com
# 2. Connect GitHub account
# 3. Create new Web Service
# 4. Select your repository
# 5. Configure:
#    - Build: npm install && npm run build
#    - Start: npm start
# 6. Add environment variables
# 7. Deploy
```

---

## Documentation

- **Full Guide**: `DEPLOYMENT_COMPLETE.md`
- **Vercel Guide**: `VERCEL_DEPLOYMENT.md`
- **Local Setup**: `STARTUP.md` & `START_HERE.md`
- **Project Docs**: `README.md`

---

## Support

- Vercel Status: https://www.vercel-status.com
- Render Status: https://status.render.com
- GitHub Issues: Check project repository

---

**Version**: 1.0
**Last Updated**: December 7, 2025
**Project**: Email Onebox
**Repository**: https://github.com/yash1262/email-onebox
