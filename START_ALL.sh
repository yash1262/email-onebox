#!/bin/bash

echo "🚀 Starting Email Onebox..."
echo ""

# Kill existing processes
echo "🛑 Stopping existing services..."
pkill -f "ts-node.*server" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Start backend
echo "🖥️  Starting backend..."
cd backend
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 8

# Check backend
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend running on http://localhost:3000"
else
    echo "❌ Backend failed to start. Check /tmp/backend.log"
    exit 1
fi

# Start frontend
echo "🌐 Starting frontend..."
cd frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
sleep 6

# Check frontend
if lsof -ti:5173 > /dev/null 2>&1; then
    echo "✅ Frontend running on http://localhost:5173"
else
    echo "⚠️  Frontend may still be starting..."
fi

echo ""
echo "═══════════════════════════════════════"
echo "✅ Email Onebox is ready!"
echo "═══════════════════════════════════════"
echo ""
echo "🌐 Open: http://localhost:5173"
echo ""
echo "📊 Services:"
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop: pkill -f 'ts-node|vite'"
echo ""
