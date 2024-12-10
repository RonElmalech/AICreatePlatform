import React from 'react';
import israelFlag from '../assets/israel.png';
import usaFlag from '../assets/usa.png';

const LanguageSwitcher = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center space-x-2 px-3 py-2 rounded ${
          language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
        } hover:bg-blue-400`}
      >
        <img src={usaFlag} alt="English" className="w-6 h-6" />
        <span className="text-sm font-medium">English</span>
      </button>
      <button
        onClick={() => setLanguage('he')}
        className={`flex items-center space-x-2 px-3 py-2 rounded ${
          language === 'he' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
        } hover:bg-blue-400`}
      >
        <img src={israelFlag} alt="Hebrew" className="w-6 h-6" />
        <span className="text-sm font-medium">עברית</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
