import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              SoundWave
            </h3>
            <p className="text-muted-foreground text-sm">
              Premium audio electronics for music lovers and tech enthusiasts.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/category/earbuds" className="hover:text-primary transition-smooth">
                  Earbuds
                </Link>
              </li>
              <li>
                <Link to="/category/headphones" className="hover:text-primary transition-smooth">
                  Headphones
                </Link>
              </li>
              <li>
                <Link to="/category/speakers" className="hover:text-primary transition-smooth">
                  Speakers
                </Link>
              </li>
              <li>
                <Link to="/category/soundbars" className="hover:text-primary transition-smooth">
                  Soundbars
                </Link>
              </li>
              <li>
                <Link to="/category/smartwatches" className="hover:text-primary transition-smooth">
                  Smartwatches
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-primary transition-smooth">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-smooth">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Warranty
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Shipping
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SoundWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
