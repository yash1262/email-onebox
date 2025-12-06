#!/bin/bash

echo "🔧 Setting up Elasticsearch..."

# Wait for Elasticsearch to be ready
echo "⏳ Waiting for Elasticsearch to start..."
until curl -s http://localhost:9200/_cluster/health > /dev/null; do
    sleep 2
done

echo "✅ Elasticsearch is ready!"

# Create email index
echo "📊 Creating email index..."
curl -X PUT "http://localhost:9200/emails" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "messageId": { "type": "keyword" },
      "accountEmail": { "type": "keyword" },
      "from": { "type": "text" },
      "to": { "type": "text" },
      "subject": { "type": "text" },
      "body": { "type": "text" },
      "date": { "type": "date" },
      "folder": { "type": "keyword" },
      "category": { "type": "keyword" },
      "uid": { "type": "integer" },
      "flags": { "type": "keyword" },
      "timestamp": { "type": "date" }
    }
  }
}
'

echo ""
echo "✅ Email index created successfully!"
