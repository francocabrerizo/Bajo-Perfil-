import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  // Los productos guardados
  items: [],
  // El estado visual del panel
  isOpen: false,

  // Funciones para abrir y cerrar
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  // Agregar al carrito
  addItem: (product, size, quantity) => {
    const currentItems = get().items;
    const existingItem = currentItems.find(
      (item) => item.id === product.id && item.size === size
    );

    if (existingItem) {
      set({
        items: currentItems.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({ items: [...currentItems, { ...product, size, quantity }] });
    }
  },

  // Eliminar del carrito
  removeItem: (productId, size) => {
    set({
      items: get().items.filter(
        (item) => !(item.id === productId && item.size === size)
      ),
    });
  },

  // Calcular precio total
  getTotalPrice: () => get().items.reduce((total, item) => total + (Number(item.precio || item.price) * item.quantity), 0),
}));