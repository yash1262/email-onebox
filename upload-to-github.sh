#!/bin/bash

echo "🚀 Email Onebox - GitHub Upload Helper"
echo "======================================"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub username is required!"
    exit 1
fi

echo ""
echo "📝 Repository will be created at:"
echo "   https://github.com/$GITHUB_USER/email-onebox"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USER/email-onebox.git"

echo ""
echo "✅ Remote added successfully!"
echo ""
echo "📤 Now follow these steps:"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: email-onebox"
echo "3. Make it Public"
echo "4. DO NOT initialize with README"
echo "5. Click 'Create repository'"
echo ""
echo "6. Then run this command to push:"
echo ""
echo "   git push -u origin main"
echo ""
echo "======================================"
echo ""
echo "Or if you already created the repo, run:"
echo ""
echo "   git push -u origin main"
echo ""
