import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // === ESTADOS ===
      items: [],
      isOpen: false,

      // === ACCIONES ===
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, size, quantity) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && item.size === size
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isOpen: true, 
          });
        } else {
          set({
            items: [...items, { ...product, size, quantity }],
            isOpen: true,
          });
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.size === size)
          ),
        });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = Number(item.precio || item.price || 0);
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'bajo-perfil-cart', 
      partialize: (state) => ({ 
        items: state.items
      }),
    }
  )
);