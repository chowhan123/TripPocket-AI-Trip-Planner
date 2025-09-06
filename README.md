# 🌍 TripPocket – AI-Powered Travel Planner

**TripPocket** is a modern **AI-driven travel planning platform** that helps users generate personalized itineraries, discover destinations, and explore hotels with real-time assistance.
It integrates OpenAI, Gemini AI, and Google Maps API to deliver AI-enhanced, interactive, and visually rich travel recommendations.


## 🎯 Objectives & Scope

**Objectives:**
- Provide an AI-powered real-time travel assistant
- Generate personalized itineraries based on budget, duration, and preferences
- Show places, hotels, and attractions with live previews
- Enable chat-based trip planning with dynamic AI conversations

**Scope:**
- End-to-end full-stack development (React + Node + MongoDB)
- Secure authentication and session management
- Real-time Socket.IO chat integration
- Google Maps & Places API for location rendering and hotel previews
- Clean, responsive UI with Tailwind CSS

## ✨ Key Features
- 🤖 AI-Powered Planning – Uses OpenAI GPT-3.5 to generate personalized itineraries
- ⚡ Real-Time Chat – Integrated Gemini AI + Socket.IO for conversational trip planning
- 🗺️ Interactive Maps – Google Maps API for destination previews & navigation links
- 🏨 Hotel & Attraction Previews – Contextual cards with images, ratings, and links
- 🔐 Secure User Management – JWT authentication with role-based access
- 🛠 RESTful APIs – Modular and scalable backend with Express.js & MongoDB

## 🛠 Tech Stack
- **Frontend**: React, TailwindCSS, Socket.IO
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: OpenAI API, Google Places API
- **Others**: JWT Auth, Axios, Vite

## ⚙️ Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trippocket.git
cd trippocket
```

2.Install dependencies:
```bash
npm install
cd client && npm install
```

3. Create .env file:
```bash
OPENAI_API_KEY=xxxx
GEMINI_API_KEY=xxxx
GOOGLE_API_KEY=xxxx
MONGO_URI=your_mongodb_connection
JWT_SECRET=xxxx
```

4. Start development server:
```bash
npm run dev
```

## 📊 What I Learned & Built
- ✅ AI Integration – how to combine OpenAI + Google Places for contextual suggestions
- ⚡ Real-time Communication – Socket.IO event handling for live AI chat
- 🏗 Backend Scalability – building modular Express.js APIs with MongoDB
- 🎨 Frontend Design – responsive UI using Tailwind with interactive components
- 🌐 API Orchestration – enriching AI results with external APIs for richer responses

## 💡 Challenges Faced
- Challenge	Solution
- AI responses lacked real-world context	Enriched output with Google Places API for real places, ratings & maps
- Handling large queries in chat	Implemented streaming responses for smoother UX
- Latency in conversational planning	Optimized Socket.IO with event throttling
- API key security	Used .env, backend proxy & gitignore to hide secrets
  
## 💬 FAQs & Interview Questions
Q: How did you integrate AI into the project?
- Combined OpenAI GPT-3.5 for natural language and Google Places API for real-world details. AI generates suggestions, backend enriches them with actual places, then returns structured results.

Q: Why use Socket.IO instead of simple API calls?
- To enable real-time, conversational trip planning where users interact with AI continuously like a chatbot.

Q: Why MongoDB?
- For flexible storage of user preferences, itineraries, and chat history in a JSON-like schema.

Q: What’s unique about TripPocket?
- It’s not just an AI chatbot; it integrates real-world travel data with AI-driven personalization.

## 🙋‍♂️ Contact Details

**Santhosh Korra**  
📧 **Email**: santhoshnaik6929@gmail.com  
🌐 **LinkedIn**: [linkedin.com/in/santhosh-chauhan](https://www.linkedin.com/in/santhosh-chauhan/)


## 🤝 Collaboration & Connect

I'm always open to:

- 🌱 Contributing to open-source
- ✏️ Learning from mentors
- 💼 Internships & collaborations
- 🚀 Building real-world full-stack products

Feel free to connect with me on LinkedIn!
