const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const normalizeQuery = require("./utils/normalizeQuery.cjs");
const classifyIntent = require("./utils/classifyIntent.cjs");
const reasoningEngine = require("./utils/reasoningEngine.cjs");
const buildKnowledgeBase = require("./utils/buildKnowledge.cjs");
const levenshteinDistance = require("./utils/stringUtils.cjs");

const knowledgeBase = buildKnowledgeBase();

const app = express();

// 🔒 SECURITY MIDDLEWARE
app.use(helmet()); // Secure HTTP headers

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration
const corsOptions = {
  origin: "*", // ALLOW ALL FOR DEBUGGING
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Strict Rate Limiting for Login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // INCREASED LIMIT TEMPORARILY FOR TESTING
  message: {
    errors: [{ msg: "Too many login attempts, please try again after 15 minutes." }]
  },
});

app.use(express.json({ limit: "10kb" })); // Body parser with limit

// 📁 Using JSON file storage (backend/data/users.json)
console.log("Using JSON file storage for user data");

// 🔒 STRICT CONTEXT MEMORY
let lastContext = {
  products: [],
};

// 🛣️ ROUTES
app.use("/api/auth/login", authLimiter); // Apply strict limit to login BEFORE mounting auth routes
app.use("/api/auth", require("./routes/auth")); // Auth Routes
app.use("/api/orders", require("./routes/orderRoutes")); // Order Routes

app.post("/api/chat", (req, res) => {
  const message = req.body.message;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Invalid message format." });
  }

  if (message.length > 500) {
    return res.status(400).json({ reply: "Message too long." });
  }

  const keywords = normalizeQuery(message);
  const intent = classifyIntent(keywords);

  let results = [];

  /* =====================================================
     1️⃣ PRICE QUERIES — STRICT PRODUCT NAME MATCH ONLY
     ===================================================== */
  if (intent === "price") {
    const matchedProducts = knowledgeBase.filter(
      (item) =>
        item.type === "product" &&
        keywords.some((word) => item.title.toLowerCase().includes(word))
    );

    if (matchedProducts.length === 0) {
      return res.json({
        reply:
          "I searched the website but couldn’t find pricing information for that product.",
      });
    }

    results = matchedProducts;
  } else if (intent === "recommendation") {
    // Extract budget
    const budgetMatch = message.match(/\d+/); // Finds the first number
    const budget = budgetMatch ? parseInt(budgetMatch[0]) : Infinity;

    // Extract category
    let category = null;
    if (keywords.includes("headphone") || keywords.includes("headphones"))
      category = "headphones";
    else if (keywords.includes("earbud") || keywords.includes("earbuds"))
      category = "earbuds";
    else if (keywords.includes("speaker") || keywords.includes("speakers"))
      category = "speakers";
    else if (keywords.includes("watch") || keywords.includes("smartwatch"))
      category = "smartwatches";
    else if (keywords.includes("soundbar") || keywords.includes("soundbars"))
      category = "soundbars";

    // Filter products
    results = knowledgeBase.filter((item) => {
      const isProduct = item.type === "product";
      const matchesCategory = category ? item.category === category : true;
      const withinBudget = item.price <= budget;
      return isProduct && matchesCategory && withinBudget;
    });

    // Sort by rating (popularity)
    results.sort((a, b) => b.rating - a.rating);

    // If no results found with specific criteria, relax budget
    if (results.length === 0 && budget !== Infinity) {
      results = knowledgeBase.filter((item) => {
        return (
          item.type === "product" &&
          (category ? item.category === category : true)
        );
      });
      results.sort((a, b) => a.price - b.price); // Show cheapest first if budget constraint failed
    }
  } else if (
    /* =====================================================
     3️⃣ BROWSE / LIST QUERIES (show / list headphones)
     ===================================================== */
    intent === "general" &&
    (keywords.includes("headphones") ||
      keywords.includes("products") ||
      keywords.includes("items"))
  ) {
    results = knowledgeBase.filter(
      (item) =>
        item.type === "product" &&
        item.content.toLowerCase().includes("headphone")
    );
  } else {
    /* =====================================================
     4️⃣ COMPARISON / NORMAL SEARCH (WITH FUZZY MATCH)
     ===================================================== */
    // 1. Exact/Partial Match
    results = knowledgeBase.filter((item) =>
      keywords.some(
        (word) =>
          item.title?.toLowerCase().includes(word) ||
          item.content.toLowerCase().includes(word)
      )
    );

    // 2. Fuzzy Match (if no exact matches)
    if (results.length === 0) {
      results = knowledgeBase.filter((item) =>
        keywords.some((word) => {
          const distance = levenshteinDistance(word, item.title.toLowerCase());
          // Allow simplified threshold: 3 for longer words, 2 for shorter
          const threshold = word.length > 5 ? 3 : 2;
          // Also check against fuzzy version of product name parts?
          // Simplest: check if any word in query is close to product name
          return distance <= threshold;
        })
      );
    }
  }

  /* =====================================================
     4️⃣ CONTEXT MEMORY (ONLY FOR FOLLOW-UPS)
     ===================================================== */
  if (
    results.length === 0 &&
    lastContext.products.length > 0 &&
    (intent === "warranty" || intent === "shipping")
  ) {
    results = knowledgeBase.filter((item) =>
      lastContext.products.includes(item.title)
    );
  }

  /* =====================================================
     5️⃣ SAVE CONTEXT (ONLY REAL PRODUCTS)
     ===================================================== */
  lastContext.products = results
    .filter((r) => r.type === "product")
    .map((p) => p.title);

  /* =====================================================
     6️⃣ GENERATE FINAL ANSWER
     ===================================================== */
  const response = reasoningEngine(intent, results);

  // Ensure response is always an object with { reply, products }
  const replyData =
    typeof response === "string"
      ? { reply: response, products: [] }
      : { reply: response.text, products: response.products || [] };

  res.json(replyData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Chatbot backend running on port ${PORT}`);
});
