import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, getTotalPrice } = useCartStore();

  const [postalCode, setPostalCode] = useState('');
  const [mensajeEnvio, setMensajeEnvio] = useState('');

  if (!isOpen) return null;

  // Lógica "falsa" para el envío
  const handleCalcularEnvio = (e) => {
    e.preventDefault();
    if (postalCode.trim().length >= 4) {
      setMensajeEnvio("Acordar con el vendedor en el momento de concretar la compra.");
    } else {
      setMensajeEnvio("Por favor, ingresá un código postal válido.");
    }
  };

  // Lógica de WhatsApp actualizada (sin sumar envíos)
  const handleWhatsAppCheckout = () => {
    const phoneNumber = "5492246488161"; 
    const subtotal = getTotalPrice();
    
    let message = "¡Hola Bajo Perfil! Quiero confirmar mi pedido:\n\n";
    
    items.forEach(item => {
      const nombre = item.nombre || item.name;
      const precio = Number(item.precio || item.price);
      message += `- ${item.quantity}x ${nombre} (Talle: ${item.size}) - $${precio.toLocaleString('es-AR')}\n`;
    });
    
    message += `\nEnvío: A coordinar`;
    message += `\n*TOTAL FINAL: $${subtotal.toLocaleString('es-AR')}*\n\n`;
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
      
      <div className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white">
          <h2 className="text-lg font-bold tracking-widest uppercase text-stone-900">Tu Carrito</h2>
          <button onClick={closeCart} className="p-2 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer rounded-full hover:bg-stone-100">
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
              <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm group">
                <div className="w-20 h-24 bg-stone-100 overflow-hidden flex-shrink-0 rounded-xl">
                  <img 
                    src={(item.images && item.images[0]?.url) || item.imagen || item.image} 
                    alt={item.nombre || item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
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
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-bold tracking-widest uppercase text-stone-900">Total</span>
              <span className="text-xl font-bold text-stone-900">
                ${getTotalPrice().toLocaleString('es-AR')}
              </span>
            </div>

            {/* Sección de Envío Estilo Premium */}
            <div className="border-t border-stone-100 pt-6 mt-2">
              <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-4">
                Calculador de Envío
              </p>
              
              <form onSubmit={handleCalcularEnvio} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tu Código Postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="flex-1 h-12 px-5 border border-stone-200 rounded-full text-sm font-medium focus:outline-none focus:border-stone-900 transition-colors bg-stone-50"
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-stone-900 text-white rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Calcular
                </button>
              </form>

              {mensajeEnvio && (
                <div className="mt-4 p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                  <p className="text-xs text-stone-600 font-medium leading-relaxed text-center">
                    {mensajeEnvio}
                  </p>
                </div>
              )}
            </div>

            <button onClick={handleWhatsAppCheckout} className="w-full h-14 bg-stone-900 text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors cursor-pointer mt-2 shadow-lg shadow-stone-900/10 hover:-translate-y-0.5">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}