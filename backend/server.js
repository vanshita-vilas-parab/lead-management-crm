const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const leadRoutes = require("./routes/leads");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors());                       
app.use(express.json());               

// ─── Routes ──────────────────────────────────────────────────────
app.use("/api/leads", leadRoutes);

// ─── Health check ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Lead CRM API is running 🚀" });
});

// ─── Connect to MongoDB, then start server ────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });