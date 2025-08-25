
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

// --- Environment Variables ---
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL; // MongoDB Atlas connection string
const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT

// --- MongoDB Connection ---
mongoose.connect(MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error:", err));

// --- Schemas & Models ---

// Product Schema
const Product = mongoose.model("Product", {
  name: String,
  category: String,
  price: Number,
  image: String,
  occasion: String,
  color: String,
  desc: String,
}, "products");

// User Schema
const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: String,
}, "users");

// Order Schema
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
}, "orders");

// --- JWT Middleware ---
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// --- Routes ---

// Health Check
app.get("/", (req, res) => res.send("Backend is running!"));

// Products
app.get("/products", async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error retrieving products");
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).send("Error retrieving product");
  }
});

// Auth - Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

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

// Auth - Login
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

// User Profile
app.get("/users/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.put("/users/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
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

// Orders
app.post("/orders", authMiddleware, async (req, res) => {
  try {
    const { items, totalPrice, customerName, customerEmail, shippingAddress } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const newOrder = new Order({
      items,
      totalPrice,
      customerName,
      customerEmail,
      shippingAddress,
      userId: req.userId,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.get("/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("items.productId", "name price image category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
