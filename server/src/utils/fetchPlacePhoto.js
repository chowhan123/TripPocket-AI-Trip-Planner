const axios = require("axios");

const FALLBACK_IMAGE_URL = "https://via.placeholder.com/400x300?text=No+Image"; // 🛠️ You can replace this with any custom fallback URL

// Exported async function that fetches a place photo using Google Places API
module.exports.fetchPlacePhoto = async function (placeName) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_API_KEY is missing");
      return FALLBACK_IMAGE_URL;
    }

    console.log("Fetching photo for:", placeName);

    // Step 1: Search for place using text input
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      placeName
    )}&inputtype=textquery&fields=photos&key=${apiKey}`;

    // Call Google Places API to get candidate places and photo references
    const searchResponse = await axios.get(searchUrl);
    console.log("Google API Response:", searchResponse.data);

    const candidate = searchResponse.data.candidates?.[0];  // Get the first candidate
    const photoReference = candidate?.photos?.[0]?.photo_reference; // Get the photo reference

    // Step 2: If photo reference exists, fetch the actual image URL
    if (photoReference) {
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

      // The image is returned as a redirect (302), so we extract the final URL from headers
      const photoResponse = await axios.get(photoUrl, {
        maxRedirects: 0,
        validateStatus: null,
      });

      console.log("Photo Response Headers:", photoResponse.headers);

      const finalImageUrl = photoResponse.headers.location;
      return finalImageUrl || FALLBACK_IMAGE_URL; // 🛠️ fallback if no image found
    } else {
      console.warn(`No photo found for: ${placeName}`);
      return FALLBACK_IMAGE_URL;  // If no photo is found
    }
  } catch (error) {
    console.error("Error fetching place photo:", error.message);
    return FALLBACK_IMAGE_URL;  // On error, use fallback image
  }
};
