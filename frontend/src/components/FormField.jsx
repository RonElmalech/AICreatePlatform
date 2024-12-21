import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// Form field component
const FormField = ({
  labelName, // Label name
  name, // Name of the input
  value, //  Value of the input
  handleChange, // Handle change function
  autocomplete, // Add autocomplete attribute
  maxRows = 5, // Set the maximum number of rows
  maxLength, // Add maxLength to restrict input
}) => {
  const textareaRef = useRef(null); // Reference to the textarea element
  const [isFocused, setIsFocused] = useState(false); // State to check if the input is focused
  const language = useSelector((state) => state.language.language); // Get the language from Redux
  
  // Function to update textarea height and handle scroll
  useEffect(() => {
    if (textareaRef.current) {
      // Set the initial height (one line of text)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  
      // Reset height to auto to shrink back if text is deleted
      textareaRef.current.style.height = 'auto';
  
      // Adjust the height based on the content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  
      // Apply maximum height logic
      if (textareaRef.current.scrollHeight > maxRows * 24) {
        textareaRef.current.style.height = `${maxRows * 24}px`;
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [value, maxRows]);
  // Set text alignment based on the language
  const textAlign = language === 'he' ? 'text-right' : 'text-left';
  const labelAlign = language === 'he' ? 'right-3' : 'left-3';

  // Handle focus and blur events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (value === '') {
      setIsFocused(false);
    }
  };

  // Return the form field
  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        name={name}
        id={name}
        rows="1"
        value={value}
        onChange={handleChange}
        required
        autoComplete={autocomplete}
        maxLength={maxLength}
        className={`bg-[#2a2a2a] border border-[#444444] text-[#f0f0f0] text-xs sm:text-sm rounded-lg focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none w-full p-2 resize-none overflow-hidden ${textAlign}`}
        placeholder=" "
        onFocus={handleFocus}
        onBlur={handleBlur}
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
