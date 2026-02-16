function searchKnowledge(keywords, knowledgeBase) {
  return knowledgeBase.filter((item) =>
    keywords.some(
      (word) =>
        // STRICT product name / content match
        item.title?.toLowerCase().includes(word) ||
        item.content.toLowerCase().includes(word)
    )
  );
}

module.exports = searchKnowledge;
