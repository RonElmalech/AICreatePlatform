import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { Home, CreatePost, Community, ChatWithAI, EditImage, TermsOfService, PrivacyPolicy, AIDisclaimer } from './pages';
import {LanguageSwitcher} from './components';
import { FiHome, FiUsers, FiImage, FiMessageCircle, FiEdit3 } from 'react-icons/fi';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import logo from './assets/MindCraft-logo.png';
import { useSelector } from 'react-redux';

const App = () => {
  // Local state
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  //Redux state
  const language = useSelector((state) => state.language.language);


  // Toggle the sidebar
  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);

  // Close the sidebar on small screens
  const closeSidebar = () => {
    if (isSidebarExpanded && windowWidth < 768) {
      setSidebarExpanded(false);
    }
  };

  // Close the sidebar on small screens when a link is clicked
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close the sidebar on small screens when the window is resized
  useEffect(() => {
    if (windowWidth < 768) {
      setSidebarExpanded(false);
    } else {
      setSidebarExpanded(true);
    }
  }, [windowWidth]);

  // Check if the language is Hebrew
  const isHebrew = language === 'he';

  // Set the document direction based on the language
  useEffect(() => {
    if (language === 'he') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }
  }, [language]);

  return (
    <BrowserRouter>
      <div className={`flex min-h-screen bg-[#121212] text-gray-100 w-full overflow-x-hidden`}>
        {/* Sidebar */}
        <aside className={`bg-[#2a2a2a] text-gray-100 fixed inset-y-0 transition-all duration-300 ${isSidebarExpanded ? 'w-60' : 'w-10'} md:w-60`}>
          <div className={`flex items-center justify-between px-4 py-6`}>

            {/* Logo */}
            {isSidebarExpanded && <img src={logo} alt="MindCraft Logo" className={`h-10 w-auto`} />}
            {/* Sidebar Toggle Button */}
            <button
              className={`p-2 focus:outline-none hover:bg-gray-700 rounded ${isSidebarExpanded ? 'bg-gray-600' : 'bg-gray-500'} transition-all md:hidden absolute ${isHebrew ? 'left-0' : 'right-0'}`}
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
              {isSidebarExpanded && <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>{language === 'he' ? 'דף הבית' : 'Home'}</span>}
            </NavLink>
            <NavLink to="/community" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'}`}>
              <span className={`px-2 `}>
                <FiUsers size={20} />
              </span>
              {isSidebarExpanded && <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>{language === 'he' ? 'קהילה' : 'Community'}</span>}
            </NavLink>
            <NavLink to="/generate" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'}`}>
              <span className={`px-2`}>
                <FiImage size={20} />
              </span>
              {isSidebarExpanded && <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>{language === 'he' ? 'יצירת תמונה' : 'Generate Image'}</span>}
            </NavLink>
            <NavLink to="/chat" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'}`}>
              <span className={`px-2 `}>
                <FiMessageCircle size={20} />
              </span>
              {isSidebarExpanded && <span>{language === 'he' ? 'שיחה עם AI' : 'Chat With AI'}</span>}
            </NavLink>
            <NavLink to="/edit" onClick={closeSidebar} className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'}`}>
              <span className={`px-2 `}>
                <FiEdit3 size={20} />
              </span>
              {isSidebarExpanded && <span>{language === 'he' ? 'עריכת תמונה' : 'Edit Image'}</span>}
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 mt-6 ${isSidebarExpanded && windowWidth < 768 ? 'hidden' : ''} ${isHebrew ? (isSidebarExpanded ? 'pr-60 pl-0' : 'pr-10 pl-0') : (isSidebarExpanded ? 'pl-60 pr-0' : 'pl-10 pr-0')}`}>
          <main className={`flex-1 mt-8 mr-4 ml-4`} style={{ maxHeight: windowHeight - 70 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/community" element={<Community />} />
              <Route path="/generate" element={<CreatePost />} />
              <Route path="/chat" element={<ChatWithAI />} />
              <Route path="/edit" element={<EditImage />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/ai-disclaimer" element={<AIDisclaimer />} />
            </Routes>
          </main>
        </div>

        {/* Language Switcher */}
        <div className={`fixed top-4 z-50 ${isHebrew ? 'left-4' : 'right-4'}`}>
          <LanguageSwitcher />
        </div>
      </div>

    {/* Footer */}
<footer
  className={`bg-[#1a1a1a] text-[#f0f0f0] py-4 ${isSidebarExpanded && windowWidth < 768 ? 'hidden' : ''} `}
  style={{
    position: 'fixed',
    bottom: 0,
    left: isHebrew ? 0 : isSidebarExpanded ? 240 : 40,
    right: isHebrew ? (isSidebarExpanded ? 240 : 40) : 0,
  }}
>
  {/* Center the content horizontally */}
  <div className="flex justify-center items-center w-full">
    {/* Flex container for links, centered and spaced out */}
    <div className="text-xs flex justify-center w-full gap-2">
      <NavLink to="/terms-of-service" className="hover:underline  ">
        {language === 'he' ? 'תנאי שירות' : 'Terms of Service'}
      </NavLink>
      <NavLink to="/privacy-policy" className="hover:underline ">
        {language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
      </NavLink>
      <NavLink to="/ai-disclaimer" className="hover:underline ">
        {language === 'he' ? 'הצהרת AI' : 'AI Disclaimer'}
      </NavLink>
    </div>
  </div>
</footer>

    </BrowserRouter>
  );
};

export default App;
