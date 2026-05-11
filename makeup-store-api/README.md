# 💄 Makeup Store API

Base de datos y API REST para la tienda de maquillaje.

## Requisitos

- Node.js 18+

## Instalación

```bash
npm install
```

## Inicializar la base de datos con datos

```bash
npm run seed
```

## Ejecutar el servidor

```bash
# Desarrollo (auto-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3001`

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Listar productos (filtros: `?brand=MAC&category=labiales`) |
| GET | `/api/products/:id` | Obtener un producto |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Desactivar producto |
| GET | `/api/brands` | Listar marcas |
| POST | `/api/brands` | Crear marca |
| DELETE | `/api/brands/:id` | Eliminar marca |
| GET | `/api/categories` | Listar categorías |
| POST | `/api/categories` | Crear categoría |
| GET | `/api/recommendations` | Recomendaciones (filtros: `?skin_tone=claro&skin_type=seca`) |
| POST | `/api/recommendations` | Crear recomendación |

## Base de datos

SQLite (`database.db`) con las siguientes tablas:

- **categories** - Categorías de productos
- **brands** - Marcas
- **products** - Productos del catálogo
- **users** - Usuarios registrados (con perfil de piel)
- **orders** - Pedidos
- **order_items** - Items de cada pedido
- **favorites** - Productos favoritos por usuario
- **recommendations** - Recomendaciones por tipo/tono de piel
