import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SoundWave
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-smooth">
              Products
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-smooth">
              Contact
            </Link>
            <Link to="/faq" className="text-foreground hover:text-primary transition-smooth">
              FAQ
            </Link>
            <Link to="/compare">
              <Button variant="outline" size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Compare
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className="block text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/faq"
              className="block text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <Link to="/compare" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Compare
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
