const products = require("../../src/data/products.json");

function buildKnowledgeBase() {
  return products.map((p) => ({
    type: "product",
    title: p.name,
    category: p.category,
    price: p.price,
    rating: p.rating,
    images: p.images,
    features: p.features,
    content: `${p.name} is a ${p.category} priced at ₹${p.price}. It has a rating of ${p.rating}/5. Features: ${p.features.join(", ")}.`,
  }));
}

module.exports = buildKnowledgeBase;
