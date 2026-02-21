import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Check, ShoppingCart } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/hooks/use-toast";
import productsData from "@/data/products.json";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCompare } = useCompareStore();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const product = productsData.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCompare = () => {
    addToCompare(product);
    toast({
      title: "Added to Compare",
      description: `${product.name} has been added to comparison`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted/50 mb-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted/50">
                <img
                  src={image}
                  alt={`${product.name} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 fill-accent text-accent mr-1" />
            <span className="text-lg">{product.rating}</span>
          </div>
          <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="flex gap-4 mb-8">
            <Button
              size="lg"
              className="flex-1 bg-gradient-accent hover:opacity-90"
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  category: product.category,
                });
                toast({
                  title: "Added to Cart 🛒",
                  description: `${product.name} has been added to your cart.`,
                });
                navigate("/cart");
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  category: product.category,
                });
                toast({
                  title: "Added to Cart 🛒",
                  description: `${product.name} has been added to your cart.`,
                });
              }}
            >
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToCompare}
            >
              Add to Compare
            </Button>
          </div>

          {/* Features */}
          <Card className="mb-6 bg-gradient-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <dl className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
