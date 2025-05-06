import React, { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

const MyProfile: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    name: "Rohan Sharma",
    email: "rohan@example.com",
    address: "123 Street, Delhi, India",
    avatarUrl: "https://i.pravatar.cc/100?img=68",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("profileData");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(user));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUser((prev) => ({ ...prev, avatarUrl: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex  h-181vh  ">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 border-r border-sky-100 space-y-6">
       <Link to={'/myprofile'}> <h2 className="text-xl font-bold text-sky-700 mb-4">My Account</h2></Link>
        <Link to="myorders" className="flex items-center space-x-2 text-gray-700 hover:text-sky-600">
          <FaBoxOpen />
          <span>My Orders</span>
        </Link>
        <Link to="myaddress" className="flex items-center space-x-2 text-gray-700 hover:text-sky-600">
          <FaMapMarkerAlt />
          <span>My Addresses</span>
        </Link>
        <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-sky-600">
          <FaShoppingCart />
          <span>My Cart</span>
        </Link>
        <Link to="/wishlist" className="flex items-center space-x-2 text-gray-700 hover:text-sky-600">
          <FaHeart />
          <span>My Wishlist</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="min-h-screen">

      <Outlet/>

      </div>


    
    
    </div>
  );
};

export default MyProfile;
