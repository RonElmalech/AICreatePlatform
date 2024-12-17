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

  const handleSurpriseMe = async () => {
    const randomPrompt = getRandomPrompt(form.prompt);
  
    // If language is Hebrew, translate the prompt
    if (language === 'he') {
      try {
        const response = await axios.post('/api/v1/dalle/translate', {
          prompt: randomPrompt,
        });
        setForm({ ...form, prompt: response.data.translatedPrompt });
      } catch (error) {
        console.error('Translation failed', error);
      }
    } else {
      setForm({ ...form, prompt: randomPrompt });
    }
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
      description: 'צור תמונות מרשימות ומלאות דמיון בעזרת בינה מלאכותית, ואז שתף אותן עם הקהילה',
      generate: 'צור',
      share: 'שתף עם הקהילה',
      sharing: '...משתף',
      download: 'הורדה ללא שיתוף',
      downloading: '...מוריד',
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-5">
      <div className="text-center mt-10">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{texts[language].title}</h1>
        <p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg mt-2">{texts[language].description}</p>
      </div>

      <div className={`max-w-3xl mx-auto ${language === 'he' ? 'flex-row-reverse' : 'flex-row'} gap-4 items-start`}>
        <form className="mt-6 max-w-3xl mx-auto w-full flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {/* First Input */}
            <FormField
              labelName={language === 'he' ? 'שמך' : 'Your Name'}
              type="text"
              name="name"
              value={form.name}
              handleChange={handleChange}
              autocomplete="name"
              language={language}
              maxLength={30}
            />
            {/* Button placed above the second input */}
            <div className="relative mt-8">
              <button
                type="button"
                onClick={handleSurpriseMe}
                className={`flex items-center justify-center w-1. py-1 px-2 border rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out text-xs sm:text-sm md:text-md absolute top-[-40px] 
                ${language === 'he' ? 'left-0' : 'right-0'}`}
              >
                🎲
                <span className={`ml-1 ${language === 'he' ? 'mr-1' : 'ml-1'}`}>
                  {language === 'he' ? 'תיאור בהפתעה' : 'Surprise Me'}
                </span>
              </button>
              {/* Second Input Field */}
              <FormField
                labelName={language === 'he' ? 'תיאור' : 'Prompt'}
                type="text"
                name="prompt"
                value={form.prompt}
                handleChange={handleChange}
                language={language}
                maxLength={300}
              />
            </div>
          </div>
        </form>
<div className="mt-5 flex flex-col gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full px-5 py-2.5 text-center"
          >
            {generatingImg ? (language === 'he' ? '...יוצר' : 'Generating...') : texts[language].generate}
          </button>

        <div className="mt-3 w-full flex items-center justify-center">
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-9/12 p-3 flex items-center"> 
            <div className="flex w-full h-full justify-center items-center">
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

        
        <div className="flex gap-4 w-full sm:w-auto">
  <button
    type="button"
    onClick={handleDownload}
    className="text-white bg-yellow-500 font-medium rounded-md text-sm w-1/2 px-5 py-2.5 text-center"
    disabled={downloading || !form.photo}
  >
    {downloading ? (language === 'he' ? 'מוריד...' : 'Downloading...') : texts[language].download}
  </button>

  <button
    type="button"
    onClick={handleSubmit}
    className="text-white bg-blue-700 font-medium rounded-md text-sm w-1/2 px-5 py-2.5 text-center"
    disabled={loading || sharing}
  >
    {sharing ? (language === 'he' ? '...משתף' : 'Sharing...') : texts[language].share}
  </button>
</div>

        </div>
      </div>
    </section>
  );
};

export default CreatePost;
