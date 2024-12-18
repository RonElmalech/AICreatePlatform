import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { Home, CreatePost, Community, ChatWithAI, EditImage } from './pages';
import LanguageSwitcher from './components/LanguageSwitcher';
import { FiHome, FiUsers, FiImage , FiMessageCircle , FiEdit3 } from 'react-icons/fi';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import logo from './assets/MindCraft-logo.png'; 

const App = () => {
  const [language, setLanguage] = useState('en');
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
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

  return (
<BrowserRouter>
  <div className={`flex min-h-screen ${isHebrew ? 'flex-row-reverse' : 'flex-row'} bg-gray-800 text-gray-100`}>
    {/* Sidebar */}
    <aside className={`bg-gray-600 text-gray-100 fixed inset-y-0 ${isHebrew ? 'right-0' : 'left-0'} transition-all duration-300 ${isSidebarExpanded ? 'w-60' : 'w-10'} md:w-60`}>
      <div className={`flex items-center justify-between px-4 py-6 ${isHebrew ? 'ml-auto' : ''}`}>
        {isSidebarExpanded && (
          <img src={logo} alt="MindCraft Logo" className={`h-10 w-auto ${isHebrew ? 'ml-auto' : ''}`} />
        )}
        <button
          className={`p-2 focus:outline-none hover:bg-gray-700 rounded ${isSidebarExpanded ? 'bg-gray-600' : 'bg-gray-500'} transition-all md:hidden absolute ${isHebrew ? 'left-0' : 'right-0'}`}
          onClick={toggleSidebar}
        >
          {isSidebarExpanded ? (isHebrew ? <GoSidebarCollapse size={24} /> : <GoSidebarExpand size={24} />) : (isHebrew ? <GoSidebarExpand size={24} /> : <GoSidebarCollapse size={24} />)}
        </button>
      </div>
      <nav className="space-y-2 flex-1">
        <NavLink to="/" className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'} ${isHebrew ? 'text-right' : 'text-left'}`}>
          <div className={`flex ${isHebrew ? 'flex-row-reverse ml-auto' : 'flex-row'} items-center`}>
            <span className={`px-2 ${isHebrew ? 'mr-1' : 'ml-1'}`}>
              <FiHome size={20} />
            </span>
            {isSidebarExpanded && (
              <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>
                {language === 'he' ? 'דף הבית' : 'Home'}
              </span>
            )}
          </div>
        </NavLink>
        <NavLink to="/community" className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'} ${isHebrew ? 'text-right' : 'text-left'}`}>
          <div className={`flex ${isHebrew ? 'flex-row-reverse ml-auto' : 'flex-row'} items-center`}>
            <span className={`px-2 ${isHebrew ? 'mr-1' : 'ml-1'}`}>
              <FiUsers size={20} />
            </span>
            {isSidebarExpanded && (
              <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>
                {language === 'he' ? 'קהילה' : 'Community'}
              </span>
            )}
          </div>
        </NavLink>
        <NavLink to="/generate" className={({ isActive }) => `flex items-center py-2 px-2 rounded transition ${isSidebarExpanded ? 'justify-start' : 'justify-center'} ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'} ${isHebrew ? 'text-right' : 'text-left'}`}>
          <div className={`flex ${isHebrew ? 'flex-row-reverse ml-auto' : 'flex-row'} items-center`}>
            <span className={`px-2 ${isHebrew ? 'mr-1' : 'ml-1'}`}>
              <FiImage size={20} />
            </span>
            {isSidebarExpanded && (
              <span className={`${isHebrew ? 'ml-3' : 'mr-3'}`}>
                {language === 'he' ? 'יצירת תמונה' : 'Generate Image'}
              </span>
            )}
          </div>
        </NavLink>

      {/* Chat With AI Link */}
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `flex items-center py-2 px-2 rounded transition ${
                  isSidebarExpanded ? 'justify-start' : 'justify-center'
                } ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'} ${isHebrew ? 'text-right' : 'text-left'}`
              }
            >
              <span className={`px-2 ${isHebrew ? 'mr-1' : 'ml-1'}`}>
                <FiMessageCircle size={20} />
              </span>
              {isSidebarExpanded && <span>{language === 'he' ? 'שיחה עם AI' : 'Chat With AI'}</span>}
            </NavLink>

            {/* Edit Image Link */}
            <NavLink
              to="/edit"
              className={({ isActive }) =>
                `flex items-center py-2 px-2 rounded transition ${
                  isSidebarExpanded ? 'justify-start' : 'justify-center'
                } ${isActive ? 'bg-teal-500' : 'hover:bg-gray-700'} ${isHebrew ? 'text-right' : 'text-left'}`
              }
            >
              <span className={`px-2 ${isHebrew ? 'mr-1' : 'ml-1'}`}>
                <FiEdit3 size={20} />
              </span>
              {isSidebarExpanded && <span>{language === 'he' ? 'עריכת תמונה' : 'Edit Image'}</span>}
            </NavLink>
          </nav>
        </aside>

    {/* Main Content */}
    <div className={`flex-1 flex flex-col ${isSidebarExpanded ? (isHebrew ? 'mr-60 text-right' : 'ml-60 text-left') : (isHebrew ? 'mr-6 text-right' : 'ml-6 text-left')} overflow-hidden`}>
      <main className="flex-1 overflow-y-auto p-6 mt-6">
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/community" element={<Community language={language} />} />
          <Route path="/generate" element={<CreatePost language={language} />} />
          <Route path="/chat" element={<ChatWithAI language={language} />} />
          <Route path="/edit" element={<EditImage language={language} />} />
        </Routes>
      </main>
    </div>

    {/* Language Switcher */}
    <div className={`fixed top-4 ${isHebrew ? 'left-4' : 'right-4'} z-50`}>
      <LanguageSwitcher language={language} setLanguage={setLanguage} />
    </div>
  </div>
</BrowserRouter>





  );
};

export default App;
