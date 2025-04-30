import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Product {
  _id?: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  numReviews: number;
  category: string;
}

const initialFormState: Product = {
  name: '',
  price: 0,
  image: '',
  rating: 0,
  numReviews: 0,
  category: ''
};

const AdminProductPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>(initialFormState);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>('http://localhost:8000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' || name === 'numReviews' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        await axios.put(`http://localhost:8000/api/products/${editId}`, form);
      } else {
        await axios.post('http://localhost:8000/api/products', form);
      }
      setForm(initialFormState);
      setIsEditing(false);
      setEditId(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setIsEditing(true);
    setEditId(product._id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 text-blue-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Product Panel</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-blue-50 p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
          {Object.entries(form).map(([key, value]) => {
            if (key === '_id') return null;
            return (
              <div className="mb-4" key={key}>
                <label className="block mb-1 capitalize font-medium">{key}</label>
                <input
                  type={typeof value === 'number' ? 'number' : 'text'}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            );
          })}
          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <ul className="space-y-4">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="bg-white p-4 border border-blue-100 rounded-lg shadow-sm flex justify-between items-center transition hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                  <div>
                    <img src={product.image}  height={200} width={200}  alt="" />
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductPanel;
