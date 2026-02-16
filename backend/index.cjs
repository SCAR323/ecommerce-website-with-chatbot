const express = require("express");
const cors = require("cors");
const normalizeQuery = require("./utils/normalizeQuery.cjs");
const classifyIntent = require("./utils/classifyIntent.cjs");
const reasoningEngine = require("./utils/reasoningEngine.cjs");
const buildKnowledgeBase = require("./utils/buildKnowledge.cjs");

const knowledgeBase = buildKnowledgeBase();

const app = express();

// 🔒 STRICT CONTEXT MEMORY
let lastContext = {
  products: [],
};

app.use(cors());
app.use(express.json());

app.post("/api/chat", (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.json({ reply: "Please ask a question." });
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
  } else if (
    /* =====================================================
     2️⃣ BROWSE / LIST QUERIES (show / list headphones)
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
     3️⃣ COMPARISON / NORMAL SEARCH
     ===================================================== */
    results = knowledgeBase.filter((item) =>
      keywords.some(
        (word) =>
          item.title?.toLowerCase().includes(word) ||
          item.content.toLowerCase().includes(word)
      )
    );
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
  const reply = reasoningEngine(intent, results);

  res.json({ reply });
});

app.listen(5000, () => {
  console.log("Chatbot backend running on port 5000");
});
