import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";

import Hero from "./components/Hero";
import TravelPreferencesForm from "./components/TravelPreferencesForm";
import TripPlanDisplay from "./components/TripPlanDisplay";

import Chat from "./components/Chat";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>

        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/travel-preferences" element={<TravelPreferencesForm />} />
        <Route path="/trip-display/:tripId" element={<TripPlanDisplay />} />
        <Route path="/chat" element={<Chat />} />
        
      </Routes>
    </>
  );
};

export default App;
