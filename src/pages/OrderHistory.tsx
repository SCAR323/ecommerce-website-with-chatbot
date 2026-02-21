import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
}

interface Order {
    _id: string;
    orderItems: OrderItem[];
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

const OrderHistory = () => {
    const { token, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            setLoading(false);
            return;
        }

        fetch("http://localhost:5000/api/orders/myorders", {
            headers: { "x-auth-token": token },
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch orders");
            })
            .then((data) => setOrders(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [token, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Package className="h-24 w-24 mx-auto text-muted-foreground/40 mb-6" />
                <h1 className="text-3xl font-bold mb-3">Login Required</h1>
                <p className="text-muted-foreground mb-8">
                    Please log in to view your order history.
                </p>
                <Link to="/login">
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                        Login
                    </Button>
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-lg text-muted-foreground">Loading your orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/40 mb-6" />
                <h1 className="text-3xl font-bold mb-3">No Orders Yet</h1>
                <p className="text-muted-foreground mb-8">
                    You haven't placed any orders yet. Start shopping!
                </p>
                <Link to="/products">
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                        Browse Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Order History</h1>

            <div className="space-y-6">
                {orders
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .map((order) => (
                        <Card
                            key={order._id}
                            className="bg-gradient-card border-border overflow-hidden"
                        >
                            <CardContent className="p-6">
                                {/* Order Header */}
                                <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Order #{order._id ? order._id.slice(-8).toUpperCase() : "UNKNOWN"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={order.isPaid ? "default" : "destructive"}
                                            className={
                                                order.isPaid
                                                    ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                                    : ""
                                            }
                                        >
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </Badge>
                                        <Badge
                                            variant={order.isDelivered ? "default" : "secondary"}
                                            className={
                                                order.isDelivered
                                                    ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                                                    : ""
                                            }
                                        >
                                            {order.isDelivered ? "Delivered" : "Processing"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3 mb-4">
                                    {order.orderItems.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 py-2 border-b border-border last:border-0"
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

                                {/* Order Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Shipped to: {order.shippingAddress.city},{" "}
                                            {order.shippingAddress.country}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total</p>
                                        <p className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                            ₹{order.totalPrice.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
};

export default OrderHistory;
