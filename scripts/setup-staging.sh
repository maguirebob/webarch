#!/bin/bash

echo "🚀 Setting up Staging Deployment..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run commands and check result
run_command() {
    local command="$1"
    local description="$2"
    
    echo -e "\n${BLUE}Running: $description${NC}"
    echo "Command: $command"
    echo "----------------------------------------"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $description completed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ $description failed${NC}"
        return 1
    fi
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not in a git repository. Please run this from the project root.${NC}"
    exit 1
fi

# Check if staging branch exists
if git show-ref --verify --quiet refs/heads/staging; then
    echo -e "${YELLOW}⚠️  Staging branch already exists${NC}"
    read -p "Do you want to reset it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_command "git branch -D staging" "Delete existing staging branch"
    else
        echo -e "${YELLOW}Using existing staging branch${NC}"
    fi
fi

# Create or switch to staging branch
if ! git show-ref --verify --quiet refs/heads/staging; then
    run_command "git checkout -b staging" "Create staging branch"
else
    run_command "git checkout staging" "Switch to staging branch"
fi

# Ensure we're up to date with main
run_command "git merge main" "Merge latest changes from main"

# Build the application
run_command "npm run build" "Build application for production"

# Run tests to ensure everything works
run_command "npm run test:ci" "Run test suite"

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Staging setup completed successfully!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Choose a deployment platform (Railway, Render, or Heroku)"
echo "2. Follow the deployment guide in DEPLOYMENT.md"
echo "3. Set up your staging environment variables"
echo "4. Deploy and test your application"

echo -e "\n${BLUE}Deployment platforms:${NC}"
echo "• Railway: https://railway.app (Recommended - easiest)"
echo "• Render: https://render.com (Good free tier)"
echo "• Heroku: https://heroku.com (Well-established)"

echo -e "\n${BLUE}Current staging branch status:${NC}"
git status --short
