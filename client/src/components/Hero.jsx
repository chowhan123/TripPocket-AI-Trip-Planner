// export default Hero;
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GlobeAltIcon, PaperAirplaneIcon, MapIcon } from "@heroicons/react/24/solid";

const Hero = () => {
  return (
    <section
      className="relative flex items-center justify-center min-h-[90vh] text-center bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
      }}
     >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 px-6 py-16 text-white max-w-2xl"
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <GlobeAltIcon className="w-8 h-8 text-yellow-400" />
          <PaperAirplaneIcon className="w-8 h-8 text-pink-400" />
          <MapIcon className="w-8 h-8 text-green-400" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold md:text-5xl"
        >
          Explore the World with AI Travel Planner
        </motion.h1> 
       

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-xl md:text-2xl font-medium"
        >
          Your perfect trip, customized in seconds.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 text-gray-200"
        >
          Plan smarter with AI. Whether it's the Alps or New York – we've got your itinerary covered.
        </motion.p>

        <Link to="/travel-preferences">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 mt-6 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Get Started, It's Free
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
