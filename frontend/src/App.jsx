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
      <header className="flex justify-between items-center px-4 py-4 bg-gray-800 text-white shadow">
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="MindCraft Logo" className="w-28" />
          </Link>
          {/* Navigation Links */}
          <nav className="ml-8 space-x-6">
            <Link
              to="/"
              className="text-lg hover:text-blue-400 transition-colors"
            >
              {language === 'he' ? 'בית' : 'Home'}
            </Link>
            <Link
              to="/generate"
              className="text-lg hover:text-blue-400 transition-colors"
            >
              {language === 'he' ? 'יצירת תמונה' : 'Generate Image'}
            </Link>
          </nav>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </header>

      {/* Main Content */}
      <main className="w-full p-8 bg-gray-100 min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/generate" element={<CreatePost language={language} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
