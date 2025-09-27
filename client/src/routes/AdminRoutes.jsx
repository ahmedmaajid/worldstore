import { React, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import { AdminLayout } from "../pages/admin/AdminLayout";
import Categories from "../pages/admin/Categories";
import Customers from "../pages/admin/Customers";
import { CommerceManagement } from "../pages/admin/CommerceManagement";
import { AdminRoute } from "../components/admin/AdminRoute";
import { isAdmin } from "../api/admin";

export default function AdminRoutes() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const admin = await isAdmin();
        setUser({ isAdmin: admin });
        <Navigate to="/admin/dashboard" replace />;
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [user]);
  return (
    <Routes>
      <Route element={<AdminRoute user={user} isLoading={isLoading} />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="customers" element={<Customers />} />
          <Route path="commerce" element={<CommerceManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}
