import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "@/components/PaymentModal";

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCartStore();
    const { isAuthenticated, token } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [showPayment, setShowPayment] = useState(false);
    const [shipping, setShipping] = useState({
        address: "",
        city: "",
        postalCode: "",
        country: "India",
    });

    const total = getCartTotal();
    const shippingCost = total > 5000 ? 0 : 99;
    const tax = Math.round(total * 0.18);
    const grandTotal = total + shippingCost + tax;

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/40 mb-6" />
                <h1 className="text-3xl font-bold mb-3">Nothing to Checkout</h1>
                <p className="text-muted-foreground mb-8">Add items to your cart first.</p>
                <Link to="/products">
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                        Browse Products
                    </Button>
                </Link>
            </div>
        );
    }

    const handleProceedToPayment = () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please log in to place your order.",
                variant: "destructive",
            });
            navigate("/login");
            return;
        }
        if (!shipping.address || !shipping.city || !shipping.postalCode) {
            toast({
                title: "Missing Details",
                description: "Please fill in all shipping fields.",
                variant: "destructive",
            });
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentSuccess = async () => {
        try {
            const orderPayload = {
                orderItems: cartItems.map((item) => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item.id,
                })),
                shippingAddress: shipping,
                paymentMethod: "Card",
                itemsPrice: total,
                taxPrice: tax,
                shippingPrice: shippingCost,
                totalPrice: grandTotal,
            };

            const res = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token || "",
                },
                body: JSON.stringify(orderPayload),
            });

            if (!res.ok) {
                throw new Error("Failed to create order");
            }

            // Mark as paid
            const order = await res.json();
            await fetch(`http://localhost:5000/api/orders/${order._id}/pay`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token || "",
                },
                body: JSON.stringify({
                    id: `SIM_${Date.now()}`,
                    status: "COMPLETED",
                    update_time: new Date().toISOString(),
                    email_address: "simulation@sonic-hub.com",
                }),
            });

            clearCart();
            setShowPayment(false);
            toast({
                title: "Order Placed! 🎉",
                description: "Your order has been successfully placed.",
            });
            navigate("/orders");
        } catch (err) {
            toast({
                title: "Order Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-smooth mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
            </Link>

            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2">
                    <Card className="bg-gradient-card border-border">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="Enter your street address"
                                        value={shipping.address}
                                        onChange={(e) =>
                                            setShipping({ ...shipping, address: e.target.value })
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            placeholder="Enter city"
                                            value={shipping.city}
                                            onChange={(e) =>
                                                setShipping({ ...shipping, city: e.target.value })
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input
                                            id="postalCode"
                                            placeholder="Enter postal code"
                                            value={shipping.postalCode}
                                            onChange={(e) =>
                                                setShipping({ ...shipping, postalCode: e.target.value })
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={shipping.country}
                                        onChange={(e) =>
                                            setShipping({ ...shipping, country: e.target.value })
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cart Items Summary */}
                    <Card className="bg-gradient-card border-border mt-6">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 py-2 border-b border-border last:border-0"
                                    >
                                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted/50 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.qty}
                                            </p>
                                        </div>
                                        <p className="font-semibold">
                                            ₹{(item.price * item.qty).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Price Summary */}
                <div>
                    <Card className="bg-gradient-card border-border sticky top-24">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-6">Price Details</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Items Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
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
                            <Button
                                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                                size="lg"
                                onClick={handleProceedToPayment}
                            >
                                Place Order & Pay
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                open={showPayment}
                onClose={() => setShowPayment(false)}
                onSuccess={handlePaymentSuccess}
                amount={grandTotal}
            />
        </div>
    );
};

export default Checkout;
