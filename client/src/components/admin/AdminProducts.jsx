import { React, useState } from "react";
import { Eye, Edit, Info, Trash2, BoxesIcon } from "lucide-react";
import VariationModal from "./VariationModal";
import { useEffect } from "react";
import { deleteProduct, getProducts } from "../../api/admin";
import { AlertDialog } from "../client/AlertDialog";
import { ConfirmationDialog } from "../client/ConfirmationDialog";
import { Spinner } from "../client/Spinner";
export const AdminProducts = ({
  handleEdit,
  filteredProducts,
  setProducts,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showProductConfirm, setShowProductConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const [alert, setAlert] = useState({
    state: false,
    status: null,
    message: "",
  });

  const handleOpenVariationsModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseVariationsModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };
  const handleVariationDeleted = async () => {
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  // New functions for product deletion
  const handlePreDeleteProduct = (product) => () => {
    setProductToDelete(product);
    setShowProductConfirm(true);
  };

  const handleConfirmProductDelete = async () => {
    setShowProductConfirm(false);
    setShowSpinner(true);
    try {
      const response = await deleteProduct(productToDelete._id);
      if (response.success) {
        setProducts(
          filteredProducts.filter((p) => p._id !== productToDelete._id)
        );
        setShowSpinner(false);
        setAlert({
          state: true,
          status: "success",
          message: "Product deleted successfully.",
        });
      } else {
        setShowSpinner(false);
        setAlert({
          state: true,
          status: "error",
          message: "Failed to delete product.",
        });
      }
    } catch (error) {
      setShowSpinner(false);
      setAlert({
        state: true,
        status: "error",
        message: "An error occurred while deleting the product.",
      });
    } finally {
      setShowSpinner(false);
      setProductToDelete(null);
    }
  };

  const handleCancelProductDelete = () => {
    setShowProductConfirm(false);
    setProductToDelete(null);
  };
  return (
    <>
      {modalOpen && selectedProduct && (
        <VariationModal
          product={selectedProduct}
          onClose={handleCloseVariationsModal}
          onVariationDeleted={handleVariationDeleted}
        />
      )}

      {showSpinner && <Spinner />}

      <AlertDialog
        isOpen={alert.state}
        type={alert.status}
        message={alert.message}
        onClose={() => setAlert({ state: false, message: "" })}
      />
      <ConfirmationDialog
        isOpen={showProductConfirm}
        title="Delete Product?"
        message={`Are you sure you want to delete the product "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmProductDelete}
        onCancel={handleCancelProductDelete}
      />

      <div className="luxury-products-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="luxury-product-card">
            <div className="luxury-product-image">
              <img src={product.mainImages?.[0]} alt={product.name} />
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
                  onClick={() => handleOpenVariationsModal(product)}
                  className="luxury-overlay-btn luxury-view-btn"
                  title="View Variations"
                >
                  <BoxesIcon size={16} />
                </button>
                <button
                  className="luxury-overlay-btn luxury-delete-btn"
                  onClick={handlePreDeleteProduct(product)}
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
                      product.inStock ? "in-stock" : "out-stock"
                    }`}
                  ></span>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
