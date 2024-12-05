
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import postRoutes from './mongodb/routes/postRoutes.js';
import dalleRoutes from './mongodb/routes/dalleRoutes.js';
import path from 'path';
import express from 'express';
// Load environment variables
dotenv.config();

const app = express();

// Middleware for CORS
const corsOptions = {
    origin: '*', // Allow all origins (or specify your NGINX domain)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
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
