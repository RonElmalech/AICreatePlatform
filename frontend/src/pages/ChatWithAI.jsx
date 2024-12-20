import React, { useState, useEffect, useRef } from "react";
import {  AiOutlineClear } from "react-icons/ai";
import { FaMicrophone, FaMicrophoneAltSlash , FaArrowUp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../components/FormField";
import axios from "axios";
import {useSelector} from 'react-redux';

const texts = {

  en: {
    title: "Chat with AI",
    chatPlaceholder: "Chat with AI...",
    typing: "AI is typing...",
    noSpeech: "No speech detected. Please try again.",
    noInput: "Please enter a message.",
    clearConfirmation: "Are you sure you want to delete all messages?",
    yes: "Yes",
    no: "No",
  },
  he: {
    title: "שוחחו עם הבינה המלאכותית",
    chatPlaceholder: "שוחח עם AI...",
    typing: "...הבינה המלאכותית מקלידה",
    noSpeech: ".לא זוהה דיבור. אנא נסה שוב",
    noInput: ".אנא הזן הודעה",
    clearConfirmation: "? האם אתה בטוח שברצונך למחוק את כל ההודעות",
    yes: "כן",
    no: "לא",
  },
};

const ChatWithAI = () => {
  const language = useSelector((state) => state.language.language);
  const isHebrew = language === "he";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isRecognitionInProgress, setIsRecognitionInProgress] = useState(false);
  const [hasStartedRecognition, setHasStartedRecognition] = useState(false);

  const buttonRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const top = buttonRect.top + window.scrollY - 60;
        toast.error(texts[language].noInput, {  // Adjust no speech toast
          position: isHebrew ? "top-left" : "top-right",  // Adjust position for Hebrew
          autoClose: 3000,
          className: `custom-toast p-4 rounded-md bg-gray-800 text-white ${language === "he" ? "flex flex-row-reverse" : ""}`,
          style: { top: `${top}px` },
        });
      }
      return;  // Exit the function if the input is empty
    }
    const currentInput = input.trim();

    // Detect language of user input

    // Send user message
    const userMessage = { type: "user", text: currentInput};

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    // Send to backend for AI response (no translation, just detection)
    try {
      const res = await axios.post("/api/v1/dalle/generate-text", 
       { prompt: currentInput })
      let aiMessageText = res.data;

      // If the language is Hebrew, send AI response to the translate API
      if (isHebrew) {
        const translatedResponse = await translateAIResponseToHebrew(aiMessageText);
        aiMessageText = translatedResponse;
      }

      // Add AI message (in English or translated to Hebrew)
      const aiMessage = { type: "ai", text: aiMessageText, language: isHebrew ? "he" : "en" };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
    setLoading(false);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecognitionInProgress) {
      recognition.stop();
      setIsListening(false);
      setIsRecognitionInProgress(false);
      return;
    }

    const newRecognition = new window.webkitSpeechRecognition();
    newRecognition.continuous = false;
    newRecognition.lang = language === "he" ? "he-IL" : "en-US";

    let speechDetected = false;

    newRecognition.onstart = () => {
      setIsListening(true);
      setIsRecognitionInProgress(true);
    };

    newRecognition.onresult = (event) => {
      speechDetected = true;
      const transcript = event.results[0][0].transcript;
      setInput((prevInput) => prevInput + " " + transcript);
    };

    newRecognition.onerror = (event) => {
      setIsListening(false);
      setIsRecognitionInProgress(false);
    };

    newRecognition.onend = () => {
      setIsListening(false);
      setIsRecognitionInProgress(false);
      if (!speechDetected) {
        if (buttonRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          const top = buttonRect.top + window.scrollY - 60;
          toast.error(texts[language].noSpeech, {  // Adjust no speech toast
            position: isHebrew ? "top-left" : "top-right",  // Adjust position for Hebrew
            autoClose: 3000,
            className: `custom-toast p-4 rounded-md bg-gray-800 text-white ${language === "he" ? "flex flex-row-reverse" : ""}`,
            style: { top: `${top}px` },
          });
        }
      }
    };

    newRecognition.start();
    setRecognition(newRecognition);
  };

  const handleClearChat = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const top = buttonRect.top + window.scrollY - 60;
      toast.warn(
        <div>
          <p>{texts[language].clearConfirmation}</p>
          <div className="flex justify-between mt-3">
            <button
              onClick={() => {
                setMessages([]);
                toast.dismiss();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              {texts[language].yes}
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              {texts[language].no}
            </button>
          </div>
        </div>,

        {
          position: isHebrew ? "top-left" : "top-right",  // Adjust position for Hebrew
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          className: `custom-toast p-4 rounded-md bg-gray-800 text-white ${language === "he" ? "flex flex-row-reverse" : ""}`,
          style: { top: `${top}px` },
        }
      );
    }
  };

  const translateAIResponseToHebrew = async (responseText) => {
    const response = await axios.post('/api/v1/dalle/translate', {
      text: responseText,
      target: "he",
    });

    return response.data.translatedText;  // The translated response in Hebrew
  };

  return (
    <div className="text-white px-2 pt-8 overflow-hidden">
      <ToastContainer position="top-right" />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#f0f0f0]">
        {texts[language].title}
      </h1>
      <div className="max-w-3xl">
        <div className="flex-1 overflow-y-auto bg-[#2a2a2a] p-4 rounded-md max-h-[calc(100vh-200px)]">
          {messages.map((msg, i) => (
            <div key={i} className={`my-2 ${isHebrew ? "text-right" : "text-left"}`}>
              <p
                className={`inline-block p-2 rounded-md ${
                  msg.type === "user" ? "bg-[#3b82f6] text-[#ffffff]" : "bg-[#444444] text-[#f0f0f0]"
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
          {loading && <p className="text-center">{texts[language].typing}</p>}
        </div>

        {/* Input and Buttons Section */}
        <div className="mt-4 p-4 bg-[#1a1a1a] rounded-md">
  <FormField
    labelName={texts[language].chatPlaceholder}
    name="chatInput"
    value={input}
    handleChange={(e) => setInput(e.target.value)}
    maxLength={500}
  />
  <div className="mt-4 flex items-center">
    {/* Clear button on the left */}
    <button
      onClick={handleClearChat}
      className="p-3 bg-[#ef4444] hover:bg-[#ff5555] text-white rounded-full"
      ref={buttonRef}
    >
      <AiOutlineClear size={24} />
    </button>
    
    {/* Voice and Send buttons on the right */}
    <div className={` flex gap-2 ${isHebrew ? "mr-auto" : "ml-auto"}`}>
      <button
        onClick={handleVoiceInput}
        className={`p-3 ${isListening ? "bg-[#ef4444] hover:bg-[#ff5555]" : "bg-[#444444] hover:bg-[#555555]"} text-white rounded-full`}
      >
        {isListening ? <FaMicrophoneAltSlash size={24} /> : <FaMicrophone size={24} />}
      </button>
      <button
        onClick={handleSendMessage}
        className="p-3 bg-[#444444] hover:bg-[#555555] text-white rounded-full"
      >
        <FaArrowUp size={24} />
      </button>
    </div>
  </div>
</div>


      </div>
    </div>
  );
};

export default ChatWithAI;
