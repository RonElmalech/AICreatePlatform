import express from 'express'; 
import * as dotenv from 'dotenv';
import axios from 'axios'; // Import axios
import { detectAndTranslate } from '../utils/languageUtils.js'; // Import the language utility

dotenv.config(); 

const router = express.Router();
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const MODEL_ID = process.env.CLOUDFLARE_MODEL_ID;
const CF_API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL_ID}`;

router.route('/generate-image').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log("Received prompt:", prompt);

        // Use the utility function to detect and translate the prompt
        const { translatedPrompt, detectedLang } = await detectAndTranslate(prompt);

        // Call Cloudflare API to generate an image using the translated prompt
        const input = { prompt: translatedPrompt, language: 'en' };  // Always send 'en' for image generation
        console.log("Sending request to Cloudflare API with input:", input);

        const response = await axios.post(CF_API_URL, input, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_TOKEN}`,
            },
            responseType: 'arraybuffer',
        });

        if (response.status !== 200) {
            throw new Error('Error generating image from Cloudflare API');
        }

        console.log("Received response from Cloudflare API:", response.status);

        const contentType = response.headers['content-type'];
        console.log("Response content type:", contentType);

        if (contentType && contentType.startsWith('image/')) {
            const base64Image = `data:${contentType};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
            return res.status(200).json({ imageBase64: base64Image });
        } else {
            const result = response.data;
            console.log("Unexpected response format:", result);
            throw new Error(result.error || 'Unexpected response format');
        }

    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
