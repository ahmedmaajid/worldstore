// CheckoutForm.jsx
import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { createOrder } from "../../api/order";
import PopMessage from "./PopMessage";
import { Spinner } from "../../components/client/Spinner";

export default function CheckoutForm({
  setConfirmationData,
  cartItems = [],
  total = 0,
  subtotal = 0,
  promoDiscount = 0,
  appliedPromo = null,
  shippingFee = 0,
  freeShippingOver = null,
  onBackToCart,
  onOrderPlaced,
}) {
  const [popup, setPopup] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    try {
      const fullData = {
        formData,
        appliedPromo,
        total,
        shippingFee,
        freeShippingOver,
        cartItems,
      };
      console.log(fullData);
      const data = await createOrder(fullData);
      console.log(data.order);

      setConfirmationData(data.order);

      setPopup({ status: "success", message: "Order placed successfully!" });
      setShowSpinner(false);
      setTimeout(() => {
        onOrderPlaced(data.order);
      }, 3000);
    } catch (err) {
      setShowSpinner(false);
      console.error(err);
      const message =
        err.response?.data?.message || "Something went wrong. Try again!";
      setPopup({ status: "error", message });
    }
  };

  return (
    <div className="checkout-page">
      {showSpinner && <Spinner />}
      {popup && (
        <PopMessage
          status={popup.status}
          message={popup.message}
          autoClose={true}
          duration={4000}
          onClose={() => setPopup(null)}
        />
      )}
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

        {/* Product Summary Section */}
        <div className="order-items">
          {cartItems.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <img
                  src={item.image}
                  alt={item.name}
                  className="item-thumbnail"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginRight: "12px",
                  }}
                  onError={(e) => {
                    e.target.src = "/api/placeholder/60/60";
                  }}
                />
                <div className="item-details">
                  <div className="item-name">{item.name}</div>

                  <div className="item-variation">
                    {Object.entries(item.attributes || {}).map(
                      ([key, value], index) => (
                        <span key={key}>
                          {value}
                          {index <
                            Object.keys(item.attributes || {}).length - 1 &&
                            " / "}
                        </span>
                      )
                    )}
                  </div>
                  <div className="item-quantity">Qty: {item.quantity}</div>
                </div>
              </div>
              <div className="item-price">
                LKR {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Original summary list style for totals */}
        <ul className="summary-list">
          {cartItems.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>

        <div className="summary-line">
          <span>Subtotal</span>
          <span>LKR {subtotal.toLocaleString()}</span>
        </div>

        {appliedPromo && promoDiscount > 0 && (
          <div className="summary-line">
            <span>Promo Discount ({appliedPromo.code})</span>
            <span>-LKR {promoDiscount.toLocaleString()}</span>
          </div>
        )}

        <div className="summary-line">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? "Free" : `LKR ${shippingFee}`}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>LKR {total.toLocaleString()}</span>
        </div>
      </div>

      <style jsx>{`
        .order-items {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
          color: #333;
        }

        .item-variation {
          font-size: 12px;
          color: #666;
          margin-bottom: 2px;
        }

        .item-quantity {
          font-size: 12px;
          color: #666;
        }

        .item-price {
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
