// export default TripPlanDisplay;
import React, { useEffect, useState, useContext } from "react";
import axios from "axios"; 
import { PlanContext } from "../components/TripContext"; 
import { useParams, useNavigate } from "react-router-dom"; 

const TripPlanDisplay = () => {
  const { tripId } = useParams(); 
  const { tripPlan, setTripPlan } = useContext(PlanContext); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        navigate("/login");
        return;
      }
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/tripplan/${tripId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { trip } = response.data;

        setTripPlan({
          generatedPlan: trip.generatedPlan,
          tripDetails: {
            location: trip.destination,
            duration: trip.days + " days",
            travelers: trip.travelGroup,
            budget: trip.budget,
          },
        });
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, setTripPlan, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tripPlan) {
    return <p className="text-center text-gray-500">No trip data available.</p>;
  }

  const { tripDetails, generatedPlan } = tripPlan;
  const { hotelOptions, itinerary } = generatedPlan || {};

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Trip Details */}
      <section className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-2">Trip Details ✈️</h2>
        <p><strong>Location:</strong> {tripDetails?.location}</p>
        <p><strong>Duration:</strong> {tripDetails?.duration}</p>
        <p><strong>Travelers:</strong> {tripDetails?.travelers}</p>
        <p><strong>Budget:</strong> {tripDetails?.budget}</p>
      </section>

      {/* Hotel Options */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Hotel Options 🏨</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotelOptions?.map((hotel, index) => (
            <a
              key={index}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block transform transition duration-300 hover:scale-105"
            >
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={hotel.hotelImageUrl}
                  alt={hotel.hotelName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{hotel.hotelName}</h3>
                  <p className="text-gray-600">{hotel.hotelAddress}</p>
                  <p className="text-blue-500 font-semibold">{hotel.price}</p>
                  <p className="text-sm mt-2">{hotel.description}</p>
                  <p className="text-yellow-500 mt-1">⭐ {hotel.rating}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Itinerary */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Itinerary 📅</h2>
        {itinerary &&
          Object.keys(itinerary).map((day) => {
            const { theme, bestTimeToVisit, plan } = itinerary[day];
            return (
              <div key={day} className="bg-gray-50 p-4 rounded-lg mb-10">
                <h3 className="text-xl font-semibold mb-2">Day: {day}</h3>
                <p><strong>Theme:</strong> {theme}</p>
                <p><strong>Best Time to Visit:</strong> {bestTimeToVisit}</p>
                <div className="mt-6 space-y-6">
                  {plan?.map((place, index) => (
                    <a
                      key={index}
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        place.placeName + " " + tripDetails?.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="bg-white shadow-md rounded-lg p-4 flex items-center transition-transform transform hover:scale-105">
                        <img
                          src={place.placeImageUrl}
                          alt={place.placeName}
                          className="w-24 h-24 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <h4 className="text-lg font-semibold">
                            {place.placeName}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {place.placeDetails}
                          </p>
                          <p className="text-blue-500 font-semibold">
                            {place.ticketPricing}
                          </p>
                          <p className="text-yellow-500">⭐ {place.rating}</p>
                          <p className="text-sm text-gray-500">
                            Travel Time: {place.timeTravel}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
};

export default TripPlanDisplay;

