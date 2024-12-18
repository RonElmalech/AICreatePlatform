import { TranslationServiceClient } from '@google-cloud/translate';
import { decodeBase64Credentials } from './gcloudauth.js'; 

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

// Existing function for detecting language and translating to English if needed
export async function detectAndTranslate(prompt) {
    try {
        if (!prompt) {
            throw new Error('Prompt is required');
        }

        // Step 1: Detect the language of the input prompt
        const [detection] = await translateClient.detectLanguage({
            parent,
            content: prompt,
        });

        const detectedLang = detection.languages[0].languageCode;

        // Step 2: If the detected language is not English, translate it to English
        let translatedPrompt = prompt;
        if (detectedLang !== 'en') {
            const [translation] = await translateClient.translateText({
                parent,
                contents: [prompt],
                sourceLanguageCode: detectedLang,
                targetLanguageCode: 'en',
                mimeType: 'text/plain',
            });

            translatedPrompt = translation.translations[0].translatedText;
        }

        return { translatedPrompt, detectedLang };
    } catch (error) {
        console.error("Error in language detection/translation:", error.message);
        throw error;
    }
}

// New function to translate specifically from English to Hebrew
export async function translateEnglishToHebrew(text) {
    try {
        if (!text) {
            throw new Error('Text is required');
        }

        // Translate text from English to Hebrew
        const [translation] = await translateClient.translateText({
            parent,
            contents: [text],
            sourceLanguageCode: 'en',
            targetLanguageCode: 'he', // Target language: Hebrew
            mimeType: 'text/plain',
        });

        return translation.translations[0].translatedText;
    } catch (error) {
        console.error("Error in English to Hebrew translation:", error.message);
        throw error;
    }
}
