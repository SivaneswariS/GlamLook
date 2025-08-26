import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ⬅️ import navigate
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ⬅️ navigation hook
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  // 👤 Example: Check login status from localStorage (or AuthContext if you have one)
  const isLoggedIn = !!localStorage.getItem("userToken");

  useEffect(() => {
    fetch(`https://app-glamlook.onrender.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error(err);
        setProduct(null);
      });
  }, [id]);

  if (!product) return <p className="text-center py-10">Loading...</p>;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login"); // ⬅️ Redirect to login if not logged in
    } else {
      addToCart(product); // ⬅️ Add to cart if logged in
    }
  };

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left - Image */}
        <div className="w-full h-[500px] overflow-hidden rounded-xl shadow">
          <img
            src={`https://app-glamlook.onrender.com/images/${product.image}`}
            alt={product.name}
            className="h-full w-full object-contain rounded-lg"
          />
        </div>

        {/* Right - Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-pink-600 text-2xl font-semibold mb-4">
            ₹{product.price}
          </p>
          <p className="text-gray-700 mb-6">{product.desc}</p>

          <button
            onClick={handleAddToCart}
            className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-6 py-3 rounded-lg font-medium shadow"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;

