function classifyIntent(keywords) {
    if (keywords.includes("compare")) return "comparison";
    if (keywords.includes("best") || keywords.includes("suggest"))
      return "recommendation";
    if (keywords.includes("price")) return "price";
    if (keywords.includes("warranty")) return "warranty";
    if (keywords.includes("delivery") || keywords.includes("shipping"))
      return "shipping";
  
    return "general";
  }
  
  module.exports = classifyIntent;  