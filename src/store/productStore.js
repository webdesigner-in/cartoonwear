import { create } from 'zustand';

export const useProductStore = create((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  // Product state (can be expanded)
  products: [],
  setProducts: (products) => set({ products }),
  fetchProducts: async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      set({ products: data.products });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },
  
  // Cart state (can be expanded)
  cart: [],
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
}));
