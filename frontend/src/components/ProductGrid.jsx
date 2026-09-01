import { useState, useEffect, useMemo } from 'react';
import ProductModal from './ProductModal';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // NUEVO: Estado para la categoría activa
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    fetch('https://bajo-perfil-backend.onrender.com/api/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al traer los productos:', error);
        setLoading(false);
      });
  }, []);

  // NUEVO: Extraer categorías únicas de los productos para armar los botones
  const categories = useMemo(() => {
    const allCategories = products.map(p => p.categoria || p.category || 'Otros');
    const uniqueCategories = [...new Set(allCategories)].filter(c => c !== 'Otros');
    return ['Todos', ...uniqueCategories];
  }, [products]);

  // NUEVO: Filtrar los productos según el botón clickeado
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products;
    return products.filter(p => (p.categoria || p.category) === activeCategory);
  }, [products, activeCategory]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mt-8">
          {[...Array(6)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* NUEVO: Barra de Filtros Minimalista */}
      {categories.length > 1 && (
        <div className="flex gap-8 mb-12 overflow-x-auto w-full justify-start md:justify-center px-4 pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-bold tracking-widest uppercase transition-all duration-300 whitespace-nowrap pb-1 border-b-2 ${
                activeCategory === cat 
                  ? 'text-stone-900 border-stone-900' 
                  : 'text-stone-400 border-transparent hover:text-stone-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grilla de Productos (Ahora usa filteredProducts) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => setSelectedProduct(product)} 
          />
        ))}
      </div>

      {/* Modal de Producto */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}

// COMPONENTE TARJETA REDISEÑADA (Brutalista / Técnica)
function ProductCard({ product, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Salvavidas: si no carga el producto por un milisegundo, no explota.
  if (!product) return null;

  const nombre = product.nombre || product.name || 'Sin título';
  const precio = product.precio || product.price || 0;
  const precioOriginal = product.precioOriginal || product.originalPrice;
  const descripcion = product.descripcion || product.description || '';
  
  // EL SECRETO ANTI-CRASHEO: el "|| []" al final asegura que .map() siempre funcione
  const talles = product.talles || product.sizes || [];
  const categoria = product.categoria || product.category || 'Catálogo';
  
  // Generamos el código de referencia técnico
  const refCode = `REF:BP-${(product.id || 0).toString().padStart(3, '0')}`;
  
  const imagenes = (product.images && product.images.length > 0) 
    ? product.images.map(img => img.url) 
    : [product.imagen || product.image].filter(Boolean);

  const nextImage = (e) => {
    e.stopPropagation();
    if (imagenes.length <= 1) return;
    setCurrentIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (imagenes.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  return (
    <div 
      className="group flex flex-col bg-white border border-stone-200 hover:border-stone-900 transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Contenedor de Imagen de Corte Recto */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 border-b border-stone-200">
        {imagenes.length > 0 ? (
          <img
            src={imagenes[currentIndex]}
            alt={nombre}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-stone-400 text-[10px] font-bold tracking-widest uppercase">
            Sin imagen
          </div>
        )}
        
        {/* Badge "Nuevo" estilo industrial */}
        <div className="absolute top-0 left-0 bg-stone-900 px-3 py-2 text-[10px] tracking-[0.2em] uppercase font-bold text-white z-10">
          Nuevo
        </div>

        {/* Flechas del carrusel con diseño cuadrado brutalista */}
        {imagenes.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 border border-stone-200 text-stone-900 p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-stone-900 hover:text-white transition-all duration-200 z-10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 border border-stone-200 text-stone-900 p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-stone-900 hover:text-white transition-all duration-200 z-10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            {/* Indicadores estilo "código de barras" (guiones) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {imagenes.map((_, idx) => (
                <div key={idx} className={`h-[2px] transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-stone-900' : 'w-2 bg-stone-400/80'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Información del Producto - Estructura de Grilla */}
      <div className="flex flex-col flex-grow p-4 md:p-5 text-left bg-white">
        
        {/* Fila técnica superior */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[9px] text-stone-400 tracking-[0.1em] uppercase font-medium">{refCode}</span>
          <span className="text-[9px] text-stone-400 tracking-[0.1em] uppercase font-medium">{categoria}</span>
        </div>

        {/* Título y Precios alineados arriba */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <h3 className="text-sm font-bold text-stone-900 tracking-widest uppercase leading-snug group-hover:text-stone-500 transition-colors">
            {nombre}
          </h3>
          
          <div className="flex flex-col items-end flex-shrink-0">
            {precioOriginal && (
              <span className="text-[10px] text-stone-400 line-through mb-0.5">
                ${Number(precioOriginal).toLocaleString('es-AR')}
              </span>
            )}
            <span className="text-sm font-bold text-stone-900">
              ${Number(precio).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-500 line-clamp-2 mb-6 font-light leading-relaxed">
          {descripcion}
        </p>

        {/* Talles en cajas rígidas */}
        <div className="mt-auto pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] tracking-[0.2em] text-stone-900 uppercase font-bold">Talles</span>
            <div className="flex gap-1 flex-wrap">
              {talles.map((talle, index) => (
                <span 
                  key={index} 
                  className="w-6 h-6 flex items-center justify-center border border-stone-300 text-stone-600 text-[9px] font-bold uppercase"
                >
                  {talle.name || talle}
                </span>
              ))} 
              {talles.length === 0 && (
                <span className="text-[9px] text-stone-400 uppercase tracking-widest">Consultar</span>
              )}
            </div>
          </div>

          {/* Botón Invertido */}
          <button className="w-full py-3 bg-transparent border border-stone-900 text-stone-900 text-xs tracking-[0.2em] uppercase font-bold hover:bg-stone-900 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}

// COMPONENTE ESQUELETO (Adaptado al diseño de bordes rectos)
const ProductSkeleton = () => {
  return (
    <div className="flex flex-col bg-white border border-stone-200 overflow-hidden animate-pulse">
      {/* Imagen */}
      <div className="w-full aspect-[3/4] bg-stone-200"></div>
      
      <div className="flex flex-col flex-grow p-4 md:p-5 text-left">
        {/* Fila técnica */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-2 w-1/4 bg-stone-200 rounded-none"></div>
          <div className="h-2 w-1/4 bg-stone-200 rounded-none"></div>
        </div>

        {/* Título y precio */}
        <div className="flex items-start justify-between mb-4">
          <div className="h-5 w-1/2 bg-stone-200 rounded-none"></div>
          <div className="h-5 w-1/4 bg-stone-200 rounded-none"></div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="h-2 w-full bg-stone-200 rounded-none"></div>
          <div className="h-2 w-4/5 bg-stone-200 rounded-none"></div>
        </div>

        {/* Talles y botón */}
        <div className="mt-auto pt-4 border-t border-stone-100">
          <div className="flex justify-between items-center mb-4">
            <div className="h-2 w-1/5 bg-stone-200 rounded-none"></div>
            <div className="flex gap-1">
              <div className="h-6 w-6 bg-stone-200 rounded-none"></div>
              <div className="h-6 w-6 bg-stone-200 rounded-none"></div>
            </div>
          </div>
          <div className="w-full h-[42px] bg-stone-200 rounded-none"></div>
        </div>
      </div>
    </div>
  );
};