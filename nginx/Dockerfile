# Use the official NGINX image
FROM nginx:latest

# Copy the custom NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the required port
EXPOSE 80

# Copy the built frontend files from the frontend container
COPY --from=frontend /app/dist /usr/share/nginx/html

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
