import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Loader } from '../components';
import preview from '../assets/preview.png';
import getRandomPrompt from '../utils/index.js';
import axios from 'axios';

const CreatePost = ({ language }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.prompt && form.photo && form.name) {
      setLoading(true);  
      try {
        const response = await axios.post(`/api/v1/post`, form, {
          headers: { 'Content-Type': 'application/json' }
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
        const response = await axios.post(`/api/v1/dalle/generate-image`, { prompt: form.prompt }, {
          headers: { 'Content-Type': 'application/json' }
        });

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

  const texts = {
    en: {
      generate: "Generate",
      share: "Share with the community"
    },
    he: {
      generate: "צור",
      share: "שתף עם הקהל"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5">
      <div className={`max-w-3xl mx-auto flex ${language === 'he' ? 'flex-row-reverse' : 'flex-row'} gap-5 items-start`}>
        {/* The form part of your layout */}
        <form className="mt-16 max-w-3xl mx-auto w-full flex flex-col gap-5" onSubmit={handleSubmit}>
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
            />
            <FormField
              labelName={language === 'he' ? 'תיאור' : 'Prompt'}
              type="text"
              name="prompt"
              placeholder={language === 'he' ? 'תמונה של כלב סמויד עם לשון בחוץ מחבק חתול סיאמאי לבן' : 'A photo of a Samoyed dog with its tongue out hugging a white Siamese cat'}
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
              language={language}
            />
          </div>
  
          {/* Image Section with Flexbox Handling */}
          <div className={`relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 p-3 h-64 flex justify-center items-center`}>
            {/* Image */}
            <div className="flex justify-center items-center w-full h-full">
              {form.photo ? (
                <img src={form.photo} alt={form.prompt} className="object-contain w-full h-full" />
              ) : (
                <img src={preview} alt="preview" className="object-contain w-full h-full opacity-40" />
              )}
            </div>
  
            {/* Loader */}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
  
          {/* Other Form Buttons */}
          <div className="mt-5 flex gap-5 justify-start">
            <button
              type="button"
              onClick={generateImage}
              className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              {generatingImg ? (language === 'he' ? 'יוצר...' : 'Generating...') : (language === 'he' ? 'צור' : 'Generate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
