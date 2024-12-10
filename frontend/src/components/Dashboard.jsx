import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ language }) => {
  return (
    <div className={`fixed top-0 ${language === 'he' ? 'right-0' : 'left-0'} w-64 h-full bg-gray-800 text-white p-5`}>
      <h2 className="text-xl font-bold mb-4">{language === 'he' ? 'לוח בקרה' : 'Dashboard'}</h2>
      <ul>
        <li>
          <Link to="/" className="text-lg hover:text-blue-500">
            {language === 'he' ? 'בית' : 'Home'}
          </Link>
        </li>
        <li>
          <Link to="/generate" className="text-lg hover:text-blue-500">
            {language === 'he' ? 'יצירת תמונה' : 'Generate Image'}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
