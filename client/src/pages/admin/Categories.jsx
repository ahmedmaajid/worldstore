import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalBox: {
    backgroundColor: "white",
    color: "#f9fafb",
    padding: "32px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    border: "1px solid #4b5563",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "400",
    borderBottom: "1px solid #eee",
    paddingBottom: "16px",
    marginBottom: "8px",
    color: "#333",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  formLabel: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#666",
  },
  formInput: {
    padding: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    color: "#333",
    borderRadius: "4px",
    outline: "none",
    fontSize: "16px",
  },
  formSelect: {
    padding: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    color: "#333",
    outline: "none",
    fontSize: "15px",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "150px",
    objectFit: "contain",
    marginTop: "8px",
    border: "1px solid #4b5563",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "16px",
  },
  button: {
    padding: "10px 20px",
    fontWeight: 500,
    borderRadius: "3px",
    border: "none",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#333",
    color: "white",
    transition: "background-color 0.2s",
  },
  cancelButton: {
    backgroundColor: "transparent",
    color: "#000",
    border: "1px solid #4b5563",
    transition: "background-color 0.2s",
  },
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "'Manrope', sans-serif",
  },
  headerContainer: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  headerContent: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  headerFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: "30px",
    fontWeight: "500",
    color: "#444",
  },
  headerSubtitle: {
    color: "#888",
    fontSize: "14px",
    marginTop: "8px",
    fontWeight: 500,
  },
  addButton: {
    backgroundColor: "#1f2937",
    color: "#fff",
    padding: "10px 24px",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
  },
  contentContainer: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  searchBarContainer: {
    marginBottom: "32px",
  },
  searchBarRelative: {
    position: "relative",
    maxWidth: "448px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "16px",
    color: "#9ca3af",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 40px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#fff",
    color: "#1f2937",
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
  },
  searchInputFocus: {
    boxShadow: "0 0 0 2px #1f2937",
    borderColor: "transparent",
  },
  categoriesList: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  categoryImage: {
    height: "50px",
    width: "50px",
    objectFit: "contain",
    backgroundColor: "#f6f6f6",
  },
  noCategories: {
    padding: "48px",
    textAlign: "center",
  },
  noCategoriesIconWrapper: {
    width: "64px",
    height: "64px",
    margin: "0 auto 16px",
    backgroundColor: "#f3f4f6",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noCategoriesIcon: {
    width: "24px",
    height: "24px",
    color: "#9ca3af",
  },
  noCategoriesTitle: {
    fontSize: "18px",
    fontWeight: 500,
    color: "#1f2937",
    marginBottom: "8px",
  },
  noCategoriesText: {
    color: "#4b5563",
  },
  categoryItem: {
    transition: "background-color 0.2s ease",
    borderBottom: "1px solid #f3f4f6",
  },
  categoryItemFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
  },
  categoryItemHover: {
    backgroundColor: "#f9fafb",
  },
  categoryToggleBtn: {
    padding: "4px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "9999px",
    transition: "background-color 0.2s ease",
    cursor: "pointer",
  },
  categoryToggleBtnHover: {
    backgroundColor: "#e5e7eb",
  },
  categoryIcon: {
    width: "16px",
    height: "16px",
    color: "#4b5563",
  },
  categoryInfo: {
    display: "flex",
    flexDirection: "column",
  },
  categoryName: {
    fontWeight: 500,
  },
  categoryLevel0: {
    color: "#1f2937",
    fontSize: "18px",
  },
  categoryLevel1: {
    color: "#374151",
  },
  categoryLevel2: {
    color: "#4b5563",
    fontSize: "14px",
  },
  categoryType: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  actionButton: {
    padding: "8px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    cursor: "pointer",
  },
  actionButtonHover: {
    backgroundColor: "#f3f4f6",
  },
  editIcon: {
    width: "16px",
    height: "16px",
    color: "#6b7280",
    transition: "color 0.2s ease",
  },
  editIconHover: {
    color: "#4b5563",
  },
  trashButtonHover: {
    backgroundColor: "#fee2e2",
  },
  trashIcon: {
    width: "16px",
    height: "16px",
    color: "#6b7280",
    transition: "color 0.2s ease",
  },
  trashIconHover: {
    color: "#ef4444",
  },
};

import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/admin";

import { ConfirmationDialog } from "../../components/client/ConfirmationDialog";
import { AlertDialog } from "../../components/client/AlertDialog";

export default function AdminCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [addButtonHover, setAddButtonHover] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredButtons, setHoveredButtons] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryParentId, setNewCategoryParentId] = useState("");
  const [newCategoryImageFile, setNewCategoryImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [catId, setCatId] = useState(null); // Category ID for deleting.
  const [isOpen, setIsOpen] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState({
    state: false,
    status: null,
    message: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchCats() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCats();
  }, []);

  // Build tree whenever categories change
  useEffect(() => {
    if (categories.length > 0) {
      const tree = makeTree(categories);
      setCategoryTree(tree);
    }
  }, [categories]);

  function makeTree(categories) {
    const byId = {};
    const roots = [];

    // First pass: create all nodes
    categories.forEach((c) => {
      byId[c._id] = { ...c, children: [] };
    });

    // Second pass: build parent-child relationships
    categories.forEach((c) => {
      if (c.parentId && byId[c.parentId]) {
        byId[c.parentId].children.push(byId[c._id]);
      } else if (!c.parentId) {
        roots.push(byId[c._id]);
      }
    });

    return roots;
  }

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Add this function to your AdminCategories component
  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryParentId(category.parentId || "");
    setImagePreviewUrl(category.image);
    setNewCategoryImageFile(null); // Clear file input for edit
    setShowModal(true);
    setIsEditing(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const handleUpdateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name is required.");
      return;
    }

    const updatedCategory = {
      _id: editingCategory._id,
      name: newCategoryName,
      parentId: newCategoryParentId || null,
      image: newCategoryImageFile ? imagePreviewUrl : editingCategory.image,
    };

    try {
      await updateCategory(updatedCategory); // Assuming you have an updateCategory function
      const updated = await getCategories();
      setCategories(updated);
      setShowModal(false);
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    }
  };

  const openDeleteModal = (category) => {
    setIsOpen(true);
    setCatId(category._id);
  };
  const handleDelete = async () => {
    console.log(catId);
    try {
      const deleted = await deleteCategory(catId);
      setIsOpen(false);
      if (deleted.success) {
        const updated = await getCategories();
        setCategories(updated);
        setOpenAlertDialog({
          state: true,
          status: "success",
          message: deleted.message, // "Category deleted successfully"
        });
        // maybe refresh categories here
      } else {
        setIsOpen(false);
        setOpenAlertDialog({
          state: true,
          status: "error",
          message: deleted.message || "Failed to delete category",
        });
      }
    } catch (error) {
      console.log(error);
      setIsOpen(false);
      setOpenAlertDialog({
        state: true,
        status: "error",
        message: error,
      });
    }
  };

  const openAddCategoryModal = () => {
    setNewCategoryName("");
    setNewCategoryParentId("");
    setNewCategoryImageFile(null);
    setImagePreviewUrl(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategoryImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setNewCategoryImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategoryName);
    if (newCategoryParentId) formData.append("parentId", newCategoryParentId);
    if (newCategoryImageFile) formData.append("image", newCategoryImageFile);

    try {
      const addCat = await addCategory(formData); // returns res.data
      if (addCat.status === "success") {
        setOpenAlertDialog({
          state: true,
          status: "success",
          message: "Category added Successfully!",
        });
      }
      const updated = await getCategories();
      setCategories(updated);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setOpenAlertDialog({
        state: true,
        status: "error",
        message: "Error adding category",
      });
    }
  };

  const flattenTreeForSelect = (tree, level = 0, result = []) => {
    tree.forEach((category) => {
      // Create indentation using different symbols for each level
      let indent = "";
      if (level === 1) {
        indent = "├── ";
      } else if (level === 2) {
        indent = "│   └── ";
      } else if (level > 2) {
        indent = "│   ".repeat(level - 1) + "└── ";
      }

      result.push({
        ...category,
        level,
        displayName: `${indent}${category.name}`,
        disabled: false,
      });

      // Recursively add children
      if (category.children && category.children.length > 0) {
        flattenTreeForSelect(category.children, level + 1, result);
      }
    });

    return result;
  };

  const flattenedOptions = flattenTreeForSelect(categoryTree);

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category._id);
    const paddingLeft = isMobile ? level * 1 : level * 2;

    const isHovered = hoveredButtons[`item-${category._id}`];
    const itemStyle = {
      ...styles.categoryItem,
      backgroundColor: isHovered
        ? styles.categoryItemHover.backgroundColor
        : level === 0
        ? "#fff"
        : level === 1
        ? "#fafafa"
        : "#f9fafb",
    };

    return (
      <div key={category._id}>
        <div
          style={itemStyle}
          onMouseEnter={() =>
            setHoveredButtons((prev) => ({
              ...prev,
              [`item-${category._id}`]: true,
            }))
          }
          onMouseLeave={() =>
            setHoveredButtons((prev) => ({
              ...prev,
              [`item-${category._id}`]: false,
            }))
          }
        >
          <div
            style={{
              ...styles.categoryItemFlex,
              paddingLeft: `${1 + paddingLeft}rem`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(category._id)}
                  style={{
                    ...styles.categoryToggleBtn,
                    ...(hoveredButtons[`toggle-${category._id}`] &&
                      styles.categoryToggleBtnHover),
                  }}
                  onMouseEnter={() =>
                    setHoveredButtons((prev) => ({
                      ...prev,
                      [`toggle-${category._id}`]: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setHoveredButtons((prev) => ({
                      ...prev,
                      [`toggle-${category._id}`]: false,
                    }))
                  }
                >
                  {isExpanded ? (
                    <ChevronDown style={styles.categoryIcon} />
                  ) : (
                    <ChevronRight style={styles.categoryIcon} />
                  )}
                </button>
              ) : (
                <div style={{ width: "24px" }}></div>
              )}
              {category.image && (
                <img style={styles.categoryImage} src={category.image} alt="" />
              )}

              <div style={styles.categoryInfo}>
                <span
                  style={{
                    ...styles.categoryName,
                    ...(level === 0
                      ? styles.categoryLevel0
                      : level === 1
                      ? styles.categoryLevel1
                      : styles.categoryLevel2),
                  }}
                  className="category-list-category-name"
                >
                  {category.name}
                </span>
                <span style={styles.categoryType}>
                  {level === 0
                    ? "Main Category"
                    : level === 1
                    ? "Sub Category"
                    : "Sub-Sub Category"}
                </span>
              </div>
            </div>
            <div style={styles.actionButtons}>
              <button
                onClick={() => {
                  handleEdit(category);
                }}
                style={{
                  ...styles.actionButton,
                  ...(hoveredButtons[`edit-${category._id}`] &&
                    styles.actionButtonHover),
                }}
                onMouseEnter={() =>
                  setHoveredButtons((prev) => ({
                    ...prev,
                    [`edit-${category._id}`]: true,
                  }))
                }
                onMouseLeave={() =>
                  setHoveredButtons((prev) => ({
                    ...prev,
                    [`edit-${category._id}`]: false,
                  }))
                }
              >
                <Edit2
                  style={{
                    ...styles.editIcon,
                    ...(hoveredButtons[`edit-${category._id}`] &&
                      styles.editIconHover),
                  }}
                />
              </button>
              <button
                onClick={() => openDeleteModal(category)}
                style={{
                  ...styles.actionButton,
                  ...(hoveredButtons[`trash-${category._id}`] &&
                    styles.trashButtonHover),
                }}
                onMouseEnter={() =>
                  setHoveredButtons((prev) => ({
                    ...prev,
                    [`trash-${category._id}`]: true,
                  }))
                }
                onMouseLeave={() =>
                  setHoveredButtons((prev) => ({
                    ...prev,
                    [`trash-${category._id}`]: false,
                  }))
                }
              >
                <Trash2
                  style={{
                    ...styles.trashIcon,
                    ...(hoveredButtons[`trash-${category._id}`] &&
                      styles.trashIconHover),
                  }}
                />
              </button>
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Filter tree based on search query
  const filterCategoryTree = (categories, query) => {
    if (!query) return categories;

    const filtered = [];

    categories.forEach((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const filteredChildren = filterCategoryTree(
        category.children || [],
        query
      );

      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...category,
          children: filteredChildren,
        });
      }
    });

    return filtered;
  };

  const filteredCategoryTree = filterCategoryTree(categoryTree, searchQuery);

  return (
    <>
      <AlertDialog
        isOpen={openAlertDialog.state}
        type={openAlertDialog.status} // you can add type to your state too
        message={openAlertDialog.message}
        onClose={() => setOpenAlertDialog({ state: false, message: "" })}
      />

      <ConfirmationDialog
        isOpen={isOpen}
        title="Delete Item?"
        message="This item will be permanently deleted and cannot be recovered."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => handleDelete()}
        onCancel={() => setIsOpen(false)}
      />
      <div style={styles.container}>
        <div style={styles.headerContainer}>
          <div style={styles.headerContent}>
            <div style={styles.headerFlex} className="category-header-content">
              <div>
                <h1 style={styles.headerTitle}>Categories</h1>
                <p style={styles.headerSubtitle}>
                  Manage your product categories with elegance
                </p>
              </div>
              <button
                style={{
                  ...styles.addButton,
                  backgroundColor: addButtonHover ? "#111827" : "#1f2937",
                }}
                onMouseEnter={() => setAddButtonHover(true)}
                onMouseLeave={() => setAddButtonHover(false)}
                onClick={openAddCategoryModal}
              >
                <Plus style={{ width: "16px", height: "16px" }} />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>
        <div style={styles.contentContainer}>
          <div style={styles.searchBarContainer}>
            <div style={styles.searchBarRelative}>
              <Search style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                style={{
                  ...styles.searchInput,
                  ...(isSearchFocused && styles.searchInputFocus),
                }}
              />
            </div>
          </div>
          <div style={styles.categoriesList}>
            {filteredCategoryTree.length === 0 ? (
              <div style={styles.noCategories}>
                <div style={styles.noCategoriesIconWrapper}>
                  <Search style={styles.noCategoriesIcon} />
                </div>
                <h3 style={styles.noCategoriesTitle}>No categories found</h3>
                <p style={styles.noCategoriesText}>
                  Try adjusting your search or create a new category
                </p>
              </div>
            ) : (
              <div>
                {filteredCategoryTree.map((category) =>
                  renderCategory(category, 0)
                )}
              </div>
            )}
          </div>
        </div>
        {showModal && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modalBox}>
              <h2 style={modalStyles.modalTitle}>
                {isEditing ? "Update Category" : "Add a New Category"}
              </h2>
              <div style={modalStyles.formGroup}>
                <label htmlFor="categoryName" style={modalStyles.formLabel}>
                  Category Name
                </label>
                <input
                  placeholder="Category Name"
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={modalStyles.formInput}
                />
              </div>
              <div style={modalStyles.formGroup}>
                <label htmlFor="parentCategory" style={modalStyles.formLabel}>
                  Parent Category (Optional)
                </label>
                <select
                  id="parentCategory"
                  value={newCategoryParentId}
                  onChange={(e) => setNewCategoryParentId(e.target.value)}
                  style={modalStyles.formSelect}
                >
                  <option value="">None (Top Level)</option>
                  {flattenedOptions.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.displayName}
                    </option>
                  ))}
                </select>
              </div>
              <div style={modalStyles.formGroup}>
                <label htmlFor="categoryImage" style={modalStyles.formLabel}>
                  Category Image
                </label>
                <input
                  type="file"
                  id="categoryImage"
                  onChange={handleImageChange}
                  style={modalStyles.formInput}
                  accept="image/*"
                />
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    alt="Image Preview"
                    style={modalStyles.imagePreview}
                  />
                )}
              </div>
              <div style={modalStyles.buttonContainer}>
                <button
                  style={{
                    ...modalStyles.button,
                    ...modalStyles.cancelButton,
                  }}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...modalStyles.button,
                    ...modalStyles.saveButton,
                  }}
                  onClick={
                    isEditing ? handleUpdateCategory : handleSaveCategory
                  }
                >
                  {isEditing ? "Update Category" : "Save Category"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
