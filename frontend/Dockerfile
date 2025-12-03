# ✅ Build stage
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# ✅✅✅ MODIFIED: Accept API URL as a BUILD-TIME argument from GitHub Actions
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# ✅✅✅ MODIFIED: Accept Google Maps API Key as a BUILD-TIME argument
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY

# ✅✅✅ React will now build with real production env values instead of undefined
RUN npm run build

# ✅ Serve with Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
