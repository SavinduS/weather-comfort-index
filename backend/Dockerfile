# --- Stage 1: Build Stage ---
# Use the official Node.js Alpine image for a small footprint
FROM node:20-alpine3.20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first to leverage Docker layer caching
# The asterisk ensures package-lock.json is copied if it exists
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies) required for the build process
# 'npm ci' is preferred for CI/CD environments as it is faster and more reliable
RUN npm ci 

# Copy the rest of the source code
COPY . .

# --- Stage 2: Production Stage ---
# Start with a fresh image to keep the final production image clean and small
FROM node:20-alpine3.20 AS production

# Set the environment variable to production
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy package files again to install only production dependencies
COPY package.json package-lock.json* ./

# Install only production dependencies to keep the image size minimal
RUN npm ci --only=production

# Copy only the necessary files from the build stage
# This excludes source code not needed in production and build tools
COPY --from=build /app/src ./src
COPY --from=build /app/cities.json ./cities.json

# Security Best Practice: Run the application as a non-root user
# The official Node image comes with a pre-created 'node' user
USER node

# Document the port the application listens on
EXPOSE 5001

# Execute the application directly using node (better for signal handling than npm start)
CMD ["node", "src/index.js"]