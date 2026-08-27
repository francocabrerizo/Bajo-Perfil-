import { useState, useEffect } from 'react';
import { Trash2, Plus, Lock, UploadCloud, X } from 'lucide-react';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// === CONFIGURACIÓN DE CLOUDINARY ===
const CLOUD_NAME = 'jmwfuhnl';
const UPLOAD_PRESET = 'lhvfyrvd';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loginError, setLoginError] = useState('');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // Estado para mostrar "Subiendo..."
  
  // Ahora el formData tiene un array vacío de 'images'
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', images: [], sizes: []
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
      } else {
        setLoginError(data.error || 'Contraseña incorrecta');
      }
    } catch (error) {
      setLoginError('Error de conexión con el servidor');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const toggleSize = (sizeName) => {
    setFormData(prev => {
      const sizes = prev.sizes.includes(sizeName)
        ? prev.sizes.filter(s => s !== sizeName) 
        : [...prev.sizes, sizeName];
      return { ...prev, sizes };
    });
  };

  // === LÓGICA DE SUBIDA A CLOUDINARY ===
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // Armamos el "paquete" para enviar a Cloudinary
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data
      });
      const fileData = await response.json();
      
      // Agregamos la nueva URL a nuestro array de imágenes
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, fileData.secure_url]
      }));
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("Hubo un error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  // Función para sacar una foto si nos equivocamos antes de publicar
  const removePreviewImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (formData.sizes.length === 0) return alert("Seleccioná al menos un talle.");
    if (formData.images.length === 0) return alert("Subí al menos una foto.");

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.status === 403 || response.status === 401) {
        alert("Tu sesión expiró. Volvé a ingresar.");
        return handleLogout();
      }

      setFormData({ name: '', price: '', description: '', images: [], sizes: [] });
      fetchProducts();
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 403 || response.status === 401) {
        alert("Tu sesión expiró.");
        return handleLogout();
      }
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!token) {
    // ... (El código del login sigue igual)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <div className="max-w-md w-full bg-white p-8 shadow-xl border border-stone-200">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-stone-900 text-white flex items-center justify-center mb-4 rounded-full">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-widest uppercase text-stone-900">Acceso Restringido</h2>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="password" placeholder="Contraseña" required className="w-full p-4 border border-stone-300 text-center tracking-widest" value={password} onChange={(e) => setPassword(e.target.value)} />
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            <button type="submit" className="w-full h-14 bg-stone-900 text-white text-sm font-bold tracking-widest uppercase">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 pt-24">
      <div className="flex justify-between items-center mb-12 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-900 tracking-widest uppercase">Panel de Gestión</h1>
        <button onClick={handleLogout} className="text-xs font-bold text-stone-500 hover:text-stone-900 tracking-widest uppercase">Cerrar Sesión</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-stone-900 mb-6 uppercase tracking-widest">Nuevo Ingreso</h2>
          <form onSubmit={handleSubmit} className="bg-stone-50 p-6 border border-stone-200 flex flex-col gap-4">
            
            {/* ... inputs de nombre, precio, descripción siguen igual ... */}
            <div><label className="text-xs font-bold text-stone-500 uppercase block mb-2">Nombre</label><input type="text" required className="w-full p-3 border border-stone-300 bg-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-stone-500 uppercase block mb-2">Precio ($)</label><input type="number" required className="w-full p-3 border border-stone-300 bg-white" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-stone-500 uppercase block mb-2">Descripción</label><textarea required rows="3" className="w-full p-3 border border-stone-300 bg-white resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>

            {/* NUEVO: Subida de Imágenes */}
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Fotos de la Prenda</label>
              
              {/* Grilla de miniaturas subidas */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative w-16 h-16 border border-stone-200">
                      <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePreviewImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón para subir archivo (Ocultamos el input feo y lo enlazamos al label) */}
              <label className={`w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-stone-300 text-stone-500 hover:border-stone-900 hover:text-stone-900 transition-colors cursor-pointer bg-white ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <UploadCloud className="w-5 h-5" />
                <span className="text-sm font-bold tracking-widest uppercase">
                  {isUploading ? 'Subiendo...' : 'Agregar Foto'}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Talles */}
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Talles</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map(size => (
                  <button key={size} type="button" onClick={() => toggleSize(size)} className={`w-10 h-10 border text-xs font-bold cursor-pointer ${formData.sizes.includes(size) ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-300'}`}>{size}</button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isUploading} className="mt-4 w-full h-12 bg-stone-900 text-white text-sm font-bold uppercase hover:bg-stone-800 disabled:bg-stone-400">
              <Plus className="w-4 h-4 inline mr-2" /> Publicar Producto
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-stone-900 mb-6 uppercase tracking-widest">Inventario Activo</h2>
          {loading ? <p>Cargando...</p> : (
            <div className="bg-white border border-stone-200 divide-y divide-stone-200">
              {products.length === 0 ? <p className="p-6">No hay productos.</p> : products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {/* Leemos la primera imagen del nuevo array de la base de datos */}
                    <img src={product.images && product.images[0] ? product.images[0].url : ''} alt={product.name} className="w-16 h-20 object-cover bg-stone-100 border" />
                    <div>
                      <h3 className="font-bold text-sm uppercase">{product.name}</h3>
                      <p className="text-xs mb-2">${product.price.toLocaleString('es-AR')}</p>
                      <div className="flex gap-1">{product.sizes?.map(s => <span key={s.id} className="px-2 py-1 bg-stone-200 text-[10px]">{s.name}</span>)}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-stone-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}