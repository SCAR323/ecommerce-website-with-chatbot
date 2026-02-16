import { create } from 'zustand';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
}

interface CompareStore {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  compareProducts: [],
  addToCompare: (product) =>
    set((state) => {
      if (state.compareProducts.length >= 2) {
        return state;
      }
      if (state.compareProducts.find((p) => p.id === product.id)) {
        return state;
      }
      return { compareProducts: [...state.compareProducts, product] };
    }),
  removeFromCompare: (productId) =>
    set((state) => ({
      compareProducts: state.compareProducts.filter((p) => p.id !== productId),
    })),
  clearCompare: () => set({ compareProducts: [] }),
}));
