import React, { useRef, useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // React Toastify styles
import { downloadImage } from '../utils';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startEditing } from '../store/editButtonSlice';
import { FiX } from 'react-icons/fi';

const Card = ({name, prompt, photo }) => {
 // Local state
  const [downloading, setDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translatedPrompt, setTranslatedPrompt] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const navigate = useNavigate();
  const isPromptHebrew = /[\u0590-\u05FF]/.test(prompt);
  const [Editing, setEditing] = useState(false);

  // Redux
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  
  //button reference
  const buttonRef = useRef();
  
  const handleEdit = () => {
    setEditing(true); // Set editing to true
    dispatch(startEditing({ image: photo, prompt })); // Start editing
    navigate('/edit'); // Navigate to the edit page
    setEditing(false); // Set editing to false
  };

  const handleDownload = async () => {
    if (!photo) {
      // If the image is not available, show an toast error message
      if (buttonRef.current) {
              const buttonRect = buttonRef.current.getBoundingClientRect();
              const top = buttonRect.top + window.scrollY - 60;
              toast.error(language === 'he' ? 'אנא צור תמונה לפני ההורדה' : 'Please generate an image before downloading'
                , {
                position: 'top-center',
                autoClose: 3000,
                style: { top: `${top}px` },
              });
            }
            return; // Exit if input is empty 
      }
    
    setDownloading(true);
    try {
      const userName = name;
      await downloadImage(photo, userName); // Download the image
      
    } catch (error) {
      toast.error(`Error downloading: ${error.message}`);
    } finally {
      // Show a success toast message after downloading the image
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const top = buttonRect.top + window.scrollY - 60;
        toast.success(language === 'he' ? '!ההורדה הושלמה בהצלחה' : 'Download completed successfully!'
          , {
          position: 'top-center',
          autoClose: 3000,
          style: { top: `${top}px` },
        });
      }
      setDownloading(false);
    }
  };

  const handleTranslate = async () => {

    // If the original prompt is shown, hide it and return
    if (showOriginal) {
      setTranslatedPrompt(null);
      setShowOriginal(false);
      return;
    }
    if (!prompt) return;

    setIsTranslating(true);

    // Translate the prompt
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

  // Open and close modal functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle outside click to close the modal
  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  };

  // Check if the translate button should be shown
  const shouldShowTranslateButton =
    (language === 'he' && !isPromptHebrew) || (language !== 'he' && isPromptHebrew);

  return (
    <div className="relative group">

      {/* Image */}
      <img src={photo} alt={prompt} className="w-full h-full object-cover rounded-lg" />
      <div className="absolute inset-0 bg-black/70 text-white p-2 sm:p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
        <div className="flex items-center gap-2">

          {/* User avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-500 flex items-center justify-center text-white text-sm sm:text-lg">
            {name[0]}
          </div>

          {/* User name */}
          <span className="text-sm truncate">{name}</span>
        </div>

        {/* Prompt and details button */}
        <p className={`text-sm ${isPromptHebrew ? 'text-right' : 'text-left'} line-clamp-3`}>
          {prompt}
        </p>
        <button
          onClick={openModal}
          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
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
          <div className="bg-[#1a1a1a] border rounded-lg p-4 sm:p-6 max-w-full sm:max-w-3xl w-[90%] relative">

            {/* Close button */}
            <button
              onClick={closeModal}
              className={`absolute top-1 ${language === 'he' ? 'left-1' : 'right-1'} p-1 bg-[#1a1a1a] border hover:bg-[#555555] text-white rounded-full`}
            >
              <FiX size={20} />
            </button>

            {/* Modal Image */}
            <img src={photo} alt={prompt} className="w-full h-auto rounded-lg" />
            <div className="mt-4">
              <div className="flex items-center gap-2">

                {/* Modal User avatar */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-500 flex items-center justify-center text-white text-md sm:text-lg">
                  {name[0]}
                </div>

                {/* Modal User name */}
                <span className="text-md sm:text-lg truncate">{name}</span>
              </div>

              {/* Modal Prompt */}
              <p className="mt-2 text-sm sm:text-md">
                <strong>{language === 'he' ? 'נושא:' : 'Prompt:'} </strong>

                {/* Show the translated prompt if it exists, otherwise show the original prompt */}
                {translatedPrompt || prompt}
                {shouldShowTranslateButton && (
                  <button
                    onClick={handleTranslate}
                    className={`bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-3 rounded-lg ${
                      language === 'he' ? 'mr-2' : 'ml-2'
                    }`}
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
              <div className="mt-4 flex flex-wrap gap-2">
              <ToastContainer />
                {/* Edit button */}
                <button
                  onClick={handleEdit}
                  className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-3 rounded-lg"
                >
                  {Editing ? (
                    <span>{language === 'he' ? '...עורך' : 'Editing...'}</span>
                  ) : (
                    language === 'he' ? 'ערוך תמונה' : 'Edit Image'
                  )}
                </button>

                {/* Download button */}
                <button
                  ref={buttonRef}
                  onClick={handleDownload}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-3 rounded-lg"
                  disabled={downloading}
                >
                  {downloading
                    ? language === 'he'
                      ? '...מוריד'
                      : 'Downloading...'
                    : language === 'he'
                    ? 'הורדה'
                    : 'Download'}
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
