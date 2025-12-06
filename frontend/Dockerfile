# -------------------------
# ✅ Build Stage
# -------------------------
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files
COPY . .

# -------------------------
# ✅ Build-time Arguments
# -------------------------
# Accept API URL and Google Maps API Key from GitHub Actions
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY

# Build React app with production env variables
RUN npm run build

# -------------------------
# ✅ Production Stage (Apache HTTP Server) - UPDATED
# -------------------------
FROM httpd:alpine

# Copy React build output from build stage to Apache's default web root
COPY --from=build /app/build /usr/local/apache2/htdocs/

# Expose port 80 (Apache listens on this by default)
EXPOSE 80

# Apache starts automatically by default
