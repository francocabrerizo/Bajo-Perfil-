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
    const { name, price, priceOriginal, description, categoria, images, sizes } = req.body;
    
    const sizeData = sizes.map(sizeName => ({ name: sizeName, stock: 10 }));
    const imageData = images.map(imgUrl => ({ url: imgUrl }));
    
    const newProduct = await prisma.product.create({
      data: {
        name, 
        price: Number(price), 
        priceOriginal: priceOriginal ? Number(priceOriginal) : null,
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

// ACTUALIZAR: Privada (Requiere verificarToken)
app.put('/api/products/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, priceOriginal, description, categoria, images, sizes } = req.body;
    
    // Preparamos los datos igual que en el POST
    const sizeData = sizes.map(sizeName => ({ name: sizeName, stock: 10 }));
    const imageData = images.map(imgUrl => ({ url: imgUrl }));
    
    // Actualizamos el producto en Prisma
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name, 
        price: Number(price), 
        priceOriginal: priceOriginal ? Number(priceOriginal) : null, 
        description,
        categoria: categoria || 'Remera',
        // El truco: borramos las relaciones viejas y creamos las nuevas en un solo paso
        sizes: { deleteMany: {}, create: sizeData },
        images: { deleteMany: {}, create: imageData }
      },
      include: { 
        sizes: true,
        images: true 
      }
    });
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando producto" });
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

// =========================================
// RUTA PARA CALCULAR ENVIOS
// ========================================

app.post('/api/shipping/quote', async (req, res) => {
  try {
    const { codigoPostalDestino } = req.body;
    
    if (!codigoPostalDestino || codigoPostalDestino.length < 4) {
      return res.status(400).json({ error: "El código postal es requerido" });
    }

    const cp = parseInt(codigoPostalDestino, 10);
    
    let precioClasico = 0;
    let diasClasico = "";

    // 1. LÓGICA DE ZONAS (Valores estimativos, podés actualizarlos cuando el correo suba los precios)
    if (cp === 7600) {
      // ZONA LOCAL: Mar del Plata
      precioClasico = 3500;
      diasClasico = "1 a 2";
    } 
    else if ((cp >= 1000 && cp <= 3600) || (cp >= 6000 && cp <= 7620)) {
      // ZONA REGIONAL: CABA y Provincia de Buenos Aires
      precioClasico = 5500;
      diasClasico = "3 a 5";
    } 
    else {
      // ZONA NACIONAL: Resto del país
      precioClasico = 7500;
      diasClasico = "4 a 7";
    }

    // 2. ARMAMOS LA RESPUESTA QUE ESPERA TU FRONTEND
    const cotizacionesFormateadas = [
      {
        id: 1,
        correo: "Correo Argentino",
        servicio: "Clásico a Domicilio",
        precio: precioClasico,
        dias_estimados: `${diasClasico} días hábiles`
      },
      {
        id: 2,
        correo: "Correo Argentino",
        servicio: "Retiro en Sucursal",
        // El envío a sucursal suele ser un poco más barato
        precio: precioClasico - 1200, 
        dias_estimados: `${diasClasico} días hábiles`
      }
    ];

    // Devolvemos la lista limpia, sin depender de ningún servidor externo
    res.json(cotizacionesFormateadas);

  } catch (error) {
    console.error("Error calculando el tarifario:", error);
    res.status(500).json({ error: "Error interno al calcular el envío" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

