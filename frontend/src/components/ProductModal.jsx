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
  const precioOriginal = product.precioOriginal || product.originalPrice;
  const descripcion = product.descripcion || product.description;
  const talles = product.talles || product.sizes || [];
  const categoria = product.categoria || product.category || 'Catálogo';

  const refCode = `REF:BP-${(product.id || 0).toString().padStart(3, '0')}`;

  const imagenes = (product.images && product.images.length > 0) 
    ? product.images.map(img => img.url) 
    : [product.imagen || product.image].filter(Boolean);

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    toast.success(`${nombre} agregado al carrito`, {
      style: { background: '#1c1917', color: '#fafaf9', borderRadius: '100px', padding: '12px 24px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' },
    });
    onClose();
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
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-stone-900/80 backdrop-blur-sm p-0 md:p-6 transition-all">
      
      {/* Contenedor Principal: Bordes curvos (rounded-3xl) haciendo juego con las tarjetas */}
      <div className="relative flex flex-col md:flex-row w-full h-[92vh] md:h-auto md:max-w-5xl md:max-h-[85vh] bg-white rounded-t-[2rem] md:rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Botón Cerrar (X) redondeado */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 text-stone-900 bg-white/70 backdrop-blur-md border border-stone-200/50 rounded-full shadow-sm hover:bg-stone-900 hover:text-white transition-all duration-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MITAD IZQUIERDA: Imagen y Carrusel */}
        <div className="w-full h-[45%] md:h-auto md:w-1/2 bg-[#F9F9F9] relative flex items-center justify-center group">
          <img 
            src={imagenes[currentImageIndex]} 
            alt={`${nombre} - vista ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover md:object-contain transition-transform duration-700"
          />

          {imagenes.length > 1 && ChevronLeft && ChevronRight && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-stone-900 hover:bg-stone-900 hover:text-white transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-stone-900 hover:bg-stone-900 hover:text-white transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Indicadores formato píldora */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                {imagenes.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-5 bg-stone-900' : 'w-1.5 bg-stone-400'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* MITAD DERECHA: Detalles de la prenda */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto bg-white flex flex-col">
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] text-stone-400 tracking-[0.15em] uppercase font-semibold">{refCode}</span>
            <span className="text-[10px] text-stone-500 tracking-[0.15em] uppercase font-medium bg-stone-50 px-3 py-1 rounded-full border border-stone-100">{categoria}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 mb-2 leading-tight">
            {nombre}
          </h2>
          
          <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-stone-50">
            <span className="text-2xl md:text-3xl font-black text-stone-900">
              ${Number(precio).toLocaleString('es-AR')}
            </span>
            {precioOriginal && (
              <span className="text-sm md:text-base text-stone-400 line-through font-medium">
                ${Number(precioOriginal).toLocaleString('es-AR')}
              </span>
            )}
          </div>

          {/* Talles en botones redondos (píldoras) */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                Talles
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {talles.map((talle, index) => {
                const nombreTalle = talle.name || talle;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(nombreTalle)}
                    className={`min-w-[3rem] px-4 py-2.5 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200 cursor-pointer border ${
                      selectedSize === nombreTalle 
                        ? 'border-stone-900 bg-stone-900 text-white shadow-md' 
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-900 hover:text-stone-900'
                    }`}
                  >
                    {nombreTalle}
                  </button>
                );
              })}
              {talles.length === 0 && (
                <span className="text-sm text-stone-500 font-medium py-2">Único</span>
              )}
            </div>
          </div>

          {/* Controles de cantidad y botón Agregar al Carrito */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center justify-between bg-white border border-stone-200 rounded-full h-14 w-full sm:w-36 px-2">
              <button onClick={decreaseQuantity} className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-all cursor-pointer font-medium">-</button>
              <div className="flex-1 text-center font-bold text-stone-900">{quantity}</div>
              <button onClick={increaseQuantity} className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-all cursor-pointer font-medium">+</button>
            </div>
            
            <button 
                onClick={handleAddToCart}
                className={`flex-1 h-14 flex items-center justify-center text-xs font-bold tracking-[0.15em] uppercase rounded-full transition-all duration-300 ${
                 selectedSize || talles.length === 0
                  ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/10 hover:-translate-y-0.5 cursor-pointer' 
                  : 'bg-stone-50 text-stone-400 cursor-not-allowed border border-stone-200'
                }`}
                 disabled={!selectedSize && talles.length > 0}
            >   
                {selectedSize || talles.length === 0 ? 'Agregar al carrito' : 'Seleccioná un talle'}
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-stone-50">
            <div className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-3">
              Descripción
            </div>
            <p className="text-stone-600 text-sm leading-relaxed font-medium">
              {descripcion}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}