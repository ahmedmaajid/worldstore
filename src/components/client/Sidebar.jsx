import React from "react";
import { Heart, Handbag, User, X, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  // Dummy categories
  const categories = [
    { id: 1, name: "Bags", path: "/bags" },
    { id: 2, name: "Shoes", path: "/shoes" },
    { id: 3, name: "Accessories", path: "/accessories" },
    { id: 4, name: "Watches", path: "/watches" },
    { id: 5, name: "Sunglasses", path: "/sunglasses" },
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
          <ul>
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
                <Link to={cat.path}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
