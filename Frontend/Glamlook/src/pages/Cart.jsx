import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Your cart is empty 🛒</h2></div>;
  }

  return (
 <div className="max-w-5xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Cart</h2>
      
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center md:justify-between bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            {/* Left - Product Info */}
            <div className="flex items-center gap-4">
              <img
                src={`http://localhost:3000/images/${item.image}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-pink-600 font-bold">₹{item.price}</p>
              </div>
            </div>

            {/* Right - Quantity & Remove */}
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item._id, parseInt(e.target.value))
                  }
                  className="w-16 p-1 border rounded-lg text-center"
                />
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-8 text-right">
        <h3 className="text-2xl font-bold">
          Total: ₹
          {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </h3>
        <button className="mt-4 bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-6 py-3 rounded-xl font-semibold shadow">
         <Link to={"/checkout"}> Proceed to Checkout</Link>
        </button>
      </div>
    </div>
  );
};

export default Cart;
