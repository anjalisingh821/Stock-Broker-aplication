#!/bin/bash

echo "Building TradeHub Standalone Package..."
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Build the application
echo "Building application..."
npm run build

# Create standalone package directory
echo "Creating standalone package..."
mkdir -p dist-package

# Copy standalone build
cp -r .next/standalone/* dist-package/
cp -r .next/static dist-package/.next/static
cp -r public dist-package/public
cp -r prisma dist-package/prisma

# Copy necessary files
cp package.json dist-package/
cp start.sh dist-package/
cp start.bat dist-package/

# Create README for standalone package
cat > dist-package/README.md << 'EOF'
# TradeHub Standalone Package

This is a standalone build of TradeHub that can run anywhere Node.js is installed.

## Requirements
- Node.js 18+ installed
- Port 3000 available (or set PORT environment variable)

## Quick Start

### Windows:
```bash
start.bat
```

### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

## Environment Variables

Create a `.env` file in this directory:

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## Production Deployment

For production, set:
- NEXTAUTH_URL to your domain
- NEXTAUTH_SECRET to a secure random string
- DATABASE_URL to your production database

## Running

```bash
node server.js
```

The application will be available at http://localhost:3000
EOF

echo ""
echo "Standalone package created in dist-package/"
echo "Copy this folder to any machine with Node.js and run start.sh or start.bat"

