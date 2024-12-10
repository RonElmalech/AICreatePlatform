import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { Home, CreatePost } from './pages';
import LanguageSwitcher from './components/LanguageSwitcher';
import logo from './assets/MindCraft-logo.png';
import './App.css'; // Import the CSS file

const App = () => {
  const [language, setLanguage] = useState('en');

  return (
    <BrowserRouter>
      <header className="top-bar">
        <div className="top-bar-left">
          <Link to="/">
            <img src={logo} alt="MindCraft Logo" className="logo" />
          </Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">{language === 'he' ? 'בית' : 'Home'}</Link>
            <Link to="/generate" className="nav-link">{language === 'he' ? 'יצירת תמונה' : 'Generate Image'}</Link>
          </nav>
        </div>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/generate" element={<CreatePost language={language} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
