# MindCreaftAI - AI-Powered Image and Chat Platform

**MindCreaftAI** is a fully Dockerized MERN (MongoDB, Express.js, React, Node.js) web application that enables users to generate, edit, upload, and share AI-powered images in a community platform. The app also integrates real-time AI chat with Socket.IO and supports multilingual prompts with Google Cloud Translation API. The platform is deployed securely with HTTPS and supports a seamless user experience for both Hebrew and English languages.

## Features
- **AI Image Generation**: Generate images using AI powered by Cloudflare APIs.
- **Image Upload/Download**: Upload your own images to the community and download images created by others.
- **Image Editing**: Edit both AI-generated images and regular user-uploaded images.
- **Real-Time AI Chat**: Chat with an AI in real-time using Socket.IO integration.
- **Multilingual Support**: Supports both Hebrew and English languages, with multilingual prompts translated via Google Cloud Translation API.
- **Community Page**: Users can browse, edit, or download images posted by others in the community.
- **Google Cloud Storage**: All images are uploaded to Google Cloud Storage for efficient management.

## Technologies
- **Frontend**: React.js (Vite for fast build times), TailwindCSS (responsive design)
- **Backend**: Node.js, Express.js
- **Real-Time Communication**: Socket.IO for chat functionality
- **Database**: MongoDB
- **AI Integration**: Cloudflare API for AI image generation and editing
- **Image Storage**: Google Cloud Storage
- **Translation**: Google Cloud Translation API for multilingual support
- **Deployment**: Docker, Nginx, SSL/HTTPS (for live environment)

## Project Structure

```
/client              # React app (frontend)
  /src
    /components      # React components
    /assets          # Images, fonts, etc.
    /store           # Redux state management
    /utils           # Helper functions

/server              # Node.js app (backend)
  /controllers       # API controllers for handling requests
  /routes            # Express.js routes
  /services          # Helper services (e.g., AI service, image storage)
  /middleware        # Middlewares (e.g., authentication)
  /models            # MongoDB models
  /config            # Configuration files (e.g., Google Cloud, Cloudflare)

/docker              # Docker-related files (Dockerfile, docker-compose.yml)
```

## Getting Started

### Prerequisites
Before running the project, ensure you have the following installed:
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (for local development)
- [MongoDB](https://www.mongodb.com/) (for local development, or use a cloud MongoDB instance)

### Installation (Locally)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ronelmalech/AICreatePlatform.git
   cd AICreatePlatform
   ```

2. **Install dependencies**:
   - For the frontend:
     ```bash
     cd client
     npm install
     ```
   - For the backend:
     ```bash
     cd server
     npm install
     ```

3. **Set up environment variables**:
   Create a `.env` file in the root of the `server` directory and add the following variables:
   ```env
   GOOGLE_CLOUD_STORAGE_BUCKET=<your-google-cloud-bucket-name>
   GOOGLE_CLOUD_PROJECT=<your-google-cloud-project-id>
   GOOGLE_CLOUD_KEYFILE=<path-to-your-google-cloud-keyfile>
   CLOUDFARE_API_KEY=<your-cloudflare-api-key>
   SOCKET_IO_SERVER_URL=http://localhost:5000
   MONGODB_URI=mongodb://localhost:27017/mindcraftai
   ```

4. **Run the application locally**:
   - Start MongoDB (if running locally).
   - Run the server:
     ```bash
     cd server
     npm run dev
     ```
   - Run the client:
     ```bash
     cd client
     npm run dev
     ```

5. Visit `http://localhost:3000` in your browser to access the app.

### Running the App with Docker (Production)

1. **Build the Docker images**:
   In the root directory, run:
   ```bash
   docker-compose build
   ```

2. **Run the containers**:
   ```bash
   docker-compose up
   ```

3. The app should be live at `https://localhost` (with SSL enabled). You can also deploy the app to a cloud server and configure your domain for production.

4. **Access the app**:
   Open your browser and navigate to `https://localhost` (or the domain you configured if deploying on a server) to access the live version of the platform.

5. **Stopping the Docker containers**:
   To stop the app, you can use:
   ```bash
   docker-compose down
   ```

## Configuration for Cloud Deployment (Optional)
1. **Set up a server**: Deploy your app on a cloud provider such as AWS, Google Cloud, or DigitalOcean.
2. **Domain and SSL**: Set up a domain for your application and configure SSL/HTTPS using Nginx. You can use Let's Encrypt for free SSL certificates.
3. **Configure environment variables**: Ensure your cloud environment has the correct environment variables set, such as the Google Cloud API credentials, Cloudflare API key, and MongoDB URI.

## Troubleshooting

- **Docker issues**: If you encounter issues while building or running Docker containers, ensure that Docker is running properly on your system and that you have sufficient resources allocated to Docker.
- **Google Cloud Storage errors**: If images are not uploading to Google Cloud Storage, check your Google Cloud API credentials and ensure the correct permissions are set for your storage bucket.
- **Socket.IO connection issues**: Ensure that your Socket.IO server is properly configured and that the backend is running before trying to connect to the frontend.

## Contributing

If you’d like to contribute to this project, feel free to fork the repository, make changes, and submit a pull request. Please ensure your code follows the project's style guidelines and includes appropriate tests where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

