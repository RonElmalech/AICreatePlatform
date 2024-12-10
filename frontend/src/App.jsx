import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { Home, CreatePost } from './pages';
import LanguageSwitcher from './components/LanguageSwitcher';
import logo from './assets/MindCraft-logo.png';

const App = () => {
  const [language, setLanguage] = useState('en');

  return (
    <BrowserRouter>
      {/* Top Bar */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="MindCraft Logo" className="w-32 object-contain" />
          </Link>
          {/* Navigation Links */}
          <nav className="hidden sm:flex space-x-6">
            <Link
              to="/"
              className="text-lg font-semibold text-gray-300 hover:text-white transition"
            >
              {language === 'he' ? 'בית' : 'Home'}
            </Link>
            <Link
              to="/generate"
              className="text-lg font-semibold text-gray-300 hover:text-white transition"
            >
              {language === 'he' ? 'יצירת תמונה' : 'Generate Image'}
            </Link>
          </nav>
        </div>
        {/* Language Switcher */}
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </header>

      {/* Main Content */}
      <main className="w-full p-8 bg-gray-800 text-gray-100 min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/generate" element={<CreatePost language={language} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
