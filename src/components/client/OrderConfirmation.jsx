import React, { useEffect } from "react";
// import "./orderConfirmation.css";

export default function OrderConfirmation() {
  useEffect(() => {
    // Generate random order number
    const orderNumber =
      "#LUX-2025-" +
      String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
    const orderEl = document.querySelector(".order-number");
    if (orderEl) orderEl.textContent = orderNumber;

    // Add current date + 3-5 days for delivery estimate
    const today = new Date();
    const deliveryStart = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const deliveryEnd = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);

    const formatDate = (date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const deliveryText = `${formatDate(deliveryStart)} - ${formatDate(
      deliveryEnd
    )}`;
    const deliveryEl = document.querySelector(
      ".detail-row:nth-child(3) .detail-value"
    );
    if (deliveryEl) deliveryEl.textContent = deliveryText;
  }, []);

  const continueShopping = () => {
    document.body.style.opacity = "0";
    document.body.style.transform = "translateY(20px)";

    setTimeout(() => {
      window.location.href = "/shop";
    }, 300);
  };

  const trackOrder = () => {
    alert("Order tracking feature coming soon...");
    // window.location.href = "/track-order";
  };

  return (
    <div className="order-confirmation-page" style={{ width: "100%" }}>
      <div className="confirmation-container">
        <div className="checkmark-container">
          <svg
            className="checkmark-circle-svg"
            viewBox="0 0 120 120"
            width="120"
            height="120"
          >
            <circle
              cx="60"
              cy="60"
              r="58"
              stroke="#1a1a1a"
              strokeWidth="4"
              fill="none"
              className="circle"
            />
            <path
              d="M40 60 L55 75 L80 45"
              stroke="#1a1a1a"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="check"
            />
          </svg>
        </div>

        {/* Main Content */}
        <h1 className="confirmation-title">Order Confirmed</h1>
        <p className="confirmation-subtitle">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order Details */}
        <div className="order-details">
          <h3>Order Details</h3>
          <div className="detail-row">
            <span className="detail-label">Order Number</span>
            <span className="detail-value order-number">#LUX-2025-0001</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Payment Method</span>
            <span className="detail-value">Cash on Delivery</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Estimated Delivery</span>
            <span className="detail-value">3-5 Business Days</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Delivery Address</span>
            <span className="detail-value">Your provided address</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h4>What Happens Next</h4>
          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-text">
                We'll process your order within 24 hours
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-text">
                You'll receive a call to confirm delivery details
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-text">
                Your order will be dispatched for delivery
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-text">
                Pay cash when your order arrives at your doorstep
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="primary-btn" onClick={continueShopping}>
            Continue Shopping
          </button>
          <button className="secondary-btn" onClick={trackOrder}>
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}
