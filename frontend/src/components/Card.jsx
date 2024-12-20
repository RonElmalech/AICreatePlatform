import React, { useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { MdDownloadForOffline } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // React Toastify styles
import { downloadImage } from '../utils';
import axios from 'axios';
import { useSelector , useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startEditing } from '../store/editButtonSlice';

const Card = ({ _id, name, prompt, photo}) => {
  const [downloading, setDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For the image popup modal
  const [translatedPrompt, setTranslatedPrompt] = useState(null); // Store the translated prompt
  const [isTranslating, setIsTranslating] = useState(false); // Track translation state
  const [showOriginal, setShowOriginal] = useState(false); // Toggle between original and translated
  const navigate = useNavigate();
  const isPromptHebrew = /[\u0590-\u05FF]/.test(prompt);
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
// Edit Button Handler
const handleEdit = () => {
  dispatch(startEditing({ image: photo, prompt: prompt }));
  navigate('/edit');
};

  const handleDownload = async () => {
    if (!photo) {
      toast.error(language === 'he' ? 'אנא צור תמונה לפני ההורדה' : 'Please generate an image before downloading');
      return;
    }

    setDownloading(true);
    try {
      const timestamp = Date.now();
      const filename = `MindCraftAI-${name || 'user'}-${timestamp}.jpg`;
      await downloadImage(photo, name, filename);
      toast.success(language === 'he' ? 'ההורדה הושלמה בהצלחה!' : 'Download completed successfully!');
    } catch (error) {
      toast.error(`Error downloading: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleTranslate = async () => {
    if (showOriginal) {
      // Toggle back to original prompt
      setTranslatedPrompt(null);
      setShowOriginal(false);
      return;
    }

    if (!prompt) return;

    setIsTranslating(true);
    try {
      const response = await axios.post('/api/v1/dalle/translate', {
        text: prompt,
        target: language,
      });

      const translatedText = response.data.translatedText || '';
      const suffix = language === 'he' ? ' (מתורגם)' : ' (translated)';
      setTranslatedPrompt(translatedText + suffix);
      setShowOriginal(true);
    } catch (error) {
      toast.error(language === 'he' ? 'שגיאה בתרגום' : 'Error translating prompt');
    } finally {
      setIsTranslating(false);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      closeModal();
    }
  };

  const shouldShowTranslateButton =
    (language === 'he' && !isPromptHebrew) || (language !== 'he' && isPromptHebrew);

  return (
    <div className="relative group">
      {/* Image */}
      <img src={photo} alt={prompt} className="w-full h-full object-cover rounded-lg" />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/70 text-white p-2 sm:p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
        {/* User Info */}
        <div className={`flex items-center gap-2 `}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-sm sm:text-lg">
            {name[0]}
          </div>
          <span className="text-xs sm:text-sm truncate">{name}</span>
        </div>

        {/* Prompt Text */}
        <p className={`text-xs sm:text-sm ${isPromptHebrew ? 'text-right' : 'text-left'} line-clamp-3`}>
          {prompt}
        </p>

        {/* View Details Button */}
        <button
          onClick={openModal}
          className="flex items-center gap-1 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300"
        >
          <MdInfoOutline size={18} />
          {language === 'he' ? 'פרטים' : 'Details'}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-[#1a1a1a] rounded-lg p-4 sm:p-8 max-w-[90%] sm:max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
          >
            <button
              className={`absolute text-gray-500 text-2xl ${language === 'he' ? 'top-2 left-2' : 'top-2 right-2'}`}
              onClick={closeModal}
            >
              &times;
            </button>
           
            {/* Image */}
            <img src={photo} alt={prompt} className="w-full h-auto rounded-lg" />

            {/* Details */}
            <div className={`mt-4 `}>
              <div className={`flex items-center gap-2 `}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-500 flex items-center justify-center text-white text-sm sm:text-lg">
                  {name[0]}
                </div>
                <span className="text-sm sm:text-lg truncate">{name}</span>
              </div>

              {/* Prompt Text */}
              <p
                className={`mt-2 text-xs sm:text-md`}
               
              >
                <strong>{language === 'he' ? 'נושא:' : 'Prompt:'} </strong>
                {translatedPrompt || prompt}
                {shouldShowTranslateButton && (
                  <button
                    onClick={handleTranslate}
                    className={`${language === 'he' ? "mr-2" : "ml-2"}`}
                    disabled={isTranslating}
                  >
                    {isTranslating
                      ? language === 'he'
                        ? '...מתרגם'
                        : 'Translating...'
                      : showOriginal
                      ? language === 'he'
                        ? 'הצג מקורי'
                        : 'Show Original'
                      : language === 'he'
                      ? 'תרגם'
                      : 'Translate'}
                  </button>
                )}
              </p>

              <div className={`mt-4 flex `}>
                <button onClick={handleEdit} className={`text-xs sm:text-md flex items-center gap-2 hover:text-cyan-500 `}>
                edit</button>
                <button
                  onClick={handleDownload}
                  className={`text-xs sm:text-md flex items-center gap-2 hover:text-cyan-500 `}
                  disabled={downloading}
                >
                  {downloading ? (
                    <span>{language === 'he' ? '...מוריד' : 'Downloading...'}</span>
                  ) : (
                    <>
                      <MdDownloadForOffline size={20} />
                      {language === 'he' ? 'הורדה' : 'Download'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;