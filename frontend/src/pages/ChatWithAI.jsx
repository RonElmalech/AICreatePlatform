import React, { useState } from "react";
import { AiOutlineSend, AiOutlineClear } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatWithAI = () => {
  const [messages, setMessages] = useState([]); // Chat history
  const [input, setInput] = useState(""); // User input
  const [loading, setLoading] = useState(false); // Loading state for AI response
  const [isListening, setIsListening] = useState(false); // Speech-to-text state
  const [recognition, setRecognition] = useState(null); // Store speech recognition instance
  const [imageUrl, setImageUrl] = useState(""); // To store the generated image URL
  const [isRecognitionInProgress, setIsRecognitionInProgress] = useState(false); // Prevent multiple starts

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setImageUrl(""); // Reset image when new message is sent

    try {
      const res = await fetch("/api/v1/dalle/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      console.log(data);

      const aiMessage = { type: "ai", text: data };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      toast.error("Error generating response.");
    }
    setLoading(false);
    setInput("");
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    // Prevent starting recognition if already in progress
    if (isRecognitionInProgress) return;

    setIsRecognitionInProgress(true);

    // If recognition is already in progress, stop it
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setIsRecognitionInProgress(false);
      return;
    }

    const newRecognition = new window.webkitSpeechRecognition();
    newRecognition.continuous = false;
    newRecognition.lang = "en-US"; // Set to "en-US", but can auto-detect via backend if needed

    newRecognition.onstart = () => {
      setIsListening(true);
    };

    newRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prevInput) => prevInput + " " + transcript); // Merge speech with existing input
    };

    newRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
      setIsRecognitionInProgress(false);
      // Single toast for speech issues
      toast.error("No speech detected. Please try again.");
    };

    newRecognition.onend = () => {
      setIsListening(false);
      setIsRecognitionInProgress(false);
      if (!input.trim()) {
        toast.error("No speech detected. Please try again."); // Single error toast for all speech issues
      }
    };

    // Start speech recognition
    newRecognition.start();
    setRecognition(newRecognition); // Save the recognition instance to manage it
  };

  const handleClearChat = () => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete all messages?</p>
        <div className="flex justify-between mt-3">
          <button
            onClick={() => {
              setMessages([]); // Clear messages
              toast.dismiss(); // Close the toast after confirming
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()} // Close toast if "No" is clicked
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "bottom-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: "custom-toast p-4 rounded-md bg-gray-800 text-white",
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#1a1a1a] text-[#f0f0f0] min-h-screen flex flex-col">
      <ToastContainer position="bottom-center" />
      <h1 className="text-center text-2xl font-bold mb-4">Chat with AI</h1>

      <div className="flex-1 overflow-y-auto bg-[#2a2a2a] p-4 rounded-md">
        {messages.map((msg, i) => (
          <div key={i} className={`my-2 ${msg.type === "user" ? "text-right" : "text-left"}`}>
            <p
              className={`inline-block p-2 rounded-md ${
                msg.type === "user" ? "bg-[#3b82f6] text-[#ffffff]" : "bg-[#444444] text-[#f0f0f0]"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        {loading && <p className="text-center">AI is typing...</p>}
      </div>

      {imageUrl && (
        <div className="my-4">
          <h3 className="text-center text-xl font-semibold">Generated Image:</h3>
          <img src={imageUrl} alt="Generated" className="mx-auto mt-4 rounded-md" />
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 bg-[#333333] text-[#f0f0f0] rounded-md"
        />
        <button onClick={handleSendMessage} className="p-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-md">
          <AiOutlineSend size={24} />
        </button>
        <button onClick={handleVoiceInput} className={`p-2 ${isListening ? "bg-[#ef4444]" : "bg-[#444444]"}`}>
          {isListening ? <FaMicrophoneAltSlash size={24} /> : <FaMicrophone size={24} />}
        </button>
        <button onClick={handleClearChat} className="p-2 bg-[#ef4444] text-white rounded-md">
          <AiOutlineClear size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatWithAI;
