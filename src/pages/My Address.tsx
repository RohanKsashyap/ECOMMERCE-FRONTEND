import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Address = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

const MyAddress: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState<Address>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  // Fetch saved addresses from backend on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/user/addresses"); // Your backend API route
        const data = await res.json();
        setSavedAddresses(data.addresses);
      } catch (err) {
        toast.error("⚠️ Failed to fetch addresses");
      }
    };

    fetchAddresses();
  }, []);

  const handleShippingChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleShippingSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingInfo),
      });

      const data = await res.json();

      if (res.ok) {
        setSavedAddresses([...savedAddresses, data.newAddress]);
        toast.success("✅ Address saved successfully!");
        setShippingInfo({
          fullName: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          phone: "",
        });
        setShowForm(false);
      } else {
        toast.error(data.message || "Failed to save address");
      }
    } catch (err) {
      toast.error("⚠️ Error saving address");
    }
  };

  const handleDeleteAddress = async (index: number) => {
    const addressToDelete = savedAddresses[index];
    try {
      const res = await fetch("/api/user/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: addressToDelete.phone }), // Use phone or unique identifier
      });

      if (res.ok) {
        const updated = savedAddresses.filter((_, i) => i !== index);
        setSavedAddresses(updated);
        toast.error("🗑️ Address deleted");
      } else {
        toast.error("Failed to delete address");
      }
    } catch (err) {
      toast.error("⚠️ Error deleting address");
    }
  };

  return (
    <div className="p-6 bg-sky-50 min-h-110vh">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-sky-700">My Addresses</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-sky-600 text-white  mx-14 px-4 py-2 rounded-lg hover:bg-sky-700 transition"
          >
            {showForm ? "Cancel" : "Add New Address"}
          </button>
        </div>

        {/* Saved Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {savedAddresses.length > 0 ? (
            savedAddresses.map((addr, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg shadow border border-sky-100 relative"
              >
                <button
                  onClick={() => handleDeleteAddress(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-sm"
                >
                  <Trash2 />
                </button>
                <h2 className="text-lg font-semibold text-sky-800">
                  {addr.fullName}
                </h2>
                <p className="text-gray-600">{addr.address}</p>
                <p className="text-gray-600">
                  {addr.city}, {addr.state}, {addr.postalCode}
                </p>
                <p className="text-gray-600">{addr.country}</p>
                <p className="text-gray-600">📞 {addr.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No saved addresses.</p>
          )}
        </div>

        {/* Add Address Form */}
        {showForm && (
          <form
            onSubmit={handleShippingSubmit}
            className="bg-white p-6 rounded-lg shadow border border-sky-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State / Province
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleShippingChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  required
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition"
              >
                Save Address
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyAddress;
