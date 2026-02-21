function classifyIntent(keywords) {
  if (keywords.includes("compare")) return "comparison";
  if (keywords.includes("price") || keywords.includes("cost") || keywords.includes("how much")) {
    return "price";
  }

  if (keywords.includes("suggest") || keywords.includes("recommend") || keywords.includes("best") || keywords.includes("under") || keywords.includes("budget") || keywords.includes("top")) {
    return "recommendation";
  }

  if (keywords.includes("warranty") || keywords.includes("guarantee")) {
    return "warranty";
  }
  if (keywords.includes("delivery") || keywords.includes("shipping"))
    return "shipping";

  return "general";
}

module.exports = classifyIntent;