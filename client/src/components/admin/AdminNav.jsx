import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  Package,
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  Boxes,
  Box,
} from "lucide-react";

export const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", link: "/admin/dashboard" },
    // { icon: BarChart3, label: "Analytics",link: "/" },
    { icon: Box, label: "Commerce", link: "/admin/commerce" },
    { icon: Package, label: "Products", link: "/admin/products" },
    { icon: Boxes, label: "Categories", link: "/admin/categories" },
    { icon: Users, label: "Customers", link: "/admin/customers" },
    { icon: Bell, label: "Orders", link: "/admin/orders" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}

      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <nav className={`admin-nav ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="nav-header">
          <div className="logo">
            <span className="logo-text">WORLD STORE</span>
            <span className="logo-subtitle">ADMIN</span>
          </div>
        </div>

        {/* Search */}
        <div className="nav-search">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        {/* Navigation Items */}
        <ul className="nav-menu">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.link;
            return (
              <li
                key={index}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Link to={item.link} className="nav-link">
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Profile */}
        <div className="nav-profile">
          <div className="profile-avatar">
            <User size={20} />
          </div>
          <div className="profile-info">
            <span className="profile-name">Admin User</span>
            <span className="profile-role">Administrator</span>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="nav-overlay" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};
