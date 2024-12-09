import express from 'express'; 
import * as dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import Post from '../models/post.js';
import fs from 'fs';

dotenv.config();

const router = express.Router();

// Ensure GCLOUD_CREDENTIALS_BASE64 environment variable is defined
const base64Credentials = process.env.GCLOUD_CREDENTIALS_BASE64;


if (!base64Credentials) {
    throw new Error('GCLOUD_CREDENTIALS_BASE64 is not defined in environment variables.');
}

// Function to add padding to the Base64 string
function addBase64Padding(base64String) {
    const padding = base64String.length % 4 === 0 ? 0 : 4 - (base64String.length % 4);
    return base64String + '='.repeat(padding);
}

// Re-add padding to the credentials
const base64CredentialsWithPadding = addBase64Padding(base64Credentials);

// Decode the base64 credentials and parse it as JSON
const credentialsJson = Buffer.from(base64CredentialsWithPadding, 'base64').toString('utf8');
const credentials = JSON.parse(credentialsJson);

// Initialize Google Cloud Storage client using the decoded credentials
const storage = new Storage({
    credentials, // Use the decoded JSON credentials
    projectId: process.env.GCLOUD_PROJECT_ID, // Your project ID
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET); // Your bucket name

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a post
router.post('/', async (req, res) => {
    try {
        const { name, prompt, photo } = req.body;

        if (photo) {
            // Convert the base64 photo to a buffer
            const buffer = Buffer.from(photo.split(',')[1], 'base64');
            const fileName = `${Date.now()}.jpg`; // Generate a unique file name

            // Upload the image to Google Cloud Storage
            const file = bucket.file(`images/${fileName}`);

            // Save the file with public read access
            await file.save(buffer, { contentType: 'image/jpeg', public: true });

            // Generate the public URL for the uploaded image
            const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/images/${fileName}`;

            // Create the post with the secure image URL
            const newPost = await Post.create({
                name,
                prompt,
                photo: publicUrl, // Use the public URL
            });

            res.status(201).json({ success: true, data: newPost });
        } else {
            res.status(400).json({ success: false, message: 'Photo is required.' });
        }
    } catch (error) {
        console.error('Error during image upload or post creation:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
