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

router.route('/translate').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Translate prompt from English to Hebrew
        const translatedPrompt = await translateEnglishToHebrew(translateClient, prompt);
        return res.status(200).json({ translatedPrompt });
        
    } catch (error) {
        console.error("Error occurred during translation:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.route('/generate-text').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        const modelId = '@cf/meta/llama-3-8b-instruct'; // Default model set here

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Translate prompt if it's not already in Hebrew
        const { translatedPrompt, detectedLang } = await detectAndTranslate(translateClient, prompt);

        const input = { prompt: translatedPrompt, language: detectedLang || 'en' };

        const response = await axios.post(`${CF_API_URL}/${modelId}`, input, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });

        if (response.status !== 200) {
            throw new Error('Error generating text from Cloudflare API');
        }

        return res.status(200).json({ generatedText: response.data });
        
    } catch (error) {
        console.error("Error occurred during text generation:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.route('/generate-image').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        const modelId = '@cf/bytedance/stable-diffusion-xl-lightning'; // Default model set here

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const { translatedPrompt, detectedLang } = await detectAndTranslate(translateClient, prompt);

        const input = { prompt: translatedPrompt, language: detectedLang || 'en' };

        const response = await axios.post(`${CF_API_URL}/${modelId}`, input, {
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
            throw new Error('Unexpected response format from Cloudflare API');
        }

    } catch (error) {
        console.error("Error occurred during image generation:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Auto Speech (Text-to-Speech using Cloudflare's Whisper model)
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
