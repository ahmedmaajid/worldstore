import React, { useEffect, useState } from "react";
import "../../styles/client/shop.css";
import Filter from "../../components/client/Filter";
import { FilterIcon, X } from "lucide-react";
import SortDropdown from "../../components/client/SortDropdown";
import { Link, useParams } from "react-router-dom";
import { Product } from "../../components/client/Product";

// --- Categories ---

const CATEGORIES = [
  {
    id: "1",
    name: "Home Needs",
    urlName: "home-needs",
    subcategories: [
      { id: "1a", name: "Home Appliances", image: "/Watch.png" },
      { id: "1b", name: "Clocks", image: "/Handbag.png" },
      { id: "1c", name: "Spoons and Sets", image: "/Toy.png" },
      { id: "1d", name: "Lunch Boxes", image: "/Belt.png" },
      { id: "1e", name: "Water Bottles", image: "/Jwelry.png" },
      { id: "1a", name: "Home Appliances", image: "/Watch.png" },
      { id: "1b", name: "Clocks", image: "/Handbag.png" },
      { id: "1c", name: "Spoons and Sets", image: "/Toy.png" },
      { id: "1d", name: "Lunch Boxes", image: "/Belt.png" },
      { id: "1e", name: "Water Bottles", image: "/Jwelry.png" },
    ],
  },
  {
    id: "2",
    name: "Foreign Mart",
    urlName: "foreign-mart",
    subcategories: [
      { id: "2a", name: "Sneakers", image: "/subcategory-2a.jpg" },
      { id: "2b", name: "Loafers", image: "/subcategory-2b.jpg" },
      { id: "2c", name: "Sandals", image: "/subcategory-2c.jpg" },
    ],
  },
  {
    id: "3",
    name: "Cosmetic Items",
    urlName: "cosmetic-items",
    subcategories: [
      {
        id: "3m",
        name: "Men",
        image: "/subcategory-3m.jpg",
        subsubcategories: [
          { id: "3m1", name: "Watches" },
          { id: "3m2", name: "Bags" },
          { id: "3m3", name: "Wallets" },
        ],
      },
      {
        id: "3w",
        name: "Women",
        image: "/subcategory-3w.jpg",
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
    urlName: "phone-accessories",
    subcategories: [
      { id: "4a", name: "Chargers", image: "/subcategory-4a.jpg" },
      { id: "4b", name: "Covers & Cases", image: "/subcategory-4b.jpg" },
      { id: "4c", name: "Headphones", image: "/subcategory-4c.jpg" },
      { id: "4d", name: "Screen Protectors", image: "/subcategory-4d.jpg" },
    ],
  },
];

// --- Dummy products ---
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "lorem ipsum dolar sit amet constructor plan not consto",
    price: 29.99,
    category: "home-needs",
    subcategory: "clocks",
    image: "/Watch.png",
  },
  {
    id: 2,
    name: "Modern Sneakers",
    price: 89.99,
    category: "foreign-mart",
    subcategory: "sneakers",
    image: "/Handbag.png",
  },
  {
    id: 3,
    name: "lorem ipsum dolar sit amet constructor plan not consto",
    price: 149.99,
    category: "cosmetic-items",
    subcategory: "men",
    image: "/Belt.png",
  },
  {
    id: 4,
    name: "White Linen Shirt",
    price: 45.0,
    category: "phone-accessories",
    subcategory: "chargers",
    image: "/Tech Essentials.png",
  },
  {
    id: 5,
    name: "Leather Wallet",
    price: 65.5,
    category: "cosmetic-items",
    subcategory: "women",
    image: "/Jwelry.png",
  },
  {
    id: 6,
    name: "Canvas Tote Bag",
    price: 35.0,
    category: "home-needs",
    subcategory: "lunch-boxes",
    image: "/Headset.png",
  },
  {
    id: 7,
    name: "Classic Loafers",
    price: 125.0,
    category: "foreign-mart",
    subcategory: "loafers",
    image: "/Beauty & Personal Care.png",
  },
  {
    id: 8,
    name: "Graphic Hoodie",
    price: 75.0,
    category: "phone-accessories",
    subcategory: "headphones",
    image: "/Toy.png",
  },
];

export default function Shop() {
  const { category, subcategory } = useParams();
  const isSubcategoryView = !!subcategory;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("price-low-to-high");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 200,
    categories: [],
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  // Get subcategories

  const getSubcategoriesForCategory = (urlCategoryName) => {
    const category = CATEGORIES.find((cat) => cat.urlName === urlCategoryName);
    return category ? category.subcategories : [];
  };

  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.urlName === category);
    setSelectedCategory(cat || null);
    setSubCategories(cat ? cat.subcategories : []);
    setFilters((prev) => ({ ...prev, categories: cat ? [cat.urlName] : [] }));
  }, [category]);

  const getCategoryDisplayName = (urlCategoryName) => {
    const category = CATEGORIES.find((cat) => cat.urlName === urlCategoryName);
    return category ? category.name : urlCategoryName;
  };

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
      setSubCategories(getSubcategoriesForCategory(category));
      setFilters((prev) => ({ ...prev, categories: [category] }));
    } else {
      setSelectedCategory(null);
      setSubCategories([]);
      setFilters((prev) => ({ ...prev, categories: [] }));
    }
  }, [category]);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  // const applyFilters = (product) => {
  //   const isPriceMatch =
  //     product.price >= filters.minPrice && product.price <= filters.maxPrice;
  //   const isCategoryMatch =
  //     filters.categories.length === 0 ||
  //     filters.categories.includes(product.category);
  //   return isPriceMatch && isCategoryMatch;
  // };
  const applyFilters = (product) => {
    const isPriceMatch =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;

    const isCategoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    const isSubcategoryMatch = subcategory
      ? product.subcategory.toLowerCase().replace(/\s+/g, "-") === subcategory
      : true;

    return isPriceMatch && isCategoryMatch && isSubcategoryMatch;
  };

  const sortedAndFilteredProducts = [...DUMMY_PRODUCTS]
    .filter(applyFilters)
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

  const removeCategory = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const resetPrice = () => {
    setFilters((prev) => ({ ...prev, minPrice: 0, maxPrice: 200 }));
  };

  return (
    <div className="shop-page-container">
      {/* Subcategories section */}
      {/* {selectedCategory && subCategories.length > 0 && (
        <div className="subcategories-section">
          <div className="breadcrumb-section">
            <nav className="breadcrumb">
              <Link to="/" className="breadcrumb-item">
                Home
              </Link>
              <span className="breadcrumb-separator">›</span>
              <Link to="/shop" className="breadcrumb-item">
                Shop
              </Link>
              {selectedCategory && (
                <>
                  <span className="breadcrumb-separator">›</span>
                  <span className="breadcrumb-item current">
                    {getCategoryDisplayName(selectedCategory)}
                  </span>
                </>
              )}
            </nav>
          </div>
          <div className="subcategories-grid">
            {subCategories.map((subcat) => (
              <Link
                key={subcat.id}
                to={`/shop/category/${selectedCategory}/${subcat.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="subcategory-card"
              >
                <img
                  src={subcat.image}
                  alt={subcat.name}
                  className="subcategory-image"
                  onError={(e) => (e.target.src = "/default-subcategory.jpg")}
                />
                <span className="subcategory-name">{subcat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )} */}
      {!isSubcategoryView && selectedCategory && subCategories.length > 0 && (
        <div className="subcategories-section mt-8">
          <nav className="breadcrumb" style={{ zIndex: "2000" }}>
            <Link to="/" className="breadcrumb-item">
              Home
            </Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/shop" className="breadcrumb-item">
              Shop
            </Link>
            {selectedCategory && (
              <>
                <span className="breadcrumb-separator">›</span>
                <Link
                  to={`/shop/category/${selectedCategory}`}
                  className="breadcrumb-item"
                >
                  {getCategoryDisplayName(selectedCategory)}
                </Link>
              </>
            )}
          </nav>

          <div className="subcategories-grid">
            {subCategories.map((subcat) => (
              <Link
                key={subcat.id}
                to={`/shop/category/${selectedCategory}/${subcat.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="subcategory-card"
              >
                <img
                  src={subcat.image}
                  alt={subcat.name}
                  className="subcategory-image"
                  onError={(e) => (e.target.src = "/default-subcategory.jpg")}
                />
                <span className="subcategory-name">{subcat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {isSubcategoryView ? (
        <div className="subcategories-section mt-8">
          <nav className="breadcrumb" style={{ zIndex: "2000" }}>
            <Link to="/shop" className="breadcrumb-item">
              Shop
            </Link>
            {selectedCategory && (
              <>
                <span className="breadcrumb-separator">›</span>
                <Link
                  to={`/shop/category/${selectedCategory}`}
                  className="breadcrumb-item"
                >
                  {getCategoryDisplayName(selectedCategory)}
                </Link>
                <span className="breadcrumb-separator">›</span>
              </>
            )}
            <span className="breadcrumb-item current">{subcategory}</span>
          </nav>
        </div>
      ) : (
        ""
      )}

      <header className="shop-header">
        <div className="selected-filters align-center">
          <span className="d-flex align-center">Selected Filters: </span>
          {filters.categories.length > 0 ? (
            filters.categories.map((cat) => (
              <span
                key={cat}
                className="filter-tag"
                onClick={() => removeCategory(cat)}
              >
                {getCategoryDisplayName(cat)}
                <X size={14} />
              </span>
            ))
          ) : (
            <span className="c-gray">Nothing Selected</span>
          )}
          {(filters.minPrice !== 0 || filters.maxPrice !== 200) && (
            <span className="filter-tag">
              Rs.{filters.minPrice} - Rs.{filters.maxPrice}
              <X size={14} onClick={resetPrice} />
            </span>
          )}
        </div>
        <button
          className="filter-toggle d-flex align-center"
          onClick={toggleFilter}
        >
          <FilterIcon /> Filter
        </button>
      </header>

      <div className="main-content">
        <Filter
          isOpen={isFilterOpen}
          toggle={toggleFilter}
          filters={filters}
          setFilters={setFilters}
          categoriesData={CATEGORIES}
        />

        <div className="product-grid-container">
          <div className="product-grid-header">
            <div className="sort-by">
              <label htmlFor="sort">Sort by</label>
              <SortDropdown
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </div>
          </div>
          <div className="product-grid">
            {sortedAndFilteredProducts.length > 0 ? (
              sortedAndFilteredProducts.map((product) => (
                <Product key={product.id} product={product} />
              ))
            ) : (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
