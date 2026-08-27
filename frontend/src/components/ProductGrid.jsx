import { useState, useEffect } from 'react';
import ProductModal from './ProductModal';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-stone-500 text-lg">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => setSelectedProduct(product)} 
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}

// Componente ProductCard en el mismo archivo
function ProductCard({ product, onClick }) {
  const nombre = product.nombre || product.name;
  const precio = product.precio || product.price;
  const descripcion = product.descripcion || product.description;
  const talles = product.talles || product.sizes;
  
  // MAGIA APLICADA AQUÍ ABAJO
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
            <span key={index}>{talle.name || talle}</span>
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