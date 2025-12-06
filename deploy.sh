#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}📦 Email Onebox - Vercel Deployment${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📥 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check git status
echo -e "${YELLOW}📋 Checking git status...${NC}"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ Git working directory clean${NC}"
else
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    echo "Run: git add . && git commit -m 'Pre-deployment commit'"
    exit 1
fi

echo ""
echo -e "${YELLOW}🚀 Deployment Options:${NC}"
echo ""
echo "1️⃣  ${GREEN}Deploy to Vercel (Recommended for Full-Stack)${NC}"
echo "   Command: vercel --prod"
echo ""
echo "2️⃣  ${GREEN}Deploy Frontend Only to Vercel${NC}"
echo "   Command: cd frontend && npm run build && vercel --prod"
echo ""
echo "3️⃣  ${GREEN}Deploy Backend to Render/Railway${NC}"
echo "   (Better for persistent connections)"
echo ""

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Pre-Deployment Checklist:${NC}"
echo ""
echo "[ ] GitHub repository updated and pushed"
echo "[ ] Environment variables configured in Vercel"
echo "[ ] MongoDB Atlas cluster created"
echo "[ ] Elasticsearch endpoint configured"
echo "[ ] Qdrant instance ready"
echo "[ ] OPENAI_API_KEY added to env vars"
echo "[ ] Email credentials stored securely"
echo ""

echo -e "${YELLOW}Quick Deploy Commands:${NC}"
echo ""
echo "Frontend to Vercel:"
echo "  cd frontend && npm run build && vercel --prod"
echo ""
echo "Backend to Render:"
echo "  1. Go to https://render.com/dashboard"
echo "  2. Connect GitHub repository"
echo "  3. Create new Web Service"
echo ""

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}For detailed instructions, see: VERCEL_DEPLOYMENT.md${NC}"
echo ""
