export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 bg-stone-50 text-stone-900 text-center overflow-hidden">
      {/* Elementos decorativos sutiles para reforzar la estética de marca de diseño */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
      
      <div className="relative max-w-3xl mx-auto flex flex-col items-center z-10">
        <span className="text-xs font-semibold tracking-[0.4em] text-stone-500 uppercase mb-4 animate-fade-in">
          BAJO PERFIL / / / 2026
        </span>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-stone-950 leading-none mb-6">
          Ropa sin exceso, <br />
          <span className="font-semibold tracking-wide">identidad sin esfuerzo.</span>
        </h1>
        
        <p className="max-w-md text-stone-600 text-sm md:text-base tracking-wide font-light leading-relaxed mb-10">
          Prendas únicas, modelos que no se repiten. Ropa streetwear pensada para quienes buscan diferenciarse sin exagerar. 
        </p>
        
        <button className="px-8 py-3.5 bg-stone-950 text-white font-medium text-sm tracking-widest uppercase hover:bg-stone-800 active:bg-stone-900 border border-transparent hover:border-stone-950 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer focus:outline-none">
          Ver catálogo
        </button>
      </div>

      {/* Sutil pie de foto de la sección para dar realismo editorial */}
      <div className="absolute bottom-8 left-6 hidden md:block text-[10px] tracking-widest uppercase text-stone-400">
        BP-026 // STOCK LIMITADO
      </div>
    </section>
  )
}
