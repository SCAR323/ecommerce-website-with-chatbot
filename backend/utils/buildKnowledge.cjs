const Product = require("../models/Product");
const FAQ = require("../models/FAQ");

async function buildKnowledgeBase() {
  try {
    const products = await Product.find({});
    const faqs = await FAQ.find({});

    // ── Product entries (one per product) ─────────────────────────────────────
    const productEntries = products.map((p) => {
      const specObj = p.specs || {};
      const specLines = Object.entries(specObj)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");

      return {
        type: "product",
        id: p.productId,
        title: p.name,
        category: p.category,
        price: p.price,
        rating: p.rating,
        images: p.images,
        description: p.description,
        features: p.features,
        specs: specObj,
        // Rich content string — used for full-text search
        content: [
          `${p.name} is a ${p.category} priced at ₹${p.price}.`,
          `Rating: ${p.rating}/5.`,
          `Description: ${p.description}.`,
          `Features: ${(p.features || []).join(", ")}.`,
          specLines ? `Specs: ${specLines}.` : "",
        ]
          .filter(Boolean)
          .join(" "),
      };
    });

    // ── FAQ / Store policy entries ─────────────────────────────────────────────
    const faqEntries = faqs.map((f) => ({
      type: "faq",
      id: f.faqId,
      title: f.title,
      keywords: f.keywords,
      content: f.content,
    }));

    return [...productEntries, ...faqEntries];
  } catch (error) {
    console.error("❌ Error building knowledge base from database:", error);
    return [];
  }
}

module.exports = buildKnowledgeBase;
