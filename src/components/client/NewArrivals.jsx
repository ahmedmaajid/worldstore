import React, { useRef } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const NewArrivals = () => {
  const scrollContainerRef = useRef(null);

  const products = [
    {
      id: 1,
      name: "Classic Leather Bag",
      price: 2909.0,
      image:
        "https://media.gucci.com/style/White_South_0_160_316x316/1748967318/834460_AAE1D_3441_001_100_0000_Light-Gucci-Savoy-medium-duffle-bag.jpg",
    },

    {
      id: 3,
      name: "Silk Scarf",
      price: 1449.0,
      image:
        "https://media.gucci.com/style/White_South_0_160_316x316/1752512502/847034_ZATF9_1504_001_100_0000_Light-GG-silk-jacquard-shirt.jpg",
    },
    {
      id: 4,
      name: "Designer Shoes",
      price: 2399.0,
      image:
        "https://in.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-low-key-all-in-bb--M25543_PM2_Front%20view.png?wid=490&hei=490",
    },
    {
      id: 5,
      name: "Minimalist Sunglasses",
      price: 2199.0,
      image:
        "https://in.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-neonoe-mm--M45256_PM2_Front%20view.png?wid=490&hei=490",
    },

    {
      id: 3,
      name: "Silk Scarf",
      price: 1449.0,
      image:
        "https://media.gucci.com/style/White_South_0_160_316x316/1752512502/847034_ZATF9_1504_001_100_0000_Light-GG-silk-jacquard-shirt.jpg",
    },
    {
      id: 4,
      name: "Designer Shoes",
      price: 2399.0,
      image:
        "https://in.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-low-key-all-in-bb--M25543_PM2_Front%20view.png?wid=490&hei=490",
    },
  ];

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
            <Link to="/" key={product.id} className="new-arrival-product-card">
              <img
                src={product.image}
                alt={product.name}
                className="new-arrival-product-image"
              />
              <div className="new-arrival-product-info">
                <h3 className="product-name">{product.name}</h3>
                <span className="price">{formatPrice(product.price)}</span>
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
