import { useState, useEffect } from "react";
import "../../styles/client/nav.css";
import { Heart, Menu, Search, User, X, Handbag } from "lucide-react";
import Sidebar from "../../components/client/Sidebar";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/products";
import { formatPrice } from "../../utils/formatPrice";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products, setProducts] = useState([]);

  function handleClick() {
    setSearchOpen(!searchOpen);
  }

  function handleClose() {
    setSearchOpen(!searchOpen);
  }

  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen || searchOpen ? "hidden" : "auto";
  }, [sidebarOpen, searchOpen]);

  useEffect(() => {
    async function getData() {
      const products = await getProducts();
      setProducts(products);
    }
    getData();
  }, []);
  function getRandomTrending(products, count = 4) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const trendingProducts = getRandomTrending(products);
  // Filter products by query
  const filteredProducts = trendingProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <button
            className="icon-text"
            style={{ zIndex: "3" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu strokeWidth={1.2} />
            <span>Menu</span>
          </button>
        </div>

        <a href="#" className="navbar-logo">
          {/* World Store */}
          {/* <img src="./World Store.jpg" alt="" /> */}
          <img
            src="/World_Store-removebg-preview.png
          "
            alt=""
          />
        </a>

        <div className="navbar-right">
          <button className="icon-text" onClick={handleClick}>
            <Search strokeWidth={1.2} />
            <span>Search</span>
          </button>
          <Link to="/cart" className="icon-text">
            <Handbag strokeWidth={1.2} />
            <span>Cart</span>
          </Link>

          {/* <button className="icon-btn">
            <Handbag strokeWidth={1.2} />
          </button> */}
        </div>
      </header>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        {/* Close button */}
        <button
          className="close-btn"
          style={{ display: "block" }}
          onClick={handleClose}
        >
          <X />
        </button>

        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder='Search for "Luxury Bag"...'
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {/* Trending searches */}
          <div className="trending">
            <span>Trending searches</span>
            <div className="tags">
              {trendingProducts.map((p) => (
                <button key={p._id} onClick={() => setQuery(p.name)}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="search-results">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                to={`/product/${product.slug}`}
                key={product.id}
                className="product-card"
                onClick={() => setSearchOpen(false)}
              >
                <img src={product.mainImages[0]} alt={product.name} />
                <h3 className="product-name">{product.name}</h3>
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
              </Link>
            ))
          ) : (
            <p className="no-results">No products found</p>
          )}
        </div>
      </div>
    </>
  );
}
