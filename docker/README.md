# Docker Services for Email Onebox

This directory contains Docker configurations for the required services.

## Services

### 1. Elasticsearch (Port 9200)
- **Purpose:** Email storage and full-text search
- **Version:** 8.11.0
- **Configuration:**
  - Single-node mode (no clustering)
  - Security disabled for local development
  - 512MB heap size
  - Data persisted in `elasticsearch-data` volume

### 2. Qdrant (Port 6333)
- **Purpose:** Vector database for RAG (AI-powered replies)
- **Version:** Latest
- **Configuration:**
  - REST API: Port 6333
  - gRPC API: Port 6334
  - Data persisted in `qdrant-data` volume

## Quick Start

### Start Services
```bash
# From project root
docker-compose up -d

# OR from this directory
cd docker
docker-compose up -d
```

### Check Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f elasticsearch
docker-compose logs -f qdrant
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Data
```bash
docker-compose down -v
```

## Health Checks

### Elasticsearch
```bash
curl http://localhost:9200/_cluster/health
```

Expected response:
```json
{
  "cluster_name": "docker-cluster",
  "status": "green",
  "number_of_nodes": 1
}
```

### Qdrant
```bash
curl http://localhost:6333/healthz
```

Expected response: `200 OK`

Or check collections:
```bash
curl http://localhost:6333/collections
```

## Data Persistence

Data is stored in Docker volumes:
- `elasticsearch-data` - Email indices and search data
- `qdrant-data` - Vector embeddings and context

These volumes persist even when containers are stopped.

## Troubleshooting

### Elasticsearch won't start
1. **Not enough memory:**
   ```bash
   # Reduce heap size in docker-compose.yml
   ES_JAVA_OPTS=-Xms256m -Xmx256m
   ```

2. **Port already in use:**
   ```bash
   # Check what's using port 9200
   lsof -ti:9200
   # Kill the process or change port in docker-compose.yml
   ```

3. **Permission issues:**
   ```bash
   # Fix volume permissions
   docker-compose down -v
   docker-compose up -d
   ```

### Qdrant won't start
1. **Port already in use:**
   ```bash
   # Check what's using port 6333
   lsof -ti:6333
   ```

2. **Storage issues:**
   ```bash
   # Reset Qdrant data
   docker-compose down
   docker volume rm email-onebox_qdrant-data
   docker-compose up -d qdrant
   ```

### General Issues
```bash
# Restart all services
docker-compose restart

# Rebuild containers
docker-compose up -d --force-recreate

# View detailed logs
docker-compose logs --tail=100 -f
```

## Network

Services communicate on the `email-onebox-network` bridge network.

Backend application can connect to:
- Elasticsearch: `http://localhost:9200`
- Qdrant: `http://localhost:6333`

## Resource Usage

**Minimum Requirements:**
- RAM: 2GB
- Disk: 5GB

**Recommended:**
- RAM: 4GB
- Disk: 10GB

## Advanced Configuration

### Custom Elasticsearch Settings
Edit `docker-compose.yml`:
```yaml
environment:
  - "ES_JAVA_OPTS=-Xms1g -Xmx1g"  # Increase heap to 1GB
  - cluster.name=my-cluster
```

### Custom Qdrant Settings
Edit `docker-compose.yml`:
```yaml
environment:
  - QDRANT__LOG_LEVEL=INFO
  - QDRANT__SERVICE__GRPC_PORT=6334
```

## Production Notes

⚠️ **This configuration is for DEVELOPMENT only!**

For production deployment:
1. Enable Elasticsearch security (authentication)
2. Use managed services (AWS Elasticsearch, Qdrant Cloud)
3. Set up proper backup strategies
4. Configure SSL/TLS
5. Implement access controls
6. Monitor resource usage

## Useful Commands

```bash
# Check service health
docker-compose ps

# Inspect a container
docker inspect email-onebox-elasticsearch

# Execute command in container
docker-compose exec elasticsearch bash

# View container stats
docker stats

# Remove everything and start fresh
docker-compose down -v
docker-compose up -d
```

## Integration with Backend

The backend expects these environment variables:

```bash
# .env file
ELASTICSEARCH_NODE=http://localhost:9200
QDRANT_URL=http://localhost:6333
```

Make sure these match the ports exposed in docker-compose.yml.
