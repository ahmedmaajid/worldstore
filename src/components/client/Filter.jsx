import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
// import "./shop.css";

const Filter = ({ isOpen, toggle, filters, setFilters, categoriesData }) => {
  const [openCategories, setOpenCategories] = useState({});

  const handleMinPriceChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      minPrice: value,
    }));
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value === "" ? Infinity : Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      maxPrice: value,
    }));
  };

  const handleCategoryToggle = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubcategoryChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter((cat) => cat !== value),
    }));
  };

  const renderCategory = (category) => {
    const hasChildren =
      (category.subcategories && category.subcategories.length > 0) ||
      (category.subsubcategories && category.subsubcategories.length > 0);

    // If it's a leaf node (no children), render a checkbox
    if (!hasChildren) {
      return (
        <label key={category.id} className="category-label">
          <input
            type="checkbox"
            value={category.name}
            checked={filters.categories.includes(category.name)}
            onChange={handleSubcategoryChange}
          />
          {category.name}
        </label>
      );
    }

    // If it has children, render the expandable structure
    return (
      <div key={category.id} className="category-item">
        <div
          className="category-header"
          onClick={() => handleCategoryToggle(category.id)}
          style={{ cursor: "pointer" }}
        >
          <span>{category.name}</span>
          {openCategories[category.id] ? <ChevronUp /> : <ChevronDown />}
        </div>

        {openCategories[category.id] && (
          <div className="subcategories">
            {/* Recursively render subcategories if they exist */}
            {category.subcategories?.map((sub) => renderCategory(sub))}

            {/* Recursively render sub-subcategories if they exist */}
            {category.subsubcategories?.map((subsub) => renderCategory(subsub))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`filter-sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggle}>
        &times;
      </button>
      <div className="filter-group">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice === 0 ? "" : filters.minPrice}
            onChange={handleMinPriceChange}
            className="price-input"
          />
          <span className="separator">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice === Infinity ? "" : filters.maxPrice}
            onChange={handleMaxPriceChange}
            className="price-input"
          />
        </div>
        <div className="range-slider-container">
          <input
            type="range"
            min="0"
            max="200"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minPrice: Number(e.target.value),
              }))
            }
            className="range-slider min-thumb"
            style={{ zIndex: filters.minPrice > filters.maxPrice ? 2 : 1 }}
          />
          <input
            type="range"
            min="0"
            max="200"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: Number(e.target.value),
              }))
            }
            className="range-slider max-thumb"
          />
        </div>
        <div className="price-display">
          Rs.{filters.minPrice}.00 - Rs.
          {filters.maxPrice === Infinity ? "Max" : filters.maxPrice}.00
        </div>
      </div>
      <div className="filter-group category-list">
        <h4>Category</h4>
        {categoriesData.map((cat) => renderCategory(cat))}
      </div>
    </div>
  );
};

export default Filter;
