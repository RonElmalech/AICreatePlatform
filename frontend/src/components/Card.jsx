import React from 'react';
import download from '../assets/download.png';
import { downloadImage } from '../utils';

// Function to check if the text contains Hebrew characters
const isHebrew = (text) => {
  return /[\u0590-\u05FF]/.test(text);  // Check for Hebrew letters in the string
};

const Card = ({ _id, name, prompt, photo }) => {
  // Check if the prompt and name text contain Hebrew characters
  const isPromptHebrew = isHebrew(prompt);
  const isNameHebrew = isHebrew(name);

  // Determine the direction based on Hebrew or English for the prompt
  const promptTextDirection = isPromptHebrew ? 'rtl' : 'ltr';
  const promptAlignmentClass = isPromptHebrew ? 'text-right' : 'text-left';

  // If name is Hebrew, change all the layout elements (name, photo, download button) to RTL
  const layoutDirectionClass = isNameHebrew ? 'flex-row-reverse' : 'flex-row';
  const nameAlignmentClass = isNameHebrew ? 'mr-2' : 'ml-2';
  const buttonAlignmentClass = isNameHebrew ? 'ml-2' : 'mr-2';
  const textAlignmentClass = isNameHebrew ? 'text-right' : 'text-left';

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card min-h-[300px]">
      <img
        className="w-full h-full object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        {/* Apply RTL only for Hebrew prompt text */}
        <p
          className={`text-white text-md overflow-y-auto prompt ${promptAlignmentClass}`}
          style={{
            direction: promptTextDirection, // Apply text direction based on Hebrew detection for prompt
          }}
        >
          {prompt}
        </p>
        <div className={`mt-5 flex justify-between items-center gap-2 ${layoutDirectionClass}`}>
          <div className={`flex items-center gap-2 ${layoutDirectionClass}`}>
            <div
              className={`w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold ${nameAlignmentClass}`}
            >
              {name[0]}
            </div>
            <p className={`text-white text-sm ${textAlignmentClass}`}>
              {name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => downloadImage(_id, photo)}
            className={`outline-none bg-transparent border-none ${buttonAlignmentClass}`}
          >
            <img src={download} alt="download" className="w-6 h-6 object-contain invert" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
