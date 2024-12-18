import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { detectAndTranslate, translateEnglishToHebrew } from '../utils/languageUtils.js'; 

dotenv.config();

const router = express.Router();
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run`;

// Helper function to generate speech using Cloudflare's Whisper model
const generateSpeech = async (text, language) => {
    const modelId = '@cf/openai/whisper-large-v3-turbo'; // Cloudflare Whisper model for TTS

    const input = { prompt: text, language: language || 'en' };

    const response = await axios.post(`${CF_API_URL}/${modelId}`, input, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
        },
        responseType: 'arraybuffer', // Expecting binary audio data
    });

    if (response.status !== 200) {
        throw new Error('Error generating speech from Cloudflare Whisper model');
    }

    return response.data; // Return audio data
};

// Handle translation from the front-end
router.route('/translate').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Translate prompt from English to Hebrew
        const translatedPrompt = await translateEnglishToHebrew(prompt);
        return res.status(200).json({ translatedPrompt });

    } catch (error) {
        console.error("Error occurred during translation:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Handle text generation
router.route('/generate-text').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        const modelId = '@cf/meta/llama-3-8b-instruct'; // Default model set here

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await axios.post(`${CF_API_URL}/${modelId}`, { prompt }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });

        if (response.status !== 200) {
            throw new Error('Error generating text from Cloudflare API');
        }

        return res.status(200).json(response.data.result.response);

    } catch (error) {
        console.error("Error occurred during text generation:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Handle speech generation
router.route('/generate-speech').post(async (req, res) => {
    try {
        const { text, language = 'en' } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const audioContent = await generateSpeech(text, language);
        return res.status(200).json({ audioContent: audioContent.toString('base64') });
    } catch (error) {
        console.error("Error occurred during speech generation:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
