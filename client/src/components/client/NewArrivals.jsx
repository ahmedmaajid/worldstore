import React, { useRef, useEffect, useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../../api/products";
import axios from "../../api/axios";
import { checkAuth } from "../../api/checkAuth";
import PopMessage from "./PopMessage";
import { useNavigate } from "react-router-dom";

export const NewArrivals = () => {
  const scrollContainerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [popUp, setPopUp] = useState({ state: false, message: "", status: "" });
  const [isAdding, setIsAdding] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  async function getData() {
    const allProducts = await getProducts();
    const sixProducts = allProducts.slice(0, 6);
    setProducts(sixProducts);
  }

  useEffect(() => {
    getData();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const renderProductCard = (product, mobile = false) => (
    <div key={product._id} className={`na-product-card ${mobile ? 'na-mobile' : ''}`}>
      <Link to={`/product/${product.slug}`} className="na-product-link">
        <div className="na-image-wrapper">
          <img
            src={product.mainImages[0]}
            alt={product.name}
            className="na-product-image"
          />
        </div>
        <div className="na-product-info">
          <h3 className="na-product-name">{product.name}</h3>
          <p className="na-product-description">{product.description}</p>

          {product.price > 0 ? (
            <div className="na-price-container">
              {product.discountPrice ? (
                <>
                  <span className="na-price na-original">{formatPrice(product.price)}</span>
                  <span className="na-price na-discounted">{formatPrice(product.discountPrice)}</span>
                </>
              ) : (
                <span className="na-price">{formatPrice(product.price)}</span>
              )}
            </div>
          ) : (
            <div className="na-price-container">
              {product.variations && product.variations.length > 0 ? (
                <>
                  <span className="na-price">
                    {formatPrice(product.variations[0].price)}
                  </span>
                  {product.variations[0].discountPrice && (
                    <span className="na-price na-discounted">
                      {formatPrice(product.variations[0].discountPrice)}
                    </span>
                  )}
                </>
              ) : (
                <span className="na-price">N/A</span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="na-action-buttons">
        <button
          className="na-btn na-btn-cart"
          onClick={async (e) => {
            e.preventDefault();
            if (product.hasVariations) {
              navigate(`/product/${product.slug}`);
              return;
            }

            const isLogged = await checkAuth();
            if (!isLogged) {
              navigate("/account/login");
            }

            setIsAdding(product._id);
            try {
              const payload = {
                productId: product._id,
                productName: product.name,
                productImage: product.mainImages?.[0] || "/api/placeholder/300/300",
                variationId: null,
                variationName: null,
                price: product.price || (product.variations?.[0]?.price || 0),
                quantity: 1,
              };

              const res = await axios.post("/api/products/add-to-cart", payload);
              setPopUp({ 
                state: true, 
                message: `${res.data.cartItem.productName} added to cart`, 
                status: "success" 
              });
            } catch (err) {
              console.error(err);
              const msg = err.response?.data?.message || "Failed to add to cart";
              setPopUp({ state: true, message: msg, status: "error" });
            } finally {
              setIsAdding(null);
            }
          }}
          disabled={isAdding === product._id}
        >
          {isAdding === product._id ? "Adding..." : "Add to Cart"}
        </button>

        <button
          className="na-btn na-btn-buy"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/product/${product.slug}`);
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        .na-section {
          padding: 60px 16px;
          max-width: 1400px;
          margin: 6rem auto;
          overflow: hidden;
        }

        .na-section-heading {
          text-align: center;
          margin-bottom: 48px;
        }

        .na-section-title {
          font-size: 36px;
          font-weight: 500;
          letter-spacing: 1.5px;
          font-style: italic;
          color: #0a0a0a;
          margin: 0 0 8px 0;
          font-family: 'Instrument Serif', sans-serif;
        }

        .na-section-subtitle {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.2px;
          color: #666666;
          max-width: 460px;
          margin: 0 auto;
          line-height: 1.6;
          font-family: 'Manrope', sans-serif;
        }

        .na-scroll-container {
          position: relative;
          margin-bottom: 40px;
          width: 100%;
        }

        .na-chevron-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background-color: #ffffff;
          border: 1px solid #d0d0d0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .na-chevron-btn:hover {
          background-color: #0a0a0a;
          border-color: #0a0a0a;
        }

        .na-chevron-btn:hover svg {
          stroke: #ffffff;
        }

        .na-chevron-btn-left {
          left: -16px;
        }

        .na-chevron-btn-right {
          right: -16px;
        }

        .na-products-desktop {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px;
        }

        .na-products-desktop::-webkit-scrollbar {
          display: none;
        }

        .na-products-mobile {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
        }

        .na-product-card {
          background-color: #ffffff;
          border: 1px solid #e5e5e5;
          min-width: 220px;
          max-width: 220px;
          display: flex;
          flex-direction: column;
          
          transition: border-color 0.2s ease;
        }

        .na-product-card:hover {
          border-color: #c0c0c0;
        }

        .na-product-card.na-mobile {
          min-width: 0;
          max-width: none;
          width: 100%;
        }

        .na-product-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .na-image-wrapper {
          width: 100%;
          background-color: #fafafa;
          border-bottom: 1px solid #e5e5e5;
          overflow: hidden;
        }

        .na-product-image {
          width: 100%;
          height: 180px;
          object-fit: contain;
          display: block;
          transition: opacity 0.2s ease;
          padding: 12px;
        }

        .na-product-link:hover .na-product-image {
          opacity: 0.85;
        }

        .na-product-info {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .na-product-name {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-align: left;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'Manrope', sans-serif;
        }

        .na-product-description {
          font-size: 12px;
          font-weight: 400;
          color: #737373;
          line-height: 1.5;
          letter-spacing: 0.1px;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          min-height: 33px;
          margin: 0;
          font-family: 'Manrope', sans-serif;
        }

        .na-price-container {
          display: flex;
          gap: 6px;
          align-items: center;
          margin-top: 2px;
        }

        .na-price {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.2px;
          color: #0a0a0a;
          font-family: 'Manrope', sans-serif;
        }

        .na-price.na-original {
          text-decoration: line-through;
          color: #a0a0a0;
          font-size: 10px;
          font-weight: 400;
        }

        .na-price.na-discounted {
          color: #0a0a0a;
        }

        .na-action-buttons {
          display: flex;
          gap: 6px;
          padding: 10px 12px;
          border-top: 1px solid #e5e5e5;
        }

        .na-btn {
          flex: 1;
          padding: 7px 10px;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #d0d0d0;
          background-color: #ffffff;
          color: #0a0a0a;
          font-family: 'Manrope', sans-serif;
        }

        .na-btn-cart:hover:not(:disabled) {
          background-color: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }

        .na-btn-buy:hover {
          background-color: #fafafa;
          border-color: #b0b0b0;
        }

        .na-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .na-discover-btn {
          display: block;
          width: fit-content;
          margin: 2rem auto;
          padding: 11px 32px;
          background-color: #0a0a0a;
          color: #ffffff;
          text-decoration: none;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: 1px solid #0a0a0a;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Manrope', sans-serif;
        }

        .na-discover-btn:hover {
          background-color: #ffffff;
          color: #0a0a0a;
        }

        /* Tablet */
        @media (max-width: 768px) {
          .na-section {
            padding: 50px 14px;
            margin: 4rem auto;
          }

         
          .na-products-mobile {
            gap: 8px;
          }

          .na-product-image {
            height: 160px;
          }

          .na-product-info {
            padding: 10px;
          }

          .na-action-buttons {
            padding: 8px 10px;
          }
        }

        /* Mobile */
        @media (max-width: 500px) {
          .na-section {
            padding: 40px 12px;
            margin: 3rem auto;
          }

          .na-section-heading {
            margin-bottom: 32px;
          }

          .na-section-title {
            font-size: 32px;
          }

          .na-section-subtitle {
            font-size: 12px;
          }

          .na-products-mobile {
            gap: 8px;
          }

          .na-product-image {
            height: 140px;
            padding: 10px;
          }

          .na-product-info {
            padding: 10px;
            gap: 5px;
          }

          .na-product-name {
            font-size: 12px;
          }

          .na-product-description {
            font-size: 12px;
            line-height: 1.45;
            min-height: 29px;
          }

         

          .na-action-buttons {
            padding: 8px 10px;
            flex-wrap: wrap;
            display:flex;
            flex-direction: column;
            gap: 5px;
          }

          .na-btn {
            padding: 6px 8px;
            font-size: 11px;
            letter-spacing: 0.6px;
          }
        }

        /* Small Mobile */
        @media (max-width: 400px) {
          .na-section {
            padding: 36px 10px;
          }

          .na-products-mobile {
            gap: 6px;
          }

          .na-product-image {
            height: 120px;
            padding: 8px;
          }

          .na-product-info {
            padding: 8px;
            gap: 4px;
          }

         

          

          .na-action-buttons {
            padding: 6px 8px;
            gap: 4px;
          }

        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .na-section {
            padding: 32px 8px;
          }

          .na-section-title {
            font-size: 20px;
          }

          .na-products-mobile {
            gap: 6px;
          }

          .na-product-image {
            height: 110px;
            padding: 6px;
          }

          .na-product-info {
            padding: 7px;
            gap: 3px;
          }

          
          .na-btn {
            padding: 4px 5px;
            letter-spacing: 0.4px;
          }
        }

        /* Ultra Small Mobile (320px) */
        @media (max-width: 320px) {
          .na-section {
            padding: 28px 6px;
          }

          .na-section-title {
            font-size: 18px;
          }

          .na-section-subtitle {
            font-size: 10px;
          }

          .na-products-mobile {
            gap: 5px;
          }

          .na-product-image {
            height: 100px;
            padding: 5px;
          }

          .na-product-info {
            padding: 6px;
            gap: 3px;
          }

          .na-product-name {
            font-size: 8px;
            letter-spacing: 0.2px;
          }

          .na-product-description {
            font-size: 8px;
            line-height: 1.3;
            min-height: 21px;
          }

          .na-price-container {
            gap: 4px;
          }

          .na-price {
            font-size: 8px;
          }

          .na-price.na-original {
            font-size: 7px;
          }

          .na-action-buttons {
            padding: 4px 6px;
            gap: 3px;
          }

          .na-btn {
            padding: 4px 4px;
            font-size: 6px;
            letter-spacing: 0.3px;
          }
        }
      `}</style>

      {popUp.state && (
        <PopMessage 
          message={popUp.message} 
          status={popUp.status} 
          onClose={() => setPopUp({ state: false })} 
        />
      )}

      <section className="na-section">
        <div className="na-section-heading">
          <h2 className="na-section-title">New Arrivals</h2>
          <p className="na-section-subtitle">
            Discover our latest products, freshly dropped to bring you new
            styles and timeless elegance.
          </p>
        </div>

        {/* Desktop/Tablet View - Horizontal Scroll */}
        {!isMobile && (
          <div className="na-scroll-container">
            <button onClick={scrollLeft} className="na-chevron-btn na-chevron-btn-left">
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            <button onClick={scrollRight} className="na-chevron-btn na-chevron-btn-right">
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>

            <div ref={scrollContainerRef} className="na-products-desktop">
              {products.map((product) => renderProductCard(product, false))}
            </div>
          </div>
        )}

        {/* Mobile View - 2 Column Grid */}
        {isMobile && (
          <div className="na-products-mobile">
            {products.map((product) => renderProductCard(product, true))}
          </div>
        )}

        <Link to="/shop" className="na-discover-btn">
          Discover More
        </Link>
      </section>
    </>
  );
};