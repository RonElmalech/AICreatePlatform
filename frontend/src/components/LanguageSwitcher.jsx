import React from 'react';
import israelFlag from '../assets/israel.png';
import usaFlag from '../assets/usa.png';
import './LanguageSwitcher.css'; // Import the CSS file

const LanguageSwitcher = ({ language, setLanguage }) => {
  return (
    <div className="language-switcher">
      <button
        onClick={() => setLanguage('en')}
        className={`language-button ${language === 'en' ? 'active' : ''}`}
      >
        <img src={usaFlag} alt="English" className="flag-icon" />
        <span className="language-text">English</span>
      </button>
      <button
        onClick={() => setLanguage('he')}
        className={`language-button ${language === 'he' ? 'active' : ''}`}
      >
        <img src={israelFlag} alt="Hebrew" className="flag-icon" />
        <span className="language-text">עברית</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
