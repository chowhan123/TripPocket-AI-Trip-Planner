// 👤 Traveler options to show in UI (for selection)
export const SelectTravelsList = [
  {
    id: 1,
    label: "Just Me",
    value: "just_me",
    description: "A sole traveler in exploration",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    label: "A Couple",
    value: "couple",
    description: "Two travelers in tandem",
    icon: "🥂",
    people: "2",
  },
  {
    id: 3,
    label: "Friends",
    value: "friends",
    description: "A bunch of thrill-seekers",
    icon: "⛵",
    people: "3 to 5 People",
  },

  {
    id: 4,
    label: "Family",
    value: "family",
    description: "A group of fun-loving adventurers",
    icon: "🏠",
    people: "4 to 5 People",
  },
];

// 💸 Budget preference options to show in UI (for selection)
export const SelectBudgetOptions = [
  {
    id: 1,
    label: "Cheap",
    value: "cheap",
    description: "Stay conscious of costs",
    icon: "💵",
  },
  {
    id: 2,
    label: "Moderate",
    value: "moderate",
    description: "Keep costs on the average side",
    icon: "💰",
  },
  {
    id: 3,
    label: "Luxury",
    value: "luxury",
    description: "Don't worry about costs",
    icon: "🤑",
  },
];

// 🤖 Prompt string to be sent to the AI model (Gemini/GPT)
export const AI_PROMPT =
  "Generate Travel Plan for Location:{location} , for {totalDays} Days for {traveler} with a {budget} budget ,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for {totaldays} days with each day plan with best time to visit in JSON format.";
