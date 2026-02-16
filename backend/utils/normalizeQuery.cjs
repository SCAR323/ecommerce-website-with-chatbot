function normalizeQuery(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter(word => word.length > 2);
  }
  
  module.exports = normalizeQuery;
  