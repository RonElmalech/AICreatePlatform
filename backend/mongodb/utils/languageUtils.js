import { TranslationServiceClient } from '@google-cloud/translate';
import { decodeBase64Credentials } from './gcloudauth.js'; // Import base64 decoding utility

// Ensure GCLOUD_CREDENTIALS_BASE64 is defined and decode it
const base64Credentials = process.env.GCLOUD_CREDENTIALS_BASE64;

if (!base64Credentials) {
    throw new Error('GCLOUD_CREDENTIALS_BASE64 is not defined in environment variables.');
}

const credentials = decodeBase64Credentials(base64Credentials);

// Create Google Translate client using the decoded credentials
const translateClient = new TranslationServiceClient({
    credentials, // Use the decoded credentials
    projectId: process.env.GCLOUD_PROJECT_ID, // Your Google Cloud project ID
});

const location = 'global';
const parent = `projects/${process.env.GCLOUD_PROJECT_ID}/locations/${location}`;

export async function detectAndTranslate(translateClient, prompt) {
    try {
        if (!prompt) {
            throw new Error('Prompt is required');
        }

        // Step 1: Detect the language of the input prompt
        const [detection] = await translateClient.detectLanguage({
            parent,
            content: prompt,
        });

        const detectedLang = detection.languages[0].languageCode; // Get detected language
        console.log("Detected language:", detectedLang);

        // Step 2: If the detected language is not English, translate it to English
        let translatedPrompt = prompt;
        if (detectedLang !== 'en') {
            console.log("Translating prompt to English...");

            const [translation] = await translateClient.translateText({
                parent,
                contents: [prompt],
                sourceLanguageCode: detectedLang,
                targetLanguageCode: 'en',
                mimeType: 'text/plain',
            });

            translatedPrompt = translation.translations[0].translatedText;
            console.log("Translated prompt:", translatedPrompt);
        }

        return { translatedPrompt, detectedLang };  // Return translated prompt and language
    } catch (error) {
        console.error("Error in language detection/translation:", error.message);
        throw error;
    }
}
