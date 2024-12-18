import React, { useState } from "react";
import { AiOutlineSend, AiOutlineClear } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { FaMicrophone } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatWithAI = () => {
  const [messages, setMessages] = useState([]); // Chat history
  const [input, setInput] = useState(""); // User input
  const [loading, setLoading] = useState(false); // Loading state for AI response
  const [isListening, setIsListening] = useState(false); // Speech-to-text state
  const [imageUrl, setImageUrl] = useState(""); // To store the generated image URL

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setImageUrl(""); // Reset image when new message is sent

    try {
      // Call AI backend API for text generation
      const res = await fetch("/api/v1/dalle/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();

      const aiMessage = { type: "ai", text: data.generatedText };
      setMessages((prev) => [...prev, aiMessage]);

      // Call API to generate an image based on the prompt
      const imageRes = await fetch("/api/v1/dalle/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const imageData = await imageRes.json();
      setImageUrl(imageData.imageBase64);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      toast.error("Error generating response.");
    }

    setLoading(false);
    setInput("");
  };

  // Function to handle voice input (using Web Speech API as a placeholder)
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Function to clear the chat with confirmation
  const handleClearChat = () => {
    toast.warn(
      <div>
        <p className="text-lg font-semibold">Are you sure you want to delete all messages?</p>
        <p className="mt-2 text-sm text-gray-200">This action is irreversible.</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => {
              setMessages([]);
              toast.dismiss(); // Close the Toast on confirmation
            }}
            className="bg-red-800 text-white py-2 px-6 rounded-md hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()} // Close without deleting
            className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-500"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "bottom-center", // Positioning the toast below the clear chat button
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        pauseOnHover: true,
        toastId: "confirm-clear-chat",
        icon: "⚠️", // Showing a custom icon
        className: "bg-red-600 text-white p-4 rounded-md max-w-md w-full shadow-xl",
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#1a1a1a] text-[#f0f0f0] min-h-screen flex flex-col">
      <ToastContainer
        position="bottom-center" // Ensures the toast is positioned at the bottom-center
        style={{ marginBottom: "80px" }} // Adds extra margin to make space for the buttons
      />

      {/* Chat Header */}
      <h1 className="text-center text-2xl font-bold mb-4">Chat with AI</h1>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto bg-[#2a2a2a] p-4 rounded-md">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 ${msg.type === "user" ? "text-right" : "text-left"}`}
          >
            <p
              className={`inline-block p-2 rounded-md ${
                msg.type === "user"
                  ? "bg-[#3b82f6] text-[#ffffff]"
                  : "bg-[#444444] text-[#f0f0f0]"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        {loading && <p className="text-center">AI is typing...</p>}
      </div>

      {/* Image Display */}
      {imageUrl && (
        <div className="my-4">
          <h3 className="text-center text-xl font-semibold">Generated Image:</h3>
          <img src={imageUrl} alt="Generated" className="mx-auto mt-4 rounded-md" />
        </div>
      )}

      {/* Input Area */}
      <div className="mt-4 flex items-center gap-2">
        {/* Text Input */}
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 bg-[#333333] text-[#f0f0f0] rounded-md border-none outline-none"
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="p-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-md"
        >
          <AiOutlineSend size={24} />
        </button>

        {/* Image Upload */}
        <button className="p-2 bg-[#444444] hover:bg-[#555555] rounded-md">
          <FiImage size={24} className="text-gray-200" />
        </button>

        {/* Microphone for Voice Input */}
        <button
          onClick={handleVoiceInput}
          className={`p-2 ${
            isListening ? "bg-[#ef4444]" : "bg-[#444444] hover:bg-[#555555]"
          } rounded-md`}
        >
          <FaMicrophone size={24} className="text-gray-200" />
        </button>

        {/* Clear Chat */}
        <button
          onClick={handleClearChat}
          className="p-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-md"
        >
          <AiOutlineClear size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatWithAI;
