// import React, { useState, useEffect } from "react"; 
// import io from "socket.io-client"; 

// const socket = io("http://localhost:5000", {
//   auth: { token: localStorage.getItem("token") },
// });

// const Chat = () => {
//   const [messages, setMessages] = useState([]); 
//   const [newMessage, setNewMessage] = useState(""); 
//   const [isConnected, setIsConnected] = useState(false);
//   const [typing, setTyping] = useState(false);

//   useEffect(() => {
//     socket.on("chat message", (message) => {
//       setTyping(false);
//       setMessages((prev) => [...prev, message]);
//     });

//     socket.on("typing", () => setTyping(true));

//     socket.on("connect", () => {
//       setIsConnected(true);
//       console.log("✅ Connected to server");
//     });

//     socket.on("disconnect", () => {
//       setIsConnected(false);
//       console.log("❌ Disconnected from server");
//     });

//     return () => {
//       socket.off("chat message"); 
//       socket.off("connect");
//       socket.off("disconnect"); // Remove all listeners to prevent memory leaks
//       socket.off("typing");
//     };
//   }, []); 

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       socket.emit("chat message", newMessage);
//       setNewMessage("");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSendMessage();
//   };

//   const renderMessage = (msg, i) => {
//     const isUser = msg.sender === "You";

//     if (msg.type === "structured" && typeof msg.content === "object") {
//       const { text, image, link } = msg.content;

//       return (
//         <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
//           <div
//             className={`p-3 rounded-xl max-w-[75%] space-y-2 shadow-lg ${
//               isUser ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-gray-200"
//             }`}
//           >
//             {text.split("\n").map((line, index) => (
//               <p key={index}>{line}</p>
//             ))}


//             {image && (
//               <a href={link || image} target="_blank" rel="noopener noreferrer">
//                 <img
//                   src={image}
//                   alt="Location preview"
//                   className="rounded-lg max-w-full h-auto shadow-md"
//                 />
//               </a>
//             )}
//             {link && (
//               <a
//                 href={link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline block mt-1"
//               >
//                 View More →
//               </a>
//             )}
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
//         <div
//           className={`p-2 rounded-xl max-w-[75%] ${
//             isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//           }`}
//         >
//           <strong>{msg.sender}: </strong> {msg.content || msg.text}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col justify-between h-full bg-white rounded-xl shadow-md p-4 max-w-2xl mx-auto">
//       <div className="flex-1 overflow-auto space-y-4 mb-4">
//         {messages.map((msg, i) => renderMessage(msg, i))}
//         {typing && (
//           <div className="text-gray-400 text-sm italic animate-pulse">AI is typing...</div>
//         )}
//       </div>

//       <div className="flex items-center space-x-4">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={handleKeyPress}
//           placeholder="Ask your travel query..."
//           className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg" >
//           Send
//         </button>
//       </div>

//       <div className="text-center text-sm text-gray-500 mt-2"> 
//         {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
//       </div>
//     </div>
//   );
// };

// export default Chat;
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send } from "lucide-react";

const intentButtons = [
  { label: "🔁 Reset Password", message: "How can I reset my password?" },
  { label: "✈ Book Flight", message: "Help me book a flight to Paris." },
  { label: "☀ Weather in New York", message: "What's the weather in New York?" },
  { label: "🏨 Hotel in Tokyo", message: "Help me book a flight to Paris." },
  { label: "🌧 Forecast Berlin", message: "Will it rain tomorrow in Berlin?" },
  { label: "💱 Exchange USD to EUR", message: "What's the exchange rate for USD to EUR?" },
  { label: "🏙 Top spots in Sydney", message: "What are the top tourist spots in Sydney?" },
  { label: "🚗 Rent Car in Rome", message: "I need a rental car in Rome." },
  { label: "🐛 App Crash", message: "The app keeps crashing on my phone." },
  { label: "🌙 Dark Mode", message: "Can you add a dark mode feature?" },
];

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const chatEndRef = useRef(null);

  // Scroll to bottom on message update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      let speechTimeout;

      recognition.onstart = () => {
        setListening(true);
        speechTimeout = setTimeout(() => {
          recognition.stop();
        }, 4000);
      };

      recognition.onspeechend = () => {
        clearTimeout(speechTimeout);
        recognition.stop();
      };

      recognition.onend = () => {
        setListening(false);
        clearTimeout(speechTimeout);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setSpeaking(false);
    }
  };

  const speakText = (text) => {
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      startListening();
    };

    synthRef.current.speak(utterance);
  };

  const handleSend = async (customMsg) => {
    const messageToSend = customMsg || input;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/tripplan/chat", {
        message: messageToSend,
      });

      const botReply = res.data.reply;
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      speakText(botReply);
    } catch {
      const errMsg = "Server error occurred.";
      setMessages((prev) => [...prev, { from: "bot", text: errMsg }]);
      speakText(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-15  p-4">
      <div className="w-full max-w-2xl  rounded-lg shadow-lg p-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-blue-700">🧭 AI Trip Planner</h1>

        {/* Chat Display */}
        <div className="h-80 overflow-y-auto  rounded-lg p-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 max-w-xs text-sm ${
                msg.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Intent Buttons */}
        <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
          {intentButtons.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleSend(btn.message)}
              className="text-xs  border hover:bg-gray-100  rounded shadow-sm"
            > 

<p className="hidden sm:inline">{btn.label}</p>
<p className="inline sm:hidden">{btn.label.trim()[0]}</p>
            
            </button>
          ))}
        </div>

        {/* Input + Controls */}
        <div className="flex items-center gap-2">
          <input
           onKeyUp={(e) => {
            if (e.key =="Enter") {
              console.log(e.key)
              handleSend();
            }
          }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm"
            placeholder="Ask a travel question..."
          />
          <button
            onClick={() => handleSend()}
           
            className="md:bg-blue-600 md:hover:bg-blue-700 text-white md:px-4 md:py-2 rounded-lg"
          >
            <Send className="hidden sm:inline"/>
            <span className="className="hidden sm:inline >Send</span>

          </button>
          <button
            onClick={startListening}
            className={`text-white md:px-3 md:py-2 rounded-lg ${
              listening ? "bg-red-500" : "bg-green-600"
            }`}
            title="Start Listening"
          >
            🎤
          </button>
          <button
            onClick={stopSpeaking}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg"
            title="Stop Speaking"
          >
            🛑
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;