import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { Home, CreatePost, Community, ChatWithAI, EditImage } from './pages';
import LanguageSwitcher from './components/LanguageSwitcher';
import { FiHome, FiUsers, FiImage, FiMessageCircle, FiEdit3 } from 'react-icons/fi';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import logo from './assets/MindCraft-logo.png';
import { useSelector } from 'react-redux';

const App = () => {
  
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const language = useSelector((state) => state.language.language);

  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);
  const closeSidebar = () => {
    if (isSidebarExpanded && windowWidth < 768) {
      setSidebarExpanded(false);
    }
  };
    useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 768) {
      setSidebarExpanded(false);
    } else {
      setSidebarExpanded(true);
    }
  }, [windowWidth]);

  const isHebrew = language === 'he';

  
  useEffect(() => {
    if (language === 'he') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }
  }, [language]);

  return (
    <BrowserRouter>
      <div className={`flex min-h-screen  bg-[#121212] text-gray-100 w-full overflow-x-hidden`}>
        {/* Sidebar */}
        <aside className={`bg-[#2a2a2a] text-gray-100 fixed inset-y-0 transition-all duration-300 ${isSidebarExpanded ? 'w-60' : 'w-10'} md:w-60`}>
          <div className={`flex items-center justify-between px-4 py-6`}>
            {isSidebarExpanded && (
              <img src={logo} alt="MindCraft Logo" className={`h-10 w-auto`} />
            )}
            <button
              className={`p-2 focus:outline-none hover:bg-gray-700 rounded ${isSidebarExpanded ? 'bg-gray-600' : 'bg-gray-500'} transition-all md:hidden absolute ${
                isHebrew ? 'left-0' : 'right-0'
              }`}
              onClick={toggleSidebar}
            >
              {isSidebarExpanded ? (isHebrew ? <GoSidebarCollapse size={24} /> : <GoSidebarExpand size={24} />) : isHebrew ? <GoSidebarExpand size={24} /> : <GoSidebarCollapse size={24} />}
            </button>
          </div>
          <nav className="space-y-2 flex-1">
            {/* Navigation Links */}
            <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'}`}>
                <span className={`px-2 `}>
                  <FiHome size={20} />
                </span>
                {isSidebarExpanded && (
                  <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>
                    {language === 'he' ? 'דף הבית' : 'Home'}
                  </span>
                )}
            </NavLink>
            <NavLink to="/community" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'}`}>
                <span className={`px-2 `}>
                  <FiUsers size={20} />
                </span>
                {isSidebarExpanded && (
                  <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>
                    {language === 'he' ? 'קהילה' : 'Community'}
                  </span>
                )}
            </NavLink>
            <NavLink to="/generate" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'} `}>
                <span className={`px-2`}>
                  <FiImage size={20} />
                </span>
                {isSidebarExpanded && (
                  <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>
                    {language === 'he' ? 'יצירת תמונה' : 'Generate Image'}
                  </span>
                )}
            </NavLink>
            <NavLink to="/chat" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'} `}>
              <span className={`px-2 `}>
                <FiMessageCircle size={20} />
              </span>
              {isSidebarExpanded && <span>{language === 'he' ? 'שיחה עם AI' : 'Chat With AI'}</span>}
            </NavLink>
            <NavLink to="/edit" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'} `}>
              <span className={`px-2 `}>
                <FiEdit3 size={20} />
              </span>
              {isSidebarExpanded && <span>{language === 'he' ? 'עריכת תמונה' : 'Edit Image'}</span>}
            </NavLink>
          </nav>
        </aside>

{/* Main Content */}
<div
  className={`flex-1 mt-6 ${isSidebarExpanded && windowWidth < 768 ? 'hidden' : ''} ${
    isHebrew
      ? isSidebarExpanded
        ? 'pr-60 pl-0'  // For Hebrew with sidebar expanded
        : 'pr-10 pl-0'  // For Hebrew with sidebar collapsed
      : isSidebarExpanded
      ? 'pl-60 pr-0'  // For English with sidebar expanded
      : 'pl-10 pr-0'  // For English with sidebar collapsed
  }`}
>
  <main className={`flex-1 mt-8 mr-4 ml-4 `} style={{ maxHeight: windowHeight - 70 }}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/community" element={<Community  />} />
      <Route path="/generate" element={<CreatePost  />} />
      <Route path="/chat" element={<ChatWithAI />} />
      <Route path="/edit" element={<EditImage />} />
    </Routes>
  </main>
</div>


        {/* Language Switcher */}
        <div
  className={`fixed top-4 z-50 ${isHebrew ? 'left-4' : 'right-4'}`}
>
  <LanguageSwitcher />
</div>
      </div>
    </BrowserRouter>
  );
};

export default App;
