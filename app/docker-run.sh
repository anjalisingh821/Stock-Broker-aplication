#!/bin/bash

echo "Running TradeHub in Docker Container..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed"
    echo "Please install Docker from https://www.docker.com/"
    exit 1
fi

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    echo "Starting with Docker Compose..."
    docker-compose up --build
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    echo "Starting with Docker Compose (v2)..."
    docker compose up --build
else
    echo "Building Docker image..."
    docker build -t tradehub .
    
    echo "Running container..."
    docker run -p 3000:3000 \
        -e DATABASE_URL="file:./prisma/dev.db" \
        -e NEXTAUTH_URL="http://localhost:3000" \
        -e NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-your-secret-key-change-in-production}" \
        tradehub
fi

