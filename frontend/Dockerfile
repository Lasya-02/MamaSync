# ✅ Build stage
FROM node:20 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY

RUN npm run build


# ✅ Production stage (NO NGINX)
FROM node:20-alpine
WORKDIR /app

# ✅ Install lightweight static server
RUN npm install -g serve

# ✅ Copy build output
COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
