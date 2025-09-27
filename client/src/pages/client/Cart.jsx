import React, { useState, useEffect } from "react";
import CheckoutForm from "../../components/client/CheckoutForm";
import OrderConfirmation from "../../components/client/OrderConfirmation";
import "../../styles/client/checkout.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../api/checkAuth";
import { getCartItems, removeCartItem } from "../../api/products";
import { getCommerceData } from "../../api/admin.js";
import { ConfirmationDialog } from "../../components/client/ConfirmationDialog.jsx";
import PopMessage from "../../components/client/PopMessage.jsx";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [animatedItems, setAnimatedItems] = useState([]);
  const [step, setStep] = useState("cart");

  // Commerce data states
  const [commerceData, setCommerceData] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [freeShippingOver, setFreeShippingOver] = useState(0);
  const [coupons, setCoupons] = useState([]);

  const [confirmationData, setConfirmationData] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [popUp, setPopUp] = useState({
    state: false,
    message: "",
    status: null,
  });

  const askRemoveItem = (id) => {
    setItemToDelete(id);
    setShowConfirm(true);
  };

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

  async function getData() {
    try {
      setIsLoading(true);

      // Get commerce data first
      const commerceData = await getCommerceData();
      console.log("Commerce Data:", commerceData);

      if (commerceData.length > 0) {
        const shop = commerceData[0];
        setCommerceData(shop);

        // Set shipping fee - handle null values
        const shippingFeeValue =
          shop.shippingFee !== null ? shop.shippingFee : 350;
        setShippingFee(shippingFeeValue);

        // Set free shipping threshold - handle null values
        const freeShippingValue =
          shop.freeShippingOver !== null ? shop.freeShippingOver : 5000;
        setFreeShippingOver(freeShippingValue);

        // Set coupons
        setCoupons(shop.coupons || []);

        console.log("Shipping Fee:", shippingFeeValue);
        console.log("Free Shipping Over:", freeShippingValue);
        console.log("Coupons:", shop.coupons);
      }

      // Get cart items
      const items = await getCartItems();
      console.log("Cart Items:", items);

      // Transform the API data to match the expected format
      // const transformedItems = items.map((item) => {
      //   const variationParts = item.variationName?.split(" / ") || [];
      //   return {
      //     id: item._id,
      //     name: item.productName,
      //     subtitle: item.variationName || "PREMIUM COLLECTION",
      //     collection: "FEATURED ITEMS",
      //     color: variationParts[1] || "Standard",
      //     size: variationParts[0] || "ONE SIZE",
      //     quantity: item.quantity,
      //     price: item.price,
      //     originalPrice: item.price,
      //     image: item.productImage || "/api/placeholder/120/120",
      //     sku: item.variationId?.substring(18, 24).toUpperCase() || "N/A",
      //     inStock: true,
      //     estimatedDelivery: "3-5 business days",
      //     onSale: false,
      //     totalPrice: item.totalPrice,
      //     variationId: item.variationId,
      //     productId: item.productId,
      //   };
      // });

      const transformedItems = items.map((item) => {
        // Turn attributes object into readable string
        const attributesText = Object.entries(item.attributes || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(" / ");

        return {
          id: item.id,
          name: item.productName,
          productId: item.productId._id || item.productId,
          variationId: item.variationId,
          subtitle: attributesText || "PREMIUM COLLECTION",
          attributes: item.attributes || {},
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.price,
          image: item.productImage || "/api/placeholder/120/120",
          sku: item.variationId?.substring(18, 24).toUpperCase() || "N/A",
          inStock: item.inStock,
          estimatedDelivery: "3-5 business days",
          totalPrice: item.totalPrice,
        };
      });

      setCartItems(transformedItems);
      setIsLoading(false);

      // Animate items appearing
      transformedItems.forEach((item, index) => {
        setTimeout(() => {
          setAnimatedItems((prev) => [...prev, item.id]);
        }, index * 150);
      });
    } catch (error) {
      console.error("Failed to load cart items:", error);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.price * newQuantity,
            }
          : item
      )
    );
  };

  const removeItem = async () => {
    if (!itemToDelete) return;

    try {
      const deletion = await removeCartItem(itemToDelete);
      console.log("Deletion", deletion);
      setPopUp({ state: true, status: "success", message: deletion.message });
      getData();
    } catch (error) {
      console.error("Delete failed:", error);
      setPopUp({ state: true, status: error, message: error });
    } finally {
      setShowConfirm(false);
      setItemToDelete(null);
    }
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase().trim();
    if (!code) return;

    const coupon = coupons.find((c) => c.code?.toUpperCase() === code);

    if (coupon) {
      setAppliedPromo({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description:
          coupon.description ||
          `${coupon.discountValue}${
            coupon.discountType === "percentage" ? "%" : " LKR"
          } off`,
      });
      setPromoCode("");
      console.log("Applied coupon:", coupon);
    } else {
      setPopUp({
        state: true,
        message: "Invalid promo code. Please check and try again.",
        status: "error",
      });
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

  // Calculate promo discount
  const promoDiscount = appliedPromo
    ? appliedPromo.discountType === "percentage"
      ? subtotal * (appliedPromo.discountValue / 100)
      : appliedPromo.discountType === "fixed"
      ? appliedPromo.discountValue
      : 0
    : 0;

  // Calculate shipping fee based on real data
  const calculatedShipping =
    appliedPromo?.discountType === "free_shipping"
      ? 0
      : subtotal >= freeShippingOver
      ? 0
      : shippingFee;

  // Calculate total
  const total = subtotal - promoDiscount + calculatedShipping;

  useEffect(() => {
    if (total < 0 || total === 0) {
      console.log("Minus");
      setPopUp({
        state: true,
        status: "error",
        message: "You cannot use this coupon on this product.",
      });
      setPromoCode(null);
      setAppliedPromo(null);
    } else {
      setPopUp({
        state: false,
        status: null,
        message: "",
      });
    }
  }, [total, appliedPromo]);
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
          cartItems={cartItems}
          total={total}
          subtotal={subtotal}
          promoDiscount={promoDiscount}
          appliedPromo={appliedPromo}
          shippingFee={calculatedShipping}
          freeShippingOver={freeShippingOver}
          onOrderPlaced={() => setStep("confirmation")}
          setConfirmationData={setConfirmationData}
          onBackToCart={() => setStep("cart")}
        />
      );
    }

    if (step === "confirmation") {
      return <OrderConfirmation confirmationData={confirmationData} />;
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
            <button className="shop-now-btn" onClick={() => navigate("/shop")}>
              EXPLORE COLLECTION
            </button>
          </div>
        ) : (
          <>
            <ConfirmationDialog
              isOpen={showConfirm}
              title="Remove item?"
              message="Are you sure you want to remove this item from your cart?"
              confirmText="Remove"
              cancelText="Cancel"
              variant="destructive"
              onConfirm={removeItem}
              onCancel={() => setShowConfirm(false)}
            />
            {popUp.state && (
              <PopMessage status={popUp.status} message={popUp.message} />
            )}
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
                      onError={(e) => {
                        e.target.src = "/api/placeholder/120/120";
                      }}
                    />
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <div className="item-specs">
                        {Object.entries(item.attributes || {}).map(
                          ([key, value]) => (
                            <div className="spec" key={key}>
                              <span className="spec-label">{key}:</span>
                              {value}
                            </div>
                          )
                        )}
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
                          LKR {item.price.toLocaleString()}
                        </span>
                        {item.onSale && (
                          <span className="original-price">
                            LKR {item.originalPrice.toLocaleString()}
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
                        onClick={() => askRemoveItem(item.id)}
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
                      onKeyPress={(e) => e.key === "Enter" && applyPromoCode()}
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
                  <span>LKR {subtotal.toLocaleString()}</span>
                </div>

                {savings > 0 && (
                  <div className="price-line">
                    <span>Sale Savings</span>
                    <span className="savings">
                      -LKR {savings.toLocaleString()}
                    </span>
                  </div>
                )}

                {appliedPromo && promoDiscount > 0 && (
                  <div className="price-line">
                    <span>Promo Discount ({appliedPromo.code})</span>
                    <span className="discount">
                      -LKR {promoDiscount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="price-line">
                  <span>Shipping</span>
                  <span>
                    {calculatedShipping === 0
                      ? "FREE"
                      : `LKR ${calculatedShipping.toLocaleString()}`}
                  </span>
                </div>

                <div className="price-line total">
                  <span>Total</span>
                  <span>LKR {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="shipping-info">
                <strong>FREE SHIPPING</strong> on orders over LKR{" "}
                {freeShippingOver?.toLocaleString() || "5,000"}
                <br />
                <strong>EXPRESS SHIPPING</strong> available at checkout
                <br />
                All orders are carefully packaged with our packaging team
              </div>

              <button
                className="checkout-btn"
                onClick={() => setStep("checkout")}
                disabled={cartItems.length === 0}
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
      <div className="cart-container">
        {step === "cart" ? (
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
                onClick={() => navigate("/shop")}
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
