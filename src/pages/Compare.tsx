import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { Link } from "react-router-dom";

const Compare = () => {
  const { compareProducts, removeFromCompare, clearCompare } = useCompareStore();
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    if (compareProducts.length !== 2) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Compare ${compareProducts[0].name} and ${compareProducts[1].name}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch summary");
      
      const data = await response.json();
      setSummary(data.reply);
    } catch (error) {
      console.error("Error generating comparison summary:", error);
      setSummary("Sorry, I encountered an error while generating the comparison. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <Card className="bg-gradient-card border-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <CardTitle className="text-xl">AI Comparison Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!summary && !isLoading && (
              <>
                <p className="text-muted-foreground mb-4">
                  Need help deciding? Our AI assistant can analyze the specifications, pricing, and features of these products to give you a personalized recommendation.
                </p>
                <Button 
                  onClick={generateSummary}
                  className="bg-gradient-accent hover:opacity-90 shadow-lg shadow-accent/20"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Analysis
                </Button>
              </>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">
                  AI is analyzing specifications and features...
                </p>
              </div>
            )}

            {summary && !isLoading && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="prose prose-invert max-w-none">
                  {summary.split('\n').map((line, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSummary(null)}
                  className="mt-4"
                >
                  Clear Summary
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Compare;
