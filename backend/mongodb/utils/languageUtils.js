import { TranslationServiceClient } from '@google-cloud/translate';

// Instantiate the Google Translate client
const client = new TranslationServiceClient();

// Set up the Google Cloud project and API key
const projectId = process.env.GCLOUD_PROJECT_ID; // Replace with your Google Cloud project ID
const apiKey = process.env.GCLOUD_API_KEY; // Replace with your API key
const location = 'global'; // Google Translation API location (e.g., 'global')

const parent = `projects/${projectId}/locations/${location}`;

export async function detectAndTranslate(prompt) {
    try {
        if (!prompt) {
            throw new Error('Prompt is required');
        }

        // Step 1: Detect the language of the input prompt
        const [detection] = await client.detectLanguage({
            parent,
            content: prompt,
        });

        const detectedLang = detection.languages[0].languageCode; // Get detected language
        console.log("Detected language:", detectedLang);

        // Step 2: If the detected language is not English, translate it to English
        let translatedPrompt = prompt;
        if (detectedLang !== 'en') {
            console.log("Translating prompt to English...");

            const [translation] = await client.translateText({
                parent,
                contents: [prompt],
                sourceLanguageCode: detectedLang,
                targetLanguageCode: 'en',
                mimeType: 'text/plain',
                apiKey: apiKey, // Use the API key here
            });

            translatedPrompt = translation.translations[0].translatedText;
            console.log("Translated prompt:", translatedPrompt);
        }

        return { translatedPrompt, language: detectedLang };  // Return translated prompt and language
    } catch (error) {
        console.error("Error in language detection/translation:", error.message);
        throw error;
    }
}
