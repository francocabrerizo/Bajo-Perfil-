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

// COMPONENTE TARJETA REAL
function ProductCard({ product, onClick }) {
  const nombre = product.nombre || product.name;
  const precio = product.precio || product.price;
  const descripcion = product.descripcion || product.description;
  const talles = product.talles || product.sizes;
  
  const imagen = (product.images && product.images[0]?.url) || product.imagen || product.image;

  return (
    <div 
      className="group flex flex-col bg-white border border-stone-100 overflow-hidden transition-all duration-300 hover:shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={imagen}
          alt={nombre}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 text-[10px] tracking-widest uppercase font-medium text-stone-800">
          Nuevo
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5 text-left">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-medium text-stone-900 tracking-wide hover:text-stone-700 transition-colors">
            {nombre}
          </h3>
          <span className="text-base font-semibold text-stone-950">
            ${Number(precio).toLocaleString('es-AR')}
          </span>
        </div>

        <p className="text-xs text-stone-500 line-clamp-2 mb-4 font-light leading-relaxed">
          {descripcion}
        </p>

        <div className="mb-6">
          <span className="text-[10px] tracking-wider text-stone-400 uppercase block mb-1.5">Talles disponibles:</span>
          <div className="flex gap-1.5">
            {talles.map((talle, index) => (
            <span key={index} className="text-xs text-stone-600">{talle.name || talle}</span>
            ))} 
          </div>
        </div>

        <button className="mt-auto w-full py-3 bg-stone-950 text-white text-xs tracking-widest uppercase font-semibold hover:bg-stone-800 transition-all duration-300 cursor-pointer focus:outline-none">
          Ver detalles
        </button>
      </div>
    </div>
  );
}

// COMPONENTE ESQUELETO MEJORADO (Imita la tarjeta real)
const ProductSkeleton = () => {
  return (
    <div className="flex flex-col bg-white border border-stone-100 overflow-hidden animate-pulse">
      {/* Imagen */}
      <div className="w-full aspect-[3/4] bg-stone-200"></div>
      
      <div className="flex flex-col flex-grow p-5 text-left">
        {/* Título y precio */}
        <div className="flex items-start justify-between mb-2">
          <div className="h-5 w-1/2 bg-stone-200 rounded-sm"></div>
          <div className="h-5 w-1/4 bg-stone-200 rounded-sm"></div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="h-3 w-full bg-stone-200 rounded-sm"></div>
          <div className="h-3 w-4/5 bg-stone-200 rounded-sm"></div>
        </div>

        {/* Talles */}
        <div className="mb-6">
          <div className="h-2 w-1/3 bg-stone-200 rounded-sm mb-2"></div>
          <div className="flex gap-1.5">
            <div className="h-4 w-6 bg-stone-200 rounded-sm"></div>
            <div className="h-4 w-6 bg-stone-200 rounded-sm"></div>
          </div>
        </div>

        {/* Botón */}
        <div className="mt-auto w-full py-3 h-[40px] bg-stone-200 rounded-sm"></div>
      </div>
    </div>
  );
};