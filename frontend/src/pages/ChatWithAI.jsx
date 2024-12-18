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
  const [imageUrl, setImageUrl] = useState(""); // To store the generated image URL

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setImageUrl(""); // Reset image when new message is sent

    try {
        // Fetch text response (AI generated text)
        const res = await fetch("/api/v1/dalle/generate-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: input }),
        });
        const data = await res.json();

        const aiMessage = { type: "ai", text: data.result };  // Save AI text result
        setMessages((prev) => [...prev, aiMessage]);

        // No image generation here since you have a separate page for that

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
      handleSendMessage(); // Automatically send the message after voice input
    };

    recognition.start();
  };

  const handleClearChat = () => {
    toast.warn("Are you sure you want to delete all messages?", {
      position: "bottom-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });
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
