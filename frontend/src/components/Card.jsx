import React from 'react';
import download from '../assets/download.png';
import { downloadImage } from '../utils';
import './Card.css'; // Import the CSS file

const isHebrew = (text) => {
  return /[\u0590-\u05FF]/.test(text);
};

const Card = ({ _id, name, prompt, photo }) => {
  const isPromptHebrew = isHebrew(prompt);
  const isNameHebrew = isHebrew(name);

  const promptTextDirection = isPromptHebrew ? 'rtl' : 'ltr';
  const promptAlignmentClass = isPromptHebrew ? 'text-right' : 'text-left';

  const layoutDirectionClass = isNameHebrew ? 'flex-row-reverse' : 'flex-row';
  const nameAlignmentClass = isNameHebrew ? 'mr-2' : 'ml-2';
  const buttonAlignmentClass = isNameHebrew ? 'ml-2' : 'mr-2';
  const textAlignmentClass = isNameHebrew ? 'text-right' : 'text-left';

  return (
    <div className="card-container">
      <img className="card-image" src={photo} alt={prompt} />
      <div className="card-overlay">
        <p className={`card-prompt ${promptAlignmentClass}`} style={{ direction: promptTextDirection }}>
          {prompt}
        </p>
        <div className={`card-footer ${layoutDirectionClass}`}>
          <div className={`card-name-container ${layoutDirectionClass}`}>
            <div className={`card-avatar ${nameAlignmentClass}`}>{name[0]}</div>
            <p className={`card-name ${textAlignmentClass}`}>{name}</p>
          </div>
          <button type="button" onClick={() => downloadImage(_id, photo)} className={`download-button ${buttonAlignmentClass}`}>
            <img src={download} alt="download" className="download-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
