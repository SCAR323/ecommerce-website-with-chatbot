function normalizeQuery(text) {
  const fullText = text.toLowerCase().replace(/[^\w\s]/g, "");
  const tokens = fullText
    .split(/\s+/)
    .filter((word) => word.length >= 1); // keep words >= 1 char ("vs", "a", etc.)
  return { tokens, fullText };
}

module.exports = normalizeQuery;