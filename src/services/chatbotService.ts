import products from "@/data/products.json";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  features: string[];
  rating: number;
}

const FAQs = [
  {
    keywords: ["battery", "life", "charge", "how long"],
    answer: "Most of our earbuds offer 6-8 hours of playback time on a single charge, with the charging case providing an additional 20-25 hours. Smartwatches typically last 5-7 days on a single charge.",
  },
  {
    keywords: ["warranty", "guarantee"],
    answer: "All our products come with a 1-year manufacturer warranty covering manufacturing defects. Extended warranty options are available at checkout.",
  },
  {
    keywords: ["return", "refund", "exchange"],
    answer: "We offer a 30-day return policy. Products must be in original condition with all accessories. Refunds are processed within 7-10 business days after receiving the returned item.",
  },
  {
    keywords: ["bluetooth", "range", "connection"],
    answer: "Our devices use Bluetooth 5.0 or higher, offering a stable connection up to 10 meters. They're compatible with all Bluetooth-enabled devices including smartphones, tablets, and laptops.",
  },
  {
    keywords: ["water", "resistant", "waterproof", "ipx"],
    answer: "Most of our earbuds and smartwatches feature IPX4-IPX7 water resistance, making them sweat and splash-proof. They're perfect for workouts and light rain but should not be submerged.",
  },
  {
    keywords: ["shipping", "delivery", "when", "arrive"],
    answer: "Standard shipping takes 3-5 business days. Express delivery (1-2 days) is available for select locations. Free shipping on orders above ₹999.",
  },
  {
    keywords: ["noise", "cancellation", "anc"],
    answer: "Our premium models feature Active Noise Cancellation (ANC) that reduces ambient noise by up to 32dB, perfect for commutes and focused work. We also offer Environmental Noise Cancellation (ENC) for clearer calls.",
  },
  {
    keywords: ["payment", "cod", "cash", "emi"],
    answer: "We accept all major payment methods including credit/debit cards, UPI, net banking, wallets, and Cash on Delivery (COD). EMI options are available on orders above ₹3,000.",
  },
  {
    keywords: ["compatible", "support", "work with"],
    answer: "Our products are compatible with all major platforms including iOS, Android, Windows, and Mac. They connect seamlessly via Bluetooth without requiring any special apps.",
  },
  {
    keywords: ["sound", "quality", "audio", "bass"],
    answer: "We use premium drivers with enhanced bass response and crystal-clear highs. Our products support AAC and SBC codecs for superior audio quality across all your favorite music genres.",
  },
];

const getProductsByCategory = (category: string): Product[] => {
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
};

const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  );
};

const getBestProducts = (category?: string): Product[] => {
  let filtered = category ? getProductsByCategory(category) : products;
  return filtered.sort((a, b) => b.rating - a.rating).slice(0, 3);
};

const compareProducts = (productNames: string[]): string => {
  const foundProducts = productNames
    .map((name) =>
      products.find((p) => p.name.toLowerCase().includes(name.toLowerCase()))
    )
    .filter(Boolean) as Product[];

  if (foundProducts.length < 2) {
    return "Please provide at least 2 product names to compare. For example: 'compare Bass Pro X1 and Sound Elite Pro'";
  }

  const [p1, p2] = foundProducts;
  return `**Comparing ${p1.name} vs ${p2.name}:**

**Price:** ${p1.name} costs ₹${p1.price} while ${p2.name} costs ₹${p2.price} (${
    p1.price < p2.price ? p1.name + " is cheaper" : p2.name + " is cheaper"
  })

**Rating:** ${p1.name} has ${p1.rating}★ rating while ${p2.name} has ${p2.rating}★ rating

**Category:** ${p1.name} is in ${p1.category} category, ${p2.name} is in ${p2.category} category

**Key Features:**
${p1.name}: ${p1.features.slice(0, 3).join(", ")}
${p2.name}: ${p2.features.slice(0, 3).join(", ")}

Both are excellent choices! ${p1.rating > p2.rating ? p1.name : p2.name} has slightly better ratings.`;
};

export const getChatbotResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  
  if (
    lowerMessage.includes("weather") ||
    lowerMessage.includes("news") ||
    lowerMessage.includes("joke") ||
    lowerMessage.includes("movie") ||
    lowerMessage.includes("food")
  ) {
    return "I can only answer product and website-related questions. Please ask me about our electronics, features, pricing, or support!";
  }

  
  if (lowerMessage.includes("compare") || lowerMessage.includes("vs")) {
    const productMentions = products
      .filter((p) => lowerMessage.includes(p.name.toLowerCase()))
      .map((p) => p.name);
    if (productMentions.length >= 2) {
      return compareProducts(productMentions);
    }
    return "To compare products, please mention at least 2 product names. For example: 'compare Bass Pro X1 and Sound Elite Pro'";
  }

  
  for (const faq of FAQs) {
    if (faq.keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return faq.answer;
    }
  }

  
  const categories = [
    "earbuds",
    "headphones",
    "speakers",
    "soundbars",
    "smartwatches",
    "accessories",
  ];
  for (const category of categories) {
    if (lowerMessage.includes(category)) {
      const best = getBestProducts(category);
      return `**Best ${category.charAt(0).toUpperCase() + category.slice(1)}:**\n\n${best
        .map(
          (p, i) =>
            `${i + 1}. **${p.name}** - ₹${p.price} (${p.rating}★)\n   ${p.description}`
        )
        .join("\n\n")}`;
    }
  }

  
  if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
    if (lowerMessage.includes("under") || lowerMessage.includes("below")) {
      const priceMatch = lowerMessage.match(/\d+/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[0]);
        const affordable = products
          .filter((p) => p.price <= maxPrice)
          .slice(0, 5);
        if (affordable.length > 0) {
          return `**Products under ₹${maxPrice}:**\n\n${affordable
            .map(
              (p, i) =>
                `${i + 1}. ${p.name} - ₹${p.price} (${p.rating}★)`
            )
            .join("\n")}`;
        }
      }
    }
  }

 
  if (
    lowerMessage.includes("best") ||
    lowerMessage.includes("top") ||
    lowerMessage.includes("recommend")
  ) {
    const best = getBestProducts();
    return `**Top Recommended Products:**\n\n${best
      .map(
        (p, i) =>
          `${i + 1}. **${p.name}** - ₹${p.price} (${p.rating}★)\n   ${p.description}`
      )
      .join("\n\n")}`;
  }

  // Search for specific products
  const searchResults = searchProducts(lowerMessage);
  if (searchResults.length > 0) {
    const top3 = searchResults.slice(0, 3);
    return `**Found ${searchResults.length} product(s) matching your query:**\n\n${top3
      .map(
        (p, i) =>
          `${i + 1}. **${p.name}** - ₹${p.price} (${p.rating}★)\n   ${p.description}`
      )
      .join("\n\n")}`;
  }

  
  if (
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hey")
  ) {
    return "Hello! 👋 I'm here to help you find the perfect electronics. I can help with:\n• Product recommendations\n• Feature comparisons\n• Pricing and availability\n• Warranty and support\n• Shipping information\n\nWhat would you like to know?";
  }

  // Default response
  return "I can help you with:\n• Product recommendations by category\n• Price comparisons\n• Product features and specifications\n• Warranty and support information\n• Shipping details\n• Payment options\n\nTry asking: 'Show me best earbuds' or 'What's your warranty policy?'";
};
