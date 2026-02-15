#!/bin/bash

# Wedding Invitation - Deploy Script for Google Cloud Run
# Usage: ./deploy.sh [PROJECT_ID] [REGION]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DEFAULT_REGION="europe-west1"
DEFAULT_SERVICE_NAME="wedding-invitation"

# Get parameters
PROJECT_ID=${1:-}
REGION=${2:-$DEFAULT_REGION}

echo -e "${GREEN}🎊 Wedding Invitation - Deploy to Google Cloud Run${NC}\n"

# Check if PROJECT_ID is provided
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: PROJECT_ID is required${NC}"
    echo "Usage: ./deploy.sh PROJECT_ID [REGION]"
    echo "Example: ./deploy.sh my-project-123 europe-west1"
    exit 1
fi

echo -e "${YELLOW}Configuration:${NC}"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service: $DEFAULT_SERVICE_NAME"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project
echo -e "${YELLOW}Setting project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push image
echo -e "${YELLOW}Building and pushing Docker image...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/$DEFAULT_SERVICE_NAME

# Deploy to Cloud Run
echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
gcloud run deploy $DEFAULT_SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$DEFAULT_SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

# Get service URL
SERVICE_URL=$(gcloud run services describe $DEFAULT_SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo -e "${GREEN}✅ Deploy completed successfully!${NC}"
echo ""
echo -e "${GREEN}🔗 Your invitation is live at:${NC}"
echo -e "${GREEN}   $SERVICE_URL${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Test the URL in your browser"
echo "  2. Share with your guests"
echo "  3. (Optional) Set up custom domain:"
echo "     gcloud run domain-mappings create --service $DEFAULT_SERVICE_NAME --domain www.yourdomain.com --region $REGION"
echo ""
