const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken'); 

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// MIDDLEWARE DE SEGURIDAD (El patovica)
// ==========================================
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: "Acceso denegado. Se requiere un token." });
  }

  try {
    const tokenLimpio = token.split(" ")[1];
    jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    next(); 
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
  
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Contraseña incorrecta" });
  }
});

// LEER: Pública (Cualquiera puede ver los productos con sus talles Y FOTOS)
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ 
      include: { sizes: true, images: true } 
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar productos" });
  }
});

// CREAR: Privada (Requiere verificarToken)
// CREAR: Privada (Requiere verificarToken)
app.post('/api/products', verificarToken, async (req, res) => {
  try {
    // NUEVO: Agregamos "categoria" a los datos que recibimos
    const { name, price, description, categoria, images, sizes } = req.body;
    
    const sizeData = sizes.map(sizeName => ({ name: sizeName, stock: 10 }));
    const imageData = images.map(imgUrl => ({ url: imgUrl }));
    
    const newProduct = await prisma.product.create({
      data: {
        name, 
        price: Number(price), 
        description,
        categoria: categoria || 'Remera', // NUEVO: Guardamos la categoría (con valor por defecto)
        sizes: { create: sizeData },
        images: { create: imageData }
      },
      include: { 
        sizes: true,
        images: true 
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando producto" });
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