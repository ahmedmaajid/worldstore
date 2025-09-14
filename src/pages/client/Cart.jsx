import React, { useState, useEffect } from "react";
import CheckoutForm from "../../components/client/CheckoutForm";
import OrderConfirmation from "../../components/client/OrderConfirmation";
import "../../styles/client/checkout.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../api/checkAuth";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [animatedItems, setAnimatedItems] = useState([]);
  const [step, setStep] = useState("cart"); // Add state for the checkout step

  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (!mainContent) return;

    if (step === "checkout" || step === "confirmation") {
      mainContent.style.display = "flex";
      mainContent.style.padding = "2rem 1rem 0";
    } else {
      mainContent.style.display = "grid";
      mainContent.style.padding = "2rem";
    }
  }, [step]);

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

  useEffect(() => {
    // Simulate loading cart items
    setTimeout(() => {
      const items = [
        {
          id: 1,
          name: "MONOGRAM CANVAS HANDBAG",
          subtitle: "NOIR COLLECTION",
          collection: "FALL/WINTER 2024",
          color: "Monogram Brown",
          size: "ONE SIZE",
          quantity: 1,
          price: 2850,
          originalPrice: 2850,
          image: "/Watch.png",
          sku: "M44875",
          inStock: true,
          estimatedDelivery: "3-5 business days",
        },
        {
          id: 2,
          name: "LEATHER WALLET",
          subtitle: "CLASSIC COLLECTION",
          collection: "HERITAGE SERIES",
          color: "Black",
          size: "ONE SIZE",
          quantity: 2,
          price: 1450,
          originalPrice: 1450,
          image: "/Toy.png",
          sku: "M60017",
          inStock: true,
          estimatedDelivery: "2-4 business days",
        },
        {
          id: 3,
          name: "SILK SCARF",
          subtitle: "HERITAGE COLLECTION",
          collection: "TIMELESS CLASSICS",
          color: "Royal Blue",
          size: "90x90cm",
          quantity: 1,
          price: 1600,
          originalPrice: 1800,
          image: "/api/placeholder/120/120",
          sku: "H7001S",
          inStock: true,
          estimatedDelivery: "1-3 business days",
          onSale: true,
        },
      ];
      setCartItems(items);
      setIsLoading(false);
      items.forEach((item, index) => {
        setTimeout(() => {
          setAnimatedItems((prev) => [...prev, item.id]);
        }, index * 150);
      });
    }, 1200);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setAnimatedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const applyPromoCode = () => {
    const validCodes = {
      LUXURY10: {
        discount: 0.1,
        type: "percentage",
        description: "10% off your order",
      },
      WELCOME200: {
        discount: 200,
        type: "fixed",
        description: "$200 off orders over $3000",
      },
      FREESHIP: { discount: 0, type: "shipping", description: "Free shipping" },
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...validCodes[promoCode.toUpperCase()],
      });
      setPromoCode("");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const savings = cartItems.reduce((sum, item) => {
    if (item.onSale) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? subtotal * appliedPromo.discount
      : appliedPromo.type === "fixed"
      ? appliedPromo.discount
      : 0
    : 0;

  const shippingFee =
    appliedPromo?.type === "shipping"
      ? 0
      : subtotal > 5000
      ? 0
      : subtotal > 2000
      ? 25
      : 45;

  const tax = (subtotal - promoDiscount) * 0.08; // 8% tax
  const total = subtotal - promoDiscount + shippingFee + tax;

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="luxury-spinner">
          <div className="spinner-circle"></div>
        </div>
        <p>PREPARING YOUR CART...</p>
      </div>
    );
  }

  // Conditional Rendering Logic
  const renderContent = () => {
    if (step === "checkout") {
      return (
        <CheckoutForm
          onOrderPlaced={() => setStep("confirmation")}
          onBackToCart={() => setStep("cart")}
        />
      );
    }

    if (step === "confirmation") {
      return <OrderConfirmation />;
    }

    // Default to 'cart' step
    return (
      <>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h3>YOUR CART IS EMPTY</h3>
            <p>
              Discover our exquisite collection of luxury items
              <br />
              and find something perfect for you.
            </p>
            <button className="shop-now-btn">EXPLORE COLLECTION</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`cart-item ${
                    animatedItems.includes(item.id) ? "animated" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.onSale && <div className="sale-badge">SALE</div>}
                  <div className="item-content">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-subtitle">{item.subtitle}</p>
                      <p className="item-collection">{item.collection}</p>
                      <div className="item-specs">
                        <div className="spec">
                          <span className="spec-label">Color:</span>
                          {item.color}
                        </div>
                        <div className="spec">
                          <span className="spec-label">Size:</span>
                          {item.size}
                        </div>
                      </div>
                      <div className="item-meta">
                        <div className="sku">SKU: {item.sku}</div>
                        <div className="delivery-info">
                          ✓ {item.estimatedDelivery}
                        </div>
                      </div>
                    </div>
                    <div className="item-actions">
                      <div className="price-section">
                        <span className="current-price">
                          ${item.price.toLocaleString()}
                        </span>
                        {item.onSale && (
                          <span className="original-price">
                            ${item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <input
                          className="quantity-input"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              <div className="promo-section">
                {!appliedPromo ? (
                  <div className="promo-input-group">
                    <input
                      className="promo-input"
                      type="text"
                      placeholder="PROMO CODE"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                    />
                    <button className="promo-apply" onClick={applyPromoCode}>
                      APPLY
                    </button>
                  </div>
                ) : (
                  <div className="applied-promo">
                    <div>
                      <div style={{ fontWeight: "bold" }}>
                        {appliedPromo.code} APPLIED
                      </div>
                      <div>{appliedPromo.description}</div>
                    </div>
                    <button className="remove-promo" onClick={removePromo}>
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div className="price-breakdown">
                <div className="price-line subtotal">
                  <span>
                    Subtotal (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="price-line">
                    <span>Sale Savings</span>
                    <span className="savings">
                      -${savings.toLocaleString()}
                    </span>
                  </div>
                )}
                {appliedPromo && promoDiscount > 0 && (
                  <div className="price-line">
                    <span>Promo Discount ({appliedPromo.code})</span>
                    <span className="discount">
                      -${promoDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="price-line">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `$${shippingFee}`}</span>
                </div>
                <div className="price-line">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="price-line total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="shipping-info">
                <strong>FREE SHIPPING</strong> on orders over $5,000
                <br />
                <strong>EXPRESS SHIPPING</strong> available at checkout
                <br />
                All orders are carefully packaged with our signature gift wrap
              </div>
              <button
                className="checkout-btn"
                onClick={() => setStep("checkout")}
              >
                SECURE CHECKOUT
              </button>
              <div className="security-badges">
                <div className="security-badge">🔒 SSL SECURE</div>
                <div className="security-badge">✓ MONEY BACK</div>
                <div className="security-badge">📦 FREE RETURNS</div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <style jsx>{`
        /* Your existing CSS here */
      `}</style>

      <div className="cart-container">
        {step == "cart" ? (
          <div className="cart-header">
            <div className="header-content">
              <div>
                <h1 className="cart-title">
                  {step === "cart" ? "SHOPPING CART" : "CHECKOUT"}
                </h1>
                {step === "cart" && (
                  <p className="cart-count">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "ITEM" : "ITEMS"}
                  </p>
                )}
              </div>
              <button
                className="continue-shopping"
                onClick={() => setStep("cart")}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        ) : null}

        <div className="main-content cart">{renderContent()}</div>
      </div>
    </>
  );
};
