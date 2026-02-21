import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  rating: number;
  images: string[];
  category: string;
}

export const ProductCard = ({ id, name, price, rating, images, category }: ProductCardProps) => {
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, name, price, image: images[0], category });
    toast({
      title: "Added to Cart 🛒",
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-glow transition-smooth bg-gradient-card border-border">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-muted/50">
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 fill-accent text-accent mr-1" />
          <span className="text-sm text-muted-foreground">{rating}</span>
        </div>
        <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          ₹{price.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link to={`/product/${id}`} className="flex-1">
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-smooth">
            View Details
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddToCart}
          className="flex-shrink-0 hover:bg-primary/10 hover:text-primary transition-smooth"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

