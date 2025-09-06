require("dotenv").config(); // ✅ Load first
const mongoose = require("mongoose");
const tripModel = require("../models/trip.model");
const userModel = require("../models/user.model");
const { chatSession } = require("../utils/AIModal"); // your AI integration
const { AI_PROMPT } = require("../utils/options");

const { fetchPlacePhoto } = require("../utils/fetchPlacePhoto"); // Helper for fetching real images

module.exports.createTrip = async (req, res) => {
  try {
    // Get trip info from request body
    const { destination, days, budget, travelGroup } = req.body;
    const userId = req.user._id; // User info from JWT middleware

    if (!destination || !days || !budget || !travelGroup) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (parseInt(days, 10) > 7) {
      return res.status(400).json({
        sucess: false,
        message: "Trip duration exceeds maximum limit of 7 days",
      });
    }

    // Generate AI Response
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", destination)
      .replace("{totalDays}", days)
      .replace("{traveler}", travelGroup)
      .replace("{budget}", budget)
     // .replace("{totaldays}", days);
    // 🔮 Get response from AI chatbot
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const aiResponse = JSON.parse(result?.response?.text());

    // 🛠️ Fetch real images for each place inside AI response
    if (aiResponse?.itinerary) {
      const days = Object.keys(aiResponse.itinerary);

      for (const day of days) {
        const dayPlan = aiResponse.itinerary[day].plan;

        for (const place of dayPlan) {
          if (
            !place.placeImageUrl ||
            place.placeImageUrl.includes("dummy") ||
            place.placeImageUrl.includes("example.com")
          ) {
            const realImageUrl = await fetchPlacePhoto(place.placeName);
            if (realImageUrl) {
              place.placeImageUrl = realImageUrl;
            }
          }
        }
      }
    }

    // 🛠️ Fetch real hotel images similarly
    if (aiResponse?.hotelOptions) {
      for (const hotel of aiResponse.hotelOptions) {
        if (
          !hotel.hotelImageUrl || hotel.hotelImageUrl.includes("dummy") 
          || hotel.hotelImageUrl.includes("example.com")
        ) {
          const realHotelImageUrl = await fetchPlacePhoto(hotel.hotelName);
          if (realHotelImageUrl) {
            hotel.hotelImageUrl = realHotelImageUrl;
          }
        }
      }
    }

    // Save trip to database
    const trip = await tripModel.create({
      userId,
      destination,
      days,
      budget,
      travelGroup,
      generatedPlan: aiResponse,
    });

    // 📌 Add the trip ID to the user’s trip list
    await userModel.findByIdAndUpdate(userId, { $push: { trips: trip._id } });

    // 🔁 Redirect to the trip detail endpoint
    return res.redirect(`/api/tripplan/${trip._id}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Failed to generate trip", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Get Trip Controller
module.exports.getTrip = async (req, res) => {
  try {
    let { tripId } = req.params;
    const userId = req.user._id;

    // 🧹 Sometimes tripId may come as `:id`, clean it
    tripId = tripId.replace(":", "");

    // 🧾 Validate the trip ID format
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ 
        sucess: false,
        message: "Invalid trip ID" 
      });
    }

    // 🔎 Find the trip
    const trip = await tripModel.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // 🔒 Make sure the trip belongs to the logged-in user
    if (trip.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        sucess: false,
        message: "You are not authorized to view this trip",
        error: "Unauthorized access",
      });
    }

    // ✅ Return the trip
    return res.status(200).json({ 
      trip,
      sucess: true,
      message: "Trip details fetched sucessfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      succcess: false,
      message: "Failed to fetch trip details" ,
      error: message.error,
    });
  }
};
