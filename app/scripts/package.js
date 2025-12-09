const fs = require('fs');
const path = require('path');

console.log('Packaging TradeHub for distribution...\n');

const distDir = path.join(__dirname, '..', 'dist-package');
const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');

// Create dist directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy standalone build
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory ${src} does not exist. Run 'npm run build' first.`);
    process.exit(1);
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy standalone build
console.log('Copying standalone build...');
copyRecursive(standaloneDir, distDir);

// Copy static files
console.log('Copying static files...');
const staticSrc = path.join(__dirname, '..', '.next', 'static');
const staticDest = path.join(distDir, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDest), { recursive: true });
  copyRecursive(staticSrc, staticDest);
}

// Copy public directory
console.log('Copying public directory...');
const publicSrc = path.join(__dirname, '..', 'public');
const publicDest = path.join(distDir, 'public');
if (fs.existsSync(publicSrc)) {
  fs.mkdirSync(publicDest, { recursive: true });
  copyRecursive(publicSrc, publicDest);
}

// Copy prisma directory (schema and migrations only, not database)
console.log('Copying Prisma schema...');
const prismaSrc = path.join(__dirname, '..', 'prisma');
const prismaDest = path.join(distDir, 'prisma');
if (fs.existsSync(prismaSrc)) {
  fs.mkdirSync(prismaDest, { recursive: true });
  const entries = fs.readdirSync(prismaSrc, { withFileTypes: true });
  for (const entry of entries) {
    // Skip database files
    if (entry.name.endsWith('.db') || entry.name.endsWith('.db-journal')) {
      continue;
    }
    const srcPath = path.join(prismaSrc, entry.name);
    const destPath = path.join(prismaDest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy startup scripts
console.log('Copying startup scripts...');
const scripts = ['start.sh', 'start.bat'];
scripts.forEach(script => {
  const src = path.join(__dirname, '..', script);
  const dest = path.join(distDir, script);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    if (script.endsWith('.sh')) {
      fs.chmodSync(dest, '755');
    }
  }
});

// Create README
const readme = `# TradeHub Standalone Package

This is a standalone build of TradeHub that can run anywhere Node.js is installed.

## Requirements
- Node.js 18+ installed
- Port 3000 available (or set PORT environment variable)

## Quick Start

### Windows:
\`\`\`bash
start.bat
\`\`\`

### Linux/Mac:
\`\`\`bash
chmod +x start.sh
./start.sh
\`\`\`

## Environment Variables

Create a \`.env\` file in this directory:

\`\`\`
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
\`\`\`

## Production Deployment

For production, set:
- NEXTAUTH_URL to your domain
- NEXTAUTH_SECRET to a secure random string
- DATABASE_URL to your production database

## Running Directly

\`\`\`bash
node server.js
\`\`\`

The application will be available at http://localhost:3000
`;

fs.writeFileSync(path.join(distDir, 'README.md'), readme);

console.log('\n✅ Package created successfully in dist-package/');
console.log('Copy this folder to any machine with Node.js and run start.sh or start.bat\n');

