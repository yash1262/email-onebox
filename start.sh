#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Email Onebox Startup Script${NC}"
echo "=================================="

# Function to kill processes on specific ports
cleanup_ports() {
  echo -e "${YELLOW}🔧 Cleaning up ports...${NC}"
  
  # Kill processes on port 5173 (frontend)
  if lsof -i :5173 &> /dev/null; then
    echo "  Killing process on port 5173..."
    lsof -i :5173 | awk 'NR>1 {print $2}' | xargs -r kill -9 2>/dev/null
  fi
  
  # Kill processes on port 3000 (backend)
  if lsof -i :3000 &> /dev/null; then
    echo "  Killing process on port 3000..."
    lsof -i :3000 | awk 'NR>1 {print $2}' | xargs -r kill -9 2>/dev/null
  fi
  
  # Kill any leftover node processes
  pkill -f "vite\|nodemon\|ts-node" 2>/dev/null
  
  sleep 2
  echo -e "${GREEN}✅ Ports cleaned${NC}"
}

# Function to start Docker services
start_docker() {
  echo -e "${YELLOW}🐳 Starting Docker services...${NC}"
  docker-compose up -d 2>/dev/null
  
  # Wait for services to be ready
  echo "  Waiting for services to be ready..."
  sleep 5
  
  echo -e "${GREEN}✅ Docker services started${NC}"
}

# Function to start services
start_services() {
  echo -e "${YELLOW}🚀 Starting frontend and backend...${NC}"
  
  # Start backend
  echo "  Starting backend..."
  cd backend
  npm run dev > /tmp/backend.log 2>&1 &
  BACKEND_PID=$!
  cd ..
  sleep 5
  
  # Start frontend
  echo "  Starting frontend..."
  cd frontend
  npm run dev > /tmp/frontend.log 2>&1 &
  FRONTEND_PID=$!
  cd ..
  sleep 5
  
  echo -e "${GREEN}✅ Services started${NC}"
}

# Function to verify services
verify_services() {
  echo -e "${YELLOW}📋 Verifying services...${NC}"
  
  local max_attempts=30
  local attempt=0
  
  while [ $attempt -lt $max_attempts ]; do
    local backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
    local frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null || echo "000")
    
    if [ "$backend_status" != "000" ] && [ "$frontend_status" != "000" ]; then
      echo -e "${GREEN}✅ Backend (3000): Running${NC}"
      echo -e "${GREEN}✅ Frontend (5173): Running${NC}"
      return 0
    fi
    
    echo "  Attempt $((attempt+1))/$max_attempts - Waiting for services..."
    sleep 2
    ((attempt++))
  done
  
  echo -e "${RED}❌ Services failed to start within timeout${NC}"
  echo "  Check logs:"
  echo "    Backend: cat /tmp/backend.log"
  echo "    Frontend: cat /tmp/frontend.log"
  return 1
}

# Main execution
echo ""

# Cleanup old processes and ports
cleanup_ports

# Start Docker services
start_docker

# Start frontend and backend
start_services

# Verify services are running
if verify_services; then
  echo ""
  echo -e "${GREEN}════════════════════════════════════${NC}"
  echo -e "${GREEN}✅ Email Onebox is ready!${NC}"
  echo -e "${GREEN}════════════════════════════════════${NC}"
  echo ""
  echo -e "🌐 Frontend:  ${GREEN}http://localhost:5173${NC}"
  echo -e "🔌 Backend:   ${GREEN}http://localhost:3000${NC}"
  echo ""
  echo "Press Ctrl+C to stop services"
  echo ""
  
  # Keep the script running and monitor for crashes
  while true; do
    sleep 5
    
    # Check if services are still running
    if ! lsof -i :5173 &> /dev/null; then
      echo -e "${RED}⚠️  Frontend crashed, restarting...${NC}"
      cd frontend
      npm run dev > /tmp/frontend.log 2>&1 &
      cd ..
      sleep 3
    fi
    
    if ! lsof -i :3000 &> /dev/null; then
      echo -e "${RED}⚠️  Backend crashed, restarting...${NC}"
      cd backend
      npm run dev > /tmp/backend.log 2>&1 &
      cd ..
      sleep 3
    fi
  done
else
  echo -e "${RED}Failed to start services${NC}"
  exit 1
fi
