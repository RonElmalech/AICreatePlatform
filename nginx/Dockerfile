# Use the official NGINX image
FROM nginx:latest

# Copy the custom NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the required port
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
