import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import logo from './assets/logo.svg';  // Adjust this path as needed
import { Home, CreatePost } from './pages';  // Import your existing pages
import Dashboard from './components/Dashboard'; // The new Dashboard component
import LanguageSwitcher from './components/LanguageSwitcher'; // Language Switcher with flags

const App = () => {
  const [language, setLanguage] = useState('en'); // Default language is English

  return (
    <BrowserRouter>
      {/* Header with Logo and Language Switcher */}
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
        <Link to="/">
          <img src={logo} alt="logo" className="w-28 object-contain" />
        </Link>

        {/* Language Switcher */}
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </header>

      <div className={`flex ${language === 'he' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Sidebar / Dashboard */}
        <Dashboard language={language} />

        {/* Main Content */}
        <main className="ml-64 sm:ml-72 w-full p-8 bg-[#f9fafe] min-h-[calc(100vh-73px)]">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/create-post" element={<CreatePost language={language} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
