import React, { useRef } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { getProducts } from "../../api/products";
import { useState } from "react";

export const NewArrivals = () => {
  const scrollContainerRef = useRef(null);
  const [products, setProducts] = useState([]);
  async function getData() {
    const allProducts = await getProducts();
    console.log(allProducts);

    // take only first 6
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

  return (
    <section className="new-arrival-section">
      <div className="section-heading">
        <h2>New Arrival</h2>
        <p>
          Discover our latest products, freshly dropped to bring you new styles
          and timeless elegance.
        </p>
      </div>

      <div style={{ position: "relative", width: "100%" }}>
        {/* Left Arrow */}
        <button
          className="chevron-btn"
          onClick={scrollLeft}
          style={{
            position: "absolute",
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "white",
            border: "1px solid #e5e5e5",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
        >
          <ChevronLeft size={20} color="#333" />
        </button>

        {/* Right Arrow */}
        <button
          className="chevron-btn"
          onClick={scrollRight}
          style={{
            position: "absolute",
            right: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "white",
            border: "1px solid #e5e5e5",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
        >
          <ChevronRight size={20} color="#333" />
        </button>

        <div ref={scrollContainerRef} className="products new-arrival-products">
          {products.map((product) => (
            <Link
              to={`/product/${product.slug}`}
              key={product._id}
              className="new-arrival-product-card"
            >
              <img
                src={product.mainImages[0]}
                alt={product.name}
                className="new-arrival-product-image"
              />
              <div className="new-arrival-product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="shop-product-description">
                  {product.description}
                </p>

                {product.price > 0 ? (
                  <div>
                    {/* if discount show both */}
                    {product.discountPrice ? (
                      <>
                        <span className="price line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="price discount">
                          {formatPrice(product.discountPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="price">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    {/* price comes from first variation */}
                    {product.variations && product.variations.length > 0 ? (
                      <>
                        <span className="price">
                          {formatPrice(product.variations[0].price)}
                        </span>
                        {product.variations[0].discountPrice && (
                          <span className="price discount">
                            {formatPrice(product.variations[0].discountPrice)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="price">N/A</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link to="/shop" className="btn btn-discover">
        Discover More
      </Link>
    </section>
  );
};
