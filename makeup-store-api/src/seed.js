const { getDatabase } = require('./database');

function seed() {
  const db = getDatabase();

  console.log('🌱 Iniciando seed de la base de datos...\n');

  // ─── Categorías ───
  const categories = [
    { name: 'labiales', display_name: 'Labiales' },
    { name: 'sombras', display_name: 'Sombras' },
    { name: 'bases', display_name: 'Bases' },
    { name: 'rubores', display_name: 'Rubores' },
    { name: 'mascaras', display_name: 'Máscaras' },
    { name: 'brillos', display_name: 'Brillos' },
    { name: 'polvos', display_name: 'Polvos' },
    { name: 'bronceadores', display_name: 'Bronceadores' },
  ];

  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, display_name) VALUES (?, ?)');
  for (const cat of categories) {
    insertCategory.run(cat.name, cat.display_name);
  }
  console.log(`✅ ${categories.length} categorías insertadas`);

  // ─── Marcas ───
  const brands = [
    'MAC', 'Urban Decay', 'Charlotte Tilbury', 'NARS', 'Too Faced',
    'Fenty Beauty', 'Maybelline', "L'Oréal", 'NYX', 'Benefit',
  ];

  const insertBrand = db.prepare('INSERT OR IGNORE INTO brands (name) VALUES (?)');
  for (const brand of brands) {
    insertBrand.run(brand);
  }
  console.log(`✅ ${brands.length} marcas insertadas`);

  // ─── Helper para buscar IDs ───
  const getBrandId = (name) => db.prepare('SELECT id FROM brands WHERE name = ?').get(name)?.id;
  const getCategoryId = (name) => db.prepare('SELECT id FROM categories WHERE name = ?').get(name)?.id;

  // ─── Productos (los 12 del frontend actual) ───
  const products = [
    { name: 'Ruby Woo Lipstick', brand: 'MAC', price: 22.00, image: '💄', category: 'labiales' },
    { name: 'Naked Palette', brand: 'Urban Decay', price: 54.00, image: '🎨', category: 'sombras' },
    { name: 'Flawless Filter', brand: 'Charlotte Tilbury', price: 46.00, image: '✨', category: 'bases' },
    { name: 'Orgasm Blush', brand: 'NARS', price: 30.00, image: '🌸', category: 'rubores' },
    { name: 'Better Than Sex', brand: 'Too Faced', price: 28.00, image: '👁️', category: 'mascaras' },
    { name: 'Gloss Bomb', brand: 'Fenty Beauty', price: 20.00, image: '💋', category: 'brillos' },
    { name: 'Fit Me Powder', brand: 'Maybelline', price: 8.99, image: '🪞', category: 'polvos' },
    { name: 'True Match Foundation', brand: "L'Oréal", price: 12.99, image: '🧴', category: 'bases' },
    { name: 'Butter Gloss', brand: 'NYX', price: 5.99, image: '🍯', category: 'brillos' },
    { name: 'Hoola Bronzer', brand: 'Benefit', price: 30.00, image: '☀️', category: 'bronceadores' },
    { name: 'Velvet Teddy', brand: 'MAC', price: 21.00, image: '🧸', category: 'labiales' },
    { name: 'Born This Way', brand: 'Too Faced', price: 40.00, image: '💫', category: 'bases' },
  ];

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (name, brand_id, category_id, price, image, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const p of products) {
    insertProduct.run(p.name, getBrandId(p.brand), getCategoryId(p.category), p.price, p.image, 50);
  }
  console.log(`✅ ${products.length} productos insertados`);

  // ─── Recomendaciones (las del PersonalizedAdvisor) ───
  const recommendations = [
    // Piel clara + seca
    { name: 'Base Hidratante Luminosa', brand: 'Charlotte Tilbury', description: 'Fórmula hidratante con acabado luminoso ideal para pieles claras y secas', image: '✨', skin_tone: 'claro', skin_type: 'seca' },
    { name: 'Rubor Cream Blush Rosa', brand: 'Fenty Beauty', description: 'Rubor en crema que no reseca la piel, tono rosado perfecto para pieles claras', image: '🌸', skin_tone: 'claro', skin_type: 'seca' },
    { name: 'Primer Hidratante', brand: 'Too Faced', description: 'Prebase con ácido hialurónico para pieles secas', image: '💧', skin_tone: 'claro', skin_type: 'seca' },
    { name: 'Labial Cremoso Nude', brand: 'MAC', description: 'Labial con fórmula hidratante, tono nude claro', image: '💄', skin_tone: 'claro', skin_type: 'seca' },

    // Piel clara + grasa
    { name: 'Base Mate de Larga Duración', brand: 'Fenty Beauty', description: 'Control de brillo toda la jornada, tono claro', image: '🧴', skin_tone: 'claro', skin_type: 'grasa' },
    { name: 'Polvo Matificante Translúcido', brand: 'Maybelline', description: 'Fija el maquillaje y controla el exceso de grasa', image: '🪞', skin_tone: 'claro', skin_type: 'grasa' },
    { name: 'Primer Control de Brillo', brand: 'NYX', description: 'Minimiza poros y controla la oleosidad', image: '💨', skin_tone: 'claro', skin_type: 'grasa' },
    { name: 'Setting Spray Matte', brand: 'Urban Decay', description: 'Spray fijador anti-brillo para todo el día', image: '💫', skin_tone: 'claro', skin_type: 'grasa' },

    // Piel media + seca
    { name: 'Base Hidratante Tono Medio', brand: "L'Oréal", description: 'Cobertura media con acabado satinado para pieles secas', image: '🧴', skin_tone: 'medio', skin_type: 'seca' },
    { name: 'Rubor Durazno en Crema', brand: 'NARS', description: 'Tono cálido perfecto para pieles medias, fórmula cremosa', image: '🍑', skin_tone: 'medio', skin_type: 'seca' },
    { name: 'Primer Nutritivo', brand: 'Charlotte Tilbury', description: 'Prebase con vitaminas para nutrir pieles secas', image: '💧', skin_tone: 'medio', skin_type: 'seca' },
    { name: 'Lip Oil Hidratante', brand: 'NYX', description: 'Aceite labial con color que hidrata profundamente', image: '💋', skin_tone: 'medio', skin_type: 'seca' },

    // Piel media + grasa
    { name: 'Base Oil-Free Tono Medio', brand: 'Fenty Beauty', description: 'Sin aceite, control de brillo con cobertura completa', image: '✨', skin_tone: 'medio', skin_type: 'grasa' },
    { name: 'Bronceador en Polvo', brand: 'Benefit', description: 'Tono cálido que complementa pieles medias sin brillos', image: '☀️', skin_tone: 'medio', skin_type: 'grasa' },
    { name: 'Primer Matificante', brand: 'Too Faced', description: 'Control de poros y oleosidad para pieles grasas', image: '💨', skin_tone: 'medio', skin_type: 'grasa' },
    { name: 'Labial Matte Duradero', brand: 'MAC', description: 'Fórmula matte de larga duración, no transfiere', image: '💄', skin_tone: 'medio', skin_type: 'grasa' },

    // Piel oscura + seca
    { name: 'Base Luminosa Tono Oscuro', brand: 'Fenty Beauty', description: 'Amplia gama de tonos oscuros con acabado luminoso', image: '✨', skin_tone: 'oscuro', skin_type: 'seca' },
    { name: 'Rubor Ciruela en Crema', brand: 'NARS', description: 'Tono profundo que complementa pieles oscuras, hidratante', image: '🌸', skin_tone: 'oscuro', skin_type: 'seca' },
    { name: 'Primer con Vitamina E', brand: 'Charlotte Tilbury', description: 'Nutre e hidrata pieles secas antes del maquillaje', image: '💧', skin_tone: 'oscuro', skin_type: 'seca' },
    { name: 'Gloss Hidratante Berry', brand: 'Fenty Beauty', description: 'Brillo labial con color intenso e hidratación', image: '💋', skin_tone: 'oscuro', skin_type: 'seca' },

    // Piel oscura + grasa
    { name: 'Base Matte Full Coverage', brand: 'Fenty Beauty', description: 'Cobertura total mate para pieles oscuras y grasas', image: '🧴', skin_tone: 'oscuro', skin_type: 'grasa' },
    { name: 'Polvo Fijador Oscuro', brand: 'Maybelline', description: 'Polvo con color para pieles oscuras, sin efecto ceniza', image: '🪞', skin_tone: 'oscuro', skin_type: 'grasa' },
    { name: 'Primer Control Total', brand: 'NYX', description: 'Máximo control de brillo para pieles grasas', image: '💨', skin_tone: 'oscuro', skin_type: 'grasa' },
    { name: 'Labial Matte Intenso', brand: 'MAC', description: 'Tonos profundos con fórmula matte duradera', image: '💄', skin_tone: 'oscuro', skin_type: 'grasa' },

    // Piel clara + mixta
    { name: 'Base Equilibrante Clara', brand: "L'Oréal", description: 'Balance perfecto para zona T grasa y mejillas secas', image: '🧴', skin_tone: 'claro', skin_type: 'mixta' },
    { name: 'Primer Zona T', brand: 'Benefit', description: 'Controla brillo solo donde lo necesitas', image: '💧', skin_tone: 'claro', skin_type: 'mixta' },

    // Piel media + mixta
    { name: 'Base Balanceante Media', brand: 'Charlotte Tilbury', description: 'Acabado natural que se adapta a cada zona del rostro', image: '✨', skin_tone: 'medio', skin_type: 'mixta' },
    { name: 'Setting Spray Equilibrante', brand: 'Urban Decay', description: 'Fija sin resecar ni engrasar', image: '💫', skin_tone: 'medio', skin_type: 'mixta' },

    // Piel oscura + mixta
    { name: 'Base Adaptativa Oscura', brand: 'Fenty Beauty', description: 'Se adapta a las diferentes zonas del rostro', image: '✨', skin_tone: 'oscuro', skin_type: 'mixta' },
    { name: 'Polvo Multiuso Oscuro', brand: 'NARS', description: 'Fija en zona T sin resecar el resto', image: '🪞', skin_tone: 'oscuro', skin_type: 'mixta' },

    // Piel clara + normal
    { name: 'Base Natural Clara', brand: 'Charlotte Tilbury', description: 'Acabado piel perfecta para pieles normales claras', image: '✨', skin_tone: 'claro', skin_type: 'normal' },
    { name: 'Rubor Natural Rosado', brand: 'Benefit', description: 'Color natural que complementa pieles claras', image: '🌸', skin_tone: 'claro', skin_type: 'normal' },

    // Piel media + normal
    { name: 'Base Skin Tint Media', brand: "L'Oréal", description: 'Cobertura ligera con efecto segunda piel', image: '🧴', skin_tone: 'medio', skin_type: 'normal' },
    { name: 'Bronceador Natural', brand: 'Benefit', description: 'Tono sutil para un bronceado natural', image: '☀️', skin_tone: 'medio', skin_type: 'normal' },

    // Piel oscura + normal
    { name: 'Base Skin Like Oscura', brand: 'Fenty Beauty', description: 'Efecto segunda piel con glow natural', image: '✨', skin_tone: 'oscuro', skin_type: 'normal' },
    { name: 'Highlighter Intenso', brand: 'Fenty Beauty', description: 'Iluminador para resaltar la belleza de pieles oscuras', image: '💫', skin_tone: 'oscuro', skin_type: 'normal' },
  ];

  const insertRecommendation = db.prepare(`
    INSERT OR IGNORE INTO recommendations (name, brand, description, image, skin_tone, skin_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const r of recommendations) {
    insertRecommendation.run(r.name, r.brand, r.description, r.image, r.skin_tone, r.skin_type);
  }
  console.log(`✅ ${recommendations.length} recomendaciones insertadas`);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log(`\n📊 Resumen:`);
  console.log(`   Categorías: ${db.prepare('SELECT COUNT(*) as c FROM categories').get().c}`);
  console.log(`   Marcas: ${db.prepare('SELECT COUNT(*) as c FROM brands').get().c}`);
  console.log(`   Productos: ${db.prepare('SELECT COUNT(*) as c FROM products').get().c}`);
  console.log(`   Recomendaciones: ${db.prepare('SELECT COUNT(*) as c FROM recommendations').get().c}`);
}

seed();
