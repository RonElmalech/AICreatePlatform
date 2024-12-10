import React from 'react';
import download from '../assets/download.png';
import { downloadImage } from '../utils';

const Card = ({ _id, name, prompt, photo }) => {
  // Updated function to check if the prompt is entirely Hebrew
  const isHebrew = (text) => {
    // This regex checks if the string contains only Hebrew letters and spaces
    return /^[\u0590-\u05FF\s]+$/.test(text);
  };

  const isPostHebrew = isHebrew(prompt);

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card min-h-[300px]">
      <img
        className="w-full h-full object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        <p
          className={`text-white text-md overflow-y-auto prompt ${isPostHebrew ? 'text-right' : 'text-left'}`}
          style={{
            direction: isPostHebrew ? 'rtl' : 'ltr', // Set text direction for Hebrew (RTL) and other languages (LTR)
          }}
        >
          {prompt}
        </p>
        <div className="mt-5 flex justify-between items-center gap-2">
          <div className={`flex items-center gap-2 ${isPostHebrew ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold ${isPostHebrew ? 'mr-2' : 'ml-2'}`}
            >
              {name[0]}
            </div>
            <p className={`text-white text-sm ${isPostHebrew ? 'text-right' : ''}`}>
              {name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => downloadImage(_id, photo)}
            className={`outline-none bg-transparent border-none ${isPostHebrew ? 'ml-2' : 'mr-2'}`}
          >
            <img src={download} alt="download" className="w-6 h-6 object-contain invert" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
