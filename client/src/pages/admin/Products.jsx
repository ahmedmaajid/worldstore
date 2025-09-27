import React, { useState, useCallback, useEffect } from "react";
import {
  Plus,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Info,
  Folder,
  FolderOpen,
} from "lucide-react";
import {
  addProduct,
  getCategories,
  getProducts,
  updateProduct,
} from "../../api/admin";
import Variation from "../../components/admin/Variation";
import { AlertDialog } from "../../components/client/AlertDialog";
import { AdminProducts } from "../../components/admin/AdminProducts";
import { Spinner } from "../../components/client/Spinner";

const buildCategoryTree = (categories) => {
  const categoryMap = new Map();
  const rootCategories = [];

  categories.forEach((cat) => {
    categoryMap.set(cat._id, { ...cat, children: [] });
  });

  categoryMap.forEach((cat) => {
    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.children.push(cat);
      }
    } else {
      rootCategories.push(cat);
    }
  });

  return rootCategories;
};

// Category Tree Component
const CategoryTree = ({
  categories,
  selectedCategory,
  onSelectCategory,
  level = 0,
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  return (
    <div className="category-tree">
      {categories.map((category) => (
        <div key={category._id} className="category-node">
          <div
            className={`category-item ${
              selectedCategory?._id === category._id ? "selected" : ""
            }`}
            style={{ paddingLeft: `${level * 1.5}rem` }}
          >
            {category.children && category.children.length > 0 && (
              <button
                type="button"
                className="expand-btn"
                onClick={() => toggleExpanded(category._id)}
              >
                {expandedNodes.has(category._id) ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            )}
            <div className="category-icon">
              {category.children && category.children.length > 0 ? (
                expandedNodes.has(category._id) ? (
                  <FolderOpen size={16} />
                ) : (
                  <Folder size={16} />
                )
              ) : (
                <div className="category-dot"></div>
              )}
            </div>
            <span
              className="category-name"
              onClick={() => onSelectCategory(category)}
            >
              {category.name}
            </span>
          </div>
          {category.children &&
            category.children.length > 0 &&
            expandedNodes.has(category._id) && (
              <CategoryTree
                categories={category.children}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
                level={level + 1}
              />
            )}
        </div>
      ))}
    </div>
  );
};

export default function LuxuryProductManager() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({ main: null, sub: [] });

  const [createdCombos, setCreatedCombos] = useState([]);
  const [variationTypes, setVariationTypes] = useState([]);
  // const [hasVariations, setHasVariations] = useState(false);

  const [openAlertDialog, setOpenAlertDialog] = useState({
    state: false,
    status: null,
    message: "",
  });

  const [showSpinner, setShowSpinner] = useState(false);

  const [products, setProducts] = useState([]);
  useEffect(() => {
    // This function will only run once
    async function fetchProducts() {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      console.log("Fetched products", fetchedProducts);
    }

    fetchProducts();
  }, []);

  const [formData, setFormData] = useState({
    combos: [],
    name: "",
    description: "",
    category: null,
    price: "",
    discountedPrice: "",
    stock: true,
    images: {
      main: null,
      sub: [],
    },
  });
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setShowSpinner(true);
  //   const data = new FormData();
  //   data.append("name", formData.name);
  //   data.append("description", formData.description);
  //   data.append("category", formData.category?._id || "");
  //   data.append("price", formData.price);
  //   data.append("discountedPrice", formData.discountedPrice);
  //   data.append("stock", formData.stock);

  //   // main image
  //   if (formData.images.main) {
  //     data.append("mainImage", formData.images.main);
  //   }

  //   // sub images
  //   formData.images.sub.forEach((file, i) => {
  //     data.append(`subImages`, file);
  //   });

  //   createdCombos.forEach((combo, idx) => {
  //     if (combo.image instanceof File) {
  //       data.append("variationImages", combo.image); // Correctly append to the `data` object
  //     }
  //   });
  //   formData.append("variations", JSON.stringify(createdCombos));

  //   data.append("variations", JSON.stringify(formData.combos));
  //   data.append("variationTypes", JSON.stringify(variationTypes));

  //   try {
  //     await addProduct(data);
  //     setShowSpinner(false);
  //     setOpenAlertDialog({
  //       state: true,
  //       status: "success",
  //       message: "Product added successfully!",
  //     });
  //     console.log("Product added!");
  //   } catch (err) {
  //     setShowSpinner(false);
  //     setOpenAlertDialog({ state: true, status: "error", message: err });
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category?._id || "");
    data.append("price", formData.price);
    data.append("discountedPrice", formData.discountedPrice);
    data.append("stock", formData.stock);

    // main image
    if (formData.images.main) {
      data.append("mainImage", formData.images.main);
    }

    // sub images
    formData.images.sub.forEach((file, i) => {
      data.append(`subImages`, file);
    });

    createdCombos.forEach((combo, idx) => {
      if (combo.image instanceof File) {
        data.append("variationImages", combo.image);
      }
    });

    // Fix: Change formData.append to data.append
    data.append("variations", JSON.stringify(createdCombos));

    data.append("variations", JSON.stringify(formData.combos));
    data.append("variationTypes", JSON.stringify(variationTypes));

    try {
      await addProduct(data);
      setShowSpinner(false);
      setOpenAlertDialog({
        state: true,
        status: "success",
        message: "Product added successfully!",
      });
      console.log("Product added!");
    } catch (err) {
      setShowSpinner(false);
      const msg =
        err.response?.data?.message || // API error message if available
        err.message || // generic JS error
        "Something went wrong"; // fallback

      setOpenAlertDialog({
        state: true,
        status: "error",
        message: msg,
      });

      console.error(err);
    }
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      combos: createdCombos,
    }));
  }, [createdCombos]);

  useEffect(() => {
    console.log(formData);
  }, [createdCombos, formData]);

  const [variations, setVariations] = useState([]);
  const [hasVariations, setHasVariations] = useState(false);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      const hierarchicalCategories = buildCategoryTree(categoriesData);
      setCategories(hierarchicalCategories);
    };
    fetchCategories();
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      category: null,
      price: "",
      discountedPrice: "",
      stock: true,
      images: {
        main: null,
        sub: [],
      },
    });
    setVariations([]);
    setHasVariations(false);
    setShowAddForm(false);
    setEditingProduct(null);
  }, []);

  const handleImageUpload = useCallback(
    (e, type, variationId = null) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);

        if (type === "main") {
          // 1. Save the FILE object for submission
          setFormData((prev) => ({
            ...prev,
            images: { ...prev.images, main: file },
          }));
          // 2. Save the URL for preview
          setImagePreviews((prev) => ({ ...prev, main: imageUrl }));
        } else if (type === "sub") {
          // 1. Save the FILE object for submission
          setFormData((prev) => ({
            ...prev,
            images: { ...prev.images, sub: [...prev.images.sub, file] },
          }));
          // 2. Save the URL for preview
          setImagePreviews((prev) => ({
            ...prev,
            sub: [...prev.sub, imageUrl],
          }));
        } else if (type === "variation") {
          // For variations, you'd update both the file and preview in the variations array
          setVariations(
            variations.map((variation) =>
              variation.id === variationId
                ? { ...variation, imageFile: file, imagePreview: imageUrl } // Store both
                : variation
            )
          );
        }
      }
    },
    [variations] // Add other state dependencies if needed
  );

  const removeSubImage = useCallback((index) => {
    // 1. Remove the FILE object from formData
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        sub: prev.images.sub.filter((_, i) => i !== index),
      },
    }));

    // 2. Remove the preview URL from imagePreviews
    setImagePreviews((prev) => ({
      ...prev,
      sub: prev.sub.filter((_, i) => i !== index),
    }));
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return (
            (b.price || b.variations?.[0]?.price) -
            (a.price || a.variations?.[0]?.price)
          );
        default:
          return 0;
      }
    });

  // const handleEdit = async (product) => {
  //   try {
  //     setShowAddForm(true);
  //     const fetchedSingleProduct = await getProducts(product._id);

  //     setEditingProduct(fetchedSingleProduct);

  //     // Prepare the new image previews state
  //     const newImagePreviews = {
  //       main: fetchedSingleProduct.mainImages[0],
  //       sub:
  //         fetchedSingleProduct.mainImages.length > 1
  //           ? fetchedSingleProduct.mainImages.slice(1)
  //           : [],
  //       // Map and create previews for variation images
  //       variations: fetchedSingleProduct.variations.map((variation) => ({
  //         id: variation._id,
  //         image: variation.image, // This is the URL from the database
  //       })),
  //     };

  //     // Update the imagePreviews state
  //     setImagePreviews(newImagePreviews);

  //     // Set form data with image URLs, not file objects
  //     setFormData({
  //       name: fetchedSingleProduct.name,
  //       description: fetchedSingleProduct.description,
  //       category: fetchedSingleProduct.category,
  //       price: fetchedSingleProduct.price,
  //       discountedPrice: fetchedSingleProduct.discountedPrice,
  //       stock: fetchedSingleProduct.stock,
  //       images: {
  //         main: fetchedSingleProduct.mainImages[0],
  //         sub:
  //           fetchedSingleProduct.mainImages.length > 1
  //             ? fetchedSingleProduct.mainImages.slice(1)
  //             : [],
  //       },
  //       combos: [],
  //     });

  //     if (
  //       fetchedSingleProduct.variations &&
  //       fetchedSingleProduct.variations.length > 0
  //     ) {
  //       setHasVariations(true);

  //       const extractedTypes = [
  //         ...new Set(
  //           fetchedSingleProduct.variations
  //             .map((v) => Object.keys(v.attributes))
  //             .flat()
  //         ),
  //       ];
  //       setVariationTypes(extractedTypes);

  //       // Populate the combos state with the fetched variations
  //       setCreatedCombos(
  //         fetchedSingleProduct.variations.map((variation) => ({
  //           ...variation,
  //           displayName: Object.values(variation.attributes).join(" / "),
  //           // The image URL is already in `variation.image`
  //           // You just need to make sure your Variation component uses it
  //         }))
  //       );
  //     } else {
  //       setHasVariations(false);
  //       setVariationTypes([]);
  //       setCreatedCombos([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching product for edit:", error);
  //     setOpenAlertDialog({
  //       state: true,
  //       status: "error",
  //       message: "Failed to load product for editing.",
  //     });
  //   }
  // };

  const handleEdit = async (product) => {
    try {
      setShowAddForm(true);
      const fetchedSingleProduct = await getProducts(product._id);

      setEditingProduct(fetchedSingleProduct);

      // Populate imagePreviews with URLs from the database.
      setImagePreviews({
        main: fetchedSingleProduct.mainImages[0],
        sub:
          fetchedSingleProduct.mainImages.length > 1
            ? fetchedSingleProduct.mainImages.slice(1)
            : [],
      });

      // Populate formData with existing URLs and relevant data.
      setFormData({
        name: fetchedSingleProduct.name,
        description: fetchedSingleProduct.description,
        category: fetchedSingleProduct.category,
        price: fetchedSingleProduct.price,
        discountedPrice: fetchedSingleProduct.discountedPrice,
        stock: fetchedSingleProduct.stock,
        images: {
          main: fetchedSingleProduct.mainImages[0],
          sub:
            fetchedSingleProduct.mainImages.length > 1
              ? fetchedSingleProduct.mainImages.slice(1)
              : [],
        },
        combos: [],
      });

      if (
        fetchedSingleProduct.variations &&
        fetchedSingleProduct.variations.length > 0
      ) {
        setHasVariations(true);

        const extractedTypes = [
          ...new Set(
            fetchedSingleProduct.variations
              .map((v) => Object.keys(v.attributes))
              .flat()
          ),
        ];
        setVariationTypes(extractedTypes);

        // Populate createdCombos with the full variation objects, including image URLs.
        setCreatedCombos(
          fetchedSingleProduct.variations.map((variation) => ({
            ...variation,
            displayName: Object.values(variation.attributes).join(" / "),
          }))
        );
      } else {
        setHasVariations(false);
        setVariationTypes([]);
        setCreatedCombos([]);
      }
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      setOpenAlertDialog({
        state: true,
        status: "error",
        message: "Failed to load product for editing.",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category?._id || "");
    data.append("price", formData.price);
    data.append("discountedPrice", formData.discountedPrice);
    data.append("stock", formData.stock);

    // Handle main image: Check if it's a new file or an existing URL
    if (formData.images.main instanceof File) {
      data.append("mainImage", formData.images.main);
    }

    // Handle sub images: Append only new file objects.
    formData.images.sub.forEach((file) => {
      if (file instanceof File) {
        data.append(`subImages`, file);
      }
    });

    const variationImagesToUpload = [];
    const updatedCombos = createdCombos.map((combo) => {
      let updatedCombo = { ...combo };

      if (combo.image instanceof File) {
        // It's a new file upload
        variationImagesToUpload.push(combo.image);
        updatedCombo.image = null; // Set image to null for the JSON data
        updatedCombo.isNewImage = true;
      } else if (typeof combo.image === "string") {
        // It's an existing image URL from the database
        updatedCombo.isNewImage = false;
      } else {
        // It's an empty object, meaning no image
        updatedCombo.image = null;
        updatedCombo.isNewImage = false;
      }

      return updatedCombo;
    });

    // Append new image files separately
    variationImagesToUpload.forEach((file) => {
      data.append(`variationImages`, file);
    });

    // Append the updated variations and other data as JSON
    data.append("variations", JSON.stringify(updatedCombos));
    data.append("variationTypes", JSON.stringify(variationTypes));

    try {
      await updateProduct(editingProduct._id, data);
      setShowSpinner(false);
      setOpenAlertDialog({
        state: true,
        status: "success",
        message: "Product updated successfully!",
      });
      console.log("Product updated!");
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      resetForm();
    } catch (err) {
      setShowSpinner(false);
      setOpenAlertDialog({ state: true, status: "error", message: err });
      console.error(err);
    }
  };

  if (showAddForm) {
    return (
      <>
        {showSpinner && <Spinner />}
        <AlertDialog
          isOpen={openAlertDialog.state}
          type={openAlertDialog.status} // you can add type to your state too
          message={openAlertDialog.message}
          onClose={() => setOpenAlertDialog({ state: false, message: "" })}
        />
        <div className="luxury-product-form-container">
          <div className="luxury-form-header">
            <button onClick={resetForm} className="luxury-back-btn">
              <ArrowLeft size={20} />
              Back to Products
            </button>
            <div className="luxury-form-title-section">
              <h1>{editingProduct ? "Edit Product" : "Create New Product"}</h1>
              <p>Craft your luxury product with precision and elegance</p>
            </div>
          </div>

          <div className="luxury-form-content">
            <div className="luxury-form-section">
              <h2>Product Information</h2>
              <div className="luxury-form-grid">
                <div className="luxury-form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Cashmere Signature Coat"
                  />
                  <span className="luxury-form-helper">
                    Choose a distinctive, memorable name
                  </span>
                </div>
                {!hasVariations && (
                  <>
                    <div className="luxury-form-group">
                      <label>Price (LKR)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="2450.00"
                      />
                      <span className="luxury-form-helper">
                        Set your premium price point
                      </span>
                    </div>
                    <div className="luxury-form-group">
                      <label>Discounted Price (LKR)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.discountedPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountedPrice: e.target.value,
                          })
                        }
                        placeholder="Optional"
                      />
                      <span className="luxury-form-helper">
                        Set a discounted price for promotions
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="luxury-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the craftsmanship, materials, and unique features..."
                  rows={3}
                />
                <span className="luxury-form-helper">
                  Highlight premium materials and artisanal details
                </span>
              </div>

              <div className="luxury-form-group">
                <label>Category Selection</label>
                <div className="luxury-category-selector">
                  {formData.category && (
                    <div className="selected-category">
                      <span>Selected: {formData.category.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, category: null })
                        }
                        className="clear-selection"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="category-tree-container">
                    <CategoryTree
                      categories={categories}
                      selectedCategory={formData.category}
                      onSelectCategory={(category) =>
                        setFormData({ ...formData, category })
                      }
                    />
                  </div>
                </div>
                <span className="luxury-form-helper">
                  Select the most specific category for your product
                </span>
              </div>

              <div className="luxury-form-group">
                <label>In Stock</label>
                <label className="luxury-toggle-label">
                  <input
                    type="checkbox"
                    required
                    checked={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.checked })
                    }
                  />
                  <span className="luxury-toggle-switch"></span>
                  Product is available for purchase
                </label>
              </div>
            </div>

            <div className="luxury-form-section">
              <h2>Product Images</h2>

              <div className="luxury-form-group">
                <label>Main Product Image</label>
                {formData.images.main ? (
                  <div className="luxury-main-image-preview">
                    <img src={imagePreviews.main} alt="Main preview" />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: { ...prev.images, main: null },
                        }))
                      }
                      className="luxury-remove-image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="luxury-image-upload-area"
                    onClick={() =>
                      document.getElementById("main-image-upload").click()
                    }
                  >
                    <input
                      type="file"
                      required
                      id="main-image-upload"
                      style={{ display: "none" }}
                      name="mainImage"
                      onChange={(e) => handleImageUpload(e, "main")}
                    />
                    <div className="luxury-upload-content">
                      <ImageIcon size={32} />
                      <span>Upload main product image</span>
                      <small>Recommended: 1000x1000px, high quality</small>
                    </div>
                  </div>
                )}
              </div>

              <div className="luxury-form-group">
                <label>Additional Images</label>
                <div className="luxury-sub-images-grid">
                  {formData.images.sub.map((image, index) => (
                    <div key={index} className="luxury-sub-image-item">
                      <img src={image} alt={`Sub image ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeSubImage(index)}
                        className="luxury-remove-image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("sub-image-upload").click()
                    }
                    className="luxury-add-sub-image"
                  >
                    <input
                      type="file"
                      id="sub-image-upload"
                      name="subImages"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageUpload(e, "sub")}
                    />
                    <Plus size={24} />
                    <span>Add Image</span>
                  </button>
                </div>
                <span className="luxury-form-helper">
                  Add multiple angles and detail shots
                </span>
              </div>
            </div>

            <div className="luxury-form-section">
              <Variation
                createdCombos={createdCombos}
                setCreatedCombos={setCreatedCombos}
                variationTypes={variationTypes}
                setVariationTypes={setVariationTypes}
                hasVariations={hasVariations}
                variations={variations} // <-- MISSING
                setVariations={setVariations}
                setHasVariations={setHasVariations}
              />
            </div>

            <div className="luxury-form-actions">
              <button onClick={resetForm} className="luxury-btn-secondary">
                Cancel
              </button>
              <button
                onClick={editingProduct ? handleUpdate : handleSubmit}
                className="luxury-btn-primary"
              >
                <Save size={16} />
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>

          <style jsx>{`
            @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&display=swap");

            .luxury-product-form-container {
              min-height: 100vh;
              background: #ffffff;
              font-family: "Manrope", sans-serif;
              color: #000000;
            }

            .luxury-form-header {
              background: #000000;
              color: #ffffff;
              padding: 2rem;
              position: relative;
            }

            .luxury-back-btn {
              background: transparent;
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: #ffffff;
              padding: 0.75rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.875rem;
              font-weight: 400;
              margin-bottom: 1.5rem;
              transition: all 0.2s ease;
            }

            .luxury-back-btn:hover {
              background: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.3);
            }

            .luxury-form-title-section h1 {
              font-size: 2.5rem;
              font-weight: 200;
              margin: 0 0 0.5rem 0;
              letter-spacing: -0.02em;
            }

            .luxury-form-title-section p {
              font-size: 1rem;
              font-weight: 300;
              color: rgba(255, 255, 255, 0.7);
              margin: 0;
            }

            .luxury-form-content {
              padding: 3rem;
              max-width: 1200px;
              margin: 0 auto;
            }

            .luxury-form-section {
              margin-bottom: 4rem;
            }

            .luxury-form-section h2 {
              font-size: 1.5rem;
              font-weight: 400;
              color: #000000;
              margin: 0 0 2rem 0;
              padding-bottom: 1rem;
              border-bottom: 1px solid #f0f0f0;
            }

            .luxury-form-section h3 {
              font-size: 1.25rem;
              font-weight: 500;
              color: #000000;
              margin: 0 0 1.5rem 0;
            }

            .luxury-form-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
            }

            .luxury-form-group {
              margin-bottom: 1.5rem;
            }

            .luxury-form-group label {
              display: flex;
              font-size: 0.875rem;
              font-weight: 500;
              color: #000000;
              margin-bottom: 0.5rem;
              letter-spacing: 0.01em;
            }

            .luxury-form-group input,
            .luxury-form-group select,
            .luxury-form-group textarea {
              width: 100%;
              padding: 0.875rem 1rem;
              border: 1px solid #e0e0e0;
              background: #ffffff;
              font-size: 0.875rem;
              font-family: inherit;
              color: #000000;
              transition: all 0.2s ease;
              border-radius: 2px;
            }

            .luxury-form-group input:focus,
            .luxury-form-group select:focus,
            .luxury-form-group textarea:focus {
              outline: none;
              border-color: #000000;
            }

            .luxury-form-group textarea {
              resize: vertical;
              min-height: 100px;
            }

            .luxury-form-helper {
              display: block;
              font-size: 0.75rem;
              color: #666666;
              margin-top: 0.25rem;
              font-weight: 300;
            }

            /* Category Tree Styles */
            .luxury-category-selector {
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              background: #ffffff;
            }

            .selected-category {
              padding: 0.75rem 1rem;
              background: #f8f8f8;
              border-bottom: 1px solid #e0e0e0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 0.875rem;
              font-weight: 500;
            }

            .clear-selection {
              background: none;
              border: none;
              cursor: pointer;
              color: #666666;
              padding: 4px;
              border-radius: 2px;
            }

            .clear-selection:hover {
              background: #e0e0e0;
            }

            .category-tree-container {
              max-height: 300px;
              overflow-y: auto;
              padding: 0.5rem 0;
            }

            .category-tree {
              font-size: 0.875rem;
            }

            .category-node {
              margin: 0;
            }

            .category-item {
              display: flex;
              align-items: center;
              padding: 0.5rem 1rem;
              cursor: pointer;
              transition: background 0.2s ease;
              min-height: 36px;
            }

            .category-item:hover {
              background: #f8f8f8;
            }

            .category-item.selected {
              background: #000000;
              color: #ffffff;
            }

            .expand-btn {
              background: none;
              border: none;
              cursor: pointer;
              padding: 2px;
              margin-right: 4px;
              color: #666666;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
            }

            .category-icon {
              margin-right: 8px;
              display: flex;
              align-items: center;
              color: #666666;
            }

            .category-dot {
              width: 4px;
              height: 4px;
              background: #cccccc;
              border-radius: 50%;
            }

            .category-name {
              flex: 1;
              user-select: none;
            }

            /* Image Upload Styles */
            .luxury-image-upload-area {
              border: 2px dashed #e0e0e0;
              border-radius: 4px;
              padding: 3rem 2rem;
              text-align: center;
              cursor: pointer;
              transition: border-color 0.2s ease;
              background: #fafafa;
            }

            .luxury-image-upload-area:hover {
              border-color: #cccccc;
              background: #f5f5f5;
            }

            .luxury-upload-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.75rem;
              color: #666666;
            }

            .luxury-upload-content span {
              font-size: 0.875rem;
              font-weight: 400;
            }

            .luxury-upload-content small {
              font-size: 0.75rem;
              color: #999999;
            }

            .luxury-main-image-preview {
              position: relative;
              width: 100%;
              height: 250px;
              border-radius: 4px;
              overflow: hidden;
              border: 1px solid #e0e0e0;
            }
            .luxury-main-image-preview img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }

            /* Sub Images Grid */
            .luxury-sub-images-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              gap: 1rem;
              margin-top: 0.5rem;
            }

            .luxury-sub-image-item {
              position: relative;
              aspect-ratio: 1;
              border-radius: 4px;
              overflow: hidden;
              border: 1px solid #e0e0e0;
            }

            .luxury-sub-image-item img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .luxury-remove-image {
              position: absolute;
              top: 4px;
              right: 4px;
              background: rgba(0, 0, 0, 0.7);
              color: #ffffff;
              border: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.2s ease;
            }

            .luxury-sub-image-item:hover .luxury-remove-image,
            .luxury-main-image-preview:hover .luxury-remove-image {
              opacity: 1;
            }

            .luxury-add-sub-image {
              aspect-ratio: 1;
              background: #f8f8f8;
              border: 2px dashed #cccccc;
              border-radius: 4px;
              cursor: pointer;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              color: #666666;
              transition: all 0.2s ease;
            }

            .luxury-add-sub-image:hover {
              border-color: #999999;
              background: #f0f0f0;
            }

            .luxury-add-sub-image span {
              font-size: 0.75rem;
              font-weight: 500;
            }

            /* Toggle Styles */
            .luxury-variation-toggle {
              background: #fafafa;
              padding: 2rem;
              border-radius: 4px;
              margin-bottom: 2rem;
            }

            .luxury-toggle-label {
              display: flex;
              align-items: center;
              gap: 1rem;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
              margin-bottom: 1rem;
            }

            .lv-file-upload {
              display: flex;
              align-items: center;
              gap: 1rem;
            }

            /* Hide the default file input */
            .lv-file-upload input[type="file"] {
              display: none;
            }

            .lv-file-label {
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem 1rem;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              background-color: #f8f8f8;
              color: #000000;
              font-size: 0.875rem;
              font-weight: 500;
              transition: all 0.2s ease;
            }

            .lv-file-label:hover {
              background-color: #e0e0e0;
            }

            .luxury-toggle-label input[type="checkbox"] {
              display: none;
            }

            .luxury-toggle-switch {
              width: 56px;
              height: 28px;
              background: #e0e0e0;
              border-radius: 14px;
              position: relative;
              transition: background 0.2s ease;
            }

            .luxury-toggle-switch::before {
              content: "";
              position: absolute;
              top: 2px;
              left: 2px;
              width: 24px;
              height: 24px;
              background: #ffffff;
              border-radius: 50%;
              transition: transform 0.2s ease;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .luxury-toggle-label
              input[type="checkbox"]:checked
              + .luxury-toggle-switch {
              background: #000000;
            }

            .luxury-toggle-label
              input[type="checkbox"]:checked
              + .luxury-toggle-switch::before {
              transform: translateX(28px);
            }

            /* Small Toggle for Variations */
            .luxury-toggle-label-small {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              cursor: pointer;
              font-size: 0.75rem;
              font-weight: 400;
            }

            .luxury-toggle-label-small input[type="checkbox"] {
              display: none;
            }

            .luxury-toggle-switch-small {
              width: 40px;
              height: 20px;
              background: #e0e0e0;
              border-radius: 10px;
              position: relative;
              transition: background 0.2s ease;
            }

            .luxury-toggle-switch-small::before {
              content: "";
              position: absolute;
              top: 2px;
              left: 2px;
              width: 16px;
              height: 16px;
              background: #ffffff;
              border-radius: 50%;
              transition: transform 0.2s ease;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }

            .luxury-toggle-label-small
              input[type="checkbox"]:checked
              + .luxury-toggle-switch-small {
              background: #000000;
            }

            .luxury-toggle-label-small
              input[type="checkbox"]:checked
              + .luxury-toggle-switch-small::before {
              transform: translateX(20px);
            }

            .luxury-toggle-info {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              color: #666666;
              font-size: 0.75rem;
            }

            /* Variations Section */
            .luxury-variations-section {
              margin-bottom: 2rem;
            }

            .luxury-section-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1.5rem;
            }

            .luxury-add-btn-small {
              background: #000000;
              color: #ffffff;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 2px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.75rem;
              font-weight: 500;
              transition: background 0.2s ease;
            }

            .luxury-add-btn-small:hover {
              background: #333333;
            }

            .luxury-variation-type {
              background: #ffffff;
              border: 1px solid #f0f0f0;
              border-radius: 4px;
              padding: 1.5rem;
              margin-bottom: 1rem;
            }

            .luxury-variation-header {
              display: flex;
              align-items: flex-start;
              gap: 1rem;
            }

            .luxury-variation-number {
              width: 28px;
              height: 28px;
              background: #000000;
              color: #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.75rem;
              font-weight: 600;
              flex-shrink: 0;
              margin-top: 0.5rem;
            }

            .luxury-variation-inputs {
              flex: 1;
              display: grid;
              grid-template-columns: 1fr 2fr;
              gap: 1rem;
            }

            .luxury-remove-btn {
              background: transparent;
              border: none;
              color: #cc0000;
              cursor: pointer;
              padding: 0.5rem;
              border-radius: 2px;
              transition: background 0.2s ease;
            }

            .luxury-remove-btn:hover {
              background: rgba(204, 0, 0, 0.1);
            }

            /* Variations Grid */
            .luxury-combinations-section {
              background: #fafafa;
              padding: 2rem;
              border-radius: 4px;
            }

            .luxury-combinations-count {
              background: #000000;
              color: #ffffff;
              padding: 0.25rem 0.75rem;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 500;
            }

            .luxury-variations-grid {
              display: grid;
              gap: 1.5rem;
              margin-top: 1.5rem;
            }

            .luxury-variation-card {
              background: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              padding: 1.5rem;
            }

            .luxury-variation-header h4 {
              font-size: 1rem;
              font-weight: 500;
              color: #000000;
              margin: 0 0 0.25rem 0;
            }

            .luxury-variation-type {
              font-size: 0.75rem;
              color: #666666;
              background: #f0f0f0;
              padding: 0.25rem 0.5rem;
              border-radius: 12px;
              display: inline-block;
            }

            .luxury-variation-fields {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 1rem;
              margin: 1rem 0;
            }

            .luxury-variation-image {
              margin-top: 1rem;
            }

            .luxury-variation-image label {
              font-size: 0.875rem;
              font-weight: 500;
              color: #000000;
              margin-bottom: 0.75rem;
              display: block;
            }

            .luxury-variation-image-preview {
              position: relative;
              width: 50px;
              height: 50px;
              border-radius: 4px;
              overflow: hidden;
              border: 1px solid #e0e0e0;
            }

            .luxury-variation-image-preview img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }

            .luxury-add-variation-image {
              width: 80px;
              height: 80px;
              background: #f8f8f8;
              border: 2px dashed #cccccc;
              border-radius: 4px;
              cursor: pointer;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #666666;
              transition: all 0.2s ease;
              gap: 0.25rem;
              font-size: 0.75rem;
            }

            .luxury-add-variation-image:hover {
              border-color: #999999;
              background: #f0f0f0;
            }

            /* Form Actions */
            .luxury-form-actions {
              display: flex;
              justify-content: flex-end;
              gap: 1rem;
              padding-top: 2rem;
              border-top: 1px solid #f0f0f0;
            }

            .luxury-btn-primary,
            .luxury-btn-secondary {
              padding: 0.875rem 2rem;
              font-size: 0.875rem;
              font-weight: 500;
              border: none;
              border-radius: 2px;
              cursor: pointer;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            .luxury-btn-primary {
              background: #000000;
              color: #ffffff;
            }

            .luxury-btn-primary:hover {
              background: #333333;
            }

            .luxury-btn-secondary {
              background: transparent;
              color: #666666;
              border: 1px solid #e0e0e0;
            }

            .luxury-btn-secondary:hover {
              background: #f8f8f8;
              color: #000000;
            }

            @media (max-width: 768px) {
              .luxury-form-content {
                padding: 2rem 1rem;
              }

              .luxury-form-grid,
              .luxury-variation-inputs,
              .luxury-variation-fields {
                grid-template-columns: 1fr;
                gap: 1rem;
              }

              .luxury-form-header {
                padding: 1.5rem;
              }

              .luxury-form-title-section h1 {
                font-size: 2rem;
              }

              .luxury-variation-header {
                flex-direction: column;
                gap: 1rem;
              }

              .luxury-variation-inputs {
                grid-template-columns: 1fr;
              }

              .luxury-sub-images-grid {
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
              }

              .luxury-form-actions {
                flex-direction: column;
              }
            }
          `}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <AlertDialog
        isOpen={openAlertDialog.state}
        type={openAlertDialog.status} // you can add type to your state too
        message={openAlertDialog.message}
        onClose={() => setOpenAlertDialog({ state: false, message: "" })}
      />
      <div className="luxury-products-page">
        <div className="luxury-page-header">
          <div className="luxury-header-content">
            <h1>Manage Products</h1>
            <p>Curate your luxury collection with precision and artistry</p>
          </div>
        </div>

        <div className="luxury-filters-section">
          <div className="luxury-search-container">
            <Search size={18} className="luxury-search-icon" />
            <input
              type="text"
              placeholder="Search your collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="luxury-search-input"
            />
          </div>
          <div className="luxury-sort-container">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="luxury-sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
            <ChevronDown size={16} className="luxury-select-arrow" />
          </div>
        </div>

        <div className="luxury-content-card">
          <div className="luxury-card-header">
            <div>
              <h2>Collection Overview</h2>
              <p>{products.length} products in collection</p>
            </div>
            <button
              className="luxury-create-btn"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              Create Product
            </button>
          </div>
        </div>
        <AdminProducts
          handleEdit={handleEdit}
          filteredProducts={filteredProducts}
          setProducts={setProducts}
        />
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&display=swap");

          .luxury-products-page {
            min-height: 100vh;
            background: #ffffff;
            font-family: "Manrope", sans-serif;
            color: #000000;
          }

          .luxury-page-header {
            background: #fff;
            color: #000;
            padding: 4rem 3rem;
          }

          .luxury-header-content h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.02em;
          }

          .luxury-header-content p {
            font-size: 16px;
            font-weight: 400;
            color: #000;
            margin: 0;
          }

          .luxury-filters-section {
            padding: 2rem 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;
            background: #fff;
          }

          .luxury-search-container {
            position: relative;
            flex: 1;
            max-width: 400px;
          }

          .luxury-search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #999999;
          }

          .luxury-search-input {
            width: 100%;
            padding: 0.875rem 1rem 0.875rem 3rem;
            border: 1px solid #e0e0e0;
            background: #ffffff;
            font-size: 0.875rem;
            font-weight: 400;
            color: #000000;
            transition: border-color 0.2s ease;
            border-radius: 2px;
          }

          .luxury-search-input:focus {
            outline: none;
            border-color: #000000;
          }

          .luxury-sort-container {
            position: relative;
          }

          .luxury-sort-select {
            padding: 0.875rem 3rem 0.875rem 1rem;
            border: 1px solid #e0e0e0;
            background: #ffffff;
            font-size: 0.875rem;
            color: #000000;
            cursor: pointer;
            appearance: none;
            min-width: 180px;
            border-radius: 2px;
            transition: border-color 0.2s ease;
          }

          .luxury-sort-select:focus {
            outline: none;
            border-color: #000000;
          }

          .luxury-select-arrow {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #666666;
            pointer-events: none;
          }

          .luxury-content-card {
            margin: 1rem 0;
            background: #ffffff;
            border-radius: 4px;
            overflow: hidden;
          }

          .luxury-card-header {
            padding: 2.5rem 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            background: white;
          }

          .luxury-card-header h2 {
            font-size: 1.5rem;
            font-weight: 400;
            color: #000000;
            margin: 0 0 0.25rem 0;
          }

          .luxury-card-header p {
            font-size: 0.875rem;
            color: #666666;
            margin: 0;
            font-weight: 300;
          }

          .luxury-create-btn {
            background: #000000;
            color: #ffffff;
            border: none;
            padding: 1rem 1.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: background 0.2s ease;
            border-radius: 2px;
          }

          .luxury-create-btn:hover {
            background: #333333;
          }

          .luxury-products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
            padding: 2.5rem;
          }

          .luxury-product-card {
            background: #ffffff;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .luxury-product-card:hover {
            border-color: #e0e0e0;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          }

          .luxury-product-image {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
          }

          .luxury-product-image img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
          }

          .luxury-product-card:hover .luxury-product-image img {
            transform: scale(1.05);
          }

          .luxury-product-overlay {
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .luxury-product-card:hover .luxury-product-overlay {
            opacity: 1;
          }

          .luxury-overlay-btn {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.9);
          }

          .luxury-view-btn {
            color: #666666;
          }

          .luxury-view-btn:hover {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
          }

          .luxury-edit-btn {
            color: #666666;
          }

          .luxury-edit-btn:hover {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
          }

          .luxury-delete-btn {
            color: #666666;
          }

          .luxury-delete-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }

          .luxury-product-info {
            padding: 1rem 1.5rem 10px;
          }

          .luxury-product-category {
            font-size: 0.75rem;
            font-weight: 500;
            color: #999999;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
          }

          .luxury-product-name {
            font-size: 1.125rem;
            font-weight: 500;
            color: #000000;
            margin: 0 0 0.5rem 0;
            line-height: 1.4;
          }

          .luxury-product-description {
            font-size: 0.875rem;
            color: #666666;
            margin: 0 0 1rem 0;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .luxury-product-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .luxury-product-price {
            font-size: 1.125rem;
            font-weight: 600;
            color: #000000;
          }

          .luxury-price-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .luxury-product-price-strike {
            font-size: 0.875rem;
            color: #999999;
            text-decoration: line-through;
          }

          .luxury-product-price-discounted {
            font-size: 1.125rem;
            font-weight: 600;
            color: #cc0000;
          }

          .luxury-product-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: #666666;
          }

          .luxury-status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          .luxury-status-indicator.in-stock {
            background: #10b981;
          }

          .luxury-status-indicator.out-stock {
            background: #ef4444;
          }

          .luxury-variations-preview {
            background: #fafafa;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .luxury-variations-info {
            display: flex;
            gap: 0.5rem;
          }

          .luxury-variation-preview {
            font-size: 0.75rem;
            color: #666666;
            background: #ffffff;
            border-radius: 12px;
          }

          @media (max-width: 768px) {
            .luxury-page-header,
            .luxury-filters-section {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }

            .luxury-content-card {
              margin: 0 1.5rem 1.5rem;
            }

            .luxury-header-content h1 {
              font-size: 2.5rem;
            }

            .luxury-filters-section {
              flex-direction: column;
              gap: 1rem;
              align-items: stretch;
            }

            .luxury-search-container {
              max-width: none;
            }

            .luxury-products-grid {
              grid-template-columns: 1fr;
              padding: 1.5rem;
              gap: 10px;
            }

            .luxury-card-header {
              flex-direction: column;
              gap: 1rem;
              align-items: stretch;
            }

            .luxury-create-btn {
              align-self: flex-start;
            }
          }
        `}</style>
      </div>
    </>
  );
}
