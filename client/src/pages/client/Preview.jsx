import React, { useState, useEffect } from "react";
import { Navigate, resolvePath, useParams } from "react-router-dom";
import { getProduct } from "../../api/products.js";
import { Handbag, Heart } from "lucide-react";
import PopMessage from "../../components/client/PopMessage";
import { Spinner } from "../../components/client/Spinner";
import axios from "../../api/axios";
import { checkAuth } from "../../api/checkAuth.js";
import { getCommerceData } from "../../api/admin.js";
import { directOrder } from "../../api/order.js";

export default function Preview() {
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // New state for cart and wishlist functionality
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showPopMessage, setShowPopMessage] = useState(null);

  const [popUp, setPopUp] = useState({ message: "", state: false, status: "" });

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

  const { slug } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const productData = await getProduct(slug);
        setProduct(productData);

        if (productData.hasVariations && productData.variations?.length > 0) {
          setSelectedVariation(productData.variations[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  console.log(product);

  console.log(product);

  const [mainImage, setMainImage] = useState(null);

  // Set initial main image when product loads
  useEffect(() => {
    if (!product) return;

    let initialImage = null;

    // Priority: Product main images FIRST
    if (product.mainImages && product.mainImages.length > 0) {
      initialImage = product.mainImages[0];
    } else if (selectedVariation && selectedVariation.images?.length > 0) {
      // Only use variation image if product has no main images
      initialImage = selectedVariation.images[0];
    }

    setMainImage(initialImage);
  }, [product]);

  // When variation changes, update main image to variation's first image (if exists)
  useEffect(() => {
    if (selectedVariation) {
      // if variation has single `image`
      if (selectedVariation.image) {
        setMainImage(selectedVariation.image);
      }
      // or if it has an array `images`
      else if (selectedVariation.images?.length > 0) {
        setMainImage(selectedVariation.images[0]);
      }
    }
  }, [selectedVariation]);

  // Inside the Preview component
  const handleImageSwitch = (newImageUrl) => {
    setMainImage(newImageUrl);
  };

  const allImages = [
    ...(product?.mainImages || []),
    ...(selectedVariation?.images || []),
  ].filter((url, index, self) => url && self.indexOf(url) === index);

  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    async function getCommerce() {
      try {
        const commerce = await getCommerceData();
        setShippingFee(commerce[0].shippingFee);
      } catch (error) {
        console.log(error);
      }
    }
    getCommerce();
  }, []);

  // Cart and Wishlist handlers
  const handleAddToCart = async () => {
    const checkingUser = await checkAuth();
    if (checkingUser === false)
      return setShowPopMessage({
        status: "warning",
        message: "Please log in or create an account to add items to your cart",
      });

    if (product.hasVariations && !selectedVariation) {
      setShowPopMessage({
        status: "warning",
        message: "Please select a variation before adding to cart",
      });
      return;
    }

    if (
      product.hasVariations &&
      selectedVariation &&
      !selectedVariation.inStock
    ) {
      setShowPopMessage({
        status: "error",
        message: "This variation is currently out of stock",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem = {
        productId: product._id,
        productName: product.name,
        productImage: getCurrentImage(),
        variationId: selectedVariation?._id || null,
        variationName: selectedVariation?.displayName || null,
        price: getCurrentPrice(),
        quantity: quantity,
      };

      const response = await axios.post("/api/products/add-to-cart", cartItem);

      setShowPopMessage({
        status: "success",
        message: `${response.data.cartItem.productName}${
          response.data.cartItem.variationName
            ? ` (${response.data.cartItem.variationName})`
            : ""
        } has been added to your cart!`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setShowPopMessage({
        status: "error",
        message: "Failed to add item to cart. Please try again.",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    // Check if user is logged in
    const isLoggedIn = await checkAuth();
    if (!isLoggedIn) {
      return setShowPopMessage({
        status: "error",
        message:
          "Please log in or create an account to add items to your wishlist",
      });
    }

    // Check variation selection
    if (
      product.hasVariations &&
      product.variations?.length > 0 &&
      !selectedVariation
    ) {
      return setShowPopMessage({
        status: "warning",
        message: "Please select a variation before adding to wishlist",
      });
    }

    setIsAddingToWishlist(true);

    try {
      const wishlistData = {
        productId: product._id,
        variationId: selectedVariation?._id || null,
      };

      const response = await axios.post(
        "/api/products/add-to-wishlist",
        wishlistData
      );

      setShowPopMessage({
        status: "success",
        message: `${product.name}${
          selectedVariation ? ` (${selectedVariation.displayName})` : ""
        } has been added to your wishlist!`,
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setShowPopMessage({
        status: "error",
        message: "Failed to add item to wishlist. Please try again.",
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const closePopMessage = () => {
    setShowPopMessage(null);
  };

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
    if (product.hasVariations && !selectedVariation) {
      alert("Please select a variation");
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

  // const handlePlaceOrder = () => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     alert(
  //       "Order placed successfully! We will contact you within 24 hours to confirm your order."
  //     );
  //   }, 1500);
  // };
  const handlePlaceOrder = async () => {
    setIsLoading(true);

    try {
      const orderData = {
        productId: product._id,
        productName: product.name,
        productImage: getCurrentImage(),
        variationId: selectedVariation?._id || null,
        variationAttributes: selectedVariation?.attributes || {},
        unitPrice: getCurrentPrice(),
        quantity: quantity,
        totalPrice: totalPrice,
        deliveryFee: deliveryFee,
        finalTotal: finalTotal,
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country,
          specialInstructions: shippingInfo.specialInstructions,
        },
      };

      const response = await directOrder(orderData);
      console.log("Response", response);
      setIsLoading(false);
      setPopUp({
        state: true,
        status: "success",
        message: `Order placed successfully! Order Number: ${response.order.orderNumber}. We will confirm your order within 24 hours.`,
      });
      setTimeout(() => {
        <Navigate to={"/my-orders"} />;
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Error placing order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      setPopUp({
        state: true,
        status: "success",
        message: errorMessage,
      });
    }
  };

  const getCurrentImage = () => {
    if (selectedVariation && selectedVariation.image) {
      return selectedVariation.image;
    }
    return product?.mainImages?.[0] || "/default-product.jpg";
  };

  const getCurrentPrice = () => {
    if (product.hasVariations && selectedVariation) {
      return selectedVariation.discountedPrice > 0
        ? selectedVariation.discountedPrice
        : selectedVariation.price;
    }
    return product.discountedPrice > 0
      ? product.discountedPrice
      : product.price;
  };

  const getOriginalPrice = () => {
    if (product.hasVariations && selectedVariation) {
      return selectedVariation.discountedPrice > 0
        ? selectedVariation.price
        : null;
    }
    return product.discountedPrice > 0 ? product.price : null;
  };

  const hasDiscount = () => {
    if (product.hasVariations && selectedVariation) {
      return selectedVariation.discountedPrice > 0;
    }
    return product.discountedPrice > 0;
  };
  // inside Preview component

  const handleWhatsAppOrder = () => {
    const phoneNumber = "+94773398946"; // your WhatsApp number with country code
    const variationText = selectedVariation
      ? `Variation: ${selectedVariation.displayName}\n`
      : "";

    const message = `
Hello, I would like to order:

Product: ${product.name}
${variationText}Quantity: ${quantity}
Price per unit: Rs. ${currentPrice.toLocaleString()}
Subtotal: Rs. ${totalPrice.toLocaleString()}
Delivery Fee: ${deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
Total: Rs. ${finalTotal.toLocaleString()} `;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  if (isLoading && !product) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>LOADING PRODUCT...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="loading-container">
        <h3>Product not found</h3>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const currentPrice = getCurrentPrice();
  const originalPrice = getOriginalPrice();
  const totalPrice = currentPrice * quantity;
  const deliveryFee = shippingFee;
  const finalTotal = totalPrice + shippingFee;

  return (
    <>
      <style>{`
      /* Product Gallery Styles */
.product-preview-gallery {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #ffffff;

}

.main-image-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.main-product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #ffffff;
}

.placeholder-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  color: #999;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.thumbnail-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  width: 100%;
}

.thumbnail-btn {
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 4px;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  cursor: pointer;
  transition: border-color 0.2s ease;
  overflow: hidden;
}

.thumbnail-btn:hover {
  border-color: #d0d0d0;
}

.thumbnail-btn.active {
  border-color: #000000;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-preview-gallery {
    padding: 8px;
  }
  
  .thumbnail-gallery {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 6px;
  }
  
  .thumbnail-btn {
    padding: 3px;
  }
}

@media (max-width: 480px) {
  .thumbnail-gallery {
    grid-template-columns: repeat(4, 1fr);
  }
}
        .purchase-container {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: Manrope;
          font-weight: 600;
          padding-bottom: 2rem

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

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #ccc;
          border-top: 2px solid #666;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 6px;
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
  gap: 12px;
  position: relative;
}

.product-images .sub-images{
position: absolute;
display: flex;
  border: 1px solid #e5e5e5;
bottom:4px;
left: 4px
}

.product-images .sub-images img{
height: 100px;
flex:1;}
.product-images .main-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
}

        .product-details {
          padding: 20px 0;
        }

        .product-title {
          font-size: 32px;
          font-weight: 400;
        }

        .product-subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 14px;
        }

        .purchase-container .product-price {
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .price-discounted {
          color: #333;
          font-family: Inter;
        }

        .price-original {
          font-family: Inter;
          text-decoration: line-through;
          color: #999;
          font-size: 18px;
        }

        .product-description {
          color: #666;
          margin-bottom: 14px;
          line-height: 1.8;
        }

        .product-options {
          margin-bottom: 40px;
        }

       

        .option-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          display: block;
        }

        .variation-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .variation-option {
          padding: 12px 16px;
          border: 1px solid #ccc;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
          letter-spacing: 0.05em;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .variation-option.selected,
        .variation-option:hover {
          border-color: #000;
          background: #f9f9f9;
        }

        .variation-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .variation-name {
          font-weight: 500;
          margin-bottom: 2px;
        }

        .variation-price {
          font-size: 12px;
          color: #666;
        }

        .quantity-selector {
          display: flex;
          align-items: stretch;
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
          height: 32px;
          text-align: center;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        .product-preview-action-btns {
          margin-bottom: 10px;
          display: flex;
          gap: 8px;
        }

        .product-preview-action-btns button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 8px 16px;
          border: 1px solid #e8e8e8;
          background: #ffffff;
          color: #2c2c2c;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 38px;
        }

        .product-preview-action-btns button:hover {
          border-color: #d0d0d0;
          transform: translateY(-1px);
        }

        .product-preview-action-btns button:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        .product-preview-action-btns button:focus {
          outline: none;
          border-color: #a0a0a0;
        }

        .product-preview-action-btns button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }

        .product-preview-action-btns button:disabled:hover {
          transform: none !important;
        }

        .product-preview-action-btns button svg {
          width: 16px;
          height: 16px;
          stroke-width: 1.5;
          opacity: 0.8;
        }

        .product-preview-action-btns button:hover svg {
          opacity: 1;
        }

        @media (max-width: 480px) {
          .product-preview-action-btns {
            gap: 6px;
          }
          h2.form-title{
          font-size: 22px;
          font-weight: 500;
          }
          .product-preview-action-btns button {
            padding: 6px 12px;
            font-size: 0.8rem;
            min-height: 34px;
          }
          
          .product-preview-action-btns button svg {
            width: 14px;
            height: 14px;
          }
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

        .purchase-container .order-summary{
        padding: 32px 10px;
        }
        .form-label {
          position: absolute;
          left: 0;
          top: 16px;
          font-size: 12px;
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

        @media (max-width: 968px) {
        .product-section{
            gap: 20px;
        }
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
          .whatsapp-order-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  background: #25D366;
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.3s ease;
  text-decoration: none;
  min-height: 56px;
}

.whatsapp-order-btn:hover {
  background: #20c157;
  transform: translateY(-1px);
}

.whatsapp-order-btn:active {
  background: #1ea952;
  transform: translateY(0);
}

.whatsapp-order-btn:focus {
  outline: 2px solid #25D366;
  outline-offset: 2px;
}

.whatsapp-order-btn img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.whatsapp-order-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.whatsapp-order-btn:disabled:hover {
  background: #cccccc;
  transform: none;
}
  .purchase-buttons{
  display:flex;
  gap: 10px;
  }
  .purchase-buttons > *{
  padding: 8px;
  }
  .purchase-buttons button{
  text-transform: uppercase;
  flex:1;}

/* Mobile responsive */
@media (max-width: 480px) {
.purchase-buttons button{
font-size: 12.5px !important;
}
  .whatsapp-order-btn {
    padding: 14px 20px;
    font-size: 15px;
    min-height: 52px;
  }
  
  .whatsapp-order-btn img {
    width: 20px;
    height: 20px;
  }
}

        @media(max-width: 424px){
          .progress-step{
            font-size: 10px;
          }

          .purchase-buttons{
          flex-direction: column
          }
          .purchase-buttons button{
            min-height: 52px;
            font-size: 15px !important;
            padding: 10px !important;
          }
        }
      `}</style>

      {isLoading && <Spinner />}

      {popUp.state && (
        <PopMessage message={popUp.message} status={popUp.status} />
      )}
      <div className="purchase-container">
        <div className="main-content">
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

          {step === 1 && (
            <div className="product-section">
              {/* <div className="product-images">
                <img
                  src={getCurrentImage()}
                  alt={product.name}
                  className="main-image"
                />
                <div className="sub-images">
                  {product.mainImages.slice(1).map((image, key) => (
                    <img src={image} key={key} alt={`main-${key}`} />
                  ))}
                </div>
              </div> */}
              <div className="product-preview-gallery">
                {/* 1. Main Display Image */}
                <div className="main-image-container">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="main-product-image"
                    />
                  ) : (
                    <div className="placeholder-image">No Image Available</div>
                  )}
                </div>

                {/* 2. Thumbnail Gallery */}
                <div className="thumbnail-gallery">
                  {allImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      className={`thumbnail-btn ${
                        mainImage === imageUrl ? "active" : ""
                      }`}
                      onClick={() => handleImageSwitch(imageUrl)}
                    >
                      <img
                        src={imageUrl}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="thumbnail-image"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-details">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-subtitle">Premium Quality Product</p>

                <div className="product-price">
                  {hasDiscount() ? (
                    <>
                      <span className="price-discounted">
                        Rs. {currentPrice.toLocaleString()}
                      </span>
                      <span className="price-original">
                        Rs. {originalPrice.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span>Rs. {currentPrice.toLocaleString()}</span>
                  )}
                </div>

                <p className="product-description">
                  {product.description ||
                    "Premium quality product with excellent features."}
                </p>

                <div className="product-options">
                  {product.hasVariations && product.variations?.length > 0 && (
                    <div className="option-group">
                      <label className="option-label">SELECT VARIATION</label>
                      <div className="variation-options">
                        {product.variations.map((variation) => (
                          <button
                            key={variation._id}
                            className={`variation-option ${
                              selectedVariation?._id === variation._id
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => setSelectedVariation(variation)}
                          >
                            <div className="variation-info">
                              <div className="variation-name">
                                {variation.displayName}
                              </div>
                              <div className="variation-price">
                                {variation.discountedPrice > 0 ? (
                                  <>
                                    <span style={{ color: "#e74c3c" }}>
                                      Rs.{" "}
                                      {variation.discountedPrice.toLocaleString()}
                                    </span>
                                    <span
                                      style={{
                                        textDecoration: "line-through",
                                        marginLeft: "8px",
                                        color: "#999",
                                      }}
                                    >
                                      Rs. {variation.price.toLocaleString()}
                                    </span>
                                  </>
                                ) : (
                                  <span>
                                    Rs. {variation.price.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            {!variation.inStock && (
                              <span
                                style={{ color: "#e74c3c", fontSize: "12px" }}
                              >
                                Out of Stock
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="product-preview-action-btns">
                    <button
                      className="btn btn-secondary"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || isAddingToWishlist}
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="spinner-small"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          Add to Cart <Handbag />
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleAddToWishlist}
                      disabled={isAddingToCart || isAddingToWishlist}
                    >
                      {isAddingToWishlist ? (
                        <>
                          <div className="spinner-small"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          Add to Wishlist <Heart />
                        </>
                      )}
                    </button>
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

                <div className="purchase-buttons">
                  <button
                    className="btn btn-primary"
                    style={{ borderRadius: "0" }}
                    onClick={handleProceedToShipping}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loading">
                        <div className="spinner"></div>
                        PROCESSING...
                      </div>
                    ) : (
                      "BUY IT NOW"
                    )}
                  </button>
                  <button
                    className="whatsapp-order-btn"
                    onClick={handleWhatsAppOrder}
                  >
                    Order on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

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
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery</span>
                  <span>
                    {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                <div className="summary-item summary-total">
                  <span>TOTAL</span>
                  <span>Rs. {finalTotal.toLocaleString()}</span>
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
                {selectedVariation && (
                  <div className="summary-item">
                    <span>Variation: {selectedVariation.displayName}</span>
                    <span></span>
                  </div>
                )}
                <div className="summary-item">
                  <span>Quantity: {quantity}</span>
                  <span></span>
                </div>
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery</span>
                  <span>
                    {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                <div className="summary-item summary-total">
                  <span>TOTAL</span>
                  <span>Rs. {finalTotal.toLocaleString()}</span>
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
                You will pay Rs. {finalTotal.toLocaleString()} when you receive
                your order.
                <br />
                Expected delivery: 3-5 business days
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

      {showPopMessage && (
        <PopMessage
          status={showPopMessage.status}
          message={showPopMessage.message}
          onClose={closePopMessage}
          autoClose={true}
          duration={4000}
        />
      )}
    </>
  );
}
