const API_URL = `http://${window.location.hostname}:3001/api`;

export async function fetchProducts(brand?: string): Promise<any[]> {
  const params = brand ? `?brand=${encodeURIComponent(brand)}` : '';
  const res = await fetch(`${API_URL}/products${params}`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export async function fetchBrands(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${API_URL}/brands`);
  if (!res.ok) throw new Error('Error al obtener marcas');
  return res.json();
}

export async function fetchCategories(): Promise<{ id: number; name: string; display_name: string }[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
}

export async function fetchRecommendations(skinTone: string, skinType: string): Promise<any[]> {
  const params = `?skin_tone=${encodeURIComponent(skinTone)}&skin_type=${encodeURIComponent(skinType)}`;
  const res = await fetch(`${API_URL}/recommendations${params}`);
  if (!res.ok) throw new Error('Error al obtener recomendaciones');
  return res.json();
}

export interface OrderPayload {
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
  }>;
}

export interface OrderResponse {
  id: number;
  total: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
}

export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || 'Error al crear el pedido');
  }

  return res.json();
}
export async function fetchOrders(): Promise<OrderResponse[]> {
  const res = await fetch(`${API_URL}/orders`);
  if (!res.ok) throw new Error('Error al obtener los pedidos');
  return res.json();
}