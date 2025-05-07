import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login"); // Redirect if not logged in
      return;
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://ecommerce-backend-d1fg.onrender.com/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-border-sky-100 text-white text-lg font-semibold">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-border-sky-100 text-white text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-border-sky-100 text-black p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center ml-24">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-center text-lg">No orders found.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="border border-white p-4 rounded-lg shadow-lg bg-white text-black">
                <p className="font-semibold text-lg">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="font-semibold">Total Price: ${order.totalPrice.toFixed(2)}</p>
                <p>Status: {order.isPaid ? "Paid" : "Pending Payment"} | {order.isDelivered ? "Delivered" : "Not Delivered"}</p>
                <div className="mt-2">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-t border-indigo-300 pt-2">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-sm">Qty: {item.qty} | Price: ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
