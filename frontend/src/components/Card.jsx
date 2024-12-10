import React from 'react';
import download from '../assets/download.png';
import { downloadImage } from '../utils';

// Function to check if the text contains Hebrew characters
const isHebrew = (text) => {
  return /[\u0590-\u05FF]/.test(text);  // Check for Hebrew letters in the string
};

const Card = ({ _id, name, prompt, photo }) => {
  // Check if the prompt text contains Hebrew characters
  const isPostHebrew = isHebrew(prompt);
  console.log('prompt:', prompt);
  console.log('Is prompt Hebrew:', isPostHebrew);  // Log to verify Hebrew detection
    // Log to verify Hebrew detection

  // Determine the direction based on Hebrew or English
  const textDirection = isPostHebrew ? 'rtl' : 'ltr';
  const alignmentClass = isPostHebrew ? 'text-right' : 'text-left';

  // Adjust classes for elements based on Hebrew detection
  const nameAlignmentClass = isPostHebrew ? 'mr-2' : 'ml-2';
  const buttonAlignmentClass = isPostHebrew ? 'ml-2' : 'mr-2';
  const namePositionClass = isPostHebrew ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card min-h-[300px]">
      <img
        className="w-full h-full object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        {/* Apply RTL for Hebrew and LTR for English */}
        <p
          className={`text-white text-md overflow-y-auto prompt ${alignmentClass}`}
          style={{
            direction: textDirection, // Apply text direction based on Hebrew detection
          }}
        >
          {prompt}
        </p>
        <div className={`mt-5 flex justify-between items-center gap-2 ${namePositionClass}`}>
          <div className={`flex items-center gap-2 ${isPostHebrew ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold ${nameAlignmentClass}`}
            >
              {name[0]}
            </div>
            <p className={`text-white text-sm ${alignmentClass}`}>
              {name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => downloadImage(_id, photo)}
            className={`outline-none bg-transparent border-none ${buttonAlignmentClass}`}
          >
  
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
