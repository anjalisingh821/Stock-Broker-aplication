# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package files from the app folder
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from app/ folder
COPY app/. .

# Generate Prisma Client (project me prisma use ho raha hai)
RUN npx prisma generate

# Expose port (Next.js default 3000)
EXPOSE 3000

# Start the application (Next.js dev/start)
CMD ["npm", "run", "dev"]

