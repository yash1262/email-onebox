# Email Onebox - Feature-Rich Email Aggregator

A powerful email management system with real-time IMAP synchronization, AI-powered categorization, and intelligent reply suggestions.

## Features

✅ **Real-Time Email Synchronization**
- Multiple IMAP accounts (minimum 2)
- Persistent IMAP IDLE connections (no cron jobs)
- Last 30 days of emails

✅ **Elasticsearch Storage**
- Locally hosted Elasticsearch
- Advanced search and filtering
- Filter by folder and account

✅ **AI-Based Email Categorization**
- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

✅ **Slack & Webhook Integration**
- Slack notifications for "Interested" emails
- Webhook triggers for external automation

✅ **Frontend Interface**
- Email viewer with search
- Folder and account filtering
- AI category display

✅ **AI-Powered Suggested Replies (RAG)**
- Vector database for context storage
- RAG-based reply generation
- Context-aware suggestions

## Tech Stack

- **Backend**: Node.js, TypeScript, Express
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Search**: Elasticsearch
- **AI**: OpenAI API
- **Vector DB**: Qdrant
- **Real-time**: IMAP IDLE

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd email-onebox

# Install dependencies
npm run install:all

# Start Docker services (Elasticsearch + Qdrant)
npm run docker:up

# Start development servers
npm run dev
```

## Environment Setup

See `.env.example` files in `backend/` and `frontend/` directories.

## API Documentation

See `docs/API.md` for complete API documentation.

## Postman Collection

Import `docs/POSTMAN_COLLECTION.json` to test all endpoints.

## Project Structure

See `docs/ARCHITECTURE.md` for detailed architecture information.

## License

MIT
