import React, { useState, useEffect } from "react";
import {
  FaUserEdit,
} from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

const UserDetail: React.FC = () => {
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
       <>
        <div className="flex-1 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-sky-100">
          <div className="flex items-start space-x-6">
            <div>
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-4 border-sky-200 object-cover"
              />
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="mt-2 text-sm text-sky-700"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-sky-700">Profile Info</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="text-sky-600 hover:text-sky-800 flex items-center space-x-1"
                >
                  <FaUserEdit />
                  <span>{editMode ? "Save" : "Edit"}</span>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      className="w-full mt-1 border rounded-md px-3 py-2 text-sm border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  ) : (
                    <p className="text-gray-800">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full mt-1 border rounded-md px-3 py-2 text-sm border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  ) : (
                    <p className="text-gray-800">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Address</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                      className="w-full mt-1 border rounded-md px-3 py-2 text-sm border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  ) : (
                    <p className="text-gray-800">{user.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    );
}

export default UserDetail;