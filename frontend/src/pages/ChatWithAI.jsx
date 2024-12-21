import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { FaMicrophone, FaMicrophoneAltSlash, FaArrowUp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../components/FormField";
import { useSelector } from 'react-redux';
import io from 'socket.io-client'; // Import Socket.io client

// Texts for different languages
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
  // Redux selector for managing the language state in the app
  const language = useSelector((state) => state.language.language);
  const isHebrew = language === "he";

  // State hooks for managing messages, input, loading, and speech recognition
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [isRecognitionInProgress, setIsRecognitionInProgress] = useState(false);

  const buttonRef = useRef(null); // Reference to the clear chat button
  const socket = useRef(null); // Socket.io client reference for establishing a connection
  useEffect(() => {
    // Establish socket connection when the component mounts
    socket.current = io('https://mindcraftai.live'); // Use the live domain

    // Capture the socket ID once connected
    socket.current.on('connect', () => {
      setSocketId(socket.current.id);
    });

    // Handle AI responses and add them to the message state
    socket.current.on('ai-response', (response) => {
      const aiMessage = {
        type: 'ai',
        text: response.response || response.error, // Display either the response or error message
        language: isHebrew ? 'he' : 'en',
      };
      setMessages((prev) => [...prev, aiMessage]); // Append the new message to the list
      setLoading(false);
    });

    // Clean up socket connection on component unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []); // The effect runs only once when the component mounts

  useEffect(() => {
    // Placeholder for any additional logic if the language changes dynamically
  }, [language]);

  // Function to handle message sending
  const handleSendMessage = async () => {
  // Check if the input is empty and show a toast notification if so
    if (!input.trim()) {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const top = buttonRect.top + window.scrollY - 60;
        toast.error(texts[language].noInput, {
          position: 'top-center',
          autoClose: 3000,
          style: { top: `${top}px` },
        });
      }
      return; // Exit if input is empty
    }
  
    const currentInput = input.trim();
    const userMessage = { type: 'user', text: currentInput };
  
    setMessages((prev) => [...prev, userMessage]); // Add user message to the list
    setLoading(true); // Show loading indicator
    setInput('');  // Clear input field
  
    // Emit the message to the server for AI response generation
    socket.current.emit('generate-ai-response', {
      text: currentInput,
      socketId: socketId, // Send socket ID for backend reference
      language: language,
    });
  };

  // Function to handle voice input using the Web Speech API
  const handleVoiceInput = () => {
    // Check if speech recognition is supported by the browser
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    // Toggle speech recognition state if already in progress
    if (isRecognitionInProgress) {
      recognition.stop();
      setIsListening(false);
      setIsRecognitionInProgress(false);
      return;
    }

    const newRecognition = new window.webkitSpeechRecognition();
    newRecognition.continuous = false;
    newRecognition.lang = language === "he" ? "he-IL" : "en-US"; // Set language based on user preference

    let speechDetected = false;

    // Start listening for speech input
    newRecognition.onstart = () => {
      setIsListening(true);
      setIsRecognitionInProgress(true);
    };
    // Capture the speech result and append to the input field

    newRecognition.onresult = (event) => {
      speechDetected = true;
      const transcript = event.results[0][0].transcript;
      setInput((prevInput) => prevInput + " " + transcript);
    };

    // Handle any errors during speech recognition
    newRecognition.onerror = () => {
      setIsListening(false);
      setIsRecognitionInProgress(false);
    };

    // Handle the end of speech recognition
    newRecognition.onend = () => {
      setIsListening(false);
      setIsRecognitionInProgress(false);
      // Show error message if no speech detected
      if (!speechDetected) {
        if (buttonRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          const top = buttonRect.top + window.scrollY - 60;
          toast.error(texts[language].noSpeech, {
            position:  'top-center',
            autoClose: 3000,
            className: `custom-toast p-4 rounded-md bg-gray-800 text-white ${language === "he" ? "flex flex-row-reverse" : ""}`,
            style: { top: `${top}px` },
          });
        }
      }
    };

    // Start the speech recognition
    newRecognition.start();
    setRecognition(newRecognition);
  };

  // Function to clear the chat
  const handleClearChat = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const top = buttonRect.top + window.scrollY - 60;
      // Show a confirmation toast before clearing the chat
      toast.warn(
        <div>
          <p>{texts[language].clearConfirmation}</p>
          <div className="flex justify-between mt-3">
            <button
              onClick={() => {
                setMessages([]); // Clear all messages
                toast.dismiss(); // Dismiss the toast notification
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              {texts[language].yes}
            </button>
            <button
              onClick={() => toast.dismiss()} // Dismiss the confirmation toast without clearing
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              {texts[language].no}
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          className: `custom-toast p-4 rounded-md bg-gray-800 text-white ${language === "he" ? "flex flex-row-reverse" : ""}`,
          style: { top: `${top}px` },
        }
      );
    }
  };

  return (

    <div className="text-white px-2 pt-8 overflow-hidden">
      
      {/* Toast notifications for user feedback */}
      <ToastContainer position="top-center" />

      {/* Chat title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#f0f0f0]">
        {texts[language].title}
      </h1>

      {/* Chat messages display */}
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

          {/* Chat Input FormField */}
        <div className="mt-4 p-4 bg-[#1a1a1a] rounded-md mb-16">
          <FormField
            labelName={texts[language].chatPlaceholder}
            name="chatInput"
            value={input}
            handleChange={(e) => setInput(e.target.value)}
            maxLength={500}
          />

          <div className="mt-4 flex items-center ">

            {/* Clear chat button */}
            <button
              onClick={handleClearChat}
              className="p-3 bg-[#ef4444] hover:bg-[#ff5555] text-white rounded-full"
              ref={buttonRef}
            >
              <AiOutlineClear size={24} />
            </button>

          
            <div className={`flex gap-2 py-2 ${isHebrew ? "mr-auto" : "ml-auto"}`}>

              {/* Voice input button */}
              <button
                onClick={handleVoiceInput}
                className={`p-3 ${isListening ? "bg-[#ef4444] hover:bg-[#ff5555]" : "bg-[#444444] hover:bg-[#555555]"} text-white rounded-full`}
              >
                {isListening ? <FaMicrophoneAltSlash size={24} /> : <FaMicrophone size={24} />}
              </button>
              
              {/* Send message button */}
              <button
                onClick={handleSendMessage}
                className=" p-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full "
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
