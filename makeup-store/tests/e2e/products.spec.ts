import { expect, test } from '@playwright/test';

const products = [
  {
    id: 1,
    name: 'Base Studio',
    brand: 'MAC',
    price: 18.5,
    image: '🧴',
    category: 'Base',
  },
  {
    id: 2,
    name: 'Lip Tint',
    brand: 'Maybelline',
    price: 12,
    image: '💄',
    category: 'Labial',
  },
];

const brands = [
  { id: 1, name: 'MAC' },
  { id: 2, name: 'Maybelline' },
];

async function mockCatalog(page: Parameters<typeof test>[0]['page']) {
  await page.addInitScript(({ products, brands }) => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;

      if (url.includes('/api/products')) {
        return new Response(JSON.stringify(products), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (url.includes('/api/brands')) {
        return new Response(JSON.stringify(brands), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return originalFetch(input, init);
    };
  }, { products, brands });
}

test('agrega varios productos al carrito de forma automatizada', async ({ page }) => {
  await mockCatalog(page);

  await page.goto('/productos');

  await expect(page.locator('.products-grid .product-card').filter({ hasText: 'Base Studio' })).toHaveCount(1);
  await expect(page.locator('.products-grid .product-card').filter({ hasText: 'Lip Tint' })).toHaveCount(1);

  const baseCard = page.locator('.products-grid .product-card').filter({ hasText: 'Base Studio' });
  const lipCard = page.locator('.products-grid .product-card').filter({ hasText: 'Lip Tint' });

  await baseCard.getByRole('button', { name: '🛒 Agregar' }).click();
  await lipCard.getByRole('button', { name: '🛒 Agregar' }).click();

  await expect(page.locator('.nav-desktop a.cart-link')).toHaveText('🛒 Carrito (2)');
});

test('completa y envia el formulario de contacto automaticamente', async ({ page }) => {
  await page.goto('/contacto');

  await page.getByLabel('Nombre').fill('Prueba Automatizada');
  await page.getByLabel('Email').fill('prueba@automatizada.com');
  await page.getByLabel('Asunto').fill('Consulta de productos');
  await page.getByLabel('Mensaje').fill('Hola, quisiera saber mas sobre las promociones vigentes.');

  await page.getByRole('button', { name: '💌 Enviar mensaje' }).click();

  await expect(page.getByText('¡Mensaje enviado!')).toBeVisible();
  await expect(page.getByText('Gracias por contactarnos. Te responderemos lo antes posible.')).toBeVisible();
});