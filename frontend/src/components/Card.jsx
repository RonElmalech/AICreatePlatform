import React, { useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { MdDownloadForOffline } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // React Toastify styles
import { downloadImage } from '../utils';

const Card = ({ _id, name, prompt, photo, language }) => {
  const [downloading, setDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For the image popup modal

  const isNameHebrew = /[\u0590-\u05FF]/.test(name); // Detect Hebrew in name
  const isPromptHebrew = /[\u0590-\u05FF]/.test(prompt);

  const handleDownload = async () => {
    if (!photo) {
      toast.error(language === 'he' ? 'אנא צור תמונה לפני ההורדה' : 'Please generate an image before downloading');
      return;
    }

    setDownloading(true);
    try {
      const timestamp = Date.now(); // Generate a unique timestamp
      const filename = `MindCraftAI-${name || 'user'}-${timestamp}.jpg`; // Name the image with timestamp
      await downloadImage(photo, name, filename); // Pass the photo URL, name, and filename to downloadImage
      toast.success(language === 'he' ? 'ההורדה הושלמה בהצלחה!' : 'Download completed successfully!');
    } catch (error) {
      toast.error(`Error downloading: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      closeModal();
    }
  };

  return (
    <div className="relative group">
      {/* Image */}
      <img
        src={photo}
        alt={prompt}
        className="w-full h-full object-cover rounded-lg"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/70 text-white p-2 sm:p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
        {/* User Info */}
        <div className={`flex items-center gap-2 ${language === 'he' ? 'flex-row-reverse text-right' : ''}`}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-sm sm:text-lg">
            {name[0]}
          </div>
          <span className="text-xs sm:text-sm truncate">{name}</span>
        </div>

        {/* Prompt Text */}
        <p
          className={`text-xs sm:text-sm ${isPromptHebrew ? 'text-right' : 'text-left'} line-clamp-3`}
        >
          {prompt}
        </p>

        {/* View Details Button */}
        <button
          onClick={openModal}
          className="flex items-center gap-1 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300"
          style={{
            flexDirection: language === 'he' ? 'row-reverse' : 'row', // Reverse order of button content for Hebrew (RTL)
          }}
        >
          <MdInfoOutline size={18} /> {/* Icon always before the text */}
          {language === 'he' ? 'פרטים' : 'Details'}
        </button>
      </div>

      {/* Modal for Full Details */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-slate-600 rounded-lg p-4 sm:p-8 max-w-[90%] sm:max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
          >
            {/* Close Button */}
            <button
              className={`absolute text-gray-500 text-2xl ${language === 'he' ? 'top-2 left-2' : 'top-2 right-2'}`}
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Image */}
            <img
              src={photo}
              alt={prompt}
              className="w-full h-auto rounded-lg"
            />

            {/* Details */}
            <div className={`mt-4 ${language === 'he' ? 'text-right' : 'text-left'}`}>
              <div
                className={`flex items-center gap-2 ${language === 'he' ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-500 flex items-center justify-center text-white text-sm sm:text-lg">
                  {name[0]}
                </div>
                <span className="text-sm sm:text-lg truncate">{name}</span>
              </div>

              {/* Prompt Label and Text */}
              <p
                className={`mt-2 text-xs sm:text-md ${language === 'he' ? 'text-right' : 'text-left'}`}
                style={{ direction: language === 'he' ? 'rtl' : 'ltr' }}
              >
                <strong>{language === 'he' ? 'נושא:' : 'Prompt:'} </strong>
                {prompt}
              </p>

              <div className={`mt-4 flex ${language === 'he' ? 'justify-end' : 'justify-start'}`}>
                <button
                  onClick={handleDownload}
                  className={`text-xs sm:text-md flex items-center gap-2 hover:text-cyan-500 ${language === 'he' ? 'flex-row-reverse' : ''}`}
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
