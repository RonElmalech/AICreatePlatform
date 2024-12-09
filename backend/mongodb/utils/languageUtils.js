import axios from 'axios';

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// Cloudflare model URL for auto-detection and translation (this handles both auto-detection and translation to English)
const CF_API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/m2m100-1.2b`;

export async function detectAndTranslate(prompt) {
    try {
        if (!prompt) {
            throw new Error('Prompt is required');
        }

        // Send the prompt to Cloudflare's model for language detection and translation
        console.log("Sending prompt for auto-detection and translation...");

        const response = await axios.post(
            CF_API_URL,
            { text: prompt, target_language: 'en' },  // Auto-detect language and translate to English
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`,
                }
            }
        );

        if (response.status === 200 && response.data && response.data.translation) {
            const translatedPrompt = response.data.translation;
            const language = response.data.detected_language || 'en';  // Extract detected language
            console.log("Translated prompt:", translatedPrompt);
            console.log("Detected language:", language);
            return { translatedPrompt, language };  // Return translated prompt and detected language
        } else {
            throw new Error('Error translating text');
        }
    } catch (error) {
        console.error("Error in language detection/translation:", error.message);
        throw error;
    }
}
