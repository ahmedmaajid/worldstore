import React, { useState, useCallback, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
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
import { getCategories } from "../../api/admin";
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

// Dynamic variation combination generator based on your schema
const generateVariationCombinations = (variationTypes) => {
  if (!variationTypes || variationTypes.length === 0) return [];

  const validTypes = variationTypes.filter(
    (type) => type.type && type.values && type.values.length > 0
  );

  if (validTypes.length === 0) return [];

  const generateCombos = (typeIndex, currentCombo) => {
    if (typeIndex >= validTypes.length) {
      return [{ ...currentCombo }];
    }

    const currentType = validTypes[typeIndex];
    const combinations = [];

    for (const value of currentType.values) {
      const newCombo = {
        ...currentCombo,
        variations: {
          ...currentCombo.variations,
          [currentType.type]: value,
        },
      };
      combinations.push(...generateCombos(typeIndex + 1, newCombo));
    }

    return combinations;
  };

  return generateCombos(0, { variations: {} }).map((combo, index) => ({
    id: `combo-${index}`,
    type: Object.keys(combo.variations)[0],
    value: Object.values(combo.variations).join(" - "),
    price: "",
    discountedPrice: "",
    image: null,
    inStock: true,
    fullVariations: combo.variations,
  }));
};

export default function LuxuryProductManager() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([
    {
      _id: "prod1",
      name: "Cashmere Signature Coat",
      slug: "cashmere-signature-coat",
      description:
        "Handcrafted Italian cashmere coat with mother-of-pearl buttons",
      category: { _id: "cat6", name: "Coats" },
      price: 2450,
      stock: true,
      images: {
        main: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop",
        sub: [
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        ],
      },
      variations: [],
    },
  ]);

  const [formData, setFormData] = useState({
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

  const [variationTypes, setVariationTypes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [hasVariations, setHasVariations] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      const hierarchicalCategories = buildCategoryTree(categoriesData);
      setCategories(hierarchicalCategories);
    };
    fetchCategories();
    const hierarchicalCategories = buildCategoryTree(mockApiCategories);
    setCategories(hierarchicalCategories);
  }, []);

  useEffect(() => {
    if (hasVariations && variationTypes.length > 0) {
      const newVariations = generateVariationCombinations(variationTypes);
      setVariations(newVariations);
    } else {
      setVariations([]);
    }
  }, [variationTypes, hasVariations]);

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
    setVariationTypes([]);
    setVariations([]);
    setHasVariations(false);
    setShowAddForm(false);
    setEditingProduct(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formData.name || !formData.category) return;

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discountedPrice: parseFloat(formData.discountedPrice),
      variations: hasVariations ? variations : [],
    };

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p._id === editingProduct._id ? { ...p, ...productData } : p
        )
      );
    } else {
      setProducts([...products, { _id: `prod${Date.now()}`, ...productData }]);
    }

    resetForm();
  }, [
    formData,
    variations,
    hasVariations,
    editingProduct,
    products,
    resetForm,
  ]);

  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price ? product.price.toString() : "",
      discountedPrice: product.discountedPrice
        ? product.discountedPrice.toString()
        : "",
      stock: product.stock,
      images: product.images,
    });
    setHasVariations(product.variations.length > 0);
    setVariations(product.variations || []);

    if (product.variations && product.variations.length > 0) {
      const typesMap = {};
      product.variations.forEach((variation) => {
        for (const type in variation.fullVariations) {
          if (!typesMap[type]) {
            typesMap[type] = new Set();
          }
          typesMap[type].add(variation.fullVariations[type]);
        }
      });

      const reconstructedTypes = Object.entries(typesMap).map(
        ([type, values]) => ({
          id: `${type}-${Date.now()}`,
          type,
          values: Array.from(values),
        })
      );
      setVariationTypes(reconstructedTypes);
    } else {
      setVariationTypes([]);
    }

    setShowAddForm(true);
  }, []);

  const addVariationType = useCallback(() => {
    setVariationTypes([
      ...variationTypes,
      { id: Date.now(), type: "", values: [] },
    ]);
  }, [variationTypes]);

  const updateVariationType = useCallback(
    (id, field, value) => {
      setVariationTypes(
        variationTypes.map((type) => {
          if (type.id === id) {
            if (field === "values") {
              return {
                ...type,
                [field]: value
                  .split(",")
                  .map((opt) => opt.trim())
                  .filter(Boolean),
              };
            }
            return { ...type, [field]: value };
          }
          return type;
        })
      );
    },
    [variationTypes]
  );

  const removeVariationType = useCallback(
    (id) => {
      setVariationTypes(variationTypes.filter((type) => type.id !== id));
    },
    [variationTypes]
  );

  const updateVariation = useCallback(
    (id, field, value) => {
      setVariations(
        variations.map((variation) =>
          variation.id === id ? { ...variation, [field]: value } : variation
        )
      );
    },
    [variations]
  );

  const handleImageUpload = useCallback(
    (e, type, variationId = null, index = null) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        if (type === "main") {
          setFormData((prev) => ({
            ...prev,
            images: { ...prev.images, main: imageUrl },
          }));
        } else if (type === "sub") {
          setFormData((prev) => ({
            ...prev,
            images: { ...prev.images, sub: [...prev.images.sub, imageUrl] },
          }));
        } else if (type === "variation") {
          setVariations(
            variations.map((variation) =>
              variation.id === variationId
                ? { ...variation, image: imageUrl }
                : variation
            )
          );
        }
      }
    },
    [variations]
  );

  const removeSubImage = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        sub: prev.images.sub.filter((_, i) => i !== index),
      },
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

  if (showAddForm) {
    return (
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
                    <label>Price (USD)</label>
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
                    <label>Discounted Price (USD)</label>
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
                  <img src={formData.images.main} alt="Main Product" />
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
                    id="main-image-upload"
                    style={{ display: "none" }}
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
            <div className="luxury-variation-toggle">
              <label className="luxury-toggle-label">
                <input
                  type="checkbox"
                  checked={hasVariations}
                  onChange={(e) => setHasVariations(e.target.checked)}
                />
                <span className="luxury-toggle-switch"></span>
                This product has variations (colors, sizes, materials, etc.)
              </label>
              <div className="luxury-toggle-info">
                <Info size={16} />
                <span>
                  Enable this for products with multiple options like different
                  colors or sizes
                </span>
              </div>
            </div>

            {hasVariations && (
              <>
                <div className="luxury-variations-section">
                  <div className="luxury-section-header">
                    <h3>Variation Types</h3>
                    <button
                      onClick={addVariationType}
                      className="luxury-add-btn-small"
                    >
                      <Plus size={16} />
                      Add Type
                    </button>
                  </div>

                  {variationTypes.map((type, index) => (
                    <div key={type.id} className="luxury-variation-type">
                      <div className="luxury-variation-header">
                        <span className="luxury-variation-number">
                          {index + 1}
                        </span>
                        <div className="luxury-variation-inputs">
                          <div className="luxury-form-group">
                            <input
                              type="text"
                              value={type.type}
                              onChange={(e) =>
                                updateVariationType(
                                  type.id,
                                  "type",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Color, Size, Material"
                            />
                            <span className="luxury-form-helper">
                              Variation type name
                            </span>
                          </div>
                          <div className="luxury-form-group">
                            <input
                              type="text"
                              value={type.values ? type.values.join(", ") : ""}
                              onChange={(e) =>
                                updateVariationType(
                                  type.id,
                                  "values",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Black, Navy, Camel"
                            />
                            <span className="luxury-form-helper">
                              Available options (comma separated)
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeVariationType(type.id)}
                          className="luxury-remove-btn"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {variations.length > 0 && (
                  <div className="luxury-combinations-section">
                    <div className="luxury-section-header">
                      <h3>Product Variations</h3>
                      <span className="luxury-combinations-count">
                        {variations.length} variations
                      </span>
                    </div>

                    <div className="luxury-variations-grid">
                      {variations.map((variation) => (
                        <div
                          key={variation.id}
                          className="luxury-variation-card"
                        >
                          <div className="luxury-variation-header">
                            <div className="luxury-variation-info">
                              <h4>{variation.value}</h4>
                              <span className="luxury-variation-type">
                                {Object.keys(variation.fullVariations).join(
                                  " / "
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="luxury-variation-fields">
                            <div className="luxury-form-group">
                              <label>Price (USD)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={variation.price}
                                onChange={(e) =>
                                  updateVariation(
                                    variation.id,
                                    "price",
                                    e.target.value
                                  )
                                }
                                placeholder="2450.00"
                              />
                            </div>
                            <div className="luxury-form-group">
                              <label>Discounted Price</label>
                              <input
                                type="number"
                                step="0.01"
                                value={variation.discountedPrice}
                                onChange={(e) =>
                                  updateVariation(
                                    variation.id,
                                    "discountedPrice",
                                    e.target.value
                                  )
                                }
                                placeholder="Optional"
                              />
                            </div>
                            <div className="luxury-form-group">
                              <label className="luxury-toggle-label-small">
                                <input
                                  type="checkbox"
                                  checked={variation.inStock}
                                  onChange={(e) =>
                                    updateVariation(
                                      variation.id,
                                      "inStock",
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="luxury-toggle-switch-small"></span>
                                In Stock
                              </label>
                            </div>
                          </div>

                          <div className="luxury-variation-image">
                            <label>Variation Image</label>
                            {variation.image ? (
                              <div className="luxury-variation-image-preview">
                                <img src={variation.image} alt="Variation" />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateVariation(variation.id, "image", null)
                                  }
                                  className="luxury-remove-image"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  document
                                    .getElementById(
                                      `variation-image-${variation.id}`
                                    )
                                    .click()
                                }
                                className="luxury-add-variation-image"
                              >
                                <input
                                  type="file"
                                  id={`variation-image-${variation.id}`}
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handleImageUpload(
                                      e,
                                      "variation",
                                      variation.id
                                    )
                                  }
                                />
                                <Plus size={16} />
                                Add Image
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="luxury-form-actions">
            <button onClick={resetForm} className="luxury-btn-secondary">
              Cancel
            </button>
            <button onClick={handleSubmit} className="luxury-btn-primary">
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
            object-fit: cover;
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
            width: 80px;
            height: 80px;
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
          }

          .luxury-variation-image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
    );
  }

  return (
    <div className="luxury-products-page">
      <div className="luxury-page-header">
        <div className="luxury-header-content">
          <h1>Product Atelier</h1>
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

        <div className="luxury-products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="luxury-product-card">
              <div className="luxury-product-image">
                <img
                  src={
                    product.images?.main ||
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop"
                  }
                  alt={product.name}
                />
                <div className="luxury-product-overlay">
                  <button
                    className="luxury-overlay-btn luxury-view-btn"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="luxury-overlay-btn luxury-edit-btn"
                    onClick={() => handleEdit(product)}
                    title="Edit Product"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="luxury-overlay-btn luxury-delete-btn"
                    onClick={() =>
                      setProducts(products.filter((p) => p._id !== product._id))
                    }
                    title="Remove Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="luxury-product-info">
                <div className="luxury-product-category">
                  {product.category?.name}
                </div>
                <h3 className="luxury-product-name">{product.name}</h3>
                <p className="luxury-product-description">
                  {product.description}
                </p>

                <div className="luxury-product-details">
                  {product.variations && product.variations.length > 0 ? (
                    <div className="luxury-variations-preview">
                      <div className="luxury-variations-info">
                        <span className="luxury-variation-preview">
                          {product.variations.length} variations
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {product.discountedPrice ? (
                        <div className="luxury-price-group">
                          <span className="luxury-product-price-strike">
                            ${product.price?.toLocaleString()}
                          </span>
                          <span className="luxury-product-price-discounted">
                            ${product.discountedPrice.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div className="luxury-product-price">
                          ${product.price?.toLocaleString()}
                        </div>
                      )}
                    </>
                  )}
                  <div className="luxury-product-status">
                    <span
                      className={`luxury-status-indicator ${
                        product.stock ? "in-stock" : "out-stock"
                      }`}
                    ></span>
                    {product.stock ? "In Stock" : "Out of Stock"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
          margin: 0 3rem 3rem;
          background: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .luxury-card-header {
          padding: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
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
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
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
          height: 280px;
          overflow: hidden;
        }

        .luxury-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
          padding: 1.5rem;
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
          margin-bottom: 1rem;
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
          padding: 0.75rem;
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
          padding: 0.25rem 0.5rem;
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
            gap: 1.5rem;
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
  );
}
