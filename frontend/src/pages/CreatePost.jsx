import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Loader } from '../components';
import preview from '../assets/preview.png';
import getRandomPrompt from '../utils/index.js';
import axios from 'axios';
import { downloadImage } from '../utils'; // Assuming downloadImage is imported from utils
import FileSaver from 'file-saver'; // Ensure FileSaver is installed

const CreatePost = ({ language }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);  // State to track sharing progress
  const [downloading, setDownloading] = useState(false); // State to track downloading progress

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo && form.name) {
      setLoading(true);
      setSharing(true);  // Set sharing to true when the button is clicked
      try {
        const response = await axios.post(`/api/v1/post`, form, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200 || response.status === 201) {
          navigate('/');
        } else {
          alert(`Unexpected response: ${response.statusText}`);
        }
      } catch (error) {
        alert(`Failed to fetch: ${error.message}`);
      } finally {
        setLoading(false);
        setSharing(false);  // Reset sharing state after the action is completed
      }
    } else {
      alert('Please enter a name, prompt, and generate an image');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await axios.post(
          `/api/v1/dalle/generate-image`,
          { prompt: form.prompt },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.status === 200 && response.data.imageBase64) {
          setForm({ ...form, photo: response.data.imageBase64 });
        } else {
          throw new Error('Error generating image');
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please enter a prompt');
    }
  };

  const handleDownload = async () => {
    if (!form.photo) {
      alert(language === 'he' ? 'אנא צור תמונה לפני ההורדה' : 'Please generate an image before downloading');
      return;
    }

    setDownloading(true);
    try {
      const timestamp = Date.now(); // Generate a unique timestamp
      const filename = `MindCraftAI-${form.name || 'user'}-${timestamp}.jpg`; // Name the image with timestamp
      await downloadImage(form.photo, form.name, filename); // Pass the photo URL, name, and filename to downloadImage
    } catch (error) {
      alert(`Error downloading: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const texts = {
    en: {
      title: 'Create and Share Your Artwork',
      description: 'Generate imaginative and visually stunning images using AI, then share them with the community!',
      generate: 'Generate',
      share: 'Share with the community',
      sharing: 'Sharing...',
      download: 'Download without sharing',
      downloading: 'Downloading...',
    },
    he: {
      title: 'צור ושתף את האומנות שלך',
      description: '!צור תמונות מרשימות ומלאות דמיון בעזרת בינה מלאכותית, ואז שתף אותן עם הקהילה',
      generate: 'צור',
      share: 'שתף עם הקהילה',
      sharing: '...משתף',
      download: 'הורדה ללא שיתוף',
      downloading: 'מוריד...',
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-5">
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold">{texts[language].title}</h1>
        <p className="text-gray-600 mt-4">{texts[language].description}</p>
      </div>

      <div className={`max-w-3xl mx-auto ${language === 'he' ? 'flex-row-reverse' : 'flex-row'} gap-5 items-start`}>
        
        <form className="mt-16 max-w-3xl mx-auto w-full flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <FormField
              labelName={language === 'he' ? 'שמך' : 'Your Name'}
              type="text"
              name="name"
              placeholder={language === 'he' ? 'יוחנן דואו' : 'John Doe'}
              value={form.name}
              handleChange={handleChange}
              autocomplete="name"
              language={language}
              maxLength={30}
            />
            <div className="relative">
              <FormField
                labelName={language === 'he' ? 'תיאור' : 'Prompt'}
                type="text"
                name="prompt"
                placeholder={language === 'he' ? 'תמונה של כלב סמויד עם לשון בחוץ מחבק חתול סיאמאי לבן' : 'A photo of a Samoyed dog with its tongue out hugging a white Siamese cat'}
                value={form.prompt}
                handleChange={handleChange}
                language={language}
                maxLength={300}
              />
              <button
                type="button"
                onClick={handleSurpriseMe}
                className={`absolute ${language === 'he' ? 'left-0' : 'right-0'} top-1/2 transform -translate-y-1/2 text-gray-600`}
                style={{ fontSize: '18px' }}
              >
                🎲
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 w-full flex justify-center">
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-full p-3 flex justify-center items-center mt-5">
            <div className="flex justify-center items-center w-full h-full">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt={form.prompt}
                  className="object-contain max-w-full max-h-[500px] rounded-lg"
                />
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="object-contain max-w-full max-h-[500px] opacity-40 rounded-lg"
                />
              )}
            </div>
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? (language === 'he' ? '...יוצר' : 'Generating...') : texts[language].generate}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="text-white bg-yellow-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            disabled={downloading || !form.photo}
          >
            {downloading ? (language === 'he' ? texts[language].downloading : texts[language].downloading) : texts[language].download}
          </button>

          <button
            type="submit"
            className="text-white bg-blue-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={handleSubmit}
            disabled={sharing || loading}
          >
            {sharing ? (language === 'he' ? texts[language].sharing : texts[language].sharing) : texts[language].share}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreatePost;
