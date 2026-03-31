const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const normalizeQuery = require("./utils/normalizeQuery.cjs");
const classifyIntent = require("./utils/classifyIntent.cjs");
const reasoningEngine = require("./utils/reasoningEngine.cjs");
const buildKnowledgeBase = require("./utils/buildKnowledge.cjs");
const levenshteinDistance = require("./utils/stringUtils.cjs");

const knowledgeBase = buildKnowledgeBase();

const app = express();

// 🔒 SECURITY MIDDLEWARE
app.use(helmet({
  contentSecurityPolicy: false, // For local dev/demo
}));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again after 15 minutes.",
});

app.use(express.json({ limit: "10kb" }));

// 🗄️ DATABASE CONNECTION (MONGODB ATLAS)
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000, 
  })
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => console.log("⚠️ MongoDB initial connection failed (check your IP/network):", err.message));

// 🔒 STRICT CONTEXT MEMORY
let lastContext = {
  products: [],
};

// 🛣️ ROUTES
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.post("/api/chat", (req, res) => {
  const message = req.body.message;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Invalid message format." });
  }

  const keywords = normalizeQuery(message);
  const intent = classifyIntent(keywords);
  let results = [];

  // Chat logic (Prices, recommendations, etc.)
  if (intent === "price") {
    results = knowledgeBase.filter(item => 
      item.type === "product" && keywords.some(word => item.title.toLowerCase().includes(word))
    );
  } else if (intent === "recommendation") {
     results = knowledgeBase.filter(item => item.type === "product");
  } else {
    results = knowledgeBase.filter(item => 
      keywords.some(word => item.title?.toLowerCase().includes(word) || item.content.toLowerCase().includes(word))
    );
  }

  const response = reasoningEngine(intent, results);
  const replyData = typeof response === "string" 
    ? { reply: response, products: [] } 
    : { reply: response.text, products: response.products || [] };

  res.json(replyData);
});

// 🚀 SERVE FRONTEND (SINGLE WEBSITE DEPLOYMENT)
// Pointing to the "dist" folder where Vite builds the frontend
app.use(express.static(path.join(__dirname, "../dist")));

// Any route not handled by the API will serve the built React app (SPA logic)
app.use((req, res, next) => {
  // If it's an API route that wasn't found, don't serve index.html
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Application running correctly on port ${PORT}`);
});
