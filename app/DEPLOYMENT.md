# TradeHub Deployment Guide

This guide covers multiple ways to deploy TradeHub to any environment.

## 🚀 Quick Start Options

### Option 1: Standalone Package (Recommended)

Creates a self-contained package that runs anywhere Node.js is installed.

#### Build the Package:

**Windows:**
```bash
build-standalone.bat
```

**Linux/Mac:**
```bash
chmod +x build-standalone.sh
./build-standalone.sh
```

**Or use npm:**
```bash
npm run build
npm run package
```

This creates a `dist-package/` folder with everything needed.

#### Deploy:

1. Copy the `dist-package/` folder to your target server
2. Create a `.env` file with your configuration:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_URL="http://your-domain.com"
   NEXTAUTH_SECRET="your-secure-secret-key"
   ```
3. Run:
   ```bash
   # Windows
   start.bat
   
   # Linux/Mac
   chmod +x start.sh
   ./start.sh
   ```

### Option 2: Docker (Most Portable)

Works on any system with Docker installed.

#### Build and Run:

**Using Docker Compose:**
```bash
docker-compose up --build
```

**Or manually:**
```bash
# Build image
docker build -t tradehub .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prisma/dev.db" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  tradehub
```

### Option 3: Direct Node.js

For servers with Node.js already installed.

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build
npm run build

# Start production server
npm start
```

## 📦 Package Contents

The standalone package (`dist-package/`) includes:
- ✅ Compiled Next.js application
- ✅ Node.js server
- ✅ All static assets
- ✅ Prisma schema and migrations
- ✅ Startup scripts
- ✅ README with instructions

## 🌐 Production Deployment

### Environment Variables

Create a `.env` file with:

```env
# Database (SQLite for standalone, or PostgreSQL/MySQL for production)
DATABASE_URL="file:./prisma/dev.db"

# Application URL
NEXTAUTH_URL="https://your-domain.com"

# Secret key (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
NEXTAUTH_SECRET="your-secure-random-secret-key"

# Optional: Port (defaults to 3000)
PORT=3000
```

### Database Setup

**For SQLite (default):**
- Database file is created automatically
- No additional setup needed

**For PostgreSQL/MySQL:**
1. Update `DATABASE_URL` in `.env`
2. Update `prisma/schema.prisma` datasource
3. Run migrations: `npx prisma migrate deploy`

### Process Management

**Using PM2 (Recommended):**
```bash
npm install -g pm2
pm2 start server.js --name tradehub
pm2 save
pm2 startup
```

**Using systemd (Linux):**
Create `/etc/systemd/system/tradehub.service`:
```ini
[Unit]
Description=TradeHub Stock Broker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/dist-package
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable tradehub
sudo systemctl start tradehub
```

## 🔒 Security Checklist

- [ ] Change `NEXTAUTH_SECRET` to a secure random string
- [ ] Use HTTPS in production (set `NEXTAUTH_URL` to https://)
- [ ] Use a production database (PostgreSQL/MySQL) instead of SQLite
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular backups of database

## 📊 Monitoring

### Health Check Endpoint

The application runs on port 3000 by default. Check health:
```bash
curl http://localhost:3000
```

### Logs

**PM2:**
```bash
pm2 logs tradehub
```

**Docker:**
```bash
docker logs <container-id>
```

## 🚢 Cloud Deployment

### Vercel (Easiest)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### AWS/Azure/GCP

1. Build standalone package
2. Upload to cloud storage
3. Deploy to EC2/VM/Container Instance
4. Configure load balancer
5. Set up SSL certificate

### Docker Registry

```bash
# Build and tag
docker build -t your-registry/tradehub:latest .

# Push to registry
docker push your-registry/tradehub:latest

# Deploy on any Docker host
docker pull your-registry/tradehub:latest
docker run -p 3000:3000 your-registry/tradehub:latest
```

## 🔧 Troubleshooting

### Port Already in Use

Change port:
```bash
PORT=3001 npm start
```

### Database Errors

Reset database:
```bash
npx prisma migrate reset
npx prisma migrate deploy
```

### Build Errors

Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📝 Notes

- The standalone build includes all dependencies
- No need for `node_modules` in production
- Database migrations run automatically on first start
- All environment variables can be set via `.env` file

## 🆘 Support

For issues, check:
1. Node.js version (requires 18+)
2. Environment variables are set correctly
3. Port is available
4. Database permissions (if using PostgreSQL/MySQL)

