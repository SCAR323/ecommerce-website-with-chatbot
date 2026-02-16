import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "What is the battery life of your wireless earbuds?",
      answer:
        "Our wireless earbuds offer 30-48 hours of total playtime with the charging case, depending on the model. Single charge playback ranges from 6-12 hours.",
    },
    {
      question: "Do your products come with a warranty?",
      answer:
        "Yes, all SoundWave products come with a 1-year manufacturer warranty covering manufacturing defects. Extended warranty options are available at checkout.",
    },
    {
      question: "How do I charge my wireless earbuds/headphones?",
      answer:
        "Most of our products use USB-C charging for fast and convenient charging. Some premium models also support wireless charging. A full charge typically takes 1-2 hours.",
    },
    {
      question: "What is the Bluetooth range of your products?",
      answer:
        "Our products use Bluetooth 5.0 or higher, providing a stable connection range of up to 10-30 meters (33-100 feet) depending on the model and environment.",
    },
    {
      question: "Are your earbuds water-resistant?",
      answer:
        "Yes, most of our earbuds feature IPX5 to IPX7 water resistance, protecting them from sweat and rain. Check individual product specifications for exact ratings.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 7-day return policy from the date of delivery. Products must be unused and in original packaging. Return shipping is free for defective items.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-7 business days. Express shipping (1-3 days) is available at checkout. We provide tracking information for all orders.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we ship within India. International shipping options are coming soon. Sign up for our newsletter to be notified when we expand.",
    },
    {
      question: "How do I activate noise cancellation?",
      answer:
        "Active Noise Cancellation (ANC) can be activated through touch controls on the earbuds or via the companion app. Press and hold for 2 seconds to toggle ANC on/off.",
    },
    {
      question: "Can I use only one earbud at a time?",
      answer:
        "Yes, all our wireless earbuds support mono mode, allowing you to use either the left or right earbud independently for calls and music.",
    },
    {
      question: "What codec support do your products have?",
      answer:
        "Our premium products support advanced codecs including AAC, SBC, and LDAC for high-quality wireless audio transmission with minimal latency.",
    },
    {
      question: "How do I pair my earbuds with multiple devices?",
      answer:
        "Our products support multipoint connectivity, allowing connection to two devices simultaneously. Use the companion app or follow the quick start guide for setup instructions.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground mb-12 text-center">
          Find answers to common questions about our products and services
        </p>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-gradient-primary">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-primary-foreground">
              Still have questions?
            </h2>
            <p className="text-primary-foreground/90 mb-4">
              Our AI assistant is available 24/7 to help you find the perfect product
              or answer any questions you may have.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
