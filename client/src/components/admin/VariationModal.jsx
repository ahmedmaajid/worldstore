import { React, useState } from "react";
import { Box, Tag, Zap, DollarSign } from "lucide-react";
import { deleteVariation } from "../../api/admin";
import { AlertDialog } from "../client/AlertDialog";
import { ConfirmationDialog } from "../client/ConfirmationDialog";
const VariationModal = ({ product, onClose, onVariationDeleted }) => {
  const [openAlertDialog, setOpenAlertDialog] = useState({
    state: false,
    status: null,
    message: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [variationToDeleteId, setVariationToDeleteId] = useState(null);
  const [variations, setVariations] = useState(product.variations || []);
  if (!product || !variations || variations.length === 0) {
    return null;
  }

  const handlePreDelete = (variationId) => () => {
    setVariationToDeleteId(variationId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmation(false); // Close the confirmation dialog
    if (!variationToDeleteId) return;

    try {
      const deletedVariation = await deleteVariation(variationToDeleteId);
      if (deletedVariation.success) {
        setOpenAlertDialog({
          state: true,
          status: "success",
          message: "Variation deleted successfully",
        });
        if (onVariationDeleted) {
          onVariationDeleted();
        }
        setVariations((prev) =>
          prev.filter((v) => v._id !== variationToDeleteId)
        );
      } else {
        setOpenAlertDialog({
          state: true,
          status: "error",
          message: "Failed to delete variation",
        });
      }
    } catch (error) {
      console.error("Error deleting variation:", error);
      setOpenAlertDialog({
        state: true,
        status: "error",
        message: "An error occurred while deleting the variation",
      });
    } finally {
      setVariationToDeleteId(null); // Clear the ID after deletion attempt
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setVariationToDeleteId(null); // Clear the ID
  };

  return (
    <>
      <AlertDialog
        isOpen={openAlertDialog.state}
        type={openAlertDialog.status}
        message={openAlertDialog.message}
        onClose={() => setOpenAlertDialog({ state: false })}
      />

      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Delete Variation?"
        message="This action will permanently delete this variation. Are you sure you want to proceed?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <div className="luxury-modal-backdrop">
        <div className="luxury-modal-container">
          <div className="luxury-modal-header">
            <h2 className="luxury-modal-title">
              <Box size={20} className="luxury-modal-icon" />
              {product.name} Variations
            </h2>
          </div>
          <hr className="luxury-modal-divider" />
          <div className="luxury-variations-grid-container">
            {variations.map((variation, index) => (
              <div
                key={variation._id || index}
                className="luxury-variation-card"
              >
                {variation.image && (
                  <div className="luxury-variation-image">
                    <img
                      src={variation.image}
                      alt={variation.displayName || `Variation ${index + 1}`}
                    />
                  </div>
                )}
                <div className="luxury-variation-details">
                  {/* Display individual attributes */}
                  {variation.attributes && (
                    <div className="luxury-attributes-group">
                      {Object.entries(variation.attributes).map(
                        ([key, value]) => (
                          <p key={key} className="luxury-attribute-item">
                            <span className="info-label">{key}:</span>
                            <span className="attribute-value">{value}</span>
                          </p>
                        )
                      )}
                    </div>
                  )}
                  <div className="luxury-variation-info-row">
                    <div className="luxury-info-item">
                      <Zap size={12} />
                      <span className="info-label">Stock:</span>
                      <span>
                        {variation.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                  <div className="luxury-variation-info-row">
                    <div className="luxury-info-item">
                      <DollarSign size={12} />
                      <span className="info-label">Price:</span>
                      <span className="price-value">
                        ${variation.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="delete-variation-button"
                    onClick={handlePreDelete(variation._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <hr className="luxury-modal-divider" />
          <div className="luxury-modal-footer">
            <button
              onClick={onClose}
              className="luxury-modal-btn luxury-modal-close-btn-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VariationModal;
