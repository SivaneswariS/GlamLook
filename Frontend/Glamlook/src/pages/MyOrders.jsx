import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT stored after login
       const response = await fetch(`${API_BASE_URL}/orders`, {
  headers: { Authorization: `Bearer ${token}` },
});

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center p-5">Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">Order #{order._id}</h2>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Total: ₹{order.totalPrice}</p>
              <p>Status: {order.status}</p>

              {/* Order items (optional) */}
              <div className="mt-2">
                <h3 className="font-medium">Items:</h3>
                <ul className="list-disc pl-6">
  {order.items.map((item, idx) => (
    <li key={idx} className="flex items-center gap-3">
      <img
        src={`https://app-glamlook.onrender.com/images/${item.productId.image}`}
        alt={item.productId.name}
        className="w-12 h-12 object-cover rounded mb-4 mt-2"
      />
      <span>
        {item.productId.name} (x{item.quantity}) - ₹
        {item.productId.price * item.quantity}
      </span>
    </li>
  ))}
</ul>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
