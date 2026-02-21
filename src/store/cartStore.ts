import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    qty: number;
    category: string;
}

interface CartStore {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
    removeFromCart: (id: number) => void;
    updateQty: (id: number, qty: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cartItems: [],

            addToCart: (item, qty = 1) =>
                set((state) => {
                    const existing = state.cartItems.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            cartItems: state.cartItems.map((i) =>
                                i.id === item.id ? { ...i, qty: i.qty + qty } : i
                            ),
                        };
                    }
                    return {
                        cartItems: [...state.cartItems, { ...item, qty }],
                    };
                }),

            removeFromCart: (id) =>
                set((state) => ({
                    cartItems: state.cartItems.filter((i) => i.id !== id),
                })),

            updateQty: (id, qty) =>
                set((state) => ({
                    cartItems: state.cartItems.map((i) =>
                        i.id === id ? { ...i, qty: Math.max(1, qty) } : i
                    ),
                })),

            clearCart: () => set({ cartItems: [] }),

            getCartTotal: () => {
                const { cartItems } = get();
                return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
            },

            getCartCount: () => {
                const { cartItems } = get();
                return cartItems.reduce((sum, item) => sum + item.qty, 0);
            },
        }),
        {
            name: 'sonic-hub-cart',
        }
    )
);
