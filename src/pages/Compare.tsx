import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { Link } from "react-router-dom";

const Compare = () => {
  const { compareProducts, removeFromCompare, clearCompare } = useCompareStore();

  if (compareProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Comparison</h1>
        <p className="text-muted-foreground mb-8">
          No products selected for comparison
        </p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Compare Products</h1>
        <Button variant="outline" onClick={clearCompare}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {compareProducts.map((product) => (
          <Card key={product.id} className="bg-gradient-card border-border">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeFromCompare(product.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted/50 mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle>{product.name}</CardTitle>
              <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ₹{product.price.toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {product.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Specifications</h4>
                  <dl className="space-y-1 text-sm">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-muted-foreground">{key}:</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {compareProducts.length === 2 && (
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Comparison Summary</h3>
            <p className="text-muted-foreground mb-4">
              Need help deciding? Our AI assistant can provide a detailed comparison and recommendation.
            </p>
            <Button className="bg-gradient-accent hover:opacity-90">
              Ask AI Assistant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Compare;
