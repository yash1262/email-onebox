#!/bin/bash

echo "╔═══════════════════════════════════════════════╗"
echo "║   Docker Services Test Script                 ║"
echo "║   Email Onebox Project                        ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} - $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} - $2"
        ((TESTS_FAILED++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Checking Prerequisites"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    test_result 0 "Docker installed: $DOCKER_VERSION"
else
    test_result 1 "Docker not installed"
    echo ""
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check Docker is running
if docker info &> /dev/null; then
    test_result 0 "Docker daemon is running"
else
    test_result 1 "Docker daemon is not running"
    echo ""
    echo "Please start Docker Desktop and try again"
    exit 1
fi

# Check docker-compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    test_result 0 "docker-compose installed: $COMPOSE_VERSION"
else
    test_result 1 "docker-compose not installed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Starting Docker Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start services
echo "Starting Elasticsearch and Qdrant..."
docker-compose up -d

if [ $? -eq 0 ]; then
    test_result 0 "Docker services started"
else
    test_result 1 "Failed to start Docker services"
    exit 1
fi

echo ""
echo "⏳ Waiting for services to initialize (40 seconds)..."
sleep 40

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Checking Container Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Elasticsearch container
if docker ps | grep -q "email-onebox-elasticsearch"; then
    test_result 0 "Elasticsearch container is running"
else
    test_result 1 "Elasticsearch container not found"
fi

# Check Qdrant container
if docker ps | grep -q "email-onebox-qdrant"; then
    test_result 0 "Qdrant container is running"
else
    test_result 1 "Qdrant container not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Testing Elasticsearch (Port 9200)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test Elasticsearch connection
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9200)
if [ "$HTTP_CODE" -eq 200 ]; then
    test_result 0 "Elasticsearch is responding (HTTP $HTTP_CODE)"
else
    test_result 1 "Elasticsearch not responding (HTTP $HTTP_CODE)"
fi

# Test Elasticsearch health
HEALTH=$(curl -s http://localhost:9200/_cluster/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
if [ "$HEALTH" == "green" ] || [ "$HEALTH" == "yellow" ]; then
    test_result 0 "Elasticsearch cluster health: $HEALTH"
else
    test_result 1 "Elasticsearch cluster unhealthy: $HEALTH"
fi

# Test Elasticsearch indices
ES_INFO=$(curl -s http://localhost:9200)
if echo "$ES_INFO" | grep -q "cluster_name"; then
    test_result 0 "Elasticsearch API is functional"
else
    test_result 1 "Elasticsearch API not responding correctly"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Testing Qdrant (Port 6333)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test Qdrant health
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:6333/healthz)
if [ "$HTTP_CODE" -eq 200 ]; then
    test_result 0 "Qdrant health check passed (HTTP $HTTP_CODE)"
else
    test_result 1 "Qdrant health check failed (HTTP $HTTP_CODE)"
fi

# Test Qdrant collections endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:6333/collections)
if [ "$HTTP_CODE" -eq 200 ]; then
    test_result 0 "Qdrant API is responding (HTTP $HTTP_CODE)"
else
    test_result 1 "Qdrant API not responding (HTTP $HTTP_CODE)"
fi

# Check if Qdrant accepts requests
QDRANT_VERSION=$(curl -s http://localhost:6333 | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
if [ ! -z "$QDRANT_VERSION" ]; then
    test_result 0 "Qdrant version: $QDRANT_VERSION"
else
    test_result 1 "Cannot determine Qdrant version"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Checking Data Persistence"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Elasticsearch volume
if docker volume ls | grep -q "email-onebox_elasticsearch-data"; then
    test_result 0 "Elasticsearch data volume exists"
else
    test_result 1 "Elasticsearch data volume missing"
fi

# Check Qdrant volume
if docker volume ls | grep -q "email-onebox_qdrant-data"; then
    test_result 0 "Qdrant data volume exists"
else
    test_result 1 "Qdrant data volume missing"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  Checking Network Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check network
if docker network ls | grep -q "email-onebox_email-onebox-network"; then
    test_result 0 "Docker network configured"
else
    test_result 1 "Docker network missing"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 Docker services are ready!"
    echo ""
    echo "Service URLs:"
    echo "  📊 Elasticsearch: http://localhost:9200"
    echo "  🗄️  Qdrant:        http://localhost:6333"
    echo ""
    echo "Next steps:"
    echo "  1. Configure backend/.env with your credentials"
    echo "  2. Run: npm run dev"
    echo ""
    echo "Useful commands:"
    echo "  npm run docker:logs     - View logs"
    echo "  npm run docker:status   - Check status"
    echo "  npm run docker:down     - Stop services"
    echo ""
    exit 0
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check logs: npm run docker:logs"
    echo "  2. Restart services: npm run docker:restart"
    echo "  3. Clean and restart: npm run docker:clean && npm run docker:up"
    echo ""
    echo "For more help, see: DOCKER_FIXES.md"
    echo ""
    exit 1
fi
