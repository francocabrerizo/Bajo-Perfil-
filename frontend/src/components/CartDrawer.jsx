import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, getTotalPrice } = useCartStore();

  // NUEVOS ESTADOS PARA EL ENVÍO
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCalculated, setShippingCalculated] = useState(false);

  if (!isOpen) return null;

  // Lógica de cálculo de envío
  const calculateShipping = () => {
    if (!postalCode.trim()) return;
    
    if (postalCode.trim() === '7600') {
      setShippingCost(1500); // Envío local Mar del Plata
    } else {
      setShippingCost(4500); // Envío resto del país
    }
    setShippingCalculated(true);
  };

  // Lógica para enviar el pedido por WhatsApp actualizada
  const handleWhatsAppCheckout = () => {
    const phoneNumber = "5492246488161"; 
    const subtotal = getTotalPrice();
    const totalFinal = shippingCalculated ? subtotal + shippingCost : subtotal;
    
    let message = "¡Hola Bajo Perfil! Quiero confirmar mi pedido:\n\n";
    
    items.forEach(item => {
      const nombre = item.nombre || item.name;
      const precio = Number(item.precio || item.price);
      message += `- ${item.quantity}x ${nombre} (Talle: ${item.size}) - $${precio.toLocaleString('es-AR')}\n`;
    });
    
    message += `\nSubtotal: $${subtotal.toLocaleString('es-AR')}`;
    
    if (shippingCalculated) {
      message += `\nEnvío (CP: ${postalCode}): $${shippingCost.toLocaleString('es-AR')}`;
    } else {
      message += `\nEnvío: A coordinar`;
    }
    
    message += `\n*TOTAL FINAL: $${totalFinal.toLocaleString('es-AR')}*\n\n`;
    message += `¡Muchas gracias!`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
        onClick={closeCart}
      />
      
      <div className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white">
          <h2 className="text-lg font-bold tracking-widest uppercase text-stone-900">Tu Carrito</h2>
          <button onClick={closeCart} className="p-2 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-500 space-y-4">
              <p className="tracking-widest uppercase text-sm font-medium">El carrito está vacío</p>
              <button onClick={closeCart} className="text-xs font-bold border-b border-stone-900 text-stone-900 pb-1 uppercase tracking-widest hover:text-stone-600 transition-colors cursor-pointer">
                Explorar catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-white p-3 border border-stone-100 shadow-sm group">
                <div className="w-20 h-24 bg-stone-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={(item.images && item.images[0]?.url) || item.imagen || item.image} 
                    alt={item.nombre || item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide line-clamp-1">{item.nombre || item.name}</h3>
                    <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest">Talle: {item.size}</p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest">Cant: {item.quantity}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-stone-900">
                      ${(Number(item.precio || item.price) * item.quantity).toLocaleString('es-AR')}
                    </span>
                    <button onClick={() => removeItem(item.id, item.size)} className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.03)] flex flex-col gap-4">
            
            {/* NUEVO: Calculadora de envío */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 tracking-widest uppercase mb-2">
                Calcular Envío
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código Postal (ej: 7600)"
                  className="flex-1 p-3 text-sm border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <button
                  onClick={calculateShipping}
                  className="px-6 py-3 bg-stone-200 text-stone-900 text-xs font-bold tracking-widest uppercase hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  Calcular
                </button>
              </div>
            </div>

            {/* Resumen de totales actualizado */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between items-center text-sm text-stone-500 font-medium">
                <span>Subtotal</span>
                <span>${getTotalPrice().toLocaleString('es-AR')}</span>
              </div>
              
              {shippingCalculated && (
                <div className="flex justify-between items-center text-sm text-stone-500 font-medium">
                  <span>Envío (CP: {postalCode})</span>
                  <span>${shippingCost.toLocaleString('es-AR')}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                <span className="text-sm font-bold tracking-widest uppercase text-stone-900">Total Final</span>
                <span className="text-xl font-bold text-stone-900">
                  ${(getTotalPrice() + (shippingCalculated ? shippingCost : 0)).toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <button onClick={handleWhatsAppCheckout} className="w-full h-14 bg-stone-900 text-white text-sm font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors cursor-pointer mt-2">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}