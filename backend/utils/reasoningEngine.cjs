/**
 * reasoningEngine — converts matched knowledge items + intent into a reply.
 * Always returns: { text: string, products: array }
 */
function reasoningEngine(intent, results, originalMessage) {
  const products = results.filter((r) => r.type === "product");
  const faqs    = results.filter((r) => r.type === "faq");

  /* ── GREETING ───────────────────────────────────────────────────── */
  if (intent === "greeting") {
    return {
      text: "👋 Hey there! I'm your SonicHub AI assistant.\n\nI can help you with:\n• 🔍 Finding products\n• 💰 Checking prices\n• 📦 Shipping & returns\n• 🔧 Product specs & features\n• 🆚 Comparing products\n\nWhat would you like to know?",
      products: [],
    };
  }

  /* ── ABOUT ──────────────────────────────────────────────────────── */
  if (intent === "about") {
    const faq = results.find((r) => r.id === "faq-about");
    return {
      text: faq
        ? faq.content
        : "🎵 SonicHub is a premium audio & tech store. We sell earbuds, headphones, speakers, soundbars, smartwatches, and accessories.",
      products: [],
    };
  }

  /* ── CATEGORIES ─────────────────────────────────────────────────── */
  if (intent === "categories") {
    const faq = results.find((r) => r.id === "faq-categories");
    return {
      text: faq
        ? faq.content
        : "We sell earbuds, headphones, speakers, soundbars, smartwatches, and accessories.",
      products: [],
    };
  }

  /* ── WARRANTY ───────────────────────────────────────────────────── */
  if (intent === "warranty") {
    const faq = results.find((r) => r.id === "faq-warranty");
    if (faq) return { text: faq.content, products: [] };

    if (products.length === 0) {
      return {
        text: "🛡️ All SonicHub products come with a minimum 1-year manufacturer warranty covering manufacturing defects.",
        products: [],
      };
    }
    const lines = products
      .slice(0, 3)
      .map((p) => `• ${p.title} (₹${p.price}) — 1-year warranty included`);
    return {
      text: "🛡️ Warranty info:\n" + lines.join("\n") +
        "\n\nAll products come with at least a 1-year manufacturer warranty.",
      products: products.slice(0, 3),
    };
  }

  /* ── SHIPPING ───────────────────────────────────────────────────── */
  if (intent === "shipping") {
    const faq = results.find((r) => r.id === "faq-shipping");
    return {
      text: faq
        ? faq.content
        : "🚚 Free shipping on orders above ₹999. Standard delivery: 3-5 business days.",
      products: [],
    };
  }

  /* ── RETURNS ────────────────────────────────────────────────────── */
  if (intent === "returns") {
    const faq = results.find((r) => r.id === "faq-returns");
    return {
      text: faq
        ? faq.content
        : "🔄 We offer a 10-day hassle-free return policy. Refunds are processed within 5-7 business days.",
      products: [],
    };
  }

  /* ── PAYMENT ────────────────────────────────────────────────────── */
  if (intent === "payment") {
    const faq = results.find((r) => r.id === "faq-payment");
    return {
      text: faq
        ? faq.content
        : "💳 We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.",
      products: [],
    };
  }

  /* ── CONTACT ────────────────────────────────────────────────────── */
  if (intent === "contact") {
    const faq = results.find((r) => r.id === "faq-contact");
    return {
      text: faq
        ? faq.content
        : "📞 Reach us at support@sonichub.com or call 1800-SONIC-HUB (Mon–Sat, 9 AM–6 PM).",
      products: [],
    };
  }

  /* ── STOCK ──────────────────────────────────────────────────────── */
  if (intent === "stock") {
    if (products.length === 0) {
      return {
        text: "📦 I'm not sure which product you're asking about. Could you please specify the name?",
        products: [],
      };
    }
    const lines = products.slice(0, 3).map((p) => `• ${p.title} is currently In Stock!`);
    return {
      text: "📦 Stock Availability:\n" + lines.join("\n") + "\n\nMost items are ready to ship within 24 hours.",
      products: products.slice(0, 3),
    };
  }

  /* ── NO RESULTS ─────────────────────────────────────────────────── */
  if (results.length === 0) {
    return {
      text: "🤔 I couldn't find anything matching your query in our store.\n\nTry asking about:\n• A specific product name (e.g. \"AirBass Pro 360\")\n• A category (e.g. \"show me earbuds\")\n• Price range (e.g. \"headphones under ₹5000\")\n• Store policies (shipping, returns, warranty)",
      products: [],
    };
  }

  /* ── COMPARISON ─────────────────────────────────────────────────── */
  if (intent === "comparison") {
    if (products.length < 2) {
      return {
        text: "Please mention two product names to compare. For example: \"compare AirBass Pro 360 and AirBass Zen\"",
        products: products,
      };
    }

    const p1 = products[0];
    const p2 = products[1];

    const specRows = (p) => {
      const s = p.specs || {};
      return Object.entries(s)
        .map(([k, v]) => `  • ${k}: ${v}`)
        .join("\n");
    };

    const winnerPrice = p1.price < p2.price ? p1 : (p2.price < p1.price ? p2 : null);
    const winnerRating = p1.rating > p2.rating ? p1 : (p2.rating > p1.rating ? p2 : null);
    
    // Find unique features
    const p1Features = p1.features || [];
    const p2Features = p2.features || [];
    const p1Unique = p1Features.filter(f => !p2Features.includes(f)).slice(0, 2);
    const p2Unique = p2Features.filter(f => !p2Features.includes(f)).slice(0, 2);

    let verdict = "";
    if (winnerPrice && winnerRating && winnerPrice.id === winnerRating.id) {
      verdict = `🏆 **Overall Winner:** **${winnerPrice.title}** offers both a better price and a higher rating. It's the clear choice for value.`;
    } else {
      verdict = `⚖️ **Verdict:**\n`;
      if (winnerPrice) {
        verdict += `• **For Value:** Choose **${winnerPrice.title}** (₹${winnerPrice.price.toLocaleString()}). It is ₹${Math.abs(p1.price - p2.price).toLocaleString()} cheaper than the ${winnerPrice.id === p1.id ? p2.title : p1.title}.\n`;
      }
      if (winnerRating) {
        verdict += `• **For Performance:** Choose **${winnerRating.title}**. It has a superior rating of ${winnerRating.rating}/5.\n`;
      }
      
      const p1Reason = p1Unique.length > 0 ? ` Choose **${p1.title}** if you specifically need ${p1Unique.join(" and ")}.` : "";
      const p2Reason = p2Unique.length > 0 ? ` Choose **${p2.title}** if you prefer ${p2Unique.join(" and ")}.` : "";
      
      verdict += p1Reason + p2Reason;
    }

    const text =
      `🆚 **Comparison: ${p1.title} vs ${p2.title}**\n\n` +
      `**Quick Stats:**\n` +
      `• **${p1.title}**: ₹${p1.price.toLocaleString()} | ⭐ ${p1.rating}/5\n` +
      `• **${p2.title}**: ₹${p2.price.toLocaleString()} | ⭐ ${p2.rating}/5\n\n` +
      `**Technical Specs:**\n` +
      `${p1.title}:\n${specRows(p1)}\n\n` +
      `${p2.title}:\n${specRows(p2)}\n\n` +
      verdict;

    return { text, products: [p1, p2] };
  }

  /* ── PRICE ──────────────────────────────────────────────────────── */
  if (intent === "price") {
    if (products.length === 0) {
      return {
        text: "💰 I couldn't find pricing for that product. Try searching by exact name.",
        products: [],
      };
    }
    const lines = products
      .slice(0, 5)
      .map((p) => `• ${p.title}: ₹${p.price.toLocaleString("en-IN")} ⭐ ${p.rating}/5`);
    return {
      text: "💰 Here are the prices:\n" + lines.join("\n"),
      products: products.slice(0, 5),
    };
  }

  /* ── FEATURES ───────────────────────────────────────────────────── */
  if (intent === "features") {
    if (products.length === 0) {
      return { text: "I couldn't find that product. Please check the name.", products: [] };
    }
    const lines = products.slice(0, 3).map((p) => {
      const featureList = (p.features || []).map((f) => `  ✅ ${f}`).join("\n");
      return `🎧 ${p.title} (₹${p.price}):\n${featureList}`;
    });
    return {
      text: lines.join("\n\n"),
      products: products.slice(0, 3),
    };
  }

  /* ── SPECS ──────────────────────────────────────────────────────── */
  if (intent === "specs") {
    if (products.length === 0) {
      return { text: "I couldn't find specs for that product.", products: [] };
    }
    const lines = products.slice(0, 2).map((p) => {
      const specList = Object.entries(p.specs || {})
        .map(([k, v]) => `  • ${k}: ${v}`)
        .join("\n");
      return `📊 ${p.title} Specifications:\n${specList}`;
    });
    return {
      text: lines.join("\n\n"),
      products: products.slice(0, 2),
    };
  }

  /* ── RECOMMENDATION ─────────────────────────────────────────────── */
  if (intent === "recommendation") {
    if (products.length === 0) {
      return {
        text: "😕 No products found matching your criteria. Try adjusting your budget or category.",
        products: [],
      };
    }
    const top = products.slice(0, 4);
    const lines = top.map(
      (p) =>
        `• ${p.title} — ₹${p.price.toLocaleString("en-IN")} ⭐ ${p.rating}/5\n  ${p.description}`
    );
    return {
      text: `🌟 Here are my top recommendations:\n\n${lines.join("\n\n")}`,
      products: top,
    };
  }

  /* ── GENERAL / BROWSE ───────────────────────────────────────────── */
  // Always return product cards for any product result
  if (products.length > 0) {
    const top = products.slice(0, 4);
    const lines = top.map(
      (p) => `• ${p.title} — ₹${p.price.toLocaleString("en-IN")} ⭐ ${p.rating}/5`
    );
    return {
      text: `🛍️ Here's what I found:\n\n${lines.join("\n")}`,
      products: top,
    };
  }

  // FAQ-only result
  if (faqs.length > 0) {
    return { text: faqs[0].content, products: [] };
  }

  return {
    text: "🤔 I'm not sure about that. Try asking about a specific product, price, or store policy.",
    products: [],
  };
}

module.exports = reasoningEngine;
