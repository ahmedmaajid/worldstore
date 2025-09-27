import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Spinner } from "../client/Spinner";

export const AdminRoute = ({ user, isLoading }) => {
  if (isLoading) return <Spinner />;

  if (!user) return <Navigate to="/account/login" replace />;

  if (!user.isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};
