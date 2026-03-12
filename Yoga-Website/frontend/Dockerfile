# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Add nginx config as a template for envsubst
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default env var if not provided
ENV BACKEND_HOST=backend

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
