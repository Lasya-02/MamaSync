# frontend/Dockerfile

# --- Build stage ---
FROM node:20 AS build

WORKDIR /app

# Install deps using package-lock (npm ci expects lockfile)
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of frontend code
COPY . .

# Build React app
RUN npm run build

# --- Runtime stage (Nginx) ---
FROM nginx:alpine

# Remove default Nginx static contents and add our build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

# Expose HTTP
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
