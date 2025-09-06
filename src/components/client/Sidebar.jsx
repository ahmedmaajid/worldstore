import React from "react";
import { Heart, Handbag, User, X, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  // Dummy categories
  const categories = [
    { id: 1, name: "New Arrival", path: "/bags" },
    { id: 2, name: "Home Needs", path: "/home-needs" },
    { id: 4, name: "Cosmetic Items", path: "/cosmetic-items" },
    { id: 3, name: "Phone Accessories", path: "/accessories" },
    { id: 5, name: "Foreign Mart", path: "/sunglasses" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose}>
          <X strokeWidth={1.2} />
          Close
        </button>

        <nav className="sidebar-nav">
          <ul className="desktop-links">
            <span className="sidebar-nav-span">Quick Links</span>
            <li>
              <Store /> <span>Shop</span>
            </li>
            <li>
              <Heart /> <span>Wishlist</span>
            </li>
            <li>
              <User /> <span>Account</span>
            </li>
            <li>
              <img src="./WhatsApp.png" alt="Contact" />
              <span>Contact</span>
            </li>
          </ul>

          <ul className="categories-list">
            <span className="sidebar-nav-span">Categories</span>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link to={`/shop/category${cat.path}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
