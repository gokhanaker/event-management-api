# Use Node.js 18 Alpine as base image
FROM node:18-alpine

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