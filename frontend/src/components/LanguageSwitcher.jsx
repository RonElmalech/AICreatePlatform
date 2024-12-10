// src/components/LanguageSwitcher.js
import React from 'react';

const LanguageSwitcher = ({ language, setLanguage }) => {
  return (
    <div className="flex justify-end items-center space-x-4">
      <button onClick={() => setLanguage('en')} className="mr-2">
        <img src="/path/to/english-flag.svg" alt="English" width="24" />
      </button>
      <button onClick={() => setLanguage('he')}>
        <img src="/path/to/hebrew-flag.svg" alt="Hebrew" width="24" />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
