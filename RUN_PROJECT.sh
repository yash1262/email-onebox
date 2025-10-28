#!/bin/bash

echo "========================================"
echo "  Email Onebox - Project Setup & Run"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo ""
    echo "Option 1 - Using Homebrew (Recommended for Mac):"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "  brew install node"
    echo ""
    echo "Option 2 - Direct Download:"
    echo "  Visit: https://nodejs.org/en/download/"
    echo "  Download and install the LTS version for macOS"
    echo ""
    echo "After installing Node.js, run this script again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js found: $NODE_VERSION"
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not found!"
    echo "npm should come with Node.js. Please reinstall Node.js."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm found: $NPM_VERSION"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "========================================"
echo "Step 1: Installing Dependencies"
echo "========================================"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "✅ All dependencies installed successfully!"
echo ""

echo "========================================"
echo "Step 2: Checking Docker"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed!"
    echo ""
    echo "Docker is required to run Elasticsearch and Qdrant."
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    echo ""
    echo "After installing Docker:"
    echo "  1. Start Docker Desktop"
    echo "  2. Run: cd docker && docker-compose up -d"
    echo "  3. Then run this script again"
    echo ""
    read -p "Do you want to continue without Docker? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Docker found: $(docker --version)"
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        echo "⚠️  Docker is installed but not running!"
        echo "Please start Docker Desktop and run this script again."
        exit 1
    fi
    
    echo "✅ Docker is running"
    echo ""
    
    # Start Docker services
    echo "🐳 Starting Docker services (Elasticsearch + Qdrant)..."
    cd docker
    docker-compose up -d
    if [ $? -eq 0 ]; then
        echo "✅ Docker services started successfully!"
    else
        echo "⚠️  Failed to start Docker services"
    fi
    cd ..
fi

echo ""
echo "========================================"
echo "Step 3: Environment Configuration"
echo "========================================"
echo ""

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found!"
    echo ""
    echo "Creating backend/.env from backend/.env.example..."
    cp backend/.env.example backend/.env
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and add:"
    echo "  - Your email credentials (EMAIL1_USER, EMAIL1_PASSWORD, etc.)"
    echo "  - OpenAI API key (OPENAI_API_KEY)"
    echo "  - Optional: Slack webhook URL"
    echo ""
    read -p "Press Enter after you've configured backend/.env..."
else
    echo "✅ Backend .env file exists"
fi

# Check if frontend .env exists
if [ ! -f "frontend/.env" ]; then
    echo ""
    echo "Creating frontend/.env..."
    echo "VITE_API_URL=http://localhost:3000/api" > frontend/.env
    echo "✅ Frontend .env created"
else
    echo "✅ Frontend .env file exists"
fi

echo ""
echo "========================================"
echo "Step 4: Starting Application"
echo "========================================"
echo ""

echo "🚀 Starting backend and frontend servers..."
echo ""
echo "Backend will run on: http://localhost:3000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start both servers
npm run dev
