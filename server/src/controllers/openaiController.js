// const { OpenAI } = require("openai");
// require("dotenv").config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:5173/",
//     "X-Title": "Trip Planner Chat",
//   },
// });

// const handleChat = async (req, res) => {
//   const { message } = req.body;

//   // Validate input
//   if (!message || typeof message !== "string" || message.trim() === "") {
//     return res.status(400).json({ error: "Please provide a valid location" });
//   }

//   try {
//     const response = await openai.chat.completions.create({
//       model: "mistralai/mistral-7b-instruct",
//       max_tokens: 300,
//       messages: [
//         {
//           role: "system",
//           content: `You are a travel assistant. For the given location, provide exactly 3 short recommendations, each one sentence long and ending with an emoji. Return the response in JSON format: {"recommendations": ["sentence 1", "sentence 2", "sentence 3"]}. Do not use markdown, HTML, or extra text outside the JSON structure.`,
//         },
//         { role: "user", content: `Provide recommendations for ${message}` },
//       ],
//     });

//     const aiMessage = response.choices?.[0]?.message?.content;

//     // Parse response as JSON
//     let parsedResponse;
//     try {
//       parsedResponse = JSON.parse(aiMessage);
//       if (!parsedResponse.recommendations || !Array.isArray(parsedResponse.recommendations) || parsedResponse.recommendations.length !== 5) {
//         throw new Error("Invalid response format: Expected 5 recommendations");
//       }
//     } catch (jsonErr) {
//       console.warn("Failed to parse AI response as JSON:", jsonErr.message, "Raw response:", aiMessage);
//       return res.status(500).json({
//         error: "Invalid response from AI. Please try again.",
//         rawResponse: aiMessage, // For debugging
//       });
//     }

//     return res.json({ response: parsedResponse });
//   } catch (error) {
//     console.error("AI Error:", {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//     });
//     return res.status(500).json({
//       error: error.response?.data?.error?.message || "Failed to fetch recommendations. Please try again.",
//     });
//   }
// };

// module.exports = { handleChat };

const { OpenAI } = require("openai");
require("dotenv").config();

// ✅ Initialize OpenAI with official API key (no custom baseURL or headers)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handleChat = async (req, res) => {
  const { message } = req.body;

  // Input validation
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Please provide a valid location" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if needed
      max_tokens: 300,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Give me 3 tourist places in Jaipur with emojis, JSON only." },
      ],
    });

    const aiMessage = response.choices?.[0]?.message?.content;

    // Parse and validate JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiMessage);
      if (
        !parsedResponse.recommendations ||
        !Array.isArray(parsedResponse.recommendations) ||
        parsedResponse.recommendations.length !== 3
      ) {
        throw new Error("Invalid response format: Expected 3 recommendations");
      }
    } catch (jsonErr) {
      console.warn("❌ Failed to parse AI response as JSON:", jsonErr.message, "\nRaw response:", aiMessage);
      return res.status(500).json({
        error: "Invalid response from AI. Please try again.",
        rawResponse: aiMessage, // optional: for debugging
      });
    }

    return res.json({ response: parsedResponse });
  } catch (error) {
    console.error("❌ AI Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        "Failed to fetch recommendations. Please try again.",
    });
  }
};

module.exports = { handleChat };
