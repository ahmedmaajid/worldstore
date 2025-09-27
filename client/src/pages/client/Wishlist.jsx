import React, { useState, useEffect } from "react";
import "../../styles/client/wishlist.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../api/checkAuth";
import {
  addToCartFromWishlist,
  getWishlistData,
  removeWishlistItem,
} from "../../api/products";
import PopMessage from "../../components/client/PopMessage";
import { ConfirmationDialog } from "../../components/client/ConfirmationDialog";

const WishlistPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [animatedItems, setAnimatedItems] = useState([]);

  const [popUp, setPopUp] = useState({ state: false, message: "", status: "" });
  const [showDelete, setShowDelete] = useState(false);
  const [itemId, setItemId] = useState(null);

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

  const [wishlistItems, setWishlistItems] = useState([]);
  async function getData() {
    try {
      const data = await getWishlistData();

      // No need to deeply format, backend already did it
      const formatted = data.wishlist.map((item) => ({
        id: item._id, // wishlist id
        productId: item.productId,
        name: item.productName,
        subtitle: item.variationName || null,
        price: item.discountedPrice || item.price, // final price
        originalPrice: item.price, // original product price
        image: item.productImage || "/api/placeholder/300/300",
        inStock: item.inStock,
        onSale: item.discountedPrice < item.price, // only true if discount exists
        category: item.category || "Unknown",
        slug: item.slug,
        variationId: item.variationId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      }));

      setWishlistItems(formatted);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // async function getData() {
  //   try {
  //     const data = await getWishlistData();
  //     console.log("Wishlist API data:", data);

  //     const formatted = data.wishlist.map((item) => ({
  //       id: item.wishlistId, // or _id from your backend
  //       name: item.productName,
  //       subtitle: item.variationName || "PREMIUM COLLECTION",
  //       price: item.variations.price || item.price,
  //       originalPrice: item.price,
  //       image: item.mainImages?.[0] || "/api/placeholder/300/300",
  //       inStock: item.inStock,
  //       onSale: item.discountedPrice > 0,
  //       category: item.category || "unknown",
  //       slug: item.slug,
  //     }));

  //     console.log(formatted);

  //     setWishlistItems(formatted);
  //   } catch (err) {
  //     console.error("Failed to fetch wishlist:", err);
  //   }
  // }

  // useEffect(() => {
  //   getData();
  // }, []);

  const categories = [
    "all",
    ...new Set(wishlistItems.map((item) => item.category)),
  ];

  // Filter items based on selected category
  const filteredItems =
    selectedCategory === "all"
      ? wishlistItems
      : wishlistItems.filter((item) => item.category === selectedCategory);

  // Animate items on mount
  useEffect(() => {
    filteredItems.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedItems((prev) => [...prev, item.id]);
      }, index * 100);
    });
  }, [filteredItems]);

  const handleAddToCart = async (item) => {
    try {
      const payload = {
        productId: item.productId,
        productName: item.name,
        productImage: item.image,
        variationId: item.variationId || null,
        variationName: item.subtitle || null,
        price: item.price,
        quantity: item.quantity || 1,
        totalPrice: (item.quantity || 1) * item.price,
      };
      const adding = await addToCartFromWishlist(payload);
      setPopUp({ state: true, message: adding.message, status: "success" });
    } catch (error) {
      setPopUp({ state: true, message: error, status: "error" });
    }
  };

  const handleRemove = (id) => {
    setShowDelete(true);
    setItemId(id);
  };

  const handleDelete = async () => {
    console.log("Removing from wishlist:", itemId);
    try {
      const deletion = await removeWishlistItem(itemId);
      setPopUp({ state: true, message: deletion.message, status: "success" });
      getData();
      setShowDelete(false);
    } catch (error) {
      setShowDelete(false);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setPopUp({ state: true, message: msg, status: "error" });
      console.log(error);
    }
  };

  return (
    <>
      {popUp.state && (
        <PopMessage message={popUp.message} status={popUp.status} />
      )}
      <ConfirmationDialog
        isOpen={showDelete}
        title="Delete Item?"
        message="This item will be permanently deleted and cannot be recovered."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => handleDelete()}
        onCancel={() => setShowDelete(false)}
      />

      <div className="wishlist-container">
        <div className="wishlist-main-content">
          <div className="wishlist-header">
            <h1 className="wishlist-title">Wishlists</h1>
            <p className="wishlist-subtitle">
              Your favorite items saved for later
            </p>
          </div>

          <div className="wishlist-filters-container">
            <div className="wishlist-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`wishlist-filter-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all"
                    ? "All Items"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="wishlist-empty-state">
              <h2 className="wishlist-empty-title">Your Wishlist is Empty</h2>
              <p className="wishlist-empty-text">
                Discover our exquisite collection and save your favorite pieces
                for later.
                <br />
                Create your personal curation of luxury items.
              </p>
              <a href="/products" className="wishlist-empty-btn">
                Explore Collection
              </a>
            </div>
          ) : (
            <div className="wishlist-grid">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`wishlist-item ${
                    animatedItems.includes(item.id) ? "animated" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="wishlist-item-image-container">
                    {item.onSale && (
                      <div className="wishlist-sale-badge">Sale</div>
                    )}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="wishlist-item-image"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/300";
                      }}
                    />
                    {!item.inStock && (
                      <div className="wishlist-out-of-stock-overlay">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="wishlist-item-content">
                    <h3 className="wishlist-item-name">{item.name}</h3>
                    <p className="wishlist-item-subtitle">{item.subtitle}</p>

                    <div className="wishlist-price-container">
                      <span className="wishlist-current-price">
                        LKR {item.price.toLocaleString()}
                      </span>
                      {item.onSale && (
                        <span className="wishlist-original-price">
                          LKR {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="wishlist-actions">
                      <button
                        className="wishlist-btn"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        {item.inStock ? "Add to Cart" : "Notify When Available"}
                      </button>
                      <button
                        className="wishlist-btn wishlist-btn-secondary"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
