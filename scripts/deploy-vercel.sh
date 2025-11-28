#!/bin/bash

# Vercel Deployment Script
# Deploys sajuwooju to Vercel

PROJECT_NAME="sajuwooju"

echo "🚀 Deploying to Vercel..."

# Check if VERCEL_TOKEN is set
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN environment variable is not set"
  echo "Please set it with: export VERCEL_TOKEN=your_token_here"
  echo ""
  echo "You can get your token from: https://vercel.com/account/tokens"
  exit 1
fi

# Deploy to Vercel
echo "📦 Deploying with Vercel CLI..."
vercel --token "$VERCEL_TOKEN" --prod --yes --name "$PROJECT_NAME"

if [ $? -eq 0 ]; then
  echo "✅ Deployment successful!"
  echo "🌐 Your site should be live at: https://$PROJECT_NAME.vercel.app"
else
  echo "❌ Deployment failed"
  exit 1
fi
