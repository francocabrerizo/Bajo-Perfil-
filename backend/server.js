const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken'); // Importamos la librería de seguridad

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// MIDDLEWARE DE SEGURIDAD (El patovica)
// ==========================================
const verificarToken = (req, res, next) => {
  // Busca el token en los headers de la petición
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: "Acceso denegado. Se requiere un token." });
  }

  try {
    // Si el token tiene el prefijo "Bearer ", se lo sacamos
    const tokenLimpio = token.split(" ")[1];
    // Verificamos si la firma es válida usando nuestro secreto del .env
    jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    next(); // Si está todo ok, lo dejamos pasar a la ruta
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// ==========================================
// RUTAS DE LA API
// ==========================================

// LOGIN: Genera el token si la contraseña es correcta
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  // Comparamos la contraseña que manda el frontend con la de nuestro .env
  if (password === process.env.ADMIN_PASSWORD) {
    // Le firmamos un token que dura 12 horas
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Contraseña incorrecta" });
  }
});

// LEER: Pública (Cualquiera puede ver los productos)
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { sizes: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar productos" });
  }
});

// CREAR: Privada (Requiere verificarToken)
// CREAR: Privada (Requiere verificarToken)
app.post('/api/products', verificarToken, async (req, res) => {
  try {
    // Ahora recibimos un array de "images" (URLs) en lugar de una sola
    const { name, price, description, images, sizes } = req.body;
    
    const sizeData = sizes.map(sizeName => ({ name: sizeName, stock: 10 }));
    // Mapeamos las URLs para que Prisma las guarde en su nueva tabla
    const imageData = images.map(imgUrl => ({ url: imgUrl }));
    
    const newProduct = await prisma.product.create({
      data: {
        name, 
        price: Number(price), 
        description,
        sizes: { create: sizeData },
        images: { create: imageData } // ¡Magia de Prisma!
      },
      include: { 
        sizes: true,
        images: true // Le decimos que nos devuelva las fotos también
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando producto" });
  }
});

// En la ruta GET ('/api/products'), asegúrate de incluir las imágenes también:
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ 
      include: { sizes: true, images: true } // ¡Agregá images: true acá!
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar productos" });
  }
});

// ELIMINAR: Privada (Requiere verificarToken)
app.delete('/api/products/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando producto" });
  }
});

// ==========================================
// ENCENDER EL SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});