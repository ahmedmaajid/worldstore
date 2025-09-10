import React from "react";
import { Outlet } from "react-router-dom";
import { AdminNav } from "../../components/admin/AdminNav";
import "../../styles/admin/dashboard.css";
import "../../styles/admin/adminNav.css";

export const AdminLayout = () => {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  );
};
