import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { Home, CreatePost } from './pages';
import Dashboard from './components/Dashboard';
import LanguageSwitcher from './components/LanguageSwitcher';
import logo from './assets/MindCraft-logo.png';

const App = () => {
  const [language, setLanguage] = useState('en');

  return (
    <BrowserRouter>
      {/* Top Bar */}
      <header className="flex justify-between items-center px-4 py-4 bg-white shadow">
        <Link to="/">
          <img src={logo} alt="MindCraft Logo" className="w-28" />
        </Link>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </header>

      {/* Dashboard and Main Content */}
      <div className={`flex ${language === 'he' ? 'flex-row-reverse' : 'flex-row'}`}>
        <Dashboard language={language} />
        <main className="ml-64 sm:ml-72 w-full p-8 bg-gray-100 min-h-[calc(100vh-73px)]">
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
