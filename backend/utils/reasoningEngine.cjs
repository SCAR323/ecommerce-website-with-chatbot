function reasoningEngine(intent, results) {
  if (!results || results.length === 0) {
    return {
      text: "I searched the website but couldn’t find relevant information.",
      products: []
    };
  }

  /* ===============================
     COMPARISON LOGIC (STRICT)
     =============================== */
  if (intent === "comparison") {
    // 🔒 ONLY compare first two matched products
    const products = results.filter((r) => r.type === "product").slice(0, 2);

    if (products.length < 2) {
      return "Please mention at least two products to compare.";
    }

    const comparisons = products.map((p) => {
      const priceMatch = p.content.match(/₹\d+/);
      const price = priceMatch ? priceMatch[0] : "price not available";

      const warrantyMatch = p.content.match(/(\d+\s*year)/i);
      const warranty = warrantyMatch
        ? warrantyMatch[0]
        : "warranty not specified";

      return `• ${p.title}: costs ${price}, comes with ${warranty} warranty.`;
    });

    return {
      text: "Here is a detailed comparison:\n" +
        comparisons.join("\n") +
        "\n\nSummary:\n" +
        `${products[0].title} is better for premium features, while ${products[1].title} is more budget-friendly.`,
      products: products
    };
  }

  /* ===============================
     PRICE / RECOMMENDATION / GENERAL
     =============================== */
  if (intent === "recommendation" || intent === "price") {
    return {
      text: results.slice(0, 3).map((r) => r.content).join("\n\n"),
      products: results.slice(0, 3)
    };
  }

  return {
    text: results
      .slice(0, 2)
      .map((r) => r.content)
      .join(" "),
    products: []
  };
}

module.exports = reasoningEngine;
