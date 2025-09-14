// ProductPreview.jsx
import { useState } from "react";
import { Heart } from "lucide-react";
import "../../styles/client/productPreview.css";
import { Product } from "../../components/client/Product";
import "../../styles/client/shop.css";

export default function ProductPreview({ product }) {
  const [mainImage, setMainImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);

  const changeImage = (img) => setMainImage(img);
  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const addToCart = () => console.log("Add to cart", product, quantity);
  const DUMMY_PRODUCTS = [
    {
      id: 1,
      name: "lorem ipsum dolar sit amet constructor plan not consto",
      price: 29.99,
      category: "home-needs",
      subcategory: "clocks",
      image: "/Watch.png",
      date: "2025-08-01",
    },
    {
      id: 2,
      name: "Modern Sneakers",
      price: 89.99,
      category: "foreign-mart",
      subcategory: "sneakers",
      image: "/Handbag.png",
      date: "2025-09-01",
    },
    {
      id: 3,
      name: "lorem ipsum dolar sit amet constructor plan not consto",
      price: 149.99,
      category: "cosmetic-items",
      subcategory: "men",
      image: "/Belt.png",
      date: "2025-08-05",
    },
    {
      id: 4,
      name: "White Linen Shirt",
      price: 45.0,
      category: "phone-accessories",
      subcategory: "chargers",
      image: "/Tech Essentials.png",
      date: "2024-08-01",
    },
    {
      id: 5,
      name: "Leather Wallet",
      price: 65.5,
      category: "cosmetic-items",
      subcategory: "women",
      date: "2025-08-03",
      image: "/Jwelry.png",
    },
    {
      id: 6,
      name: "Canvas Tote Bag",
      price: 35.0,
      category: "home-needs",
      subcategory: "lunch-boxes",
      image: "/Headset.png",
      date: "2025-08-03",
    },
    {
      id: 7,
      name: "Classic Loafers",
      price: 125.0,
      category: "foreign-mart",
      subcategory: "loafers",
      date: "2025-10-01",
      image: "/Beauty & Personal Care.png",
    },
    {
      id: 8,
      name: "Graphic Hoodie",
      price: 75.0,
      category: "phone-accessories",
      subcategory: "headphones",
      image: "/Toy.png",
      date: "2025-08-11",
    },
  ];
  return (
    <>
      <div className="product-preview-container">
        {/* Images Section */}
        <div className="images-section">
          <div className="main-image-wrapper">
            <img src={mainImage} alt={product.name} className="main-image" />
            <div className="heart-icon">
              <Heart strokeWidth={1.3} size={22} />
            </div>
          </div>
          <div className="thumbnail-row">
            {product.thumbnails?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                onClick={() => changeImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="product-details-grid">
          {/* Left Column */}
          <div className="details-left">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">Rs.{product.price}</p>
            {product.variants && (
              <div className="variants">
                <h4>Available Variations</h4>
                <div className="variation-list">
                  {product.variants.map((v, idx) => (
                    <div key={idx} className="variation-box">
                      {v.color} — {v.size}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="details-right">
            {product.description && (
              <div className="product-description-section">
                <h3 className="description-title">Product Description</h3>
                <p className="product-description">{product.description}</p>
              </div>
            )}
            <div className="qty-section">
              <span>Quantity</span>
              <div className="quantity-selector">
                <button onClick={decrement}>-</button>
                <span>{quantity}</span>
                <button onClick={increment}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart" onClick={addToCart}>
                Add to Cart
              </button>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>
        </div>
      </div>

      <section className="related-products">
        <h3>Related Products</h3>

        <div className="related-product-grid-container">
          <div className="related-product-grid">
            {DUMMY_PRODUCTS.map((product) => (
              <div key={product.id} className="related-product-card">
                <div className="related-product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="related-product-image"
                  />
                </div>
                <div className="related-product-info">
                  <h3 className="related-product-title">{product.name}</h3>
                  <p className="related-product-description">
                    High-quality product with premium materials and excellent
                    craftsmanship.
                  </p>

                  {/* <div className="related-product-rating">
                    <div className="related-stars">★★★★★</div>
                    <span className="related-rating-text">
                      4.8 (127 reviews)
                    </span>
                  </div> */}

                  <div className="related-product-price-section">
                    <div className="related-price-container">
                      <span className="related-product-price">
                        Rs.{product.price}
                      </span>
                    </div>
                  </div>

                  <div className="related-product-actions">
                    <button className="related-btn related-btn-primary">
                      Add to Cart
                    </button>
                    <button className="related-btn related-btn-secondary">
                      <Heart strokeWidth={1.3} />
                    </button>
                  </div>

                  <div className="related-availability">
                    <div className="related-availability-dot"></div>
                    <span className="related-availability-text">In stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
