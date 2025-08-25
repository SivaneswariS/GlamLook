import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  // Function to scroll to categories section
  const scrollToCategories = () => {
    const element = document.getElementById("categories");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-fuchsia-700 via-pink-600 to-rose-500 text-white h-[80vh] flex flex-col items-center justify-center text-center px-6">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold mb-4">
          Where Elegance <span className="text-yellow-300">Meets You</span>
        </h1>
        <p className="text-lg mb-6">
          Step into timeless fashion crafted for every occasion.  
          Premium outfits & accessories, without the premium price. ✨
        </p>

        {/* Luxurious Gold Gradient Button */}
        <button
          onClick={scrollToCategories}
          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black px-8 py-3 rounded-2xl font-bold shadow-xl transition-transform transform hover:scale-105"
        >
          Explore Elegance
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
