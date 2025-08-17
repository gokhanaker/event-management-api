# Use Node.js 18 Debian-based image for better native dependency support
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for development)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 6000

# Start the application in development mode
CMD ["npm", "run", "dev"] 