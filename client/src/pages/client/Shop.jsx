// import React, { useEffect, useState } from "react";
// import "../../styles/client/shop.css";
// import { Filter, X, ChevronDown, ChevronRight, Search } from "lucide-react";
// import SortDropdown from "../../components/client/SortDropdown";
// import { Link, useLocation, useParams } from "react-router-dom";
// import { Product } from "../../components/client/Product";
// import {
//   getCategories,
//   getCategoryDataBySlug,
//   getProductByCategory,
//   getProductByCategoryIds,
//   getProducts,
// } from "../../api/products";
// import { Spinner } from "../../components/client/Spinner";

// // Helper function for slugify
// const slugify = (text, options = {}) => {
//   return text
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "");
// };

// export default function Shop() {
//   const { slug } = useParams();

//   const { category, subcategory } = useParams();
//   const isSubcategoryView = !!subcategory;
//   const [shop_isFilterOpen, setShop_isFilterOpen] = useState(false);
//   const [shop_sortOption, setShop_sortOption] = useState("price-low-to-high");
//   const [shop_searchQuery, setShop_searchQuery] = useState("");
//   const [shop_filters, setShop_filters] = useState({
//     minPrice: 0,
//     maxPrice: 5000,
//     categories: [],
//   });

//   // Products and Categories
//   const [shop_productsData, setShop_productsData] = useState([]);
//   const [baseProducts, setBaseProducts] = useState([]);
//   const [extraProducts, setExtraProducts] = useState([]);

//   const [shop_categoriesData, setShop_categoriesData] = useState([]);
//   const [shop_selectedCategory, setShop_selectedCategory] = useState(null);
//   const [shop_subCategories, setShop_subCategories] = useState([]);
//   const [shop_organizedCategories, setShop_organizedCategories] = useState([]);
//   const [shop_expandedCategories, setShop_expandedCategories] = useState({});

//   const [categoryBySlug, setCategoryBySlug] = useState([]);
//   const [categoriesPath, setCategoriesPath] = useState([]);
//   const location = useLocation();

//   // Add this state to track the currently selected variation image
//   const [shop_selectedVariationImages, setShop_selectedVariationImages] =
//     useState({});

//   // Add this function to handle variation clicks
//   const shop_handleVariationClick = (
//     productId,
//     variationIndex,
//     variationImage
//   ) => {
//     setShop_selectedVariationImages((prev) => ({
//       ...prev,
//       [productId]: variationImage,
//     }));
//   };

//   // Add this to get the current image for a product
//   const shop_getCurrentImage = (product) => {
//     const selectedImage = shop_selectedVariationImages[product._id];
//     if (selectedImage) return selectedImage;
//     return product.mainImages?.[0] || "/default-product.jpg";
//   };

//   // Spinner
//   const [shop_showSpinner, setShop_showSpinner] = useState({
//     state: false,
//     message: "",
//   });

//   // Function to organize categories into a nested structure
//   const organizeCategories = (categories) => {
//     const categoryMap = {};

//     // Map all categories by their _id
//     categories.forEach((cat) => {
//       categoryMap[cat._id] = { ...cat, subcategories: [] };
//     });

//     const result = [];

//     categories.forEach((cat) => {
//       if (cat.parentId) {
//         // If it has a parent, push it into parent's subcategories
//         if (categoryMap[cat.parentId]) {
//           categoryMap[cat.parentId].subcategories.push(categoryMap[cat._id]);
//         }
//       } else {
//         // Top level category
//         result.push(categoryMap[cat._id]);
//       }
//     });

//     return result;
//   };

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setShop_showSpinner({ state: true, message: "Loading Products..." });

//         const [products, categories] = await Promise.all([
//           getProducts(),
//           getCategories(),
//         ]);
//         setShop_productsData(products);
//         setShop_categoriesData(categories);
//         setShop_organizedCategories(organizeCategories(categories));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setShop_showSpinner({ state: false, message: "" });
//       }
//     }
//     fetchData();
//   }, []);

//   const CategoryItem = ({
//     category,
//     expandedCategories,
//     handleToggle,
//     handleFilter,
//     filters,
//   }) => {
//     const isExpanded = !!expandedCategories[category._id];
//     const hasSub = category.subcategories && category.subcategories.length > 0;
//     const isSelected = filters.includes(category._id);

//     return (
//       <div className="shop-category-item">
//         <div
//           className={`shop-category-toggle ${!hasSub ? "leaf-category" : ""} ${
//             isSelected ? "selected" : ""
//           }`}
//           onClick={
//             hasSub
//               ? () => handleToggle(category._id)
//               : () => handleFilter(category._id)
//           }
//         >
//           <span className="shop-category-name">{category.name}</span>

//           {hasSub && (
//             <div className="shop-toggle-icon">
//               {isExpanded ? (
//                 <ChevronDown size={16} />
//               ) : (
//                 <ChevronRight size={16} />
//               )}
//             </div>
//           )}
//         </div>

//         {hasSub && isExpanded && (
//           <div className="shop-subcategory-list">
//             {category.subcategories.map((sub) => (
//               <CategoryItem
//                 key={sub._id}
//                 category={sub}
//                 expandedCategories={expandedCategories}
//                 handleToggle={handleToggle}
//                 handleFilter={handleFilter}
//                 filters={filters}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // useEffect(() => {
//   //   const fullSlug = location.pathname.replace("/shop/category/", "");
//   //   if (!fullSlug) return;

//   //   async function fetchData() {
//   //     try {
//   //       const data = await getCategoryDataBySlug(fullSlug);
//   //       setCategoriesPath(data.categoriesPath || []);
//   //       console.log("categoriesPath & subCategories:", data);

//   //       // categories along path
//   //       const lastCategory =
//   //         data.categoriesPath[data.categoriesPath.length - 1];
//   //       setShop_selectedCategory(lastCategory);

//   //       // all subcategories of last category for header
//   //       setCategoryBySlug(data.allSubCategories[lastCategory.slug] || []);

//   //       // optional: set subcategories for breadcrumb or filter
//   //       setShop_subCategories(data.allSubCategories[lastCategory.slug] || []);
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //   }

//   //   fetchData();
//   // }, [location.pathname]);

//   // useEffect(() => {
//   //   const fullSlug = location.pathname.replace("/shop/category/", "").trim();

//   //   // if slug is empty OR equals "shop", don't fetch category-specific data
//   //   if (!fullSlug || fullSlug === "shop" || fullSlug === "/") return;

//   //   async function fetchData() {
//   //     try {
//   //       const data = await getCategoryDataBySlug(fullSlug);
//   //       setCategoriesPath(data.categoriesPath || []);
//   //       const lastCategory =
//   //         data.categoriesPath[data.categoriesPath.length - 1];
//   //       setShop_selectedCategory(lastCategory);
//   //       setCategoryBySlug(data.allSubCategories[lastCategory.slug] || []);
//   //       setShop_subCategories(data.allSubCategories[lastCategory.slug] || []);
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //   }

//   //   fetchData();
//   // }, [location.pathname]);

//   useEffect(() => {
//     const fullSlug = location.pathname.replace("/shop/category/", "").trim();

//     // Only run if there’s an actual category slug
//     if (!fullSlug || fullSlug === "shop" || fullSlug === "/") {
//       // Reset category-specific states if on /shop
//       setCategoriesPath([]);
//       setShop_selectedCategory(null);
//       setShop_subCategories([]);
//       setCategoryBySlug([]);
//       return;
//     }

//     async function fetchData() {
//       try {
//         const data = await getCategoryDataBySlug(fullSlug);

//         // Set category path for breadcrumbs
//         setCategoriesPath(data.categoriesPath || []);

//         // Last category in path is selected
//         const lastCategory =
//           data.categoriesPath[data.categoriesPath.length - 1];
//         setShop_selectedCategory(lastCategory);

//         // Subcategories for header or filters
//         const subs = data.allSubCategories[lastCategory.slug] || [];
//         setShop_subCategories(subs);
//         setCategoryBySlug(subs);
//       } catch (error) {
//         console.log("Category fetch error:", error);
//       }
//     }

//     fetchData();
//   }, [location.pathname]);

//   useEffect(() => {
//     const fullSlug = location.pathname.replace("/shop/category/", "").trim();

//     // If no slug (just /shop), reset everything
//     if (!fullSlug || fullSlug === "shop" || fullSlug === "/") {
//       setCategoriesPath([]);
//       setShop_selectedCategory(null);
//       setShop_subCategories([]);
//       setCategoryBySlug([]);
//       setBaseProducts([]);
//       setExtraProducts([]);
//       setShop_productsData([]);
//       return;
//     }

//     async function fetchCategoryAndProducts() {
//       try {
//         // Fetch category info
//         const categoryData = await getCategoryDataBySlug(fullSlug);
//         const lastCategory =
//           categoryData.categoriesPath[categoryData.categoriesPath.length - 1];

//         setCategoriesPath(categoryData.categoriesPath || []);
//         setShop_selectedCategory(lastCategory);

//         const subs = categoryData.allSubCategories[lastCategory.slug] || [];
//         setShop_subCategories(subs);
//         setCategoryBySlug(subs);

//         // Fetch products for this category
//         const productData = await getProductByCategory(fullSlug);
//         setBaseProducts(productData.products || []);
//         setExtraProducts([]);
//       } catch (err) {
//         console.error("Error fetching category/products:", err);
//       }
//     }

//     fetchCategoryAndProducts();
//   }, [location.pathname]);

//   // When filters change
//   useEffect(() => {
//     if (!shop_filters.categories.length) {
//       setExtraProducts([]);
//       return;
//     }

//     async function fetchExtra() {
//       try {
//         const res = await getProductByCategoryIds(shop_filters.categories);
//         setExtraProducts(res.products || []);
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     fetchExtra();
//   }, [shop_filters.categories]);

//   // Combine base + extra
//   useEffect(() => {
//     // merge but avoid duplicates by _id
//     const combined = [...baseProducts, ...extraProducts].reduce((acc, curr) => {
//       if (!acc.find((p) => p._id === curr._id)) acc.push(curr);
//       return acc;
//     }, []);
//     setShop_productsData(combined);
//   }, [baseProducts, extraProducts]);

//   useEffect(() => {
//     if (category) {
//       const cat = shop_categoriesData.find(
//         (c) => slugify(c.name, { lower: true }) === category
//       );
//       console.log("cat", cat);
//       setShop_selectedCategory(cat);
//       setShop_subCategories(cat ? cat.subcategories || [] : []);
//       setShop_filters((prev) => ({ ...prev, categories: [cat?._id || ""] }));
//     } else {
//       setShop_selectedCategory(null);
//       setShop_subCategories([]);
//       setShop_filters((prev) => ({ ...prev, categories: [] }));
//     }
//   }, [category, shop_categoriesData]);

//   const shop_toggleFilter = () => setShop_isFilterOpen(!shop_isFilterOpen);

//   const shop_handleToggleExpand = (categoryId) => {
//     setShop_expandedCategories((prev) => ({
//       ...prev,
//       [categoryId]: !prev[categoryId], // toggle true/false
//     }));
//   };

//   const shop_handleCategoryFilter = (categoryId) => {
//     setShop_filters((prev) => {
//       const isSelected = prev.categories.includes(categoryId);
//       if (isSelected) {
//         return {
//           ...prev,
//           categories: prev.categories.filter((c) => c !== categoryId),
//         };
//       } else {
//         return {
//           ...prev,
//           categories: [...prev.categories, categoryId],
//         };
//       }
//     });
//   };
//   const shop_applyFilters = (product) => {
//     const getProductPrice = (p) => {
//       if (p.discountedPrice && p.discountedPrice > 0) return p.discountedPrice;
//       if (p.price && p.price > 0) return p.price;
//       if (p.variations?.length > 0) {
//         const firstVar = p.variations[0];
//         return firstVar.discountedPrice > 0
//           ? firstVar.discountedPrice
//           : firstVar.price;
//       }
//       return 0;
//     };

//     const productPrice = getProductPrice(product);
//     const isPriceMatch =
//       productPrice >= shop_filters.minPrice &&
//       productPrice <= shop_filters.maxPrice;

//     const isSearchMatch =
//       !shop_searchQuery ||
//       product.name.toLowerCase().includes(shop_searchQuery.toLowerCase());

//     return isPriceMatch && isSearchMatch;
//   };

//   // const shop_applyFilters = (product) => {
//   //   const getProductPrice = (product) => {
//   //     if (product.discountedPrice && product.discountedPrice > 0) {
//   //       return product.discountedPrice;
//   //     }
//   //     if (product.price && product.price > 0) {
//   //       return product.price;
//   //     }
//   //     // Check variations if no main price
//   //     if (product.variations?.length > 0) {
//   //       const firstVar = product.variations[0];
//   //       return firstVar.discountedPrice > 0
//   //         ? firstVar.discountedPrice
//   //         : firstVar.price;
//   //     }
//   //     return 0;
//   //   };

//   //   const productPrice = getProductPrice(product);
//   //   const isPriceMatch =
//   //     productPrice >= shop_filters.minPrice &&
//   //     productPrice <= shop_filters.maxPrice;

//   //   const isCategoryMatch =
//   //     shop_filters.categories.length === 0 ||
//   //     shop_filters.categories.includes(product.category);

//   //   const isSearchMatch =
//   //     !shop_searchQuery ||
//   //     product.name.toLowerCase().includes(shop_searchQuery.toLowerCase());

//   //   return isPriceMatch && isCategoryMatch && isSearchMatch;
//   // };

//   // const shop_applyFilters = (product) => {
//   //   const getProductPrice = (product) => {
//   //     if (product.discountedPrice && product.discountedPrice > 0) {
//   //       return product.discountedPrice;
//   //     }
//   //     if (product.price && product.price > 0) {
//   //       return product.price;
//   //     }
//   //     // Check variations if no main price
//   //     if (product.variations?.length > 0) {
//   //       const firstVar = product.variations[0];
//   //       return firstVar.discountedPrice > 0
//   //         ? firstVar.discountedPrice
//   //         : firstVar.price;
//   //     }
//   //     return 0;
//   //   };

//   //   const productPrice = getProductPrice(product);
//   //   const isPriceMatch =
//   //     productPrice >= shop_filters.minPrice &&
//   //     productPrice <= shop_filters.maxPrice;

//   //   const isSearchMatch =
//   //     !shop_searchQuery ||
//   //     product.name.toLowerCase().includes(shop_searchQuery.toLowerCase());

//   //   // Fix: Call the function with ()
//   //   const isCategoryMatch = () => {
//   //     if (shop_filters.categories.length === 0) {
//   //       return true;
//   //     }
//   //     return shop_filters.categories.includes(product.category);
//   //   };

//   //   // Fix: Call isCategoryMatch() not isCategoryMatch
//   //   return isPriceMatch && isCategoryMatch() && isSearchMatch;
//   // };
//   const shop_sortedAndFilteredProducts = [...shop_productsData]
//     .filter(shop_applyFilters)
//     .sort((a, b) => {
//       const getPriceForSort = (product) => {
//         if (product.discountedPrice > 0) return product.discountedPrice;
//         if (product.price > 0) return product.price;
//         if (product.variations?.length > 0) {
//           const firstVar = product.variations[0];
//           return firstVar.discountedPrice > 0
//             ? firstVar.discountedPrice
//             : firstVar.price;
//         }
//         return 0;
//       };

//       switch (shop_sortOption) {
//         case "price-low-to-high":
//           return getPriceForSort(a) - getPriceForSort(b);
//         case "price-high-to-low":
//           return getPriceForSort(b) - getPriceForSort(a);
//         case "name-a-z":
//           return a.name.localeCompare(b.name);
//         case "name-z-a":
//           return b.name.localeCompare(a.name);
//         case "old-new":
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case "new-old":
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         default:
//           return 0;
//       }
//     });
//   // Add this useEffect to set proper min/max prices based on actual product data
//   useEffect(() => {
//     if (shop_productsData.length > 0) {
//       const prices = shop_productsData
//         .map((product) => {
//           if (product.discountedPrice > 0) return product.discountedPrice;
//           if (product.price > 0) return product.price;
//           if (product.variations?.length > 0) {
//             const firstVar = product.variations[0];
//             return firstVar.discountedPrice > 0
//               ? firstVar.discountedPrice
//               : firstVar.price;
//           }
//           return 0;
//         })
//         .filter((price) => price > 0);

//       const minPrice = Math.min(...prices);
//       const maxPrice = Math.max(...prices);

//       setShop_filters((prev) => ({
//         ...prev,
//         minPrice: 0,
//         maxPrice: Math.ceil(maxPrice),
//       }));
//     }
//   }, [shop_productsData]);

//   const shop_removeCategory = (categoryId) => {
//     setShop_filters((prev) => ({
//       ...prev,
//       categories: prev.categories.filter((c) => c !== categoryId),
//     }));
//   };

//   const shop_resetFilters = () => {
//     setShop_filters({ minPrice: 0, maxPrice: 5000, categories: [] });
//     setShop_searchQuery("");
//   };

//   return (
//     <div className="shop-page-wrapper">
//       {shop_showSpinner.state && <Spinner message={shop_showSpinner.message} />}
//       {/* Header Section */}

//       <div className="shop-header-section">
//         <div className="shop-header-content">
//           {categoryBySlug.length > 0 ? (
//             <div className="luxury-subcategories-showcase">
//               <div className="luxury-subcategories-grid">
//                 {categoryBySlug.map((subcat, ind) => (
//                   <Link
//                     key={subcat._id || ind}
//                     to={`${location.pathname}/${slugify(subcat.name)}`}
//                     className="luxury-subcat-item"
//                   >
//                     <div className="luxury-subcat-image">
//                       <img
//                         src={subcat.image || "/default-category.jpg"}
//                         alt={subcat.name}
//                         onError={(e) =>
//                           (e.target.src = "/default-category.jpg")
//                         }
//                       />
//                       <div className="luxury-subcat-overlay"></div>
//                     </div>
//                     <span className="luxury-subcat-name">{subcat.name}</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           ) : null}
//         </div>
//       </div>
//       <div className="shop-subcategories-section">
//         <nav className="shop-breadcrumb">
//           <Link to="/" className="shop-breadcrumb-item">
//             Home
//           </Link>
//           <span className="shop-breadcrumb-separator">›</span>
//           <Link to="/shop" className="shop-breadcrumb-item">
//             Shop
//           </Link>

//           {/* Use categoriesPath from your API response */}
//           {categoriesPath &&
//             categoriesPath.map((category, index) => {
//               const pathUpToHere = categoriesPath
//                 .slice(0, index + 1)
//                 .map((cat) => slugify(cat.name))
//                 .join("/");
//               const isLast = index === categoriesPath.length - 1;

//               return (
//                 <React.Fragment key={category._id}>
//                   <span className="shop-breadcrumb-separator">›</span>
//                   {isLast ? (
//                     <span className="shop-breadcrumb-item current">
//                       {category.name}
//                     </span>
//                   ) : (
//                     <Link
//                       to={`/shop/category/${pathUpToHere}`}
//                       className="shop-breadcrumb-item"
//                     >
//                       {category.name}
//                     </Link>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//         </nav>
//       </div>

//       {/* Controls Bar */}
//       <div className="shop-controls-bar">
//         <div className="shop-controls-left">
//           <button className="shop-filter-toggle" onClick={shop_toggleFilter}>
//             <Filter size={16} />
//             <span>Filters</span>
//           </button>
//           <div className="shop-results-count">
//             {shop_sortedAndFilteredProducts.length} items
//           </div>
//         </div>

//         <div className="shop-controls-right">
//           <div className="shop-sort-wrapper">
//             <label htmlFor="sort" className="shop-sort-label">
//               Sort by
//             </label>
//             <SortDropdown
//               sortOption={shop_sortOption}
//               setSortOption={setShop_sortOption}
//             />
//           </div>
//         </div>
//       </div>
//       {/* Active Filters */}
//       {(shop_filters.categories.length > 0 || shop_searchQuery) && (
//         <div className="shop-active-filters">
//           <div className="shop-filter-tags">
//             {shop_filters.categories.map((catId) => (
//               <span
//                 key={catId}
//                 className="shop-filter-tag"
//                 onClick={() => shop_removeCategory(catId)}
//               >
//                 {shop_categoriesData.find((cat) => cat._id === catId)?.name ||
//                   "Unknown"}
//                 <X size={12} />
//               </span>
//             ))}
//             {shop_searchQuery && (
//               <span
//                 className="shop-filter-tag"
//                 onClick={() => setShop_searchQuery("")}
//               >
//                 "{shop_searchQuery}"
//                 <X size={12} />
//               </span>
//             )}
//           </div>
//           <button className="shop-clear-filters" onClick={shop_resetFilters}>
//             Clear All
//           </button>
//         </div>
//       )}
//       <div className="shop-main-container">
//         {/* Filter Sidebar */}
//         <div
//           className={`shop-filter-sidebar ${shop_isFilterOpen ? "open" : ""}`}
//         >
//           <div className="shop-filter-header">
//             <h3>Filters</h3>
//             <button onClick={shop_toggleFilter} className="shop-close-filter">
//               <X size={20} />
//             </button>
//           </div>

//           <div className="shop-filter-content">
//             {/* Categories */}
//             <div className="shop-filter-group">
//               <h4>Price Range</h4>
//               <div className="shop-price-inputs">
//                 <div className="shop-price-input-group">
//                   <label>Min</label>
//                   <input
//                     type="number"
//                     value={shop_filters.minPrice}
//                     onChange={(e) =>
//                       setShop_filters((prev) => ({
//                         ...prev,
//                         minPrice: parseInt(e.target.value) || 0,
//                       }))
//                     }
//                     className="shop-price-input"
//                   />
//                 </div>
//                 <div className="shop-price-input-group">
//                   <label>Max</label>
//                   <input
//                     type="number"
//                     value={shop_filters.maxPrice}
//                     onChange={(e) =>
//                       setShop_filters((prev) => ({
//                         ...prev,
//                         maxPrice: parseInt(e.target.value) || 5000,
//                       }))
//                     }
//                     className="shop-price-input"
//                   />
//                 </div>
//               </div>
//               <div className="shop-price-range">
//                 <input
//                   type="range"
//                   min="0"
//                   max="5000"
//                   value={shop_filters.minPrice}
//                   onChange={(e) =>
//                     setShop_filters((prev) => ({
//                       ...prev,
//                       minPrice: Math.min(
//                         parseInt(e.target.value),
//                         prev.maxPrice
//                       ),
//                     }))
//                   }
//                   className="shop-range-slider"
//                 />
//                 <input
//                   type="range"
//                   min="0"
//                   max="5000"
//                   value={shop_filters.maxPrice}
//                   onChange={(e) =>
//                     setShop_filters((prev) => ({
//                       ...prev,
//                       maxPrice: Math.max(
//                         parseInt(e.target.value),
//                         prev.minPrice
//                       ),
//                     }))
//                   }
//                   className="shop-range-slider"
//                 />
//               </div>
//             </div>
//             <div className="shop-filter-group">
//               <h4>Categories</h4>
//               <div className="shop-category-list">
//                 {shop_organizedCategories.map((parent) => (
//                   <CategoryItem
//                     key={parent._id}
//                     category={parent}
//                     expandedCategories={shop_expandedCategories}
//                     handleToggle={shop_handleToggleExpand}
//                     handleFilter={shop_handleCategoryFilter}
//                     filters={shop_filters.categories}
//                   />
//                 ))}
//                 {/* {shop_organizedCategories.map((parent) => (
//                   <div key={parent._id} className="shop-category-item">
//                     <div
//                       className="shop-category-toggle"
//                       onClick={() => shop_handleToggleExpand(parent._id)}
//                     >
//                       <span className="shop-category-name">{parent.name}</span>
//                       {parent.subcategories.length > 0 && (
//                         <div className="shop-toggle-icon">
//                           {shop_expandedCategoryId === parent._id ? (
//                             <ChevronDown size={16} />
//                           ) : (
//                             <ChevronRight size={16} />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     {shop_expandedCategoryId === parent._id &&
//                       parent.subcategories.length > 0 && (
//                         <div className="shop-subcategory-list">
//                           {parent.subcategories.map((sub) => (
//                             <label
//                               key={sub._id}
//                               className="shop-subcategory-item"
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={shop_filters.categories.includes(
//                                   sub._id
//                                 )}
//                                 onChange={() =>
//                                   shop_handleCategoryFilter(sub._id)
//                                 }
//                               />
//                               <span className="shop-checkmark"></span>
//                               <span>{sub.name}</span>
//                             </label>
//                           ))}
//                         </div>
//                       )}
//                   </div>
//                 ))} */}
//               </div>
//             </div>

//             {/* Price Range */}
//           </div>
//         </div>

//         {/* Products Grid */}
//         <div className="shop-products-container">
//           {shop_sortedAndFilteredProducts.length > 0 ? (
//             <div className="shop-products-grid">
//               {shop_sortedAndFilteredProducts.map((product) => (
//                 <Link
//                   to={`/preview/${product.slug}`}
//                   key={product._id}
//                   className="shop-product-card"
//                 >
//                   <div className="shop-product-image-container">
//                     <img
//                       src={shop_getCurrentImage(product)}
//                       alt={product.name}
//                       className="shop-product-image"
//                     />

//                     <div className="shop-product-overlay"></div>
//                   </div>

//                   <div className="shop-product-info">
//                     <div className="shop-product-header">
//                       <h3 className="shop-product-name">{product.name}</h3>
//                       <div className="shop-product-stock">
//                         <div
//                           className={`shop-stock-dot ${
//                             product.inStock !== false ? "in-stock" : "out-stock"
//                           }`}
//                         ></div>
//                         <span>
//                           {product.inStock !== false
//                             ? "In Stock"
//                             : "Out of Stock"}
//                         </span>
//                       </div>
//                     </div>

//                     <p className="shop-product-description">
//                       {product.description || "Premium quality product"}
//                     </p>

//                     <span className="product-variation-count">
//                       +{product.variations.length} options
//                     </span>
//                     <div className="shop-product-price">
//                       {(() => {
//                         // step 1: check discountedPrice directly on product
//                         if (
//                           product.discountedPrice &&
//                           product.discountedPrice > 0
//                         ) {
//                           return (
//                             <>
//                               <span className="discounted">
//                                 Rs. {product.discountedPrice.toLocaleString()}
//                               </span>
//                               <span className="original">
//                                 Rs. {product.price?.toLocaleString()}
//                               </span>
//                             </>
//                           );
//                         }

//                         // step 2: if no discountedPrice, check normal price
//                         if (product.price && product.price > 0) {
//                           return (
//                             <span>Rs. {product.price.toLocaleString()}</span>
//                           );
//                         }

//                         // step 3: fallback → check variations
//                         if (
//                           product.hasVariations &&
//                           product.variations?.length > 0
//                         ) {
//                           const firstVar = product.variations[0];

//                           if (
//                             firstVar.discountedPrice &&
//                             firstVar.discountedPrice > 0
//                           ) {
//                             return (
//                               <>
//                                 <span className="discounted">
//                                   Rs.{" "}
//                                   {firstVar.discountedPrice.toLocaleString()}
//                                 </span>
//                                 <span className="original">
//                                   Rs. {firstVar.price?.toLocaleString()}
//                                 </span>
//                               </>
//                             );
//                           }

//                           if (firstVar.price && firstVar.price > 0) {
//                             return (
//                               <span>Rs. {firstVar.price.toLocaleString()}</span>
//                             );
//                           }
//                         }

//                         // step 4: if no price at all
//                         return <span>N/A</span>;
//                       })()}
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <div className="shop-no-products">
//               <h3>No products found</h3>
//               <p>Try adjusting your filters or search terms</p>
//               <button onClick={shop_resetFilters} className="shop-reset-btn">
//                 Reset Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Backdrop for mobile */}
//       {shop_isFilterOpen && (
//         <div className="shop-filter-backdrop" onClick={shop_toggleFilter}></div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import "../../styles/client/shop.css";
import { Filter, X, ChevronDown, ChevronRight, Search } from "lucide-react";
import SortDropdown from "../../components/client/SortDropdown";
import { Link, useLocation, useParams } from "react-router-dom";
import { Product } from "../../components/client/Product";
import {
  getCategories,
  getCategoryDataBySlug,
  getProductByCategory,
  getProductByCategoryIds,
  getProducts,
} from "../../api/products";
import { Spinner } from "../../components/client/Spinner";

// Helper function for slugify
const slugify = (text, options = {}) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

export default function Shop() {
  const { slug } = useParams();
  const { category, subcategory } = useParams();
  const isSubcategoryView = !!subcategory;
  const [shop_isFilterOpen, setShop_isFilterOpen] = useState(false);
  const [shop_sortOption, setShop_sortOption] = useState("price-low-to-high");
  const [shop_searchQuery, setShop_searchQuery] = useState("");
  const [shop_filters, setShop_filters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    categories: [],
  });

  // Products and Categories
  const [shop_productsData, setShop_productsData] = useState([]);
  const [shop_categoriesData, setShop_categoriesData] = useState([]);
  const [shop_selectedCategory, setShop_selectedCategory] = useState(null);
  const [shop_subCategories, setShop_subCategories] = useState([]);
  const [shop_organizedCategories, setShop_organizedCategories] = useState([]);
  const [shop_expandedCategories, setShop_expandedCategories] = useState({});

  const [categoryBySlug, setCategoryBySlug] = useState([]);
  const [categoriesPath, setCategoriesPath] = useState([]);
  const location = useLocation();

  // Add this state to track the currently selected variation image
  const [shop_selectedVariationImages, setShop_selectedVariationImages] =
    useState({});

  // Add this function to handle variation clicks
  const shop_handleVariationClick = (
    productId,
    variationIndex,
    variationImage
  ) => {
    setShop_selectedVariationImages((prev) => ({
      ...prev,
      [productId]: variationImage,
    }));
  };

  // Add this to get the current image for a product
  const shop_getCurrentImage = (product) => {
    const selectedImage = shop_selectedVariationImages[product._id];
    if (selectedImage) return selectedImage;
    return product.mainImages?.[0] || "/default-product.jpg";
  };

  // Spinner
  const [shop_showSpinner, setShop_showSpinner] = useState({
    state: false,
    message: "",
  });

  // Function to organize categories into a nested structure
  const organizeCategories = (categories) => {
    const categoryMap = {};

    // Map all categories by their _id
    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat, subcategories: [] };
    });

    const result = [];

    categories.forEach((cat) => {
      if (cat.parentId) {
        // If it has a parent, push it into parent's subcategories
        if (categoryMap[cat.parentId]) {
          categoryMap[cat.parentId].subcategories.push(categoryMap[cat._id]);
        }
      } else {
        // Top level category
        result.push(categoryMap[cat._id]);
      }
    });

    return result;
  };

  // Initial data fetch - categories only
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const categories = await getCategories();
        setShop_categoriesData(categories);
        setShop_organizedCategories(organizeCategories(categories));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchInitialData();
  }, []);

  // Main effect to handle URL changes and fetch appropriate data
  useEffect(() => {
    const fullSlug = location.pathname.replace("/shop/category/", "").trim();
    const isMainShopPage =
      !fullSlug ||
      fullSlug === "shop" ||
      fullSlug === "/" ||
      location.pathname === "/shop";

    async function fetchData() {
      try {
        setShop_showSpinner({ state: true, message: "Loading Products..." });

        if (isMainShopPage) {
          // Main shop page - show all products
          const products = await getProducts();
          setShop_productsData(products);

          // Reset category-specific states
          setCategoriesPath([]);
          setShop_selectedCategory(null);
          setShop_subCategories([]);
          setCategoryBySlug([]);
        } else {
          // Category page - fetch category data and products
          const [categoryData, productData] = await Promise.all([
            getCategoryDataBySlug(fullSlug),
            getProductByCategory(fullSlug),
          ]);

          // Set category info
          setCategoriesPath(categoryData.categoriesPath || []);
          const lastCategory =
            categoryData.categoriesPath[categoryData.categoriesPath.length - 1];
          setShop_selectedCategory(lastCategory);

          const subs = categoryData.allSubCategories[lastCategory.slug] || [];
          setShop_subCategories(subs);
          setCategoryBySlug(subs);

          // Set products
          setShop_productsData(productData.products || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        // If category fetch fails, fallback to all products
        if (!isMainShopPage) {
          try {
            const products = await getProducts();
            setShop_productsData(products);
            // Reset category states
            setCategoriesPath([]);
            setShop_selectedCategory(null);
            setShop_subCategories([]);
            setCategoryBySlug([]);
          } catch (fallbackError) {
            console.error("Fallback fetch also failed:", fallbackError);
          }
        }
      } finally {
        setShop_showSpinner({ state: false, message: "" });
      }
    }

    fetchData();
  }, [location.pathname]);

  // Handle additional category filters
  useEffect(() => {
    if (!shop_filters.categories.length) {
      return; // No additional filters to apply
    }

    async function fetchAdditionalProducts() {
      try {
        const res = await getProductByCategoryIds(shop_filters.categories);
        const additionalProducts = res.products || [];

        // Merge with existing products, avoiding duplicates
        setShop_productsData((prevProducts) => {
          const existingIds = new Set(prevProducts.map((p) => p._id));
          const newProducts = additionalProducts.filter(
            (p) => !existingIds.has(p._id)
          );
          return [...prevProducts, ...newProducts];
        });
      } catch (err) {
        console.error("Error fetching additional products:", err);
      }
    }

    fetchAdditionalProducts();
  }, [shop_filters.categories]);

  const CategoryItem = ({
    category,
    expandedCategories,
    handleToggle,
    handleFilter,
    filters,
  }) => {
    const isExpanded = !!expandedCategories[category._id];
    const hasSub = category.subcategories && category.subcategories.length > 0;
    const isSelected = filters.includes(category._id);

    return (
      <div className="shop-category-item">
        <div
          className={`shop-category-toggle ${!hasSub ? "leaf-category" : ""} ${
            isSelected ? "selected" : ""
          }`}
          onClick={
            hasSub
              ? () => handleToggle(category._id)
              : () => handleFilter(category._id)
          }
        >
          <span className="shop-category-name">{category.name}</span>

          {hasSub && (
            <div className="shop-toggle-icon">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          )}
        </div>

        {hasSub && isExpanded && (
          <div className="shop-subcategory-list">
            {category.subcategories.map((sub) => (
              <CategoryItem
                key={sub._id}
                category={sub}
                expandedCategories={expandedCategories}
                handleToggle={handleToggle}
                handleFilter={handleFilter}
                filters={filters}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const shop_toggleFilter = () => setShop_isFilterOpen(!shop_isFilterOpen);

  const shop_handleToggleExpand = (categoryId) => {
    setShop_expandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId], // toggle true/false
    }));
  };

  const shop_handleCategoryFilter = (categoryId) => {
    setShop_filters((prev) => {
      const isSelected = prev.categories.includes(categoryId);
      if (isSelected) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== categoryId),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, categoryId],
        };
      }
    });
  };

  // const shop_applyFilters = (product) => {
  //   const getProductPrice = (p) => {
  //     if (p.discountedPrice && p.discountedPrice > 0) return p.discountedPrice;
  //     if (p.price && p.price > 0) return p.price;
  //     if (p.variations?.length > 0) {
  //       const firstVar = p.variations[0];
  //       return firstVar.discountedPrice > 0
  //         ? firstVar.discountedPrice
  //         : firstVar.price;
  //     }
  //     return 0;
  //   };

  //   const productPrice = getProductPrice(product);
  //   const isPriceMatch =
  //     productPrice >= shop_filters.minPrice &&
  //     productPrice <= shop_filters.maxPrice;

  //   const isSearchMatch =
  //     !shop_searchQuery ||
  //     product.name.toLowerCase().includes(shop_searchQuery.toLowerCase());

  //   return isPriceMatch && isSearchMatch;
  // };

  const shop_applyFilters = (product) => {
    const getProductPrice = (p) => {
      if (p.discountedPrice && p.discountedPrice > 0) return p.discountedPrice;
      if (p.price && p.price > 0) return p.price;
      if (p.variations?.length > 0) {
        const firstVar = p.variations[0];
        return firstVar.discountedPrice > 0
          ? firstVar.discountedPrice
          : firstVar.price;
      }
      return 0;
    };

    const productPrice = getProductPrice(product);
    const isPriceMatch =
      productPrice >= shop_filters.minPrice &&
      productPrice <= shop_filters.maxPrice;

    const isSearchMatch =
      !shop_searchQuery ||
      product.name.toLowerCase().includes(shop_searchQuery.toLowerCase());

    // Add category filtering logic
    const isCategoryMatch =
      shop_filters.categories.length === 0 ||
      shop_filters.categories.includes(product.category);

    return isPriceMatch && isSearchMatch && isCategoryMatch;
  };
  const shop_sortedAndFilteredProducts = [...shop_productsData]
    .filter(shop_applyFilters)
    .sort((a, b) => {
      const getPriceForSort = (product) => {
        if (product.discountedPrice > 0) return product.discountedPrice;
        if (product.price > 0) return product.price;
        if (product.variations?.length > 0) {
          const firstVar = product.variations[0];
          return firstVar.discountedPrice > 0
            ? firstVar.discountedPrice
            : firstVar.price;
        }
        return 0;
      };

      switch (shop_sortOption) {
        case "price-low-to-high":
          return getPriceForSort(a) - getPriceForSort(b);
        case "price-high-to-low":
          return getPriceForSort(b) - getPriceForSort(a);
        case "name-a-z":
          return a.name.localeCompare(b.name);
        case "name-z-a":
          return b.name.localeCompare(a.name);
        case "old-new":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "new-old":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  // Set proper min/max prices based on actual product data
  useEffect(() => {
    if (shop_productsData.length > 0) {
      const prices = shop_productsData
        .map((product) => {
          if (product.discountedPrice > 0) return product.discountedPrice;
          if (product.price > 0) return product.price;
          if (product.variations?.length > 0) {
            const firstVar = product.variations[0];
            return firstVar.discountedPrice > 0
              ? firstVar.discountedPrice
              : firstVar.price;
          }
          return 0;
        })
        .filter((price) => price > 0);

      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setShop_filters((prev) => ({
          ...prev,
          minPrice: Math.max(0, Math.floor(minPrice)),
          maxPrice: Math.ceil(maxPrice),
        }));
      }
    }
  }, [shop_productsData]);

  const shop_removeCategory = (categoryId) => {
    setShop_filters((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== categoryId),
    }));
  };

  const shop_resetFilters = () => {
    setShop_filters({ minPrice: 0, maxPrice: 5000, categories: [] });
    setShop_searchQuery("");
  };

  return (
    <div className="shop-page-wrapper">
      {shop_showSpinner.state && <Spinner message={shop_showSpinner.message} />}

      {/* Header Section */}
      {categoryBySlug.length > 0 && (
        <div className="shop-header-section">
          <div className="shop-header-content">
            {categoryBySlug.length > 0 ? (
              <div className="luxury-subcategories-showcase">
                <div className="luxury-subcategories-grid">
                  {categoryBySlug.map((subcat, ind) => (
                    <Link
                      key={subcat._id || ind}
                      to={`${location.pathname}/${slugify(subcat.name)}`}
                      className="luxury-subcat-item"
                    >
                      <div className="luxury-subcat-image">
                        <img
                          src={subcat.image || "/default-category.jpg"}
                          alt={subcat.name}
                          onError={(e) =>
                            (e.target.src = "/default-category.jpg")
                          }
                        />
                        <div className="luxury-subcat-overlay"></div>
                      </div>
                      <span className="luxury-subcat-name">{subcat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="shop-subcategories-section">
        <nav className="shop-breadcrumb">
          <Link to="/" className="shop-breadcrumb-item">
            Home
          </Link>
          <span className="shop-breadcrumb-separator">›</span>
          <Link to="/shop" className="shop-breadcrumb-item">
            Shop
          </Link>

          {/* Use categoriesPath from your API response */}
          {categoriesPath &&
            categoriesPath.map((category, index) => {
              const pathUpToHere = categoriesPath
                .slice(0, index + 1)
                .map((cat) => slugify(cat.name))
                .join("/");
              const isLast = index === categoriesPath.length - 1;

              return (
                <React.Fragment key={category._id}>
                  <span className="shop-breadcrumb-separator">›</span>
                  {isLast ? (
                    <span className="shop-breadcrumb-item current">
                      {category.name}
                    </span>
                  ) : (
                    <Link
                      to={`/shop/category/${pathUpToHere}`}
                      className="shop-breadcrumb-item"
                    >
                      {category.name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
        </nav>
      </div>

      {/* Controls Bar */}
      <div className="shop-controls-bar">
        <div className="shop-controls-left">
          <button className="shop-filter-toggle" onClick={shop_toggleFilter}>
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <div className="shop-results-count">
            {shop_sortedAndFilteredProducts.length} items
          </div>
        </div>

        <div className="shop-controls-right">
          <div className="shop-sort-wrapper">
            <label htmlFor="sort" className="shop-sort-label">
              Sort by
            </label>
            <SortDropdown
              sortOption={shop_sortOption}
              setSortOption={setShop_sortOption}
            />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(shop_filters.categories.length > 0 || shop_searchQuery) && (
        <div className="shop-active-filters">
          <div className="shop-filter-tags">
            {shop_filters.categories.map((catId) => (
              <span
                key={catId}
                className="shop-filter-tag"
                onClick={() => shop_removeCategory(catId)}
              >
                {shop_categoriesData.find((cat) => cat._id === catId)?.name ||
                  "Unknown"}
                <X size={12} />
              </span>
            ))}
            {shop_searchQuery && (
              <span
                className="shop-filter-tag"
                onClick={() => setShop_searchQuery("")}
              >
                "{shop_searchQuery}"
                <X size={12} />
              </span>
            )}
          </div>
          <button className="shop-clear-filters" onClick={shop_resetFilters}>
            Clear All
          </button>
        </div>
      )}

      <div className="shop-main-container">
        {/* Filter Sidebar */}
        <div
          className={`shop-filter-sidebar ${shop_isFilterOpen ? "open" : ""}`}
        >
          <div className="shop-filter-header">
            <h3>Filters</h3>
            <button onClick={shop_toggleFilter} className="shop-close-filter">
              <X size={20} />
            </button>
          </div>

          <div className="shop-filter-content">
            {/* Price Range */}
            <div className="shop-filter-group">
              <h4>Price Range</h4>
              <div className="shop-price-inputs">
                <div className="shop-price-input-group">
                  <label>Min</label>
                  <input
                    type="number"
                    value={shop_filters.minPrice}
                    onChange={(e) =>
                      setShop_filters((prev) => ({
                        ...prev,
                        minPrice: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="shop-price-input"
                  />
                </div>
                <div className="shop-price-input-group">
                  <label>Max</label>
                  <input
                    type="number"
                    value={shop_filters.maxPrice}
                    onChange={(e) =>
                      setShop_filters((prev) => ({
                        ...prev,
                        maxPrice: parseInt(e.target.value) || 5000,
                      }))
                    }
                    className="shop-price-input"
                  />
                </div>
              </div>
              <div className="shop-price-range">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={shop_filters.minPrice}
                  onChange={(e) =>
                    setShop_filters((prev) => ({
                      ...prev,
                      minPrice: Math.min(
                        parseInt(e.target.value),
                        prev.maxPrice
                      ),
                    }))
                  }
                  className="shop-range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={shop_filters.maxPrice}
                  onChange={(e) =>
                    setShop_filters((prev) => ({
                      ...prev,
                      maxPrice: Math.max(
                        parseInt(e.target.value),
                        prev.minPrice
                      ),
                    }))
                  }
                  className="shop-range-slider"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="shop-filter-group">
              <h4>Categories</h4>
              <div className="shop-category-list">
                {shop_organizedCategories.map((parent) => (
                  <CategoryItem
                    key={parent._id}
                    category={parent}
                    expandedCategories={shop_expandedCategories}
                    handleToggle={shop_handleToggleExpand}
                    handleFilter={shop_handleCategoryFilter}
                    filters={shop_filters.categories}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="shop-products-container">
          {shop_sortedAndFilteredProducts.length > 0 ? (
            <div className="shop-products-grid">
              {shop_sortedAndFilteredProducts.map((product) => (
                <Link
                  to={`/product/${product.slug}`}
                  key={product._id}
                  className="shop-product-card"
                >
                  <div className="shop-product-image-container">
                    <img
                      src={shop_getCurrentImage(product)}
                      alt={product.name}
                      className="shop-product-image"
                    />
                    <div className="shop-product-overlay"></div>
                  </div>

                  <div className="shop-product-info">
                    <div className="shop-product-header">
                      <h3 className="shop-product-name">{product.name}</h3>
                    </div>

                    <p className="shop-product-description">
                      {product.description || "Premium quality product"}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* <span className="product-variation-count">
                        {product.variations.length > 0
                          ? `+${product.variations.length} variations`
                          : null}
                      </span> */}
                      <div className="shop-product-stock">
                        <div
                          className={`shop-stock-dot ${
                            product.inStock !== false ? "in-stock" : "out-stock"
                          }`}
                        ></div>
                        <span>
                          {product.inStock !== false
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    <div className="shop-product-price">
                      {(() => {
                        // step 1: check discountedPrice directly on product
                        if (
                          product.discountedPrice &&
                          product.discountedPrice > 0
                        ) {
                          return (
                            <>
                              <span className="discounted">
                                Rs. {product.discountedPrice.toLocaleString()}
                              </span>
                              <span className="original">
                                Rs. {product.price?.toLocaleString()}
                              </span>
                            </>
                          );
                        }

                        // step 2: if no discountedPrice, check normal price
                        if (product.price && product.price > 0) {
                          return (
                            <span>Rs. {product.price.toLocaleString()}</span>
                          );
                        }

                        // step 3: fallback → check variations
                        if (
                          product.hasVariations &&
                          product.variations?.length > 0
                        ) {
                          const firstVar = product.variations[0];

                          if (
                            firstVar.discountedPrice &&
                            firstVar.discountedPrice > 0
                          ) {
                            return (
                              <>
                                <span className="discounted">
                                  Rs.{" "}
                                  {firstVar.discountedPrice.toLocaleString()}
                                </span>
                                <span className="original">
                                  Rs. {firstVar.price?.toLocaleString()}
                                </span>
                              </>
                            );
                          }

                          if (firstVar.price && firstVar.price > 0) {
                            return (
                              <span>Rs. {firstVar.price.toLocaleString()}</span>
                            );
                          }
                        }

                        // step 4: if no price at all
                        return <span>N/A</span>;
                      })()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="shop-no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={shop_resetFilters} className="shop-reset-btn">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {shop_isFilterOpen && (
        <div className="shop-filter-backdrop" onClick={shop_toggleFilter}></div>
      )}
    </div>
  );
}
