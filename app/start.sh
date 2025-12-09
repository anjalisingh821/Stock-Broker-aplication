#!/bin/bash

echo "Starting TradeHub Stock Broker Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
fi

# Generate Prisma Client if needed
if [ ! -d "node_modules/.prisma" ]; then
    echo "Generating Prisma Client..."
    npx prisma generate
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo ""
echo "Starting application on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""
npm run dev

