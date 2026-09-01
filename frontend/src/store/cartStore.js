import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // NUEVO: Importamos el persist

export const useCartStore = create(
  persist(
    (set, get) => ({
      // === ESTADOS ===
      items: [],
      isOpen: false,
      shippingCost: 0,
      zipCode: '',

      // === ACCIONES ===
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, size, quantity) => {
        const items = get().items;
        // Buscamos si ya existe el mismo producto con el mismo talle
        const existingItem = items.find(
          (item) => item.id === product.id && item.size === size
        );

        if (existingItem) {
          // Si existe, le sumamos la cantidad
          set({
            items: items.map((item) =>
              item.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isOpen: true, // Abre el carrito automáticamente
          });
        } else {
          // Si no existe, lo agregamos como nuevo
          set({
            items: [...items, { ...product, size, quantity }],
            isOpen: true, // Abre el carrito automáticamente
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

      setShipping: (cost, zip) => {
        set({ shippingCost: cost, zipCode: zip });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = Number(item.precio || item.price || 0);
          return total + price * item.quantity;
        }, 0);
      },

      getFinalTotal: () => {
        return get().getTotalPrice() + get().shippingCost;
      },
    }),
    {
      name: 'bajo-perfil-cart', // El nombre de la cajita secreta en el navegador
      // Opcional: Si querés que el carrito se guarde cerrado cuando recargan la página
      partialize: (state) => ({ 
        items: state.items, 
        shippingCost: state.shippingCost, 
        zipCode: state.zipCode 
      }),
    }
  )
);