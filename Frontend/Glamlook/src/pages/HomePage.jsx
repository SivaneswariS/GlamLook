import React from "react";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Leaf } from "lucide-react"; // ✅ icons

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Browse by Category */}
      <section
        id="categories"
        className="py-16 px-6 bg-gradient-to-r from-pink-50 via-rose-50 to-fuchsia-50"
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Shop by <span className="text-fuchsia-700">Category</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { label: "Dresses", value: "Dress" },
            { label: "Footwear", value: "Footwear" },
            { label: "Accessories", value: "Accessory" },
          ].map((cat) => (
            <Link key={cat.value} to={`/products?category=${cat.value}`}>
              <motion.div
                className="bg-white p-6 rounded-2xl text-center shadow-md cursor-pointer hover:shadow-xl hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-pink-500 hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="font-semibold text-lg">{cat.label}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>


{/* Featured Collection */}
<section className="py-16 px-6 bg-gray-50">
  <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
    Featured <span className="text-fuchsia-700">Collection</span>
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {[
      {
        _id: "68ac850e4cf398548d6eb7fe",
        name: "Frock",
        desc: "Elegant choice for parties",
        image: "images/dresses/pink.jpg",
      },
      {
        _id: "68aca9f36a85cb3ce1fd544e",
        name: "Party Heels",
        desc: "Perfect match for festive outfits",
        image: "images/footwear/party.jpg",
      },
      {
        _id: "68aca9d06a85cb3ce1fd544c",
        name: "Sling Bag",
        desc: "Chic accessory for every look",
        image: "images/accessories/bag.jpg",
      },
    ].map((item) => (
      <motion.div
        key={item._id}
        whileHover={{ scale: 1.03 }}
        className="bg-white rounded-2xl shadow-lg p-5 text-center hover:shadow-2xl transition-all"
      >
        {/* Clickable Product Image */}
        <Link to={`/products/${item._id}`}>
          <div className="h-48 rounded-xl mb-4 overflow-hidden flex items-center justify-center bg-gray-100">
            <img
              src={`https://app-glamlook.onrender.com/images/${item.image}`}

              alt={item.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>

        <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.desc}</p>

        {/* Shop Now Link */}
        <Link to={`/products/${item._id}`}>
          <button className="mt-4 bg-gradient-to-r from-fuchsia-700 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-fuchsia-800 hover:to-pink-700 transition-transform hover:scale-105 shadow-md">
            Shop Now
          </button>
        </Link>
      </motion.div>
    ))}
  </div>
</section>



      {/* Why Shop With Us */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Why Shop <span className="text-fuchsia-700">With Us?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Trendy Styles", desc: "Stay ahead with the latest fashion picks", icon: <ShoppingBag className="w-8 h-8 text-fuchsia-600" /> },
            { title: "Premium Quality", desc: "Carefully curated women’s wear & accessories", icon: <Leaf className="w-8 h-8 text-green-600" /> },
            { title: "Exclusive Collection", desc: "Unique outfits you won’t find anywhere else", icon: <Sparkles className="w-8 h-8 text-yellow-500" /> },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-pink-50 to-fuchsia-50 p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-all"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;


