import React from 'react';
import israelFlag from '../assets/israel.png';
import usaFlag from '../assets/usa.png';

const LanguageSwitcher = ({ language, setLanguage }) => {
  return (
    <div className="relative">
      <button className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
        <img
          src={`/assets/${language === 'he' ? 'israel' : 'usa'}.png`}
          alt={language === 'he' ? 'Hebrew' : 'English'}
          className="w-6 h-6 mr-2"
        />
        {language === 'he' ? 'עברית' : 'English'}
      </button>
      <div className="absolute mt-2 bg-white shadow-lg rounded hidden group-hover:block">
        <button
          onClick={() => setLanguage('en')}
          className="flex items-center px-4 py-2 hover:bg-gray-100"
        >
          <img src={usaFlag} alt="English" className="w-6 h-6 mr-2" />
          English
        </button>
        <button
          onClick={() => setLanguage('he')}
          className="flex items-center px-4 py-2 hover:bg-gray-100"
        >
          <img src={israelFlag} alt="Hebrew" className="w-6 h-6 mr-2" />
          עברית
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
