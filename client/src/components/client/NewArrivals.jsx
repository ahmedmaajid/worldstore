// import React, { useRef } from "react";
// import { formatPrice } from "../../utils/formatPrice";
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect } from "react";
// import { getProducts } from "../../api/products";
// import { useState } from "react";

// export const NewArrivals = () => {
//   const scrollContainerRef = useRef(null);
//   const [products, setProducts] = useState([]);
//   async function getData() {
//     const allProducts = await getProducts();
//     console.log(allProducts);

//     // take only first 6
//     const sixProducts = allProducts.slice(0, 6);
//     setProducts(sixProducts);
//   }

//   useEffect(() => {
//     getData();
//   }, []);

//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: -300,
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: 300,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <section className="new-arrival-section">
//       <div className="section-heading">
//         <h2>New Arrival</h2>
//         <p>
//           Discover our latest products, freshly dropped to bring you new styles
//           and timeless elegance.
//         </p>
//       </div>

//       <div style={{ position: "relative", width: "100%" }}>
//         {/* Left Arrow */}
//         <button
//           className="chevron-btn"
//           onClick={scrollLeft}
//           style={{
//             position: "absolute",
//             left: "-20px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             zIndex: 2,
//             backgroundColor: "white",
//             border: "1px solid #e5e5e5",
//             borderRadius: "50%",
//             width: "40px",
//             height: "40px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             transition: "all 0.2s ease",
//           }}
//         >
//           <ChevronLeft size={20} color="#333" />
//         </button>

//         {/* Right Arrow */}
//         <button
//           className="chevron-btn"
//           onClick={scrollRight}
//           style={{
//             position: "absolute",
//             right: "-20px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             zIndex: 2,
//             backgroundColor: "white",
//             border: "1px solid #e5e5e5",
//             borderRadius: "50%",
//             width: "40px",
//             height: "40px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             transition: "all 0.2s ease",
//           }}
//         >
//           <ChevronRight size={20} color="#333" />
//         </button>

//         <div ref={scrollContainerRef} className="products new-arrival-products">
//           {products.map((product) => (
//             <Link
//               to={`/product/${product.slug}`}
//               key={product._id}
//               className="new-arrival-product-card"
//             >
//               <img
//                 src={product.mainImages[0]}
//                 alt={product.name}
//                 className="new-arrival-product-image"
//               />
//               <div className="new-arrival-product-info">
//                 <h3 className="product-name">{product.name}</h3>
//                 <p className="shop-product-description">
//                   {product.description}
//                 </p>

//                 {product.price > 0 ? (
//                   <div>
//                     {/* if discount show both */}
//                     {product.discountPrice ? (
//                       <>
//                         <span className="price line-through">
//                           {formatPrice(product.price)}
//                         </span>
//                         <span className="price discount">
//                           {formatPrice(product.discountPrice)}
//                         </span>
//                       </>
//                     ) : (
//                       <span className="price">
//                         {formatPrice(product.price)}
//                       </span>
//                     )}
//                   </div>
//                 ) : (
//                   <div>
//                     {/* price comes from first variation */}
//                     {product.variations && product.variations.length > 0 ? (
//                       <>
//                         <span className="price">
//                           {formatPrice(product.variations[0].price)}
//                         </span>
//                         {product.variations[0].discountPrice && (
//                           <span className="price discount">
//                             {formatPrice(product.variations[0].discountPrice)}
//                           </span>
//                         )}
//                       </>
//                     ) : (
//                       <span className="price">N/A</span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       <Link to="/shop" className="btn btn-discover">
//         Discover More
//       </Link>
//     </section>
//   );
// };

import React, { useRef, useEffect, useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../../api/products";

const styles = {
  section: {
    padding: "80px 20px",
    backgroundColor: "#FFFFFF",
    maxWidth: "1400px",
    margin: "10rem auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "50px",
  },
  title: {
    fontSize: "46px",
    fontWeight: "500",
    letterSpacing: "1px",
    textTransform: "capitalize",
    color: "#000000",
    marginBottom: "12px",
    fontStyle: "italic",
    fontFamily: "Instrument Serif",
  },
  subtitle: {
    fontSize: "13px",
    fontWeight: "400",
    letterSpacing: "0.3px",
    color: "#666666",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  scrollContainer: {
    position: "relative",
    marginBottom: "50px",
    width: "100%",
  },
  chevronBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E5E5",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  chevronBtnLeft: {
    left: "-22px",
  },
  chevronBtnRight: {
    right: "-22px",
  },
  productsDesktop: {
    display: "flex",
    gap: "16px",
    overflowX: "auto",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    paddingBottom: "4px",
  },
  productsMobile: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  productCard: {
    backgroundColor: "#FAFAFA",
    textDecoration: "none",
    color: "#000000",
    transition: "all 0.3s ease",
    minWidth: "280px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  productCardMobile: {
    minWidth: "unset",
  },
  productImage: {
    width: "100%",
    aspectRatio: "4/5",
    objectFit: "contain",
    maxHeight: "200px",
    display: "block",
  },
  productInfo: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  productName: {
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "1.3px",
    textTransform: "uppercase",
    color: "#000000",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  productDescription: {
    fontSize: "12px",
    fontWeight: "400",
    color: "#666666",
    lineHeight: "1.4",
    letterSpacing: "0.3px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    minHeight: "30px",
  },
  priceContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginTop: "4px",
  },
  price: {
    fontSize: "13px",
    fontWeight: "400",
    letterSpacing: "0.5px",
    color: "#000000",
  },
  priceLineThrough: {
    textDecoration: "line-through",
    color: "#999999",
    fontSize: "12px",
  },
  discoverBtn: {
    display: "block",
    width: "fit-content",
    margin: "2rem auto",
    padding: "14px 40px",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "400",
    letterSpacing: "2px",
    textTransform: "uppercase",
    border: "1px solid #000000",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export const NewArrivals = () => {
  const scrollContainerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

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
    <Link
      to={`/product/${product.slug}`}
      key={product._id}
      style={{
        ...styles.productCard,
        ...(mobile && styles.productCardMobile),
      }}
      onMouseEnter={(e) => {
        if (!mobile) {
          e.currentTarget.style.backgroundColor = "#F5F5F5";
          e.currentTarget.style.color = "#000";
        }
      }}
      onMouseLeave={(e) => {
        if (!mobile) {
          e.currentTarget.style.backgroundColor = "#FAFAFA";
        }
      }}
    >
      <img
        src={product.mainImages[0]}
        alt={product.name}
        style={styles.productImage}
      />
      <div style={styles.productInfo}>
        <h3 style={styles.productName}>{product.name}</h3>
        <p style={styles.productDescription}>{product.description}</p>

        {product.price > 0 ? (
          <div style={styles.priceContainer}>
            {product.discountPrice ? (
              <>
                <span style={{ ...styles.price, ...styles.priceLineThrough }}>
                  {formatPrice(product.price)}
                </span>
                <span style={styles.price}>
                  {formatPrice(product.discountPrice)}
                </span>
              </>
            ) : (
              <span style={styles.price}>{formatPrice(product.price)}</span>
            )}
          </div>
        ) : (
          <div style={styles.priceContainer}>
            {product.variations && product.variations.length > 0 ? (
              <>
                <span style={styles.price}>
                  {formatPrice(product.variations[0].price)}
                </span>
                {product.variations[0].discountPrice && (
                  <span style={styles.price}>
                    {formatPrice(product.variations[0].discountPrice)}
                  </span>
                )}
              </>
            ) : (
              <span style={styles.price}>N/A</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <>
      <style>
        {`
      @media(max-width: 480px){
      .na-section{
      padding: 80px 10px !important
      }
      .na-grid{
        gap: 4px !important
      }
      }
      
      `}
      </style>
      ;
      <section className="na-section" style={styles.section}>
        <div style={styles.heading}>
          <h2 style={styles.title}>New Arrival</h2>
          <p style={styles.subtitle}>
            Discover our latest products, freshly dropped to bring you new
            styles and timeless elegance.
          </p>
        </div>

        {/* Desktop/Tablet View - Horizontal Scroll */}
        {!isMobile && (
          <div style={styles.scrollContainer}>
            <button
              onClick={scrollLeft}
              style={{ ...styles.chevronBtn, ...styles.chevronBtnLeft }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#000000";
                e.currentTarget.style.borderColor = "#000000";
                e.currentTarget.querySelector("svg").style.stroke = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.querySelector("svg").style.stroke = "#000000";
              }}
            >
              <ChevronLeft size={18} color="#000000" />
            </button>

            <button
              onClick={scrollRight}
              style={{ ...styles.chevronBtn, ...styles.chevronBtnRight }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#000000";
                e.currentTarget.style.borderColor = "#000000";
                e.currentTarget.querySelector("svg").style.stroke = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.querySelector("svg").style.stroke = "#000000";
              }}
            >
              <ChevronRight size={18} color="#000000" />
            </button>

            <div
              ref={scrollContainerRef}
              style={{
                ...styles.productsDesktop,
                WebkitOverflowScrolling: "touch",
              }}
            >
              <style>
                {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
              </style>
              {products.map((product) => renderProductCard(product, false))}
            </div>
          </div>
        )}

        {/* Mobile View - 2 Column Grid */}
        {isMobile && (
          <div className="na-grid" style={styles.productsMobile}>
            {products.map((product) => renderProductCard(product, true))}
          </div>
        )}

        <Link
          to="/shop"
          style={styles.discoverBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
            e.currentTarget.style.color = "#000000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#000000";
            e.currentTarget.style.color = "#FFFFFF";
          }}
        >
          Discover More
        </Link>
      </section>
    </>
  );
};
