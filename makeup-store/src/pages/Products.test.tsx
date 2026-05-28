import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Products from './Products';
import { fetchBrands, fetchProducts } from '../services/api';

const addItemMock = vi.fn();

vi.mock('../services/api', () => ({
  fetchProducts: vi.fn(),
  fetchBrands: vi.fn(),
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    addItem: addItemMock,
  }),
}));

vi.mock('../components/PersonalizedAdvisor', () => ({
  default: () => <div data-testid="advisor-mock" />,
}));

const mockedFetchProducts = vi.mocked(fetchProducts);
const mockedFetchBrands = vi.mocked(fetchBrands);

describe('Products page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedFetchProducts.mockResolvedValue([
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
    ]);

    mockedFetchBrands.mockResolvedValue([
      { id: 1, name: 'MAC' },
      { id: 2, name: 'Maybelline' },
    ]);
  });

  it('filtra productos al seleccionar una marca', async () => {
    const user = userEvent.setup();

    render(<Products />);

    expect(await screen.findByText('Base Studio')).toBeTruthy();
    expect(screen.getByText('Lip Tint')).toBeTruthy();

    await user.click(screen.getByRole('checkbox', { name: 'MAC' }));

    expect(await screen.findByText('Base Studio')).toBeTruthy();
    expect(screen.queryByText('Lip Tint')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Limpiar' }));

    expect(await screen.findByText('Lip Tint')).toBeTruthy();
  });

  it('agrega un producto al carrito al pulsar Agregar', async () => {
    const user = userEvent.setup();

    render(<Products />);

    const productCard = await screen.findByText('Base Studio');
    const card = productCard.closest('.product-card');

    expect(card).not.toBeNull();

    await user.click(within(card as HTMLElement).getByRole('button', { name: '🛒 Agregar' }));

    expect(addItemMock).toHaveBeenCalledTimes(1);
    expect(addItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'Base Studio',
      })
    );
  });
});