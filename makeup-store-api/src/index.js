const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const brandsRouter = require('./routes/brands');
const categoriesRouter = require('./routes/categories');
const recommendationsRouter = require('./routes/recommendations');
const ordersRouter = require('./routes/orders');
const { getDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
}));
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/orders', ordersRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '💄 Makeup Store API',
    endpoints: {
      products: '/api/products',
      brands: '/api/brands',
      categories: '/api/categories',
      recommendations: '/api/recommendations?skin_tone=claro&skin_type=seca',
    }
  });
});

// Inicializar base de datos y arrancar servidor
getDatabase();
console.log('✅ Base de datos inicializada');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
