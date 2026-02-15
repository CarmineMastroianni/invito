#!/bin/bash

# Wedding Invitation - Google Cloud Run Deployment Script
# This script deploys the wedding invitation application to Google Cloud Run

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVICE_NAME="wedding-invitation"
REGION="europe-west1"
MEMORY="256Mi"
CPU="1"
MAX_INSTANCES="10"
MIN_INSTANCES="0"

echo -e "${GREEN}=== Wedding Invitation - Cloud Run Deployment ===${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get current project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project configured${NC}"
    echo "Please run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${YELLOW}Project ID:${NC} $PROJECT_ID"
echo -e "${YELLOW}Service Name:${NC} $SERVICE_NAME"
echo -e "${YELLOW}Region:${NC} $REGION\n"

# Confirm deployment
read -p "Do you want to proceed with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 0
fi

# Enable required APIs
echo -e "\n${GREEN}Step 1: Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and submit using Cloud Build
echo -e "\n${GREEN}Step 2: Building container image with Cloud Build...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
echo -e "\n${GREEN}Step 3: Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory $MEMORY \
    --cpu $CPU \
    --max-instances $MAX_INSTANCES \
    --min-instances $MIN_INSTANCES

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo -e "\n${GREEN}=== Deployment Complete! ===${NC}"
echo -e "${GREEN}Service URL:${NC} $SERVICE_URL"
echo -e "\nYou can view logs with:"
echo -e "  gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50"
echo -e "\nYou can view the service in the console:"
echo -e "  https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"
