# Step 1: Build the Vite app (React)
FROM node:20.18.1-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY ./package.json ./
RUN npm install

# Copy all other source files and build the app
COPY ./ ./
RUN npm run build  

# Step 2: Serve the Vite app with NGINX
FROM nginx:latest

# Copy the 'dist' directory (the output folder of Vite) to Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx config file to override the default one
COPY ../nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for Nginx to serve the app
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
