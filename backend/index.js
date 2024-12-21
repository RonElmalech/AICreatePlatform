import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './mongodb/connect.js';
import dalleRoutes from './mongodb/routes/dalleRoutes.js'; 
import { initializeSocketHandlers } from './socketIo/socketHandlers.js';
import postRoutes from './mongodb/routes/postRoutes.js'; 

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// CORS setup
const allowedOrigins = ['http://localhost:3000', 'http://localhost', 'https://mindcraftai.live'];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Create HTTP server
const server = http.createServer(app);

// Create socket.io server
const io = new socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Initialize socket handlers
initializeSocketHandlers(io);

// Routes
app.use('/api/v1/dalle', dalleRoutes);  
app.use('/api/v1/post', postRoutes);  


// Start the server
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 5000;
    server.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.log('Error starting the server:', error);
  }
};

startServer();
