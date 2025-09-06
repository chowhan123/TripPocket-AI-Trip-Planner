const mongoose = require("mongoose");
const app = require("./src/app");
require("dotenv").config(); 

const http = require("http"); // Create an HTTP server
const server = http.createServer(app); // Pass the Express app to the HTTP server

const socketIo = require("socket.io"); // Import Socket.IO
const jwt = require("jsonwebtoken"); // Import JWT for authentication
const { OpenAI } = require("openai"); // Import OpenAI SDK

// MongoDB Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not defined in .env");
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ Could not connect to MongoDB:", err.message);
    process.exit(1);
  }
};
connectDB();

// Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// JWT Auth Middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1]; 
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const decoded = jwt.verify(token, process.env.JWT_TOKEN); 
      socket.user = decoded;
      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      next(new Error("Authentication error"));
    }
  });

// OpenRouter OpenAI Setup
// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:5173/",
//     "X-Title": "Travel Chat App",
//   },
// });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI key here
});

// Socket Chat Logic
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.user?.name || "Unknown User");
  socket.on("chat message", async (msg) => {
    socket.emit("chat message", {
      sender: "You",
      type: "text",
      content: msg,
    });
    
    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [        
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Give me 3 tourist places in Jaipur with emojis, JSON only." },
          { role: "user", content: msg },
        ],
      });
      
      const rawContent = aiResponse.choices?.[0]?.message?.content || "";
      let json = {};
      try {
        json = JSON.parse(rawContent);
      } catch (e) {
        json = { text: rawContent, image: null, link: null };
      }
      
      socket.emit("chat message", {
        sender: "AI", 
        type: "structured", 
        content: json,
      });
    } catch (err) {
      socket.emit("chat message", {
        sender: "AI",
        type: "text",
        content: "AI Assistant: Sorry, I couldn't process your request.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❎ User disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
