
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import postRoutes from './mongodb/routes/postRoutes.js';
import dalleRoutes from './mongodb/routes/dalleRoutes.js';
import path from 'path';
import express from 'express';


// Load environment variables
dotenv.config();

// Create an Express application
const app = express();


// Define the allowed frontend origin
const allowedOrigins = ['http://localhost:3000',"http://localhost"];

// CORS options to only allow GET and POST methods from the allowed origin
const corsOptions = {
  origin: (origin, callback) => {
    // Allow the origin if it matches the frontend domain, or if there is no origin (e.g., for local development)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],  // Allow only GET and POST methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers for the request
};


// Use the CORS middleware with the defined options
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json({ limit: '50mb' }));

// API Routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

// Simple test route
app.get('/', (req, res) => {
    res.send('Hello From DALL-E');
});

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");

        const port = process.env.PORT || 5000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.log("Error starting the server:", error);
    }
};

startServer();
