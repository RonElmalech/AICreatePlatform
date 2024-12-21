import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Loader } from '../components';
import preview from '../assets/preview.png';
import getRandomPrompt from '../utils/index.js';
import axios from 'axios';
import { downloadImage } from '../utils'; // Assuming downloadImage is imported from utils
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const CreatePost = () => {
  // Redux state
  const language = useSelector((state) => state.language.language);

  // Local state
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

  // Refs for the buttons
  const downloadButtonRef = useRef(null);
  const shareButtonRef = useRef(null);
  const generateButtonRef = useRef(null);


  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo && form.name) {

      // If all fields are filled, proceed with the submission
      setLoading(true); 
      setSharing(true);  

      // try-catch block to handle the POST request
      try {
        const response = await axios.post(`/api/v1/post`, form, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200 || response.status === 201) {
          navigate('/Community');
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
      // If any of the fields are empty, show an toast error message
      if (shareButtonRef.current) {
        const buttonRect = shareButtonRef.current.getBoundingClientRect();
        const top = buttonRect.top + window.scrollY - 60;
        toast.error(language === 'he' ? 'אנא הזן שם תיאור ותיצור תמונה' : 'Please enter a Prompt a name and generate an image'
          , {
          position: 'top-center',
          autoClose: 3000,
          style: { top: `${top}px` },
        });
      }
      return; // Exit if input is empty    }
  }
};
  // Function to handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 

  // Function to generate a random prompt
  const handleSurpriseMe = async () => {
    const randomPrompt = getRandomPrompt(form.prompt);
  
    // If language is Hebrew, translate the prompt
    if (language === 'he') {
      try {
        const response = await axios.post('/api/v1/dalle/translate', {
          text: randomPrompt,
          target: 'he',
        });
        setForm({ ...form, prompt: response.data.translatedText });
      } catch (error) {
        console.error('Translation failed', error);
      }
    } else {
      setForm({ ...form, prompt: randomPrompt });
    }
  };
  
  // Function to generate an image
  const generateImage = async () => {
    if (form.prompt) {

      // If prompt is not empty, proceed with generating the image
      // try-catch block to handle the POST request
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
            // If prompt is empty, show an toast error message
            if (generateButtonRef.current) {
              const buttonRect = generateButtonRef.current.getBoundingClientRect();
              const top = buttonRect.top + window.scrollY - 60;
              toast.error(language === 'he' ? 'אנא הזן תיאור' : 'Please enter a Prompt', {
                position: 'top-center',
                autoClose: 3000,
                style: { top: `${top}px` },
              });
            }
            return; // Exit if input is empty
          
    }
  };

  // Function to download the image
  const handleDownload = async () => {
    if (!form.photo) {

    // If prompt is empty, show an toast error message
      if (downloadButtonRef.current) {
        const buttonRect = downloadButtonRef.current.getBoundingClientRect();
        const top = buttonRect.top + window.scrollY - 60;
        toast.error(language === 'he' ? 'אנא צור תמונה לפני ההורדה' : 'Please generate an image before downloading', {
          position: 'top-center',
          autoClose: 3000,
          style: { top: `${top}px` },
        });
      }
      return; // Exit if input is empty
  }

    setDownloading(true);
    // try-catch block to handle the downloadImage function
    try {

      await downloadImage(form.photo, form.name || ''); // Pass the photo URL, name, and filename to downloadImage
    } catch (error) {
      alert(`Error downloading: ${error.message}`);
    } finally {
      // Show a success toast message after downloading the image
      if (downloadButtonRef.current) {
        const buttonRect = downloadButtonRef.current.getBoundingClientRect();
        const top = buttonRect.top + window.scrollY - 60;
        toast.success(language === 'he' ? '!ההורדה הושלמה בהצלחה' : 'Download completed successfully!', {
          position: 'top-center',
          autoClose: 3000,
          style: { top: `${top}px` },
        });
      }
      setDownloading(false);
    }
  };

  // Texts for diffrent languages
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
    
    <section className="max-w-7xl pt-8">

      {/* Header */}
      <div className="">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{texts[language].title}</h1>
        <p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg mt-2">{texts[language].description}</p>
      </div>

      <div className={`max-w-3xl gap-4 items-start`}>
        <form id='formContainer' className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {/* Name Input */}
            <FormField
              labelName={language === 'he' ? 'שמך' : 'Your Name'}
              type="text"
              name="name"
              value={form.name}
              handleChange={handleChange}
              autocomplete="name"
              maxLength={30}
            />
            {/* SurpriseMe Button */}
            <div className="relative mt-8">
              <button
                type="button"
                onClick={handleSurpriseMe}
                className={`flex items-center justify-center py-1 px-2 border rounded-md text-white bg-[#2a2a2a] hover:bg-gray-600 transition-all duration-300 ease-in-out text-xs sm:text-sm md:text-md absolute top-[-40px] 
                ${language === 'he' ? 'left-0' : 'right-0'}`}
              >
                🎲
                <span className={``}>
                  {language === 'he' ? 'תיאור בהפתעה' : 'Surprise Me'}
                </span>
              </button>
              {/* Prompt Input */}
              <FormField
                labelName={language === 'he' ? 'תיאור' : 'Prompt'}
                type="text"
                name="prompt"
                value={form.prompt}
                handleChange={handleChange}
                maxLength={300}
   
              />
            </div>
          </div>
        </form>


<div className="mt-5 flex flex-col gap-5">

  {/* ToastContainer */}
  <ToastContainer position="top-center" />

        {/* Generate Button */}
          <button
            type="button"
            ref={generateButtonRef}
            onClick={generateImage}
            className="mt-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-lg w-full text-center"
          >
            {generatingImg ? (language === 'he' ? '...יוצר' : 'Generating...') : texts[language].generate}
          </button>
            
        <div className="mt-3 w-full flex items-center justify-center">
          
          {/* Image Preview */}
          <div className="relative bg-[#2a2a2a] border border-[#3a3a3a] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-9/12 p-3 flex items-center"> 
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
            {/* Loader */}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        
        <div className="flex gap-4 w-full sm:w-auto mb-5">
         
   {/* Download Button */}        
  <button
    type="button"
    onClick={handleDownload}
    ref={downloadButtonRef}

    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded-lg mb-16"
      >
    {downloading ? (language === 'he' ? 'מוריד...' : 'Downloading...') : texts[language].download}
  </button>

 {/* Share Button */}
  <button
    type="button"
    onClick={handleSubmit}
    ref={shareButtonRef}
    className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded-lg mb-16"
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
