import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Package, ListOrdered } from "lucide-react";

export default function AdminDashboard() {
    const { user, token, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<"products" | "add-product" | "orders">("products");
    
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

    const [newProduct, setNewProduct] = useState({
        name: "", price: "", category: "earbuds", description: "", image: ""
    });

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        if (!isAuthenticated || user?.isAdmin !== true) {
            navigate("/");
            return;
        }
        fetchData();
    }, [isAuthenticated, user, activeTab]);

    const fetchData = async () => {
        if (activeTab === "products") {
            const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
                headers: { "x-auth-token": token || "" }
            });
            if (res.ok) setProducts(await res.json());
        } else if (activeTab === "orders") {
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                headers: { "x-auth-token": token || "" }
            });
            if (res.ok) setOrders(await res.json());
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-auth-token": token || "" },
            body: JSON.stringify(newProduct)
        });

        if (res.ok) {
            toast({ title: "Success", description: "Product added successfully!" });
            setNewProduct({ name: "", price: "", category: "earbuds", description: "", image: "" });
            setActiveTab("products");
        } else {
            toast({ title: "Error", description: "Failed to add product.", variant: "destructive" });
        }
    };

    const handleDeleteProduct = async (id: number) => {
        const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
            method: "DELETE",
            headers: { "x-auth-token": token || "" }
        });
        if (res.ok) {
            toast({ title: "Deleted", description: "Product removed." });
            fetchData();
        }
    };

    if (!user?.isAdmin) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                ⚙️ Admin Panel
            </h1>

            <div className="flex gap-4 mb-8">
                <Button 
                    variant={activeTab === "products" ? "default" : "outline"} 
                    onClick={() => setActiveTab("products")}
                    className={activeTab === "products" ? "bg-gradient-primary" : ""}
                >
                    <Package className="mr-2 h-4 w-4" /> View Products
                </Button>
                <Button 
                    variant={activeTab === "add-product" ? "default" : "outline"} 
                    onClick={() => setActiveTab("add-product")}
                    className={activeTab === "add-product" ? "bg-gradient-primary" : ""}
                >
                    ➕ Add Product
                </Button>
                <Button 
                    variant={activeTab === "orders" ? "default" : "outline"} 
                    onClick={() => setActiveTab("orders")}
                    className={activeTab === "orders" ? "bg-gradient-primary" : ""}
                >
                    <ListOrdered className="mr-2 h-4 w-4" /> View Orders
                </Button>
            </div>

            {/* TAB: View Products */}
            {activeTab === "products" && (
                <div className="bg-gradient-card border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={p.images?.[0] || p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                                        {p.name}
                                    </td>
                                    <td className="p-4 capitalize">{p.category}</td>
                                    <td className="p-4">₹{p.price}</td>
                                    <td className="p-4">
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(p.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB: Add Product */}
            {activeTab === "add-product" && (
                <form onSubmit={handleAddProduct} className="max-w-xl space-y-4 bg-gradient-card p-6 rounded-xl border border-border">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Product Name" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Price (₹)</label>
                        <Input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="e.g. 2999" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Category</label>
                        <select 
                            required 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={newProduct.category} 
                            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        >
                            <option value="earbuds">Earbuds</option>
                            <option value="headphones">Headphones</option>
                            <option value="speakers">Speakers</option>
                            <option value="soundbars">Soundbars</option>
                            <option value="smartwatches">Smartwatches</option>
                            <option value="accessories">Accessories</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Brief description" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Image URL</label>
                        <Input required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://..." />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-primary">Save Product</Button>
                </form>
            )}

            {/* TAB: View Orders */}
            {activeTab === "orders" && (
                <div className="bg-gradient-card border border-border rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o._id} className="border-b border-border last:border-0 hover:bg-muted/20">
                                    <td className="p-4 text-xs font-mono text-muted-foreground">{o._id}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{o.user?.username || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{o.user?.email || ''}</div>
                                    </td>
                                    <td className="p-4 font-semibold text-primary">₹{o.totalPrice}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${o.isPaid ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                            {o.isPaid ? 'PAID' : 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
