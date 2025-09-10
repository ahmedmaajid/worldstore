// CheckoutPage.jsx
import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";

export default function CheckoutPage({ onBackToCart, onOrderPlaced }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    note: "",
  });

  const cartItems = [
    { id: 1, name: "GG Marmont Matelassé Mini Bag", price: 2100, qty: 1 },
    { id: 2, name: "Ace Embroidered Sneaker", price: 650, qty: 1 },
  ];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shipping = 0; // free shipping like luxury sites
  const tax = subtotal * 0.05;
  const total = subtotal + tax + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
    alert("Order placed successfully!");
    onOrderPlaced("confirmation");
  };

  return (
    <div className="checkout-page">
      {/* Left Side: Form */}
      <div className="checkout-form">
        <h2 className="checkout-title">Shipping Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <div className="form-row">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="note"
            placeholder="Optional Notes about Your Shipment/Order"
            value={formData.note}
            onChange={handleChange}
            required
          />

          <div className="buttons">
            <button
              type="button"
              className="back-btn d-flex align-center p-2"
              onClick={() => {
                onBackToCart("cart");
              }}
            >
              <ChevronLeft /> Back
            </button>
            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </div>
        </form>
      </div>

      {/* Right Side: Order Summary */}
      <div className="checkout-summary">
        <h2 className="summary-title">Your Order</h2>
        <ul className="summary-list">
          {cartItems.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} × {item.qty}
              </span>
              <span>${item.price * item.qty}</span>
            </li>
          ))}
        </ul>
        <div className="summary-line">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
