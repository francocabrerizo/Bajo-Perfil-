import { useState } from 'react';

export default function ProductCard({ product, onClick }) {
  // NUEVO: Estado para controlar qué foto se ve
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hacemos un fallback bilingüe por si tu JSON quedó con claves en inglés o en español
  const nombre = product.nombre || product.name;
  const precio = product.precio || product.price;
  const precioOriginal = product.precioOriginal || product.originalPrice; // <-- Agregado fallback por las dudas
  const descripcion = product.descripcion || product.description;
  const talles = product.talles || product.sizes;
  
  // NUEVO: Armamos un array con todas las fotos disponibles
  const imagenes = product.images && product.images.length > 0 
    ? product.images.map(img => img.url) 
    : [product.imagen || product.image].filter(Boolean);

  // NUEVO: Funciones para mover las flechas sin abrir el detalle del producto
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };
  
  return (
    <div 
      className="group flex flex-col bg-white border border-stone-100 overflow-hidden transition-all duration-300 hover:shadow-sm cursor-pointer"
      onClick={onClick}
    >
      {/* Contenedor de Imagen con efecto de Zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={imagenes[currentIndex]}
          alt={nombre}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badge sutil opcional */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 text-[10px] tracking-widest uppercase font-medium text-stone-800 z-10">
          Nuevo
        </div>

        {/* NUEVO: Flechas (Siempre visibles en celu opacity-100, hover en PC md:opacity-0) */}
        {imagenes.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-900 p-1.5 rounded-full shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-900 p-1.5 rounded-full shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            {/* Puntitos abajo */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {imagenes.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-stone-900' : 'w-1.5 bg-stone-400/80'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Información del Producto */}
      <div className="flex flex-col flex-grow p-5 text-left">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-medium text-stone-900 tracking-wide hover:text-stone-700 transition-colors pr-2">
            {nombre}
          </h3>
          
          {/* MODIFICACIÓN: Contenedor de precios */}
          <div className="flex flex-col items-end flex-shrink-0">
            {precioOriginal && (
              <span className="text-[11px] text-stone-400 line-through mb-0.5">
                ${Number(precioOriginal).toLocaleString('es-AR')}
              </span>
            )}
            <span className="text-base font-semibold text-stone-950">
              ${Number(precio).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-500 line-clamp-2 mb-4 font-light leading-relaxed">
          {descripcion}
        </p>

        {/* Mostrar Talles */}
        <div className="mb-6">
          <span className="text-[10px] tracking-wider text-stone-400 uppercase block mb-1.5">Talles disponibles:</span>
          <div className="flex gap-1.5">
            {talles.map((talle, index) => (
            <span key={index} className="text-xs text-stone-600">{talle.name || talle}
            </span>
            ))} 
          </div>
        </div>

        {/* Botón de Acción */}
        <button className="mt-auto w-full py-3 bg-stone-950 text-white text-xs tracking-widest uppercase font-semibold hover:bg-stone-800 transition-all duration-300 cursor-pointer focus:outline-none">
          Ver detalles
        </button>
      </div>
    </div>
  );
}