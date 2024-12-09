import axios from 'axios';
import { franc } from 'franc-min';

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// Language code mapping for Cloudflare model
const languageMapping = {
    'eng': 'en', // English
    'heb': 'he', // Hebrew
    // Add other languages as needed
};

// Function to detect language and translate if necessary
export async function detectAndTranslate(prompt) {
    try {
        if (!prompt) {
            throw new Error('Prompt is required');
        }

        // Detect the language of the prompt
        const detectedLang = franc(prompt);
        const language = languageMapping[detectedLang] || 'en'; // Default to English if language is not supported

        console.log("Detected language:", detectedLang, "Mapped language:", language);

        // If the detected language is not English, translate it to English using Cloudflare model
        let translatedPrompt = prompt;
        if (language !== 'en') {
            console.log("Translating prompt to English...");

            const translationResponse = await axios.post(
                `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/m2m100-1.2b`,
                { text: prompt, target_language: 'en' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_TOKEN}`,
                    }
                }
            );

            if (translationResponse.status === 200 && translationResponse.data && translationResponse.data.translation) {
                translatedPrompt = translationResponse.data.translation;
                console.log("Translated prompt:", translatedPrompt);
            } else {
                throw new Error('Error translating text');
            }
        }

        return { translatedPrompt, language };  // Return translated prompt and language
    } catch (error) {
        console.error("Error in language detection/translation:", error.message);
        throw error;
    }
}
