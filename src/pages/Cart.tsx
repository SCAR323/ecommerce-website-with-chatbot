import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, getCartTotal, clearCart } =
        useCartStore();

    const total = getCartTotal();
    const shipping = total > 5000 ? 0 : 99;
    const tax = Math.round(total * 0.18);
    const grandTotal = total + shipping + tax;

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/40 mb-6" />
                    <h1 className="text-3xl font-bold mb-3">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/products">
                        <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-smooth">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                    Clear Cart
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <Card key={item.id} className="bg-gradient-card border-border overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="font-semibold text-lg hover:text-primary transition-smooth truncate">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-muted-foreground capitalize mb-2">
                                            {item.category}
                                        </p>
                                        <p className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                            ₹{item.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-2 py-1">
                                            <button
                                                onClick={() => updateQty(item.id, item.qty - 1)}
                                                className="text-muted-foreground hover:text-foreground transition-smooth p-1"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="font-medium w-6 text-center text-sm">
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() => updateQty(item.id, item.qty + 1)}
                                                className="text-muted-foreground hover:text-foreground transition-smooth p-1"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="bg-gradient-card border-border sticky top-24">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Tax (18% GST)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-border pt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="bg-gradient-primary bg-clip-text text-transparent">
                                            ₹{grandTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {shipping === 0 && (
                                <p className="text-xs text-green-500 mb-4">
                                    🎉 You qualify for free shipping!
                                </p>
                            )}
                            <Link to="/checkout">
                                <Button className="w-full bg-gradient-primary hover:opacity-90 transition-smooth" size="lg">
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/products" className="block mt-3">
                                <Button variant="outline" className="w-full" size="lg">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Cart;
