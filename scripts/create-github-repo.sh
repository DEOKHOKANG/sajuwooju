#!/bin/bash

# GitHub Repository Creation Script
# Creates a new repository named 'sajuwooju' and pushes code

REPO_NAME="sajuwooju"
REPO_DESCRIPTION="사주우주 (SajuWooju) - 우주의 법칙으로 읽는 나의 운명 🌌"
GITHUB_USERNAME="efuelteam"

echo "🚀 Creating GitHub repository: $REPO_NAME"

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN environment variable is not set"
  echo "Please set it with: export GITHUB_TOKEN=your_token_here"
  exit 1
fi

# Create repository using GitHub API
echo "📦 Creating repository via GitHub API..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"$REPO_DESCRIPTION\",
    \"private\": false,
    \"has_issues\": true,
    \"has_projects\": true,
    \"has_wiki\": true
  }")

# Check if creation was successful
if echo "$RESPONSE" | grep -q "\"id\""; then
  echo "✅ Repository created successfully!"
  REPO_URL=$(echo "$RESPONSE" | grep -o '"html_url": "[^"]*"' | head -1 | cut -d'"' -f4)
  echo "📍 Repository URL: $REPO_URL"

  # Add remote and push
  echo "🔗 Adding remote origin..."
  git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

  echo "📤 Pushing to GitHub..."
  git push -u origin main

  echo "✅ Done! Repository created and code pushed."
  echo "🌐 Visit: $REPO_URL"
else
  echo "❌ Failed to create repository"
  echo "Response: $RESPONSE"
  exit 1
fi
