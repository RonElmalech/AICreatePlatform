import React, { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import israel from '../assets/israel.png';
import usa from '../assets/usa.png';
import {useDispatch, useSelector} from 'react-redux';
import { setLanguage } from '../store/languageSlice';

const LanguageSwitcher = () => {
  // Redux
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);
  // Local state
  const [isOpen, setIsOpen] = useState(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle the dropdown
  };

  const handleLanguageChange = (lang) => {
   dispatch(setLanguage(lang)); // Set the language in the Redux store
    setIsOpen(false); // Close the dropdown after selecting a language
  };

  return (
    <div className="relative inline-block">
      {/* Button to toggle the dropdown */}
      <button
        className="flex items-center px-2 py-2 rounded-md bg-[#2a2a2a] text-white hover:bg-gray-700"
        onClick={toggleDropdown}
      >
        {/* Flag and chevron icon */}
        <img src={language === 'he' ? israel : usa} alt="Flag" className={`w-5 h-5 ${language === 'he' ? "ml-2" :"mr-2"}`} />
        <HiOutlineChevronDown className="text-white" size={20} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-[#2a2a2a] text-white rounded-md shadow-md">
          {language === 'en' ? (
            <>
              <button
                className="flex items-center px-2 py-2 hover:bg-gray-700"
                onClick={() => handleLanguageChange('en')}
              >
                <img src={usa} alt="English" className={`w-6 h-6 ${language === 'he' ? "ml-1" :"mr-1"}`} />
                En
              </button>
              <button
                className="flex items-center px-2 py-2 hover:bg-gray-700"
                onClick={() => handleLanguageChange('he')}
              >
                <img src={israel} alt="Hebrew" className={`w-6 h-6 ${language === 'he' ? "ml-1" :"mr-1"}`} />
                He
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center px-2 py-2 hover:bg-gray-700"
                onClick={() => handleLanguageChange('he')}
              >
                <img src={israel} alt="Hebrew" className={`w-6 h-6 ${language === 'he' ? "ml-1" :"mr-1"}`} />
                He
              </button>
              <button
                className="flex items-center px-2 py-2 hover:bg-gray-700"
                onClick={() => handleLanguageChange('en')}
              >
                <img src={usa} alt="English" className={`w-6 h-6 ${language === 'he' ? "ml-1" :"mr-1"}`} />
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
