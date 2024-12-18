import express from 'express'; 
import * as dotenv from 'dotenv'; 
import axios from 'axios'; 
import { detectAndTranslate , translateEnglishToHebrew } from '../utils/languageUtils.js'; 
import { decodeBase64Credentials } from '../utils/gcloudauth.js'; 

dotenv.config(); 

const router = express.Router();
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const MODEL_ID = process.env.CLOUDFLARE_MODEL_ID;
const CF_API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL_ID}`;

const base64Credentials = process.env.GCLOUD_CREDENTIALS_BASE64;

if (!base64Credentials) {
    console.error('GCLOUD_CREDENTIALS_BASE64 is not defined in environment variables.');
    process.exit(1);
}

const credentials = decodeBase64Credentials(base64Credentials);

import { TranslationServiceClient } from '@google-cloud/translate';
const translateClient = new TranslationServiceClient({
    credentials,
    projectId: process.env.GCLOUD_PROJECT_ID,
});

const location = 'global';
const parent = `projects/${process.env.GCLOUD_PROJECT_ID}/locations/${location}`;

router.route('/translate').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Use the utility function to detect and translate the prompt
        const translatedPrompt = await translateEnglishToHebrew(translateClient, prompt);

        return res.status(200).json({ translatedPrompt});
        
    } catch (error) {
        console.error("Error occurred during translation:", error.message);
        res.status(500).json({ error: error.message });
    }
});


router.route('/generate-image').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const { translatedPrompt, detectedLang } = await detectAndTranslate(translateClient, prompt);

        const input = { prompt: translatedPrompt, language: 'en' };

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

        const contentType = response.headers['content-type'];

        if (contentType && contentType.startsWith('image/')) {
            const base64Image = `data:${contentType};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
            return res.status(200).json({ imageBase64: base64Image });
        } else {
            const result = response.data;
            throw new Error(result.error || 'Unexpected response format');
        }

    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
