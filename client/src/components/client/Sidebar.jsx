import React, { useEffect, useState } from "react";
import {
  Heart,
  User,
  X,
  Store,
  Home,
  ChevronRight,
  PackageOpenIcon,
  LogOut,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/products";
import { logOut } from "../../api/users";
import PopMessage from "./PopMessage";
import { checkAuth } from "../../api/checkAuth";

// Helper function for slugify
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

// Organize categories into tree
const organizeCategories = (categories) => {
  const categoryMap = new Map();
  const rootCategories = [];

  categories.forEach((cat) => {
    categoryMap.set(cat._id, { ...cat, children: [] });
  });

  categoryMap.forEach((cat) => {
    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId);
      if (parent) parent.children.push(cat);
    } else {
      rootCategories.push(cat);
    }
  });

  return rootCategories;
};

export default function Sidebar({ isOpen, onClose }) {
  const [organizedCategories, setOrganizedCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [popUp, setPopUp] = useState({ state: false, message: "", status: "" });
  const [loggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function getCats() {
      try {
        const response = await getCategories();
        const categories = response.data || response;
        setOrganizedCategories(organizeCategories(categories));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    getCats();
  }, []);

  const handleLogout = async () => {
    try {
      const loggingOut = await logOut();
      console.log(loggingOut);
      setPopUp({ status: "success", state: true, message: loggingOut.message });
      setIsLoggedIn(false);
    } catch (error) {
      const message = error ? error : "Something went wrong!";
      setPopUp({ status: "error", state: true, message: message });
      console.log(error);
    }
  };

  async function isLoggedIn() {
    const auth = await checkAuth();
    if (auth) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }
  useEffect(() => {
    isLoggedIn();
  }, [loggedIn]);

  const handleCategoryHover = (categoryId) => setHoveredCategory(categoryId);
  const handleCategoryLeave = () => setHoveredCategory(null);

  return (
    <>
      {popUp.state && (
        <PopMessage status={popUp.status} message={popUp.message} />
      )}
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose}>
          <X strokeWidth={1.2} /> Close
        </button>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-span">Quick Links</span>

          <ul className="desktop-links">
            <Link to="/" onClick={onClose}>
              <Home /> <span>Home</span>
            </Link>
            <Link to="/shop" onClick={onClose}>
              <Store /> <span>Shop</span>
            </Link>
            <Link to="/wishlist" onClick={onClose}>
              <Heart /> <span>Wishlist</span>
            </Link>
            <Link to="/account/login" onClick={onClose}>
              <User /> <span>Account</span>
            </Link>
          </ul>
          <ul className="">
            <Link to="/my-orders" onClick={onClose}>
              <PackageOpenIcon /> <span>My Orders</span>
            </Link>
            {loggedIn ? (
              <Link
                onClick={() => {
                  onClose();
                  handleLogout();
                }}
              >
                <LogOut /> <span>Logout</span>
              </Link>
            ) : (
              <Link
                to="/account/login"
                onClick={() => {
                  onClose();
                }}
              >
                <LogIn /> <span>Log In</span>
              </Link>
            )}
          </ul>

          <ul className="categories-list">
            <span className="sidebar-nav-span">Categories</span>
            {organizedCategories.map((category) => {
              const hasChildren =
                category.children && category.children.length > 0;

              // check if children themselves have children (deep structure)
              const hasGrandChildren = hasChildren
                ? category.children.some(
                    (child) => child.children && child.children.length > 0
                  )
                : false;

              return (
                <li
                  key={category._id}
                  className="category-item"
                  onMouseEnter={() => handleCategoryHover(category._id)}
                  onMouseLeave={handleCategoryLeave}
                >
                  {/* Case 1: Category has grandchildren (Cosmetic -> Men/Women -> ...) */}
                  {hasGrandChildren ? (
                    <div className="category-with-dropdown">
                      <span className="category-main-link">
                        {category.name}
                        <ChevronRight size={16} className="category-arrow" />
                      </span>

                      <div
                        className={`category-dropdown ${
                          hoveredCategory === category._id ? "show" : ""
                        }`}
                      >
                        <div className="dropdown-content">
                          {category.children.map((subcategory) => (
                            <Link
                              key={subcategory._id}
                              to={`/shop/category/${slugify(
                                category.name
                              )}/${slugify(subcategory.name)}`}
                              onClick={onClose}
                              className="subcategory-link"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : hasChildren ? (
                    // Case 2: Category has only subcategories (Home Needs -> Tables, Spoons)
                    <Link
                      to={`/shop/category/${slugify(category.name)}`}
                      onClick={onClose}
                    >
                      {category.name}
                    </Link>
                  ) : (
                    // Case 3: Category has no children at all
                    <Link
                      to={`/shop/category/${slugify(category.name)}`}
                      onClick={onClose}
                    >
                      {category.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
