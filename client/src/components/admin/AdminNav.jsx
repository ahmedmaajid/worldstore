import React, { useState } from "react";
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
} from "lucide-react";

export const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BarChart3, label: "Analytics" },
    { icon: Package, label: "Products" },
    { icon: Users, label: "Customers" },
    { icon: Bell, label: "Orders" },
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
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`nav-item ${item.active ? "active" : ""}`}
            >
              <a href="#" className="nav-link">
                <item.icon size={18} />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
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
