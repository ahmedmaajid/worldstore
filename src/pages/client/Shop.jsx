import React, { useState } from "react";
import "../../styles/client/shop.css";
import Filter from "../../components/client/Filter";
import { Menu } from "lucide-react";
import SortDropdown from "../../components/client/SortDropDown";
// New array of category and subcategory objects
const CATEGORIES = [
  {
    id: "1",
    name: "Home Needs",
    subcategories: [
      { id: "1a", name: "Home Appliances" },
      { id: "1b", name: "Clocks" },
      { id: "1c", name: "Spoons and Sets" },
      { id: "1d", name: "Lunch Boxes" },
      { id: "1e", name: "Water Bottles" },
    ],
  },
  {
    id: "2",
    name: "Foreign Mart",
    subcategories: [
      { id: "2a", name: "Sneakers" },
      { id: "2b", name: "Loafers" },
      { id: "2c", name: "Sandals" },
    ],
  },
  {
    id: "3",
    name: "Cosmetic Items",
    subcategories: [
      {
        id: "3m",
        name: "Men",
        subsubcategories: [
          { id: "3m1", name: "Watches" },
          { id: "3m2", name: "Bags" },
          { id: "3m3", name: "Wallets" },
        ],
      },
      {
        id: "3w",
        name: "Women",
        subsubcategories: [
          { id: "3w1", name: "Watches" },
          { id: "3w2", name: "Bags" },
          { id: "3w3", name: "Wallets" },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Phone Accessories",
    subcategories: [
      { id: "4a", name: "Chargers" },
      { id: "4b", name: "Covers & Cases" },
      { id: "4c", name: "Headphones" },
      { id: "4d", name: "Screen Protectors" },
    ],
  },
];

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "lorem ipsum dolar sit amet constructor plan not consto",
    price: 29.99,
    category: "clothing",
    image: "./Watch.png",
  },
  {
    id: 2,
    name: "Modern Sneakers",
    price: 89.99,
    category: "shoes",
    image: "./Handbag.png",
  },
  {
    id: 3,
    name: "lorem ipsum dolar sit amet constructor plan not consto",
    price: 149.99,
    category: "accessories",
    image: "./Belt.png",
  },
  {
    id: 4,
    name: "White Linen Shirt",
    price: 45.0,
    category: "clothing",
    image: "./Tech Essentials.png",
  },
  {
    id: 5,
    name: "Leather Wallet",
    price: 65.5,
    category: "accessories",
    image: "./Jwelry.png",
  },
  {
    id: 6,
    name: "Canvas Tote Bag",
    price: 35.0,
    category: "accessories",
    image: "./Headset.png",
  },
  {
    id: 7,
    name: "Classic Loafers",
    price: 125.0,
    category: "shoes",
    image: "./Beauty & Personal Care.png",
  },
  {
    id: 8,
    name: "Graphic Hoodie",
    price: 75.0,
    category: "clothing",
    image: "./Toy.png",
  },
];

export default function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("price-low-to-high");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 200, // Set an initial max price for the slider
    categories: [],
  });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const applyFilters = (product) => {
    const isPriceMatch =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;
    const isCategoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    return isPriceMatch && isCategoryMatch;
  };

  const sortedAndFilteredProducts = [...DUMMY_PRODUCTS]
    .filter((product) => applyFilters(product))
    .sort((a, b) => {
      switch (sortOption) {
        case "price-low-to-high":
          return a.price - b.price;
        case "price-high-to-low":
          return b.price - a.price;
        case "name-a-z":
          return a.name.localeCompare(b.name);
        case "name-z-a":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="shop-page-container">
      <header className="shop-header">
        <h1>Our Collection</h1>
        <button className="filter-toggle" onClick={toggleFilter}>
          <Menu />
        </button>
      </header>
      <div className="main-content">
        <Filter
          isOpen={isFilterOpen}
          toggle={toggleFilter}
          filters={filters}
          categoriesData={CATEGORIES}
          setFilters={setFilters}
        />

        <div className="product-grid-container">
          <div className="product-grid-header">
            <div className="sort-by">
              <label htmlFor="sort">Sort by</label>
              {/* <SortDropdown /> */}
              <SortDropdown
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </div>
          </div>
          <div className="product-grid">
            {sortedAndFilteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
