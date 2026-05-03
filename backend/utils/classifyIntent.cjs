/**
 * classifyIntent — maps query tokens/text to a high-level intent.
 * @param {string[]} tokens  — lowercased word tokens
 * @param {string}   fullText — full lowercased query string
 */
function classifyIntent(tokens, fullText) {
  // ── Greeting ────────────────────────────────────────────────────
  const greetWords = ["hi", "hello", "hey", "hola", "howdy", "greetings", "sup", "yo"];
  if (tokens.some((t) => greetWords.includes(t)) && tokens.length <= 4) {
    return "greeting";
  }

  // ── About store ─────────────────────────────────────────────────
  if (
    fullText.includes("about") ||
    fullText.includes("who are you") ||
    fullText.includes("what is sonichub") ||
    fullText.includes("tell me about")
  ) {
    return "about";
  }

  // ── Categories ──────────────────────────────────────────────────
  if (
    fullText.includes("what do you sell") ||
    fullText.includes("what do you have") ||
    (tokens.includes("categories") || tokens.includes("category")) ||
    fullText.includes("types of products")
  ) {
    return "categories";
  }

  // ── Comparison ──────────────────────────────────────────────────
  if (
    tokens.includes("compare") ||
    tokens.includes("vs") ||
    tokens.includes("versus") ||
    tokens.includes("difference") ||
    tokens.includes("better")
  ) {
    return "comparison";
  }

  // ── Price ────────────────────────────────────────────────────────
  if (
    tokens.includes("price") ||
    tokens.includes("cost") ||
    tokens.includes("mrp") ||
    tokens.includes("rate") ||
    fullText.includes("how much") ||
    fullText.includes("what is the price")
  ) {
    return "price";
  }

  // ── Recommendation ───────────────────────────────────────────────
  if (
    tokens.includes("suggest") ||
    tokens.includes("recommend") ||
    tokens.includes("recommendation") ||
    tokens.includes("best") ||
    tokens.includes("top") ||
    tokens.includes("under") ||
    tokens.includes("below") ||
    tokens.includes("within") ||
    tokens.includes("budget") ||
    tokens.includes("affordable") ||
    tokens.includes("cheap") ||
    tokens.includes("cheapest") ||
    tokens.includes("workout") ||
    tokens.includes("gaming") ||
    tokens.includes("kids") ||
    tokens.includes("good") ||
    fullText.includes("which one") ||
    fullText.includes("which is")
  ) {
    return "recommendation";
  }

  // ── Features ─────────────────────────────────────────────────────
  if (
    tokens.includes("feature") ||
    tokens.includes("features") ||
    tokens.includes("does") ||
    tokens.includes("capability") ||
    tokens.includes("capabilities") ||
    fullText.includes("does it have") ||
    fullText.includes("does the") ||
    fullText.includes("can it")
  ) {
    return "features";
  }

  // ── Specs ─────────────────────────────────────────────────────────
  if (
    tokens.includes("spec") ||
    tokens.includes("specs") ||
    tokens.includes("specification") ||
    tokens.includes("specifications") ||
    tokens.includes("battery") ||
    tokens.includes("weight") ||
    tokens.includes("driver") ||
    tokens.includes("bluetooth") ||
    tokens.includes("range") ||
    tokens.includes("waterproof") ||
    tokens.includes("water") ||
    tokens.includes("resistant")
  ) {
    return "specs";
  }

  // ── Warranty ──────────────────────────────────────────────────────
  if (
    tokens.includes("warranty") ||
    tokens.includes("guarantee") ||
    tokens.includes("repair") ||
    tokens.includes("defective") ||
    tokens.includes("broken")
  ) {
    return "warranty";
  }

  // ── Shipping / Delivery ───────────────────────────────────────────
  if (
    tokens.includes("delivery") ||
    tokens.includes("shipping") ||
    tokens.includes("dispatch") ||
    tokens.includes("arrive") ||
    fullText.includes("how long") ||
    fullText.includes("free delivery") ||
    fullText.includes("free shipping")
  ) {
    return "shipping";
  }

  // ── Returns / Refunds ─────────────────────────────────────────────
  if (
    tokens.includes("return") ||
    tokens.includes("refund") ||
    tokens.includes("exchange") ||
    tokens.includes("replacement") ||
    fullText.includes("money back") ||
    fullText.includes("send back")
  ) {
    return "returns";
  }

  // ── Payment ───────────────────────────────────────────────────────
  if (
    tokens.includes("payment") ||
    tokens.includes("pay") ||
    tokens.includes("upi") ||
    tokens.includes("cod") ||
    tokens.includes("emi") ||
    fullText.includes("credit card") ||
    fullText.includes("debit card") ||
    fullText.includes("net banking")
  ) {
    return "payment";
  }

  // ── Stock ────────────────────────────────────────────────────────
  if (
    tokens.includes("stock") ||
    tokens.includes("available") ||
    tokens.includes("availability") ||
    fullText.includes("in stock") ||
    fullText.includes("out of stock")
  ) {
    return "stock";
  }

  // ── Contact / Support ─────────────────────────────────────────────
  if (
    tokens.includes("contact") ||
    tokens.includes("support") ||
    tokens.includes("help") ||
    tokens.includes("helpline") ||
    fullText.includes("customer care") ||
    fullText.includes("customer service")
  ) {
    return "contact";
  }

  return "general";
}

module.exports = classifyIntent;