# Use the official Node.js image
FROM node:20.18.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json file into the container
COPY package.json ./

# Copy the rest of the application code into the container
COPY . .

# Install dependencies
RUN npm install

# Expose the backend's port
EXPOSE 5000

# Start the backend application
CMD ["node", "index.js"]
