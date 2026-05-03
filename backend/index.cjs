const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const normalizeQuery    = require("./utils/normalizeQuery.cjs");
const classifyIntent    = require("./utils/classifyIntent.cjs");
const reasoningEngine   = require("./utils/reasoningEngine.cjs");
const buildKnowledgeBase = require("./utils/buildKnowledge.cjs");
const levenshteinDistance = require("./utils/stringUtils.cjs");
const { connectDB, sequelize } = require("./config/db");

// Global KB variables
let productKB = [];
let faqKB = [];

const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN || "https://placeholder@sentry.io/123", // User should replace this in .env
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

const app = express();

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // For local dev/demo
}));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { errors: [{ msg: "Too many login attempts, please try again after 15 minutes." }] },
});

app.use(express.json({ limit: "10kb" }));

// ── Context memory (per-session follow-ups) ──────────────────────────────────
let lastContext = { products: [] };

// ── Auth, Order & Admin routes ──────────────────────────────────────────────────────
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ── Helper: search products ───────────────────────────────────────────────────
function searchProducts(tokens, fullText) {
  const results = [];
  const seen = new Set();

  const add = (item) => {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      results.push(item);
    }
  };

  // 1. Exact product name match (highest priority)
  const exactMatches = [];
  productKB.forEach((item) => {
    const nameLower = item.title.toLowerCase();
    if (fullText.includes(nameLower)) {
      exactMatches.push(item);
      seen.add(item.id);
    }
  });

  if (exactMatches.length > 0) {
    results.push(...exactMatches);
    return results; // Return early to prevent partial/feature matching from adding unwanted items
  }

  // Only do partial token matching if no exact name was found
  productKB.forEach((item) => {
    const nameTokens = item.title.toLowerCase().split(/\s+/);
    const hasSignificantMatch = tokens.some(t => 
      t.length > 2 && nameTokens.some(nt => nt.includes(t))
    );
    if (hasSignificantMatch) add(item);
  });

  // 2. Category match (e.g. "show me earbuds", "best headphones")
  const categoryMap = {
    earbud: "earbuds", earbuds: "earbuds",
    headphone: "headphones", headphones: "headphones",
    speaker: "speakers", speakers: "speakers",
    soundbar: "soundbars", soundbars: "soundbars",
    smartwatch: "smartwatches", smartwatches: "smartwatches", watch: "smartwatches",
    accessory: "accessories", accessories: "accessories",
    charger: "accessories", cable: "accessories", powerbank: "accessories",
  };
  tokens.forEach((t) => {
    if (categoryMap[t]) {
      productKB
        .filter((item) => item.category === categoryMap[t])
        .forEach(add);
    }
  });

  // 3. Feature / description keyword match
  const importantFeatureWords = [
    "anc", "noise", "cancellation", "wireless", "waterproof", "water",
    "gaming", "bass", "rgb", "gps", "ecg", "amoled", "ldac", "dolby",
    "atmos", "subwoofer", "karaoke", "kids", "sport", "studio", "outdoor",
    "compact", "portable", "cinema", "fashion", "hiRes", "surround",
    "charging", "fast", "multiroom", "voice", "assistant",
  ];
  tokens.forEach((t) => {
    if (importantFeatureWords.includes(t) || t.length > 4) {
      productKB
        .filter(
          (item) =>
            item.content.toLowerCase().includes(t) ||
            (item.description || "").toLowerCase().includes(t) ||
            (item.features || []).some((f) => f.toLowerCase().includes(t))
        )
        .forEach(add);
    }
  });

  // 4. Full-text phrase match in content
  if (fullText.length > 10) {
    productKB
      .filter((item) => item.content.toLowerCase().includes(fullText))
      .forEach(add);
  }

  // 5. Fuzzy match (fallback — Levenshtein)
  if (results.length === 0) {
    productKB.forEach((item) => {
      const matched = tokens.some((word) => {
        if (word.length < 4) return false; // Ignore short words for fuzzy match
        const dist = levenshteinDistance(word, item.title.toLowerCase());
        return dist <= (word.length > 5 ? 3 : 2);
      });
      if (matched) add(item);
    });
  }

  return results;
}

// ── Helper: find best two products for comparison ───────────────────────────
// Splits query on "and"/"vs"/"versus" and does a best-name-match per segment.
function findComparisonProducts(fullText) {
  // Split on common comparison separators
  const parts = fullText
    .split(/\b(?:and|vs\.?|versus|or)\b/i)
    .map((s) => s.trim())
    .filter(Boolean);

  // For each part, find the product whose name has the most overlapping words
  const matched = parts.map((part) => {
    const partWords = part.split(/\s+/).filter((w) => w.length > 2);
    let best = null;
    let bestScore = 0;
    productKB.forEach((item) => {
      const nameLower = item.title.toLowerCase();
      const score = partWords.filter((w) => nameLower.includes(w)).length;
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best;
  });

  // Return up to 2 unique, non-null products
  const unique = [];
  const seen = new Set();
  matched.forEach((p) => {
    if (p && !seen.has(p.id)) { seen.add(p.id); unique.push(p); }
  });
  return unique.slice(0, 2);
}

// ── Helper: search FAQs ───────────────────────────────────────────────────────
function searchFAQs(tokens, fullText, intent) {
  // Map intents directly to FAQ ids
  const intentToFaq = {
    shipping: "faq-shipping",
    returns:  "faq-returns",
    warranty: "faq-warranty",
    payment:  "faq-payment",
    categories: "faq-categories",
    about:    "faq-about",
    contact:  "faq-contact",
  };

  if (intentToFaq[intent]) {
    const faq = faqKB.find((f) => f.id === intentToFaq[intent]);
    return faq ? [faq] : [];
  }

  // Keyword-based FAQ search
  return faqKB.filter((faq) =>
    faq.keywords.some((kw) =>
      tokens.includes(kw) || fullText.includes(kw)
    )
  );
}

// ── Chat endpoint ─────────────────────────────────────────────────────────────
app.post("/api/chat", (req, res) => {
  const message = req.body.message;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Invalid message format.", products: [] });
  }
  if (message.length > 500) {
    return res.status(400).json({ reply: "Message too long.", products: [] });
  }

  // Normalize
  const { tokens, fullText } = normalizeQuery(message);

  // Classify intent (pass both tokens and full text)
  const intent = classifyIntent(tokens, fullText);

  // Short-circuit for greeting — no search needed
  if (intent === "greeting") {
    const response = reasoningEngine("greeting", [], message);
    return res.json({ reply: response.text, products: [] });
  }

  // ── Search ────────────────────────────────────────────────────────────────
  let productResults = [];
  let faqResults     = [];

  // FAQ-only intents
  const faqOnlyIntents = ["shipping", "returns", "payment", "about", "categories", "contact"];
  if (faqOnlyIntents.includes(intent)) {
    faqResults = searchFAQs(tokens, fullText, intent);
  } else if (intent === "warranty") {
    // Warranty: check if user asked about a specific product
    productResults = searchProducts(tokens, fullText);
    faqResults     = searchFAQs(tokens, fullText, intent);
  } else {
    // Product-related intents (price, recommendation, comparison, features, specs, general)

    // Comparison: use dedicated two-product extractor
    if (intent === "comparison") {
      productResults = findComparisonProducts(fullText);
      // Fallback to broad search if we can't find 2 named products
      if (productResults.length < 2) {
        productResults = searchProducts(tokens, fullText).slice(0, 2);
      }
    } else {
      productResults = searchProducts(tokens, fullText);
    }

    // Budget filter for recommendations
    if (intent === "recommendation") {
      const budgetMatch = message.match(/\d+/g);
      // Use the largest number as budget (e.g. "under 5000")
      const budget = budgetMatch
        ? Math.max(...budgetMatch.map(Number))
        : Infinity;

      if (budget < Infinity) {
        const filtered = productResults.filter((p) => p.price <= budget);
        // Only apply filter if it gives results; otherwise keep all
        if (filtered.length > 0) productResults = filtered;
      }

      // Sort by rating descending
      productResults.sort((a, b) => b.rating - a.rating);
    }
    // end else (non-comparison)

    // Context memory fallback for follow-up questions
    if (
      productResults.length === 0 &&
      lastContext.products.length > 0 &&
      ["warranty", "features", "specs", "price"].includes(intent)
    ) {
      productResults = productKB.filter((item) =>
        lastContext.products.includes(item.title)
      );
    }

    // Also fetch relevant FAQs (e.g. warranty FAQ for warranty intent)
    faqResults = searchFAQs(tokens, fullText, intent);
  }

  // Combine results (products first, then FAQs)
  const allResults = [...productResults, ...faqResults];

  // Update context memory (only real products)
  lastContext.products = productResults.slice(0, 4).map((p) => p.title);

  // ── Generate reply ────────────────────────────────────────────────────────
  const response = reasoningEngine(intent, allResults, message);

  const replyData =
    typeof response === "string"
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

// The error handler must be before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    // Sync models without dropping tables in production, but here we can sync
    await sequelize.sync();
    
    const knowledgeBase = await buildKnowledgeBase();
    productKB = knowledgeBase.filter((k) => k.type === "product");
    faqKB     = knowledgeBase.filter((k) => k.type === "faq");

    app.listen(PORT, () => {
      console.log(`✅ SonicHub chatbot backend running on port ${PORT}`);
      console.log(`📦 Knowledge base loaded from SQLite: ${productKB.length} products, ${faqKB.length} FAQs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}

startServer();
