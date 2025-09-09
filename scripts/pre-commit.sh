#!/bin/bash

echo "🔍 Running Pre-commit Checks..."
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run checks and check result
run_check() {
    local check_name="$1"
    local check_command="$2"
    
    echo -e "\n${YELLOW}Running: $check_name${NC}"
    echo "Command: $check_command"
    echo "----------------------------------------"
    
    if eval "$check_command"; then
        echo -e "${GREEN}✅ $check_name PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ $check_name FAILED${NC}"
        return 1
    fi
}

# Track overall result
overall_result=0

# 1. Lint check
run_check "ESLint Check" "npm run lint"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# 2. Format check
run_check "Prettier Format Check" "npx prettier --check src/**/*.ts"
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}💡 Run 'npm run format' to fix formatting issues${NC}"
    overall_result=1
fi

# 3. Type check
run_check "TypeScript Type Check" "npx tsc --noEmit"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# 4. Unit tests (fastest subset)
run_check "Unit Tests" "npm run test:unit"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# Summary
echo -e "\n==============================="
if [ $overall_result -eq 0 ]; then
    echo -e "${GREEN}🎉 All pre-commit checks PASSED!${NC}"
    echo -e "${GREEN}✅ Ready to commit${NC}"
    exit 0
else
    echo -e "${RED}💥 Some pre-commit checks FAILED!${NC}"
    echo -e "${RED}❌ Please fix issues before committing${NC}"
    exit 1
fi
