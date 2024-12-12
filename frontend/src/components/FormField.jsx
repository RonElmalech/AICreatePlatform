import React, { useEffect, useRef } from 'react';
const FormField = ({
  labelName,
  name,
  value,
  handleChange,
  autocomplete,
  maxRows = 5,
  language, // Add the language prop to apply RTL/LTR styles
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height
      if (textareaRef.current.scrollHeight > maxRows * 24) { // Approx height per line
        textareaRef.current.style.height = `${maxRows * 24}px`; // Max height
      }
    }
  }, [value, maxRows]);

  const textAlign = language === 'he' ? 'text-right' : 'text-left'; // Conditional alignment based on language
  const labelAlign = language === 'he' ? 'right-3' : 'left-3'; // Right for Hebrew and left for English

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        name={name}
        id={name}
        rows="1"
        value={value}
        onChange={handleChange}
        required
        autoComplete={autocomplete}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none w-full p-3 resize-none overflow-hidden ${textAlign}`}
      />
      <label
        htmlFor={name}
        className={`absolute ${labelAlign} text-sm font-medium text-gray-900 transition-all duration-200 ${
          value ? 'translate-y-[-1.25rem] scale-75' : 'top-3'
        }`}
      >
        {labelName}
      </label>
    </div>
  );
};

export default FormField;
