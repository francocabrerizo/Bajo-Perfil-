import { useState } from 'react';
import { X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductModal({ product, onClose }) {
  // Estados locales
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 1. Traemos la acción de Zustand ADENTRO del componente
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  // Variables de protección bilingüe
  const nombre = product.nombre || product.name;
  const precio = product.precio || product.price;
  const descripcion = product.descripcion || product.description;
  const talles = product.talles || product.sizes || [];
  const imagen = product.imagen || product.image;

  // 2. La función de agregar al carrito ADENTRO para que pueda leer las variables
  const handleAddToCart = () => {
    // Pasamos el selectedSize que ahora es siempre un texto (ej: "M")
    addItem(product, selectedSize, quantity);
    toast.success(`${nombre} agregado al carrito!`, {
      style: { background: '#1c1917', color: '#fafaf9', borderRadius: '0px' },
    });
    onClose();
  };

  // Funciones para el contador
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const increaseQuantity = () => setQuantity(prev => prev + 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative flex flex-col md:flex-row w-full max-w-6xl max-h-[90vh] bg-stone-50 overflow-hidden shadow-2xl">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/50 backdrop-blur-md rounded-full transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mitad Izquierda: Imagen */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-stone-200 overflow-hidden">
          <img 
            src={imagen} 
            alt={nombre} 
            className="w-full max-h-[40vh] md:max-h-[80vh] object-contain object-center"
          />
        </div>

        {/* Mitad Derecha: Detalles */}
        <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto">
          <div className="text-xs text-stone-500 tracking-widest uppercase mb-6">
            Inicio / Catálogo / {nombre}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-wider uppercase text-stone-900 mb-2">
            {nombre}
          </h2>
          
          <div className="text-xl text-stone-600 mb-8">
            ${Number(precio).toLocaleString('es-AR')}
          </div>

          {/* Selector de Talles */}
          <div className="mb-8">
            <div className="text-xs font-bold tracking-widest uppercase text-stone-900 mb-3">
              Talle
            </div>
            <div className="flex flex-wrap gap-3">
              {talles.map((talle, index) => {
                // AQUÍ ESTÁ LA MAGIA: Extraemos el nombre sea un objeto o un string
                const nombreTalle = talle.name || talle;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(nombreTalle)} // Guardamos solo el texto
                    className={`w-12 h-12 flex items-center justify-center border text-sm transition-all cursor-pointer ${
                      selectedSize === nombreTalle 
                        ? 'border-stone-900 bg-stone-900 text-white font-bold' 
                        : 'border-stone-300 text-stone-600 hover:border-stone-900'
                    }`}
                  >
                    {nombreTalle} {/* Imprimimos solo el texto */}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controles de Cantidad y Agregar al Carrito */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-stone-300 h-14 w-full sm:w-32">
              <button onClick={decreaseQuantity} className="w-10 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">-</button>
              <div className="flex-1 text-center font-medium">{quantity}</div>
              <button onClick={increaseQuantity} className="w-10 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">+</button>
            </div>
            
            <button 
                onClick={handleAddToCart}
                className={`flex-1 h-14 flex items-center justify-center text-sm font-bold tracking-widest uppercase transition-colors ${
                 selectedSize 
                  ? 'bg-stone-900 text-white hover:bg-stone-800 cursor-pointer' 
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
                 disabled={!selectedSize}
            >   
                {selectedSize ? 'Agregar al carrito' : 'Selecciona un talle'}
            </button>
          </div>

          {/* Descripción */}
          <div className="pt-8 border-t border-stone-200">
            <div className="text-xs font-bold tracking-widest uppercase text-stone-900 mb-3">
              Descripción
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              {descripcion}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}