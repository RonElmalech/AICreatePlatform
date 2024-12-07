# Step 1: Build the Vite app (React)
FROM node:20.18.1-alpine AS build

WORKDIR /app

# Install dependencies and build the app
COPY package.json ./ 

RUN npm install
COPY ./ ./
RUN npm run build  

# Step 2: Serve the Vite app with NGINX
FROM nginx:latest

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
