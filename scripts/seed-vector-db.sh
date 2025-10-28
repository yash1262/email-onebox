#!/bin/bash

echo "🌱 Seeding vector database with product context..."

# This would typically call your backend API or directly seed the vector DB
# Example using curl to your backend endpoint

curl -X POST "http://localhost:3000/api/admin/seed-vector-db" \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Job Application Assistant",
    "agenda": "I am applying for software engineering positions. If a lead is interested, share the meeting booking link: https://cal.com/example"
  }'

echo ""
echo "✅ Vector database seeded successfully!"
