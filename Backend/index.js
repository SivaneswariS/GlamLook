const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

app.use("/images", express.static("public"));

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;// 🔒 Change in production

// --- MongoDB connection ---
mongoose.connect("mongodb://127.0.0.1:27017/glamlook")
  .then(() => console.log("DB connected"))
  .catch(() => console.log("DB not connected"));

// --- Schemas & Models ---
// Product Schema
const Product = mongoose.model("Product", {
  name: String,
  category: String,
  price: Number,
  image: String,
  occasion: String,
  color: String,
  desc:String,
}, "products");

// Users
const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: String,
}, "users");

// Orders
const Order = mongoose.model("Order", {
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalPrice: Number,
  customerName: String,
  customerEmail: String,
  shippingAddress: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // link to user
  status:{type: String, default: "Pending"},
  createdAt: { type: Date, default: Date.now },
}, "orders");

// --- Middleware for JWT authentication ---
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// --- Product Routes ---
// Get all products
app.get("/products", async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error retrieving products");
  }
});

// Get single product
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).send("Error retrieving product");
  }
});

// --- Auth Routes ---
// Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "User created", token });
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});


// --- User Profile Routes ---
// Get logged-in user profile
app.get("/users/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update logged-in user profile
app.put("/users/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    // Generate new token if email/password changed
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Profile updated successfully",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});


// --- Order Routes ---
// Place Order
app.post("/orders", authMiddleware, async (req, res) => {
  try {
    const { items, totalPrice, customerName, customerEmail, shippingAddress } = req.body;

    if (!items || items.length === 0) return res.status(400).json({ error: "Cart is empty" });

    const newOrder = new Order({
      items,
      totalPrice,
      customerName,
      customerEmail,
      shippingAddress,
      userId: req.userId, // link order to logged-in user
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Get orders for logged-in user

app.get("/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("items.productId", "name price image category") // populate product fields
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


// --- Start Server ---
app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
