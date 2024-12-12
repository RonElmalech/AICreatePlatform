import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { Home, CreatePost } from './pages';
import LanguageSwitcher from './components/LanguageSwitcher';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from './assets/MindCraft-logo.png';

const App = () => {
  const [language, setLanguage] = useState('en');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    console.log('Language changed to:', language);
  }, [language]);

  return (
    <BrowserRouter>
      <header
        className={`bg-gray-800 text-white py-4 px-8 flex items-center justify-between h-16 ${
          language === 'he' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="MindCraft Logo" className="h-12 w-auto" />
        </div>

        {/* Navigation and Dropdown */}
        <div className={`flex items-center px-5 ${language === 'he' ? 'ml-auto' : 'mr-auto'}`}>
          <nav
            className={`hidden md:flex items-center ${language === 'he' ? 'ml-auto flex-row-reverse space-x-reverse space-x-4' : 'space-x-4'}`}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `py-2 px-4 rounded ${isActive ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`
              }
            >
              {language === 'he' ? 'בית' : 'Home'}
            </NavLink>
            <NavLink
              to="/generate"
              className={({ isActive }) =>
                `py-2 px-4 rounded ${isActive ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`
              }
            >
              {language === 'he' ? 'יצירת תמונה' : 'Generate Image'}
            </NavLink>
          </nav>

          {/* Dropdown for smaller screens */}
          <div className="relative md:hidden ml-4">
            <button
              className="text-white focus:outline-none"
              onClick={toggleDropdown}
            >
              {isDropdownOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            {isDropdownOpen && (
              <div
                className={`absolute top-full mt-2 w-48 bg-gray-700 rounded shadow-lg z-50 ${
                  language === 'he' ? 'right-0 text-right' : 'left-0 text-left'
                }`}
                style={language === 'he' ? { direction: 'rtl' } : {}}
              >
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-600 block ${isActive ? 'bg-blue-500' : ''}`
                  }
                  onClick={() => setDropdownOpen(false)}
                >
                  {language === 'he' ? 'בית' : 'Home'}
                </NavLink>
                <NavLink
                  to="/generate"
                  className={({ isActive }) =>
                    `py-2 px-4 hover:bg-gray-600 block ${isActive ? 'bg-blue-500' : ''}`
                  }
                  onClick={() => setDropdownOpen(false)}
                >
                  {language === 'he' ? 'יצירת תמונה' : 'Generate Image'}
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </header>

      <main className="container mx-auto mt-16 px-4">
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/generate" element={<CreatePost language={language} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
