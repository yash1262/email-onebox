# Email Onebox - Complete Setup Guide

## ✅ Project Status

All necessary files and code have been verified and are present. The project is ready for execution after following the setup steps below.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** and **Docker Compose** (for Elasticsearch and Qdrant)
- **OpenAI API Key** (for AI categorization and RAG features)
- **Email accounts** (minimum 2 IMAP-enabled accounts)
- Optional: **Slack Webhook URL** (for notifications)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Return to root
cd ..
```

### 2. Configure Environment Variables

#### Backend Configuration

Create `/backend/.env` based on `/backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

Edit `/backend/.env` and configure:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email Accounts (Minimum 2 required)
# For Gmail, use App Passwords (not your regular password)
EMAIL1_USER=your-email1@gmail.com
EMAIL1_PASSWORD=your-app-password1
EMAIL1_HOST=imap.gmail.com
EMAIL1_PORT=993

EMAIL2_USER=your-email2@outlook.com
EMAIL2_PASSWORD=your-app-password2
EMAIL2_HOST=outlook.office365.com
EMAIL2_PORT=993

# Elasticsearch Configuration
ELASTICSEARCH_NODE=http://localhost:9200

# Slack Integration (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# External Webhook (Optional)
WEBHOOK_URL=https://webhook.site/your-unique-url

# OpenAI API (Required)
OPENAI_API_KEY=sk-your-openai-api-key

# Qdrant Vector Database
QDRANT_URL=http://localhost:6333

# Product Context for RAG
PRODUCT_NAME=Job Application Assistant
OUTREACH_AGENDA=I am applying for software engineering positions. If a lead is interested, share the meeting booking link: https://cal.com/example

# Logging
LOG_LEVEL=info
```

#### Frontend Configuration

Create `/frontend/.env`:

```bash
cd ../frontend
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### 3. Start Docker Services

Start Elasticsearch and Qdrant:

```bash
# From the root directory
cd docker
docker-compose up -d
```

Verify services are running:

```bash
# Check Elasticsearch
curl http://localhost:9200

# Check Qdrant
curl http://localhost:6333/healthz
```

### 4. Start Application

#### Option A: Start Both (Recommended for Development)

```bash
# From root directory
npm run dev
```

#### Option B: Start Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 📧 Email Configuration Guide

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. Use this App Password in `.env` (not your regular password)

### Outlook/Office365 Setup

- Host: `outlook.office365.com`
- Port: `993`
- Use your regular credentials

### Other IMAP Providers

Check your email provider's IMAP settings:
- **Yahoo**: `imap.mail.yahoo.com:993`
- **Zoho**: `imap.zoho.com:993`
- **iCloud**: `imap.mail.me.com:993`

## 🔑 OpenAI API Key

1. Sign up at: https://platform.openai.com
2. Create an API key
3. Add to `/backend/.env` as `OPENAI_API_KEY`

**Cost Estimate**: ~$0.01-0.10 per 100 emails (depending on email length)

## 🐳 Docker Services

### Elasticsearch (Port 9200)
- Stores all email data
- Enables advanced search
- 512MB RAM allocated

### Qdrant (Port 6333)
- Vector database for RAG
- Stores embeddings for context retrieval
- Powers AI reply suggestions

### Useful Docker Commands

```bash
# Start services
cd docker && docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Remove all data and reset
docker-compose down -v
```

## 📊 API Endpoints

### Email Endpoints
- `GET /api/emails` - Get all emails
- `GET /api/emails/:id` - Get email by ID
- `GET /api/emails/category/:category` - Get emails by category
- `GET /api/emails/account/:accountEmail` - Get emails by account

### Search Endpoints
- `POST /api/search` - Search emails
- `GET /api/search/stats` - Get email statistics

### AI Endpoints
- `POST /api/ai/reply/:emailId` - Generate AI reply for email
- `POST /api/ai/reply/bulk` - Generate bulk AI replies

### Account Endpoints
- `GET /api/accounts` - Get all connected accounts
- `GET /api/accounts/status` - Get sync status

## 🧪 Testing the Application

### 1. Verify Backend is Running
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-...",
  "uptime": 123.456
}
```

### 2. Check Email Sync
Watch backend logs for:
- ✅ "Connected: your-email@gmail.com"
- ✅ "Sync completed for INBOX"
- ✅ "Processed email: [subject] [category]"

### 3. Test Frontend
- Navigate to http://localhost:5173
- Should see email list
- Try searching and filtering
- Test AI reply generation

## 🔧 Troubleshooting

### Issue: "Cannot connect to IMAP"
**Solutions:**
- Verify email credentials in `.env`
- For Gmail, ensure App Password is used
- Check if IMAP is enabled in email settings
- Verify firewall isn't blocking port 993

### Issue: "Elasticsearch connection failed"
**Solutions:**
```bash
# Check if Elasticsearch is running
docker ps | grep elasticsearch

# Restart Elasticsearch
cd docker && docker-compose restart elasticsearch

# Check logs
docker-compose logs elasticsearch
```

### Issue: "OpenAI API error"
**Solutions:**
- Verify API key is correct in `.env`
- Check OpenAI account has credits
- Ensure API key has proper permissions

### Issue: "Frontend not loading"
**Solutions:**
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "Qdrant connection failed"
**Solutions:**
```bash
# Restart Qdrant
cd docker && docker-compose restart qdrant

# Check if port 6333 is available
lsof -i :6333
```

## 📝 Development Scripts

### Root Level
- `npm run dev` - Start both backend and frontend
- `npm run build` - Build both projects
- `npm run install:all` - Install all dependencies
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Features Checklist

- ✅ **Real-Time Email Sync**: IMAP IDLE connections for instant updates
- ✅ **Multi-Account Support**: Minimum 2 accounts, expandable
- ✅ **AI Categorization**: Automatic email classification
- ✅ **Elasticsearch Search**: Advanced search and filtering
- ✅ **RAG-Powered Replies**: Context-aware AI reply suggestions
- ✅ **Slack Integration**: Notifications for interested emails
- ✅ **Webhook Support**: External automation triggers
- ✅ **Modern UI**: React + TailwindCSS interface

## 🔒 Security Notes

- Never commit `.env` files
- Use App Passwords for Gmail (never regular passwords)
- Keep OpenAI API keys secure
- Elasticsearch runs without authentication (local development only)
- Use environment variables for all sensitive data

## 📦 Project Structure

```
email-onebox/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── styles/        # CSS files
│   └── package.json
├── docker/                # Docker configuration
│   └── docker-compose.yml
└── package.json           # Root package.json
```

## 🐛 Known Limitations

1. **No Email Sending**: Currently read-only (no reply sending)
2. **Last 30 Days Only**: Only syncs emails from the last 30 days
3. **INBOX Only**: Default sync for INBOX folder (extendable)
4. **No Attachments**: Attachments are not stored or displayed
5. **Local Development**: Not production-ready without additional security

## 📚 Next Steps

1. Configure your email accounts
2. Get an OpenAI API key
3. Start Docker services
4. Run the application
5. Monitor logs for any issues
6. Test email sync and categorization
7. Try AI reply generation

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend logs: `cd backend && npm run dev`
3. Check Docker logs: `cd docker && docker-compose logs`
4. Verify all environment variables are set correctly

---

**Status**: ✅ All files present and ready for execution
**Last Updated**: 2024-10-27
