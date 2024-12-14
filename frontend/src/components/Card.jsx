import React, { useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { downloadImage } from '../utils';

const Card = ({ _id, name, prompt, photo, language }) => {
  const [downloading, setDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For the image popup modal
  const isNameHebrew = /[\u0590-\u05FF]/.test(name);  // Detect Hebrew in name
  const isPromptHebrew = /[\u0590-\u05FF]/.test(prompt);  // Detect Hebrew in prompt

  const handleDownload = async () => {
    if (!photo) {
      alert(language === 'he' ? 'אנא צור תמונה לפני ההורדה' : 'Please generate an image before downloading');
      return;
    }

    setDownloading(true);
    try {
      const timestamp = Date.now(); // Generate a unique timestamp
      const filename = `MindCraftAI-${name || 'user'}-${timestamp}.jpg`; // Name the image with timestamp
      await downloadImage(photo, name, filename); // Pass the photo URL, name, and filename to downloadImage
    } catch (error) {
      alert(`Error downloading: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
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
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
        {/* User Info */}
        <div className="flex items-center text-xs">
          {/* User Image (Clickable) */}
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-lg cursor-pointer`}
            onClick={openModal}
          >
            {name[0]} {/* First letter */}
          </div>
          {/* User Name */}
          <span className="text-xs sm:text-sm mx-2">{name}</span>
        </div>

        {/* Truncated Prompt Text (First Line Only) */}
        <p
          className={`text-xs sm:text-sm mb-2 ${isPromptHebrew ? 'text-right' : 'text-left'} line-clamp-1`}
          style={{ direction: isPromptHebrew ? 'rtl' : 'ltr' }}
        >
          {prompt}
        </p>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className={`text-xs sm:text-sm hover:text-cyan-500 ${isNameHebrew ? 'ml-2' : 'mr-2'} mt-2 sm:mt-0`}
          disabled={downloading}
        >
          {downloading ? (
            <span>{language === 'he' ? '...מוריד' : 'Downloading...'}</span>
          ) : (
            <MdDownloadForOffline size={24} />
          )}
        </button>
      </div>

      {/* Modal for Full Details */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 text-xl"
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

            {/* Full Details */}
            <div className="mt-4">
              {/* User Info */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-lg`}
                >
                  {name[0]} {/* First letter */}
                </div>
                <span className="text-xl mx-2">{name}</span>
              </div>
              
              {/* Full Prompt Description */}
              <p
                className={`text-lg mt-2 ${isPromptHebrew ? 'text-right' : 'text-left'}`}
                style={{ direction: isPromptHebrew ? 'rtl' : 'ltr' }}
              >
                {prompt}
              </p>

              {/* Download Button in Full View */}
              <button
                onClick={handleDownload}
                className="mt-4 text-lg hover:text-cyan-500"
                disabled={downloading}
              >
                {downloading ? (
                  <span>{language === 'he' ? '...מוריד' : 'Downloading...'}</span>
                ) : (
                  <MdDownloadForOffline size={32} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
