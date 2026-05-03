const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { connectDB } = require("./config/db");
const Product = require("./models/Product");
const FAQ = require("./models/FAQ");
const productsData = require("../src/data/products.json");

// Hardcoded FAQs
const faqEntries = [
    {
      faqId: "faq-shipping",
      title: "Shipping Policy",
      keywords: ["shipping", "delivery", "dispatch", "arrive", "how long", "fast delivery", "free shipping"],
      content: "🚚 We offer FREE shipping on all orders above ₹999. Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for an additional ₹99. Orders are dispatched within 24 hours of placement.",
    },
    {
      faqId: "faq-returns",
      title: "Return & Refund Policy",
      keywords: ["return", "refund", "exchange", "replacement", "send back", "money back"],
      content: "🔄 We have a hassle-free 10-day return policy. If you are not satisfied with your purchase, you can return the product within 10 days of delivery. Refunds are processed within 5-7 business days after we receive the returned item. Products must be in original condition with all accessories and packaging.",
    },
    {
      faqId: "faq-warranty",
      title: "Warranty Policy",
      keywords: ["warranty", "guarantee", "repair", "broken", "defective", "damaged"],
      content: "🛡️ All our products come with a minimum 1-year manufacturer warranty. Premium products like the Rockerz Studio and Aavante Bar 5000 come with a 2-year warranty. The warranty covers manufacturing defects. Accidental damage is not covered.",
    },
    {
      faqId: "faq-payment",
      title: "Payment Methods",
      keywords: ["payment", "pay", "upi", "credit card", "debit card", "cod", "cash", "emi", "net banking"],
      content: "💳 We accept all major payment methods: UPI (PhonePe, GPay, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery (COD). EMI options available on orders above ₹3,000.",
    },
    {
      faqId: "faq-categories",
      title: "Product Categories",
      keywords: ["categories", "category", "sell", "products", "what do you have", "what do you sell", "types"],
      content: "🛍️ We sell premium audio and tech products across 6 categories:\n• 🎧 Earbuds — Wireless earbuds with ANC, sports, and everyday options\n• 🎧 Headphones — On-ear, over-ear, kids, gaming headphones\n• 🔊 Speakers — Portable, party, outdoor, home, studio speakers\n• 📺 Soundbars — Compact to cinema-grade soundbars with subwoofers\n• ⌚ Smartwatches — Fitness, sports, fashion, and kids smartwatches\n• 🔌 Accessories — Chargers, cables, power banks, wireless pads",
    },
    {
      faqId: "faq-about",
      title: "About SonicHub",
      keywords: ["about", "who are you", "about you", "store", "brand", "company"],
      content: "🎵 SonicHub is a premium electronics and audio store. We specialize in high-quality earbuds, headphones, speakers, soundbars, smartwatches, and accessories. Our mission is to deliver the best audio experience at affordable prices. We carry top product lines including AirBass, Rockerz, SoundBlast, Aavante Bar, and Storm.",
    },
    {
      faqId: "faq-contact",
      title: "Contact & Support",
      keywords: ["contact", "support", "help", "customer care", "email", "phone", "call"],
      content: "📞 Our support team is available Mon–Sat, 9 AM to 6 PM.\n• Email: support@sonichub.com\n• Phone: 1800-SONIC-HUB (toll-free)\n• You can also use the Contact page on our website for queries.",
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log("🔗 Connected to MongoDB for seeding");

        // Clear existing data
        await Product.deleteMany({});
        await FAQ.deleteMany({});
        console.log("🗑️  Cleared existing Products and FAQs");

        // Transform products data to match Mongoose schema
        const productsToInsert = productsData.map(p => ({
            productId: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            rating: p.rating,
            images: p.images,
            description: p.description,
            features: p.features,
            specs: p.specs
        }));

        await Product.insertMany(productsToInsert);
        await FAQ.insertMany(faqEntries);

        console.log(`🌱 Seeded ${productsToInsert.length} products and ${faqEntries.length} FAQs into MongoDB`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDatabase();
