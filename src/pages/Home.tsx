import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Headphones, Speaker, Watch, Zap } from "lucide-react";
import productsData from "@/data/products.json";

const Home = () => {
  const featuredProducts = productsData.slice(0, 4);
  const bestSellers = productsData.filter((p) => p.rating >= 4.5).slice(0, 4);

  const categories = [
    { name: "Earbuds", icon: Headphones, path: "/category/earbuds" },
    { name: "Headphones", icon: Headphones, path: "/category/headphones" },
    { name: "Speakers", icon: Speaker, path: "/category/speakers" },
    { name: "Smartwatches", icon: Watch, path: "/category/smartwatches" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Experience Sound
            <br />
            Like Never Before
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Premium audio electronics designed for music lovers and tech enthusiasts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-smooth">
                <Zap className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} to={category.path}>
              <div className="group p-6 rounded-xl bg-gradient-card border border-border hover:shadow-glow transition-smooth cursor-pointer text-center">
                <category.icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-smooth" />
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Best Sellers</h2>
          <Link to="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-card border border-border rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our AI assistant can help you find the perfect product for your needs
          </p>
          <Button size="lg" className="bg-gradient-accent hover:opacity-90 transition-smooth">
            Chat with AI Assistant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
