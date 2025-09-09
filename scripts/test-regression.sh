#!/bin/bash

echo "🧪 Running Regression Test Suite..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run tests and check result
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${YELLOW}Running: $test_name${NC}"
    echo "Command: $test_command"
    echo "----------------------------------------"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ $test_name PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name FAILED${NC}"
        return 1
    fi
}

# Track overall result
overall_result=0

# 1. Lint check
run_test "ESLint Check" "npm run lint"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# 2. Type check
run_test "TypeScript Type Check" "npx tsc --noEmit"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# 3. Unit tests
run_test "Unit Tests" "npm run test:unit"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# 4. Integration tests
run_test "Integration Tests" "npm run test:integration"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# 5. E2E tests
run_test "End-to-End Tests" "npm run test:e2e"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# 6. Full test suite with coverage
run_test "Full Test Suite with Coverage" "npm run test:coverage"
if [ $? -ne 0 ]; then
    overall_result=1
fi

# Summary
echo -e "\n=================================="
if [ $overall_result -eq 0 ]; then
    echo -e "${GREEN}🎉 All regression tests PASSED!${NC}"
    echo -e "${GREEN}✅ Code is ready for deployment${NC}"
    exit 0
else
    echo -e "${RED}💥 Some regression tests FAILED!${NC}"
    echo -e "${RED}❌ Please fix issues before proceeding${NC}"
    exit 1
fi
