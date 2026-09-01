import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      {/* El Navbar y el Carrito quedan fuera de las rutas para verse en toda la web */}
      <div className="w-full bg-red-600 text-white overflow-hidden py-2">
        <div className="flex justify-center items-center gap-4 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
          <span className="hidden sm:inline"></span>
          <p>BAJO PERFIL WEB INAUGURACION - Hasta 20% OFF</p>
          <span className="hidden sm:inline"></span>
        </div>
      </div>
      <Navbar />
      <CartDrawer /> 
      
      <Routes>
        {/* RUTA 1: La tienda pública que verán los clientes */}
        <Route 
          path="/" 
          element={
            <main>
              <Hero />
              
              {/* Sección Catálogo */}
              <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-stone-900 mb-12 uppercase tracking-widest">
                  Nuestro Catálogo
                </h2>
                <ProductGrid />
              </section>

              {/* Sección Nosotros */}
              <section id="nosotros" className="w-full bg-stone-950 py-24 px-6 flex flex-col items-center text-center">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-white mb-6">
                     Nosotros
                  </h2>
                <p className="max-w-2xl text-stone-400 text-sm md:text-base font-light leading-relaxed">
                   Desde Mar del Plata, construimos Bajo Perfil paso a paso. Detrás 
                   de cada prenda, cada viaje, cada elección y cada entrega hay horas 
                   de trabajo, dedicación y esfuerzo. 
                   Nada fue dado: todo lo que somos lo construimos con nuestras propias manos.
                </p>
              </section>

              {/* Sección Contacto */}
              <section id="contacto" className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <h2 className="text-2xl font-bold text-stone-900 mb-6 uppercase tracking-widest">
                    Contacto
                  </h2>
                  <p className="text-stone-600 mb-8">
                    ¿Tenés alguna duda con tu pedido? Escribinos directamente por WhatsApp.
                  </p>
                  <a 
                    href="https://wa.me/5492246488161" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-block bg-stone-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Enviar Mensaje
                  </a>
                </div>
              </section>

              {/* Footer */}
              {/* FOOTER */}
              <footer className="w-full bg-stone-950 py-10 px-6 border-t border-stone-800">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-[10px] tracking-widest uppercase text-stone-500">
                    © 2026 BAJO PERFIL. TODOS LOS DERECHOS RESERVADOS.
                  </p>
                  
                  <a 
                    href="https://instagram.com/bajoperfilestudio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-stone-500 hover:text-white transition-colors cursor-pointer group"
                  >
                    {/* SVG Nativo de Instagram (reemplaza a Lucide) */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="group-hover:scale-110 transition-transform"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    <span className="text-[10px] tracking-widest uppercase font-bold">Seguinos en Instagram</span>
                  </a>
                </div>
              </footer>
            </main>
          } 
        />

        {/* RUTA 2: El panel oculto para cargar inventario */}
        <Route 
          path="/admin" 
          element={<AdminPanel />} 
        />
      </Routes>
    </BrowserRouter>
  );
}