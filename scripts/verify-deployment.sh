#!/bin/bash

echo "🔍 Verifying Staging Deployment..."
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get staging URL from environment or prompt
if [ -z "$STAGING_URL" ]; then
    read -p "Enter your staging URL (e.g., https://your-app.railway.app): " STAGING_URL
fi

if [ -z "$STAGING_URL" ]; then
    echo -e "${RED}❌ No staging URL provided${NC}"
    exit 1
fi

echo -e "\n${BLUE}Testing staging deployment at: $STAGING_URL${NC}"

# Function to test endpoint
test_endpoint() {
    local endpoint="$1"
    local expected_status="$2"
    local description="$3"
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "URL: $STAGING_URL$endpoint"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$STAGING_URL$endpoint")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ $description - Status: $response${NC}"
        return 0
    else
        echo -e "${RED}❌ $description - Expected: $expected_status, Got: $response${NC}"
        return 1
    fi
}

# Function to test content
test_content() {
    local endpoint="$1"
    local expected_content="$2"
    local description="$3"
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "URL: $STAGING_URL$endpoint"
    
    local content=$(curl -s "$STAGING_URL$endpoint")
    
    if echo "$content" | grep -q "$expected_content"; then
        echo -e "${GREEN}✅ $description - Content found${NC}"
        return 0
    else
        echo -e "${RED}❌ $description - Content not found${NC}"
        return 1
    fi
}

# Track overall result
overall_result=0

# Test basic connectivity
echo -e "\n${BLUE}=== Basic Connectivity Tests ===${NC}"
test_endpoint "/" "200" "Home page loads"
if [ $? -ne 0 ]; then overall_result=1; fi

test_endpoint "/events" "200" "Events listing page loads"
if [ $? -ne 0 ]; then overall_result=1; fi

test_endpoint "/events/1" "200" "Event detail page loads"
if [ $? -ne 0 ]; then overall_result=1; fi

test_endpoint "/nonexistent" "404" "404 handling works"
if [ $? -ne 0 ]; then overall_result=1; fi

# Test content
echo -e "\n${BLUE}=== Content Tests ===${NC}"
test_content "/" "Welcome to Web Arch Events" "Home page has correct title"
if [ $? -ne 0 ]; then overall_result=1; fi

test_content "/" "Featured Events" "Home page shows featured events"
if [ $? -ne 0 ]; then overall_result=1; fi

test_content "/events" "All Events" "Events page has correct title"
if [ $? -ne 0 ]; then overall_result=1; fi

test_content "/events/1" "Tech Conference 2024" "Event detail shows correct event"
if [ $? -ne 0 ]; then overall_result=1; fi

# Test static assets
echo -e "\n${BLUE}=== Static Assets Tests ===${NC}"
test_endpoint "/css/style.css" "200" "CSS file loads"
if [ $? -ne 0 ]; then overall_result=1; fi

test_endpoint "/js/main.js" "200" "JavaScript file loads"
if [ $? -ne 0 ]; then overall_result=1; fi

# Test database connectivity (indirect)
echo -e "\n${BLUE}=== Database Tests ===${NC}"
test_content "/" "Tech Conference" "Database shows sample events"
if [ $? -ne 0 ]; then overall_result=1; fi

test_content "/events" "Music Festival" "Events listing shows database content"
if [ $? -ne 0 ]; then overall_result=1; fi

# Performance test
echo -e "\n${BLUE}=== Performance Tests ===${NC}"
echo -e "\n${YELLOW}Testing response time...${NC}"
response_time=$(curl -s -o /dev/null -w "%{time_total}" "$STAGING_URL/")
echo -e "${BLUE}Response time: ${response_time}s${NC}"

if (( $(echo "$response_time < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ Response time is acceptable (< 3s)${NC}"
else
    echo -e "${YELLOW}⚠️  Response time is slow (> 3s)${NC}"
fi

# Summary
echo -e "\n================================="
if [ $overall_result -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests PASSED! Staging deployment is working correctly.${NC}"
    echo -e "\n${BLUE}Your staging environment is ready for testing:${NC}"
    echo "• Home: $STAGING_URL"
    echo "• Events: $STAGING_URL/events"
    echo "• Event Details: $STAGING_URL/events/1"
    exit 0
else
    echo -e "${RED}💥 Some tests FAILED! Please check your deployment.${NC}"
    echo -e "\n${YELLOW}Troubleshooting tips:${NC}"
    echo "• Check application logs"
    echo "• Verify environment variables"
    echo "• Ensure database is connected"
    echo "• Check build process"
    exit 1
fi
