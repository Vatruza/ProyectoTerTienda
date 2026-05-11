import { useEffect, useState } from 'react';
import { fetchOrders } from '../services/api';
import './OrderHistory.css';

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
}

function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => {
        setError('No se pudieron cargar tus pedidos.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>📦 Historial de pedidos</h1>
        <p>Revisa los pedidos que se han guardado en el sistema.</p>
      </div>

      {loading ? (
        <div className="orders-loading">Cargando pedidos...</div>
      ) : error ? (
        <div className="orders-error">{error}</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <p>No hay pedidos registrados todavía.</p>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
