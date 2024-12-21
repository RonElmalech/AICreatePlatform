# Description: This file is used to build the backend image.
FROM node:20.18.1-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json file
COPY package.json ./

# Copy the source code
COPY . .

# Install the dependencies
RUN npm install

# Expose the backend's port
EXPOSE 5000

# Start the backend application
CMD ["node", "index.js"]
