import express from 'express';
import * as dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import Post from '../models/post.js';
import { decodeBase64Credentials } from '../utils/gcloudauth.js';

dotenv.config();

const router = express.Router();

// Ensure GCLOUD_CREDENTIALS_BASE64 environment variable is defined
const base64Credentials = process.env.GCLOUD_CREDENTIALS_BASE64;

if (!base64Credentials) {
    throw new Error('GCLOUD_CREDENTIALS_BASE64 is not defined in environment variables.');
}

// Decode the base64 credentials using the utility function
const credentials = decodeBase64Credentials(base64Credentials);

// Initialize Google Cloud Storage client using the decoded credentials
const storage = new Storage({
    credentials,
    projectId: process.env.GCLOUD_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

router.get('/', async (req, res) => {
    try {
        const { searchText = '', page = 1, limit = 10 } = req.query;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);

        const searchRegex = searchText ? new RegExp(searchText, 'i') : null;
        const query = searchText
            ? { $or: [{ name: { $regex: searchRegex } }, { prompt: { $regex: searchRegex } }] }
            : {};

        const posts = await Post.find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .sort({ createdAt: -1 });

        const totalPosts = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            data: posts,
            totalPosts,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPosts / limitNumber),
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});




router.post('/', async (req, res) => {
    try {
        const { name, prompt, photo } = req.body;
        if (photo) {
            // Convert the base64 photo to a buffer
            const buffer = Buffer.from(photo.split(',')[1], 'base64');
            const fileName = `${Date.now()}.jpg`; // Generate a unique file name

            // Upload the image to Google Cloud Storage
            const file = bucket.file(`images/${fileName}`);

            console.log(`Uploading image to Google Cloud Storage as ${fileName}`);

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

            console.log('Post created successfully:', newPost);
            res.status(201).json({ success: true, data: newPost });
        } else {
            console.log('No photo provided');
            res.status(400).json({ success: false, message: 'Photo is required.' });
        }
    } catch (error) {
        console.error('Error during image upload or post creation:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
