# Description: Dockerfile for the frontend application
FROM node:20.18.1-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json files
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY ./ ./

# Build the app
RUN npm run build

# Step 2: Serve the Vite app with NGINX
FROM nginx:latest

# Expose the required port for NGINX
EXPOSE 80

# Copy the built files from the 'build' stage to NGINX's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
