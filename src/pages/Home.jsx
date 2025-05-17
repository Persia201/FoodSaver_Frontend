import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaUsers, FaUtensils } from 'react-icons/fa';

function Home() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 z-0 overflow-y-auto py-10">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-green-700 mb-6 drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to <span className="text-yellow-500">FoodSaver</span>
      </motion.h1>

      <motion.p
        className="text-base md:text-xl text-gray-700 max-w-2xl mb-10 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.2 }}
      >
        Join your community in reducing food waste by sharing surplus food and helping those in need. 
        You can donate, browse, and connect — all in one place.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-6 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <Link
          to="/browse"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:scale-105"
        >
          Browse Food
        </Link>
        <Link
          to="/donate"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:scale-105"
        >
          Donate Food
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
          <FaLeaf className="text-green-600 text-4xl mb-4 mx-auto" />
          <h3 className="text-lg font-bold mb-2">Eco-Friendly</h3>
          <p className="text-sm text-gray-600">Reduce food waste and protect the environment by sharing surplus food locally.</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
          <FaUsers className="text-yellow-500 text-4xl mb-4 mx-auto" />
          <h3 className="text-lg font-bold mb-2">Community First</h3>
          <p className="text-sm text-gray-600">Connect with neighbors and help families in need by donating or claiming food.</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
          <FaUtensils className="text-red-400 text-4xl mb-4 mx-auto" />
          <h3 className="text-lg font-bold mb-2">Easy to Use</h3>
          <p className="text-sm text-gray-600">User-friendly design for quick food posting, browsing, and pickup coordination.</p>
        </div>
      </motion.div>

      <motion.div
        className="text-sm text-gray-600 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.5 }}
      >
        Empowering communities. Reducing waste. Sharing with purpose.
      </motion.div>
    </div>
  );
}

export default Home;