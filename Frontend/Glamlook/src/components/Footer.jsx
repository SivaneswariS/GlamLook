import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      className="bg-fuchsia-900 text-white py-8 text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <p className="mb-4 text-sm">
        © 2025 <span className="font-semibold text-yellow-300">GlamLook</span>. All rights reserved.
      </p>
      <div className="flex justify-center gap-6 text-lg">
        <motion.a
          href="#"
          className="hover:text-yellow-300 transition"
          whileHover={{ scale: 1.2 }}
        >
          <FaFacebookF />
        </motion.a>
        <motion.a
          href="#"
          className="hover:text-yellow-300 transition"
          whileHover={{ scale: 1.2 }}
        >
          <FaInstagram />
        </motion.a>
        <motion.a
          href="#"
          className="hover:text-yellow-300 transition"
          whileHover={{ scale: 1.2 }}
        >
          <FaTwitter />
        </motion.a>
      </div>
    </motion.footer>
  );
};

export default Footer;

