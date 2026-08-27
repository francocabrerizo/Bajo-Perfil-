export default function ProductCard({ product, onClick }) {
  // Hacemos un fallback bilingüe por si tu JSON quedó con claves en inglés o en español
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
      {/* Contenedor de Imagen con efecto de Zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={imagen}
          alt={nombre}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badge sutil opcional */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 text-[10px] tracking-widest uppercase font-medium text-stone-800">
          Nuevo
        </div>
      </div>

      {/* Información del Producto */}
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

        {/* Mostrar Talles */}
        <div className="mb-6">
          <span className="text-[10px] tracking-wider text-stone-400 uppercase block mb-1.5">Talles disponibles:</span>
          <div className="flex gap-1.5">
            {talles.map((talle, index) => (
            <span key={index}>{talle.name || talle}
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