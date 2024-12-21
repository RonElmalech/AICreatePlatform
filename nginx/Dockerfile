# Description: This is the Dockerfile for the NGINX container. It copies the custom NGINX config and runs NGINX in the foreground.
FROM nginx:latest

# Copy the custom NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the required port
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
