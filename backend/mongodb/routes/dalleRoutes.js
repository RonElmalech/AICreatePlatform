import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { detectAndTranslate, translateEnglishToHebrew } from '../utils/languageUtils.js'; 

dotenv.config();

const router = express.Router();
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run`;

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
        const { text, target } = req.body;

        if (!text || !target) {
            return res.status(400).json({ error: 'Prompt and target language are required.' });
        }

        let translatedText;

        if (target === 'he') {
            translatedText = await translateEnglishToHebrew(text);
        } else {
            const result = await detectAndTranslate(text);
            translatedText = result.translatedText;
        }


        return res.status(200).json({ translatedText });
    } catch (error) {
        console.error("Error during translation:", error.message);
        res.status(500).json({ error: 'An error occurred during translation.' });
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

// Handle image generation
router.route('/generate-image').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        const modelId = '@cf/bytedance/stable-diffusion-xl-lightning'; 

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const { translatedText } = await detectAndTranslate(prompt);

        const input = { prompt: translatedText };

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


router.route("/edit").post(async (req, res) => {
    try {
      const modelId = "@cf/runwayml/stable-diffusion-v1-5-img2img"; // Model for image editing
  
      const { prompt, image_b64, strength } = req.body;
  
      if (!prompt || !image_b64) {
        return res.status(400).json({ error: "Prompt and image are required" });
      }
  
  
      let imageData = image_b64;
  
      // If the image is a URL, download it and convert it to base64
      if (image_b64.startsWith("http")) {
        const imageResponse = await axios({
          url: image_b64,
          method: 'GET',
          responseType: 'arraybuffer',
        });
  
        // Convert the image data to base64
        const base64Image = `data:${imageResponse.headers['content-type']};base64,${Buffer.from(imageResponse.data, 'binary').toString('base64')}`;
        imageData = base64Image;  // Update image_b64 to be the base64 image data
      }
  
      // Translate the prompt if necessary
      const result = await detectAndTranslate(prompt);
      const translatedPrompt = result.translatedText;
  
      // Prepare the payload for the model
      const input = {
        prompt: translatedPrompt,
        image_b64: imageData, // Send base64-encoded image (whether originally base64 or URL converted to base64)
        strength: strength || 0.5, // Default strength if not provided
      };
  
      // Make the API request to Cloudflare
      const response = await axios.post(`${CF_API_URL}/${modelId}`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        responseType: "arraybuffer",
      });
  
      if (response.status !== 200) {
        throw new Error("Error generating image from Cloudflare API");
      }
  
      const contentType = response.headers["content-type"];
  
      if (contentType && contentType.startsWith("image/")) {
        const base64Image = `data:${contentType};base64,${Buffer.from(response.data, "binary").toString("base64")}`;
        return res.status(200).json({ editedImageUrl: base64Image });
      } else {
        throw new Error("Unexpected response format from Cloudflare API");
      }
    } catch (error) {
      console.error("Error occurred during image generation:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

export default router;
