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
              <section id="nosotros" className="bg-stone-100 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <h2 className="text-2xl font-bold text-stone-900 mb-6 uppercase tracking-widest">
                    Nosotros
                  </h2>
                  <p className="text-stone-600 leading-relaxed max-w-2xl mx-auto">
                    Somos Bajo Perfil. Una marca pensada para quienes buscan destacar sin gritar. 
                    Diseñamos prendas con estilo minimalista, priorizando la calidad y los detalles.
                  </p>
                </div>
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
              <footer className="bg-stone-950 text-stone-400 py-8 text-center text-xs tracking-widest uppercase">
                <p>&copy; {new Date().getFullYear()} Bajo Perfil. Todos los derechos reservados.</p>
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