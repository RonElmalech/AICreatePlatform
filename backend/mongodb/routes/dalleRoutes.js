import express from 'express'; 
import * as dotenv from 'dotenv'; 
import axios from 'axios'; 
import { detectAndTranslate, translateEnglishToHebrew } from '../utils/languageUtils.js'; 
import { decodeBase64Credentials } from '../utils/gcloudauth.js'; 
import { TranslationServiceClient } from '@google-cloud/translate';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

dotenv.config();

const router = express.Router();
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run`;

const base64Credentials = process.env.GCLOUD_CREDENTIALS_BASE64;

if (!base64Credentials) {
    console.error('GCLOUD_CREDENTIALS_BASE64 is not defined in environment variables.');
    process.exit(1);
}

const credentials = decodeBase64Credentials(base64Credentials);

const translateClient = new TranslationServiceClient({
    credentials,
    projectId: process.env.GCLOUD_PROJECT_ID,
});

const location = 'global';
const parent = `projects/${process.env.GCLOUD_PROJECT_ID}/locations/${location}`;

// Helper function to generate speech
const generateSpeech = async (text, language) => {
    const textToSpeechClient = new TextToSpeechClient({ credentials, projectId: process.env.GCLOUD_PROJECT_ID });
    const request = {
        input: { text },
        voice: { languageCode: language, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };
    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    return response.audioContent;
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


// Auto Speech (Text-to-Speech API)
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
