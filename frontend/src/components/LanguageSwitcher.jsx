import React, { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import israel from '../assets/israel.png';
import usa from '../assets/usa.png';

const LanguageSwitcher = ({ language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsOpen(false); // Close the dropdown after selecting a language
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center px-2 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
        onClick={toggleDropdown}
      >
        <img src={language === 'he' ? israel : usa} alt="Flag" className="w-5 h-5 mr-2" />
        <HiOutlineChevronDown className="text-white" size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-gray-800 text-white rounded-md shadow-md">
          {language === 'en' ? (
            <>
              <button
                className="flex items-center px-2 py-2 hover:bg-gray-700"
                onClick={() => handleLanguageChange('en')}
              >
                <img src={usa} alt="English" className="w-6 h-6 mr-1" />
                En
              </button>
              <button
                className="flex items-center px-2 py-2 hover:bg-gray-700"
                onClick={() => handleLanguageChange('he')}
              >
                <img src={israel} alt="Hebrew" className="w-6 h-6 mr-1" />
                He
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center px-2 py-2 hover:bg-gray-700"
                onClick={() => handleLanguageChange('he')}
              >
                <img src={israel} alt="Hebrew" className="w-6 h-6 mr-1" />
                He
              </button>
              <button
                className="flex items-center px-2 py-2 hover:bg-gray-700"
                onClick={() => handleLanguageChange('en')}
              >
                <img src={usa} alt="English" className="w-6 h-6 mr-1" />
                En
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
