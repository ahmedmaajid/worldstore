import React, { useState, useEffect } from "react";

export default function Preview() {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1); // 1: Product details, 2: Shipping info, 3: Confirmation
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Sri Lanka",
    specialInstructions: "",
  });
  const [errors, setErrors] = useState({});

  // Simulate fetching product from URL slug
  useEffect(() => {
    const urlSlug = "monogram-canvas-handbag-noir"; // Fake slug

    // Simulate API call
    setTimeout(() => {
      setProduct({
        id: "lv-001",
        slug: urlSlug,
        name: "MONOGRAM CANVAS HANDBAG",
        subtitle: "NOIR COLLECTION",
        price: 2850,
        currency: "USD",
        description:
          "Crafted from iconic Monogram canvas with natural cowhide leather trim, this sophisticated handbag features gold-tone hardware and a spacious interior with premium silk lining.",
        images: ["/Watch.png", "/Handbag.png", "/Toy.png"],
        colors: [
          { name: "Monogram Brown", code: "#8B4513" },
          { name: "Noir Black", code: "#000000" },
          { name: "Cream Ivory", code: "#F5F5DC" },
        ],
        sizes: ["ONE SIZE"],
        features: [
          "Monogram canvas with leather trim",
          "Gold-tone hardware",
          "Interior zip pocket",
          "Premium silk lining",
          "Adjustable shoulder strap",
          "Handcrafted in France",
        ],
        inStock: true,
        deliveryTime: "3-5 business days",
      });
      setSelectedColor("Monogram Brown");
      setSelectedSize("ONE SIZE");
    }, 500);
  }, []);

  const updateShippingInfo = (field, value) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateShippingInfo = () => {
    const newErrors = {};
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
    ];

    required.forEach((field) => {
      if (!shippingInfo[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (shippingInfo.email && !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToShipping = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 800);
  };

  const handleProceedToConfirmation = () => {
    if (validateShippingInfo()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 800);
    }
  };

  const handlePlaceOrder = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(
        "Order placed successfully! We will contact you within 24 hours to confirm your order."
      );
    }, 1500);
  };

  if (!product) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>LOADING PRODUCT...</p>
      </div>
    );
  }

  const totalPrice = product.price * quantity;
  const deliveryFee = totalPrice > 2000 ? 0 : 25;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <>
      <style>{`
        .purchase-container {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: Manrope;
          font-weight: 600;
        }


        .logo {
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: #000;
        }

       
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          margin-bottom: 60px;
          gap: 40px;
        }

        .progress-step {
          display: flex;
          align-items: center;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #ccc;
        }

        .progress-step.active {
          color: #000;
        }

        .progress-step::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ccc;
          margin-right: 8px;
        }

        .progress-step.active::before {
          background: #000;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: white;
        }

        .spinner-large {
          width: 40px;
          height: 40px;
          border: 2px solid #e5e5e5;
          border-top: 2px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .product-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          margin-bottom: 60px;
        }

        .product-images {
          display: grid;
          gap: 20px;
        }

        .main-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border: 1px solid #e5e5e5;
          
        }

        .product-details {
          padding: 20px 0;
        }

        .product-title {
          font-size: 32px;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .product-subtitle {
          font-size: 14px;
          color: #666;
          letter-spacing: 0.2em;
          margin-bottom: 24px;
        }

        .product-price {
          font-size: 24px;
          font-weight: 300;
          margin-bottom: 32px;
          letter-spacing: 0.05em;
        }

        .product-description {
          color: #666;
          margin-bottom: 32px;
          line-height: 1.8;
        }

        .product-options {
          margin-bottom: 40px;
        }

        .option-group {
          margin-bottom: 24px;
        }

        .option-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          display: block;
        }

        .color-options {
          display: flex;
          gap: 12px;
        }

        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.3s;
        }

        .color-option.selected {
          border-color: #000;
        }

        .size-options {
          display: flex;
          gap: 12px;
        }

        .size-option {
          padding: 12px 20px;
          border: 1px solid #ccc;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 12px;
          letter-spacing: 0.1em;
        }

        .size-option.selected,
        .size-option:hover {
          border-color: #000;
          background: #f9f9f9;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .quantity-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.3s;
        }

        .quantity-btn:hover {
          border-color: #000;
        }

        .quantity-input {
          width: 60px;
          text-align: center;
          border: 1px solid #ccc;
          padding: 8px;
          font-size: 14px;
        }

        .form-section {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
        }

        .form-title {
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 0.1em;
          text-align: center;
          margin-bottom: 40px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-row.full {
          grid-template-columns: 1fr;
        }

        .input-group {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 16px 0;
          font-size: 14px;
          color: black;
          background: transparent;
          border: none;
          border-bottom: 1px solid #ccc;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          border-bottom-color: black;
        }

        .form-input.error {
          border-bottom-color: #dc2626;
        }

        .form-label {
          position: absolute;
          left: 0;
          top: 16px;
          font-size: 14px;
          color: #999;
          pointer-events: none;
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
        }

        .form-label.active {
          top: 0;
          font-size: 12px;
          color: #666;
          transform: translateY(-8px);
        }

        .form-textarea {
          min-height: 80px;
          resize: vertical;
          padding-top: 16px;
        }

        .error-message {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
          letter-spacing: 0.05em;
        }

        .btn {
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          text-transform: uppercase;
        }

        .btn-primary {
          background-color: black;
          color: white;
          width: 100%;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #333;
        }

        .btn-secondary {
          background-color: transparent;
          color: black;
          border: 1px solid #ccc;
          width: 100%;
          margin-top: 16px;
        }

        .btn-secondary:hover {
          border-color: black;
          background-color: #f9f9f9;
        }

        .btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .loading {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        .order-summary {
          background: #f9f9f9;
          padding: 32px;
          margin-top: 40px;
        }

        .summary-title {
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .summary-total {
          border-top: 1px solid #ccc;
          padding-top: 12px;
          margin-top: 12px;
          font-weight: 500;
        }


        .confirmation-section {
          text-align: center;
          max-width: 600px;
          width: 100%;
          margin: 0 auto;   
        }

        .cod-notice {
          background: #f0f8ff;
          border: 1px solid #b0d4f1;
          padding: 20px;
          margin: 24px 0;
          font-size: 14px;
          line-height: 1.6;
        }

        .confirmation-icon {
          width: 80px;
          height: 80px;
          border: 2px solid #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px;
          font-size: 32px;
          color: #22c55e;
        }

        @media (max-width: 768px) {
          .product-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            gap: 20px;
          }
          
          .header-content {
            flex-direction: column;
            gap: 12px;
          }
        }

        @media(max-width: 424px){
        .progress-step{
        font-size: 10px;
        }
        }
      `}</style>

      <div className="purchase-container">
        <div className="main-content">
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
              PRODUCT DETAILS
            </div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
              SHIPPING INFORMATION
            </div>
            <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
              ORDER CONFIRMATION
            </div>
          </div>

          {/* Step 1: Product Details */}
          {step === 1 && (
            <div className="product-section">
              <div className="product-images">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="main-image"
                />
              </div>

              <div className="product-details">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-subtitle">{product.subtitle}</p>
                <div className="product-price">
                  ${product.price.toLocaleString()}
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-options">
                  <div className="option-group">
                    <label className="option-label">COLOR</label>
                    <div className="color-options">
                      {product.colors.map((color) => (
                        <div
                          key={color.name}
                          className={`color-option ${
                            selectedColor === color.name ? "selected" : ""
                          }`}
                          style={{ backgroundColor: color.code }}
                          onClick={() => setSelectedColor(color.name)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <label className="option-label">SIZE</label>
                    <div className="size-options">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          className={`size-option ${
                            selectedSize === size ? "selected" : ""
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <label className="option-label">QUANTITY</label>
                    <div className="quantity-selector">
                      <button
                        className="quantity-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleProceedToShipping}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      PROCESSING...
                    </div>
                  ) : (
                    "PROCEED TO CHECKOUT"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Information */}
          {step === 2 && (
            <div className="form-section">
              <h2 className="form-title">SHIPPING INFORMATION</h2>

              <div className="form-row">
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-input ${errors.firstName ? "error" : ""}`}
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      updateShippingInfo("firstName", e.target.value)
                    }
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      shippingInfo.firstName ? "active" : ""
                    }`}
                  >
                    FIRST NAME
                  </label>
                  {errors.firstName && (
                    <div className="error-message">{errors.firstName}</div>
                  )}
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-input ${errors.lastName ? "error" : ""}`}
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      updateShippingInfo("lastName", e.target.value)
                    }
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      shippingInfo.lastName ? "active" : ""
                    }`}
                  >
                    LAST NAME
                  </label>
                  {errors.lastName && (
                    <div className="error-message">{errors.lastName}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <input
                    type="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    value={shippingInfo.email}
                    onChange={(e) =>
                      updateShippingInfo("email", e.target.value)
                    }
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      shippingInfo.email ? "active" : ""
                    }`}
                  >
                    EMAIL ADDRESS
                  </label>
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>
                <div className="input-group">
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? "error" : ""}`}
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      updateShippingInfo("phone", e.target.value)
                    }
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      shippingInfo.phone ? "active" : ""
                    }`}
                  >
                    PHONE NUMBER
                  </label>
                  {errors.phone && (
                    <div className="error-message">{errors.phone}</div>
                  )}
                </div>
              </div>

              <div className="form-row full">
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-input ${errors.address ? "error" : ""}`}
                    value={shippingInfo.address}
                    onChange={(e) =>
                      updateShippingInfo("address", e.target.value)
                    }
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      shippingInfo.address ? "active" : ""
                    }`}
                  >
                    STREET ADDRESS
                  </label>
                  {errors.address && (
                    <div className="error-message">{errors.address}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-input ${errors.city ? "error" : ""}`}
                    value={shippingInfo.city}
                    onChange={(e) => updateShippingInfo("city", e.target.value)}
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      shippingInfo.city ? "active" : ""
                    }`}
                  >
                    CITY
                  </label>
                  {errors.city && (
                    <div className="error-message">{errors.city}</div>
                  )}
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-input ${errors.postalCode ? "error" : ""}`}
                    value={shippingInfo.postalCode}
                    onChange={(e) =>
                      updateShippingInfo("postalCode", e.target.value)
                    }
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      shippingInfo.postalCode ? "active" : ""
                    }`}
                  >
                    POSTAL CODE
                  </label>
                  {errors.postalCode && (
                    <div className="error-message">{errors.postalCode}</div>
                  )}
                </div>
              </div>

              <div className="form-row full">
                <div className="input-group">
                  <textarea
                    className="form-input form-textarea"
                    value={shippingInfo.specialInstructions}
                    onChange={(e) =>
                      updateShippingInfo("specialInstructions", e.target.value)
                    }
                    placeholder=" "
                  />
                  <label
                    className={`form-label ${
                      shippingInfo.specialInstructions ? "active" : ""
                    }`}
                  >
                    SPECIAL DELIVERY INSTRUCTIONS (OPTIONAL)
                  </label>
                </div>
              </div>

              <div className="order-summary">
                <h3 className="summary-title">ORDER SUMMARY</h3>
                <div className="summary-item">
                  <span>
                    {product.name} × {quantity}
                  </span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}</span>
                </div>
                <div className="summary-item summary-total">
                  <span>TOTAL</span>
                  <span>${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleProceedToConfirmation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    PROCESSING...
                  </div>
                ) : (
                  "REVIEW ORDER"
                )}
              </button>

              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                BACK TO PRODUCT
              </button>
            </div>
          )}

          {/* Step 3: Order Confirmation */}
          {step === 3 && (
            <div className="confirmation-section">
              <div className="confirmation-icon">✓</div>
              <h2 className="form-title">CONFIRM YOUR ORDER</h2>

              <div className="order-summary">
                <h3 className="summary-title">ORDER DETAILS</h3>
                <div className="summary-item">
                  <span>
                    <strong>{product.name}</strong>
                  </span>
                  <span></span>
                </div>
                <div className="summary-item">
                  <span>Color: {selectedColor}</span>
                  <span></span>
                </div>
                <div className="summary-item">
                  <span>Size: {selectedSize}</span>
                  <span></span>
                </div>
                <div className="summary-item">
                  <span>Quantity: {quantity}</span>
                  <span></span>
                </div>
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}</span>
                </div>
                <div className="summary-item summary-total">
                  <span>TOTAL</span>
                  <span>${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="order-summary">
                <h3 className="summary-title">SHIPPING TO</h3>
                <div style={{ textAlign: "left", lineHeight: 1.8 }}>
                  <div>
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </div>
                  <div>{shippingInfo.address}</div>
                  <div>
                    {shippingInfo.city}, {shippingInfo.postalCode}
                  </div>
                  <div>{shippingInfo.country}</div>
                  <div>{shippingInfo.phone}</div>
                  <div>{shippingInfo.email}</div>
                </div>
              </div>

              <div className="cod-notice">
                <strong>CASH ON DELIVERY</strong>
                <br />
                You will pay ${finalTotal.toLocaleString()} when you receive
                your order.
                <br />
                Expected delivery: {product.deliveryTime}
              </div>

              <button
                className="btn btn-primary"
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    PLACING ORDER...
                  </div>
                ) : (
                  "PLACE ORDER"
                )}
              </button>

              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                BACK TO SHIPPING
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
