import { useState, useEffect } from "react";
import "../../styles/client/nav.css";
import { Heart, Menu, Search, User, X, Handbag } from "lucide-react";
import Sidebar from "../../components/client/Sidebar";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Dummy products
  const products = [
    {
      id: 1,
      name: "Classic Leather Bag",
      price: 299,
      image: "/Hero.webp",
    },
    {
      id: 2,
      name: "Luxury Watch",
      price: 499,
      image: "/Hero.webp",
    },
    {
      id: 3,
      name: "Silk Scarf",
      price: 149,
      image: "/Hero.webp",
    },
    {
      id: 4,
      name: "Designer Shoes",
      price: 399,
      image: "/Hero.webp",
    },
    {
      id: 5,
      name: "Minimalist Sunglasses",
      price: 199,
      image: "/Hero.webp",
    },
  ];

  // Filter products by query
  const filteredProducts = products.filter((p) =>
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

        <a href="/" className="navbar-logo">
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
              <button>t shirt</button>
              <button>shoes</button>
              <button>wallet</button>
              <button>sunglasses men</button>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="search-results">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.image} alt={p.name} />
                <h3 className="product-name">{p.name}</h3>
                <p>${p.price}</p>
              </div>
            ))
          ) : (
            <p className="no-results">No products found</p>
          )}
        </div>
      </div>
    </>
  );
}
