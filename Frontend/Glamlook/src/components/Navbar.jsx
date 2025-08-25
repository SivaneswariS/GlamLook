import React, { useState } from "react";
import {
  FaCartArrowDown,
  FaStore,
  FaSignInAlt,
  FaUserPlus,
  FaClipboardList,
  FaSignOutAlt,
  FaUserAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-fuchsia-800 text-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to={"/"}>
          <h1 className="font-extrabold text-2xl tracking-wide">
            Glam<span className="text-yellow-300">Look</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center font-medium">
          <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition">
            <FaStore />
            <Link to="/products">Products</Link>
          </li>

          {token && (
            <>
              <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition">
                <FaCartArrowDown />
                <Link to="/cart">Cart</Link>
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition">
                <FaClipboardList />
                <Link to="/myorders">My Orders</Link>
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition">
                <FaUserAlt />
                <Link to="/profile">Profile</Link>
              </li>
              <li
                className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </li>
            </>
          )}

          {!token && (
            <>
              <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition">
                <FaSignInAlt />
                <Link to="/login">Login</Link>
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition">
                <FaUserPlus />
                <Link to="/signup">SignUp</Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-fuchsia-900 text-white px-6 py-4 space-y-4">
          <Link to="/products" className="block hover:text-yellow-300">
            <FaStore className="inline mr-2" /> Products
          </Link>
          {token ? (
            <>
              <Link to="/cart" className="block hover:text-yellow-300">
                <FaCartArrowDown className="inline mr-2" /> Cart
              </Link>
              <Link to="/myorders" className="block hover:text-yellow-300">
                <FaClipboardList className="inline mr-2" /> My Orders
              </Link>
              <Link to="/profile" className="block hover:text-yellow-300">
                <FaUserAlt className="inline mr-2" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block hover:text-yellow-300"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-yellow-300">
                <FaSignInAlt className="inline mr-2" /> Login
              </Link>
              <Link to="/signup" className="block hover:text-yellow-300">
                <FaUserPlus className="inline mr-2" /> SignUp
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;

