import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 

  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  const nombre = product.nombre || product.name;
  const precio = product.precio || product.price;
  const precioOriginal = product.priceOriginal || product.precioOriginal || product.originalPrice;
  const descripcion = product.descripcion || product.description;
  const tallesArray = product.talles || product.sizes || [];
  const categoria = product.categoria || product.category || 'Remera';

  const isCalzado = categoria.toLowerCase() === 'calzados';
  const tallesMaestros = isCalzado 
    ? ['38', '39', '40', '41', '42', '43', '44', '45']
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const tallesDisponibles = tallesArray.map(t => typeof t === 'string' ? t : t.name);

  const imagenes = (product.images && product.images.length > 0) 
    ? product.images.map(img => img.url) 
    : [product.imagen || product.image].filter(Boolean);

  let porcentajeDescuento = 0;
  if (precioOriginal && precioOriginal > precio) {
    porcentajeDescuento = Math.round(((precioOriginal - precio) / precioOriginal) * 100);
  }

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    toast.success(`${nombre} agregado al carrito`, {
      style: { background: '#1c1917', color: '#fafaf9', borderRadius: '100px', padding: '12px 24px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' },
    });
    onClose();
  };

  const handleBuyNow = () => {
    const numeroWhatsApp = "5492246488161";
    const total = precio * quantity;
    const talleElegido = selectedSize || (tallesDisponibles.length === 0 ? 'Único' : 'No especificado');
    
    let message = "¡Hola Bajo Perfil! Quiero confirmar mi pedido:\n\n";
    message += `- ${quantity}x ${nombre} (Talle: ${talleElegido}) - $${total.toLocaleString('es-AR')}\n`;
    message += `\nEnvío: A coordinar`;
    message += `\n*TOTAL FINAL: $${total.toLocaleString('es-AR')}*\n\n`;
    message += `¡Muchas gracias!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodedMessage}`, '_blank');
  };

  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const increaseQuantity = () => setQuantity(prev => prev + 1);

  const nextImage = (e) => {
    if(e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = (e) => {
    if(e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    // OPTIMIZACIÓN: Se cambió transition-all por transition-opacity y se sacó animación innecesaria
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-stone-900/80 backdrop-blur-sm p-0 md:p-6 transition-opacity duration-300">
      
      {/* OPTIMIZACIÓN: Agregado transform-gpu para aceleración por hardware */}
      <div className="relative flex flex-col md:flex-row w-full h-[92vh] md:h-auto md:max-w-5xl md:max-h-[85vh] bg-white rounded-t-[2rem] md:rounded-3xl overflow-hidden shadow-2xl transform-gpu">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 bg-white/70 backdrop-blur-md rounded-full shadow-sm hover:bg-stone-900 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MITAD IZQUIERDA: Imagen */}
        <div className="w-full h-[45%] md:h-auto md:w-1/2 bg-[#F5F5F5] relative flex items-center justify-center group">
          <img 
            src={imagenes[currentImageIndex]} 
            alt={`${nombre} - vista ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover md:object-contain transition-transform duration-500"
          />

          {imagenes.length > 1 && ChevronLeft && ChevronRight && (
            <>
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-stone-900 hover:bg-stone-900 hover:text-white transition-colors duration-200 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-stone-900 hover:bg-stone-900 hover:text-white transition-colors duration-200 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10">
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                {imagenes.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-colors duration-300 ${idx === currentImageIndex ? 'w-5 bg-stone-900' : 'w-1.5 bg-stone-400'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* MITAD DERECHA: Detalles */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto bg-white flex flex-col">
          
          <h2 className="text-2xl md:text-[30px] font-medium tracking-tight text-stone-900 mb-4 uppercase">
            {nombre}
          </h2> 
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-semibold text-[#D32F2F]">
                  ${Number(precio).toLocaleString('es-AR')} ARS
                </span>
                {precioOriginal && (
                  <span className="text-sm md:text-base text-stone-400 line-through">
                    ${Number(precioOriginal).toLocaleString('es-AR')} ARS
                  </span>
                )}
              </div>
              <p className="text-xs text-[#000000] font-medium opacity-80 mt-1">
                BAJO PERFIL // 2K26.
              </p>
            </div>

            {porcentajeDescuento > 0 && (
              <div className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                Ahorra {porcentajeDescuento}%
              </div>
            )}
          </div>

          <div className="mb-6 border-t border-stone-100 pt-6">
            <p className="text-sm text-stone-900 font-medium mb-3">
              Talles: <span className="font-bold">{selectedSize || ''}</span>
            </p>
            
            <div className="flex flex-wrap gap-2.5">
              {tallesDisponibles.length > 0 ? (
                tallesMaestros.map((talle) => {
                  const hayStock = tallesDisponibles.includes(talle);
                  const isSelected = selectedSize === talle;

                  return (
                    // OPTIMIZACIÓN: transition-colors en vez de transition-all
                    <button
                      key={talle}
                      disabled={!hayStock}
                      onClick={() => setSelectedSize(talle)}
                      className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm transition-colors duration-200
                        ${!hayStock 
                          ? 'border border-stone-200 text-stone-300 bg-stone-50 cursor-not-allowed line-through' 
                          : isSelected 
                            ? 'border-2 border-stone-900 text-stone-900 font-bold bg-white' 
                            : 'border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900 bg-white cursor-pointer'
                        }`}
                    >
                      {talle}
                    </button>
                  );
                })
              ) : (
                <span className="text-sm text-stone-500 font-medium py-2">Talle Único</span>
              )}
            </div>
            
            <p className="text-[11px] text-stone-500 mt-4 leading-relaxed">
              <span className="font-bold text-stone-900">ATENCIÓN:</span> Chequear la tabla de talle porque las medidas pueden variar inclusive en un mismo producto.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-stone-900 font-medium mb-3">Cantidad:</p>
            
            <div className="flex items-center justify-between border border-stone-300 rounded-full h-12 w-32 px-2 bg-white mb-5">
              <button onClick={decreaseQuantity} className="w-10 h-full flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors duration-200 font-medium cursor-pointer">-</button>
              <div className="flex-1 text-center font-bold text-stone-900 text-sm">{quantity}</div>
              <button onClick={increaseQuantity} className="w-10 h-full flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors duration-200 font-medium cursor-pointer">+</button>
            </div>
            
            <div className="flex flex-col gap-3">
              {/* OPTIMIZACIÓN: transition-colors en vez de transition-all */}
              <button 
                onClick={handleAddToCart}
                disabled={!selectedSize && tallesDisponibles.length > 0}
                className={`w-full h-12 flex items-center justify-center text-xs font-bold tracking-widest uppercase rounded-full transition-colors duration-200 ${
                  selectedSize || tallesDisponibles.length === 0
                    ? 'bg-black text-white hover:bg-stone-800 shadow-md cursor-pointer' 
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                }`}
              >   
                {selectedSize || tallesDisponibles.length === 0 ? 'Agregar al carrito' : 'Seleccioná un talle'}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={!selectedSize && tallesDisponibles.length > 0}
                className={`w-full h-12 flex items-center justify-center text-xs font-bold tracking-widest uppercase rounded-full transition-colors duration-200 border-2 ${
                  selectedSize || tallesDisponibles.length === 0
                    ? 'border-black bg-black text-white hover:bg-white hover:text-black shadow-md cursor-pointer' 
                    : 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
                }`}
              >
                Comprar Ahora
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-stone-100">
            <p className="text-stone-600 text-xs leading-relaxed font-medium">
              {descripcion}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}