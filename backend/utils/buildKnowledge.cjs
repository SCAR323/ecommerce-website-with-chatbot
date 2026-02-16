const products = require("../data/products.json");

function buildKnowledgeBase() {
  return products.map((p) => ({
    type: "product",
    title: p.name,
    content: `${p.name} is priced at ₹${p.price}. It has a rating of ${p.rating}.`,
  }));
}

module.exports = buildKnowledgeBase;
