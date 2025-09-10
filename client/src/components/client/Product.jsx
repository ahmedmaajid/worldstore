import React from "react";
import { Link } from "react-router-dom";
export const Product = ({ product }) => {
  return (
    <Link key={product.id} className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-price">${product.price.toFixed(2)}</span>
      </div>
    </Link>
  );
};
