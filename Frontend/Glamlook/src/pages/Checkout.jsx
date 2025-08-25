import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // ✅ adjust path if needed

const Checkout = () => {
  const { cart, setCart } = useCart(); // get cart items
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!customerName || !customerEmail || !shippingAddress) {
      alert("Please fill in all fields");
      return;
    }

    const orderData = {
      items: cart.map(({ _id, name, price, quantity }) => ({
        productId: _id,
        name,
        price,
        quantity,
      })),
      totalPrice,
      customerName,
      customerEmail,
      shippingAddress,
    };

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // ✅ get token
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ fixed with backticks
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");

      await res.json();
      setOrderPlaced(true);
      setCart([]); // clear cart after order
    } catch (err) {
      console.error(err);
      alert("Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">
          Order Placed Successfully! 🎉
        </h2>
        <p>Thank you for your purchase, {customerName}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold mb-8">Checkout</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cart Summary */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Cart Items</h3>
            <ul>
              {cart.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between mb-2 border-b pb-2"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-bold mt-4">
              Total: ₹{totalPrice}
            </h3>
          </div>

          {/* Shipping Form */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Shipping Information
            </h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-6 py-3 rounded-lg font-medium shadow"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
