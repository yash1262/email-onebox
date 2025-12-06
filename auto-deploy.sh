#!/bin/bash

# Automated Vercel Deployment Setup
# This script sets up everything needed for Vercel deployment

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 Auto-Deploy to Vercel${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}📋 Step 1: Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm found${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git found${NC}"

# Step 2: Install Vercel CLI
echo ""
echo -e "${YELLOW}📋 Step 2: Installing Vercel CLI...${NC}"

if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
else
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
fi

# Step 3: Build frontend
echo ""
echo -e "${YELLOW}📋 Step 3: Building frontend...${NC}"

cd frontend
npm run build
cd ..
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Step 4: Prepare environment
echo ""
echo -e "${YELLOW}📋 Step 4: Git commit${NC}"

if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ Working directory clean, no changes to commit${NC}"
else
    echo -e "${YELLOW}Adding and committing changes...${NC}"
    git add .
    git commit -m "Pre-deployment: Build and configuration updates"
    git push origin main
    echo -e "${GREEN}✅ Changes committed and pushed${NC}"
fi

# Step 5: Login to Vercel
echo ""
echo -e "${YELLOW}📋 Step 5: Vercel authentication${NC}"

if [ -f ~/.vercel/auth.json ]; then
    echo -e "${GREEN}✅ Already logged in to Vercel${NC}"
else
    echo -e "${YELLOW}Please log in to Vercel...${NC}"
    vercel login
fi

# Step 6: Deploy
echo ""
echo -e "${YELLOW}📋 Step 6: Deploying to Vercel...${NC}"
echo ""
echo -e "${BLUE}Choose deployment target:${NC}"
echo "1. Deploy as monorepo (frontend + API)"
echo "2. Deploy frontend only"
echo "3. Cancel"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo -e "${YELLOW}Deploying full stack...${NC}"
        vercel --prod
        ;;
    2)
        echo -e "${YELLOW}Deploying frontend only...${NC}"
        cd frontend
        vercel --prod
        cd ..
        ;;
    3)
        echo -e "${YELLOW}Deployment cancelled${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo ""
echo "1. Add environment variables in Vercel dashboard"
echo "2. Configure database connections"
echo "3. Set up monitoring and logging"
echo "4. Test the deployment"
echo ""
echo -e "${YELLOW}🔗 Resources:${NC}"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo "• Environment Vars: https://vercel.com/docs/projects/environment-variables"
echo "• Deployment Guide: VERCEL_DEPLOYMENT.md"
echo ""
