# Use the official Node.js image
FROM node:20.18.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package.json ./

# Install all dependencies


# Copy the rest of the application code into the container
COPY . .

# Expose the backend's port
EXPOSE 5000

RUN npm install
# Start the backend application
CMD ["node", "index.js"]
