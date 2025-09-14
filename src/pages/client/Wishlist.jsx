import React, { useState, useEffect } from "react";
import "../../styles/client/wishlist.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../api/checkAuth";
export const Wishlist = () => {
  const [category, setCategory] = useState("All");

  const categories = ["All", "Shoes", "Bags", "Home Needs"];

  const navigate = useNavigate();
  useEffect(() => {
    const verify = async () => {
      const isLoggedIn = await checkAuth();
      if (!isLoggedIn) {
        navigate("/account/login");
      }
    };
    verify();
  }, [navigate]);

  const products = [
    {
      id: 1,
      category: "Shoes",
      name: "Premium Running Shoes",
      description: "Comfortable and stylish running shoes.",
      price: 12499,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      category: "Bags",
      name: "Leather Travel Backpack",
      description: "Spacious and elegant travel backpack.",
      price: 18999,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    },
    {
      id: 3,
      category: "Home Needs",
      name: "Designer Lamp",
      description: "Modern lamp for your living room.",
      price: 7999,
      image:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=300&h=300&fit=crop",
    },
    {
      id: 4,
      category: "Shoes",
      name: "Classic Loafers",
      description: "Elegant loafers for formal wear.",
      price: 12500,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
    },
    {
      id: 5,
      category: "Bags",
      name: "Canvas Tote Bag",
      description: "Stylish and eco-friendly tote bag.",
      price: 3500,
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
    },
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>Wishlists</h1>
        <p>Your favorite items saved for later</p>
      </div>

      <div className="category-bar">
        {categories.map((cat) => (
          <div
            key={cat}
            className={`category-item ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            <img
              //   src={`/icons/${cat.toLowerCase()}.png`}
              src="/Watch.png"
              alt={cat}
              className="category-icon"
            />
            <div className="category-text">
              <span>{cat}</span>
              <span>10 Items</span>
            </div>
          </div>
        ))}
      </div>

      <div className="wishlist-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="wishlist-card">
            <div className="wishlist-image-wrapper">
              <img src={product.image} alt={product.name} />
              <div className="price-tag">
                Rs. {product.price.toLocaleString()}
              </div>
            </div>
            <div className="wishlist-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
            <div className="wishlist-actions">
              <button className="wishlist-add-btn">Add to Cart</button>
              <button className="wishlist-remove-btn">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
