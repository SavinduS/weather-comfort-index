# --- Stage 1: Build Stage ---
# Use Node.js to install dependencies and build the static files
FROM node:20-alpine3.20 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code and build the project
COPY . .
RUN npm run build

# --- Stage 2: Production Stage ---
# Use NGINX Alpine to serve the static files
FROM nginx:stable-alpine

# Remove default NGINX static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the static build files from the 'build' stage to the NGINX html folder
# Adjust '/app/dist' to '/app/build' if you are not using Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Industry Tip: Copy a custom NGINX configuration to handle SPA routing (Optional but recommended)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Document that the container listens on port 80
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]