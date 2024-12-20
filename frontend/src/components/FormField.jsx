import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux

const FormField = ({
  labelName,
  name,
  value,
  handleChange,
  autocomplete,
  maxRows = 5, 
  maxLength, // Add maxLength to restrict input
}) => {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const language = useSelector((state) => state.language.language); // Get the language from the store
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

  const handleFocus = () => setIsFocused(true); // Set focus state to true
  const handleBlur = () => {
    if (value === '') {
      setIsFocused(false); // Reset to false if textarea is empty
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        name={name}
        id={name}
        rows="1"
        value={value}
        onChange={handleChange} // Use handleChange as normal
        required
        autoComplete={autocomplete}
        maxLength={maxLength} // Add maxLength to restrict input
        className={`bg-[#2a2a2a] border border-[#444444] text-[#f0f0f0] text-xs sm:text-sm rounded-lg focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none w-full p-2 resize-none overflow-hidden ${textAlign}`}
        placeholder=" " // This creates the placeholder behavior
        onFocus={handleFocus} // Trigger the label to move up on focus
        onBlur={handleBlur} // Reset the label position when blur and empty
      />
      <label
        htmlFor={name}
        className={`absolute ${labelAlign} text-xs sm:text-sm font-medium text-[#f0f0f0] transition-all duration-200 ${
          isFocused || value ? 'translate-y-[-1.25rem] scale-75' : 'top-2.5 sm:top-2'
        }`}
      >
        {labelName}
      </label>
    </div>
  );
};

export default FormField;
