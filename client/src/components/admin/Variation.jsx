import React, { useState, useCallback, useEffect } from "react";
import { Plus, X, Upload, Package } from "lucide-react";

const Variation = ({
  hasVariations,
  setHasVariations,
  createdCombos,
  setCreatedCombos,
  variations,
  setVariations,
  variationTypes,
  setVariationTypes,
}) => {
  //   const [variationTypes, setVariationTypes] = useState([]);
  //   const [variations, setVariations] = useState([]);
  //   const [hasVariations, setHasVariations] = useState(false);
  const [selectedValues, setSelectedValues] = useState({});
  //   const [createdCombos, setCreatedCombos] = useState([]);

  const addVariationType = useCallback(() => {
    const typeInput = document.querySelector('input[name="variationType"]');
    const typeValue = typeInput.value.trim();
    if (!typeValue) return;

    typeInput.value = "";
    setVariationTypes((prev) => {
      if (prev.includes(typeValue)) return prev;
      return [...prev, typeValue];
    });
  }, []);

  const addVariationValue = useCallback(() => {
    const typeSelect = document.getElementById("selectType");
    const valueInput = document.querySelector('input[name="variationValue"]');
    const selectedType = typeSelect.value;
    const value = valueInput.value.trim();

    if (!selectedType || !value) return;

    valueInput.value = "";
    setVariations((prev) => {
      const existing = prev.find((v) => v.type === selectedType);
      if (existing) {
        if (!existing.value.includes(value)) {
          existing.value.push(value);
        }
        return [...prev];
      } else {
        return [
          ...prev,
          { id: Date.now(), type: selectedType, value: [value] },
        ];
      }
    });
  }, []);

  const addCombo = () => {
    const combo = {};
    variationTypes.forEach((type) => {
      if (selectedValues[type]) {
        combo[type] = selectedValues[type];
      }
    });

    if (Object.keys(combo).length === 0) return;

    const newCombo = {
      id: Date.now(),
      attributes: combo,
      price: "",
      discountedPrice: "",
      inStock: true,
    };

    setCreatedCombos((prev) => [...prev, newCombo]);
    setSelectedValues({});
  };

  const removeCombo = (indexToRemove) => {
    setCreatedCombos((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const removeVariationType = (typeToRemove) => {
    setVariationTypes((prev) => prev.filter((type) => type !== typeToRemove));
    setVariations((prev) => prev.filter((v) => v.type !== typeToRemove));
    setSelectedValues((prev) => {
      const newValues = { ...prev };
      delete newValues[typeToRemove];
      return newValues;
    });
  };

  const updateCombo = (index, field, value) => {
    setCreatedCombos((prev) =>
      prev.map((combo, idx) =>
        idx === index ? { ...combo, [field]: value } : combo
      )
    );
  };

  useEffect(() => {
    console.log("Updated combos", createdCombos);
  }, [createdCombos]);

  return (
    <div className="lv-container">
      <style jsx>{`
        .lv-container {
          background: #fefefe;
          min-height: 100vh;
          color: #2c2c2c;
          line-height: 1.6;
        }

        .lv-main-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .lv-header {
          background: #ffffff;
          padding: 3rem 3rem 2rem;
          text-align: center;
          border-bottom: 1px solid #f0f0f0;
        }

        .lv-title {
          font-size: 1.75rem;
          font-weight: 400;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .lv-subtitle {
          font-size: 0.9rem;
          color: #666666;
          margin: 0.5rem 0 0;
          font-weight: 500;
        }

        .lv-content {
          padding: 2rem 3rem 3rem;
        }

        .lv-toggle-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-bottom: 2.5rem;
          padding: 1.5rem;
          background: #fafafa;
          border-radius: 1px;
        }
        .lv-toggle-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lv-toggle-section p {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }
        .lv-toggle-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #333333;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .lv-toggle {
          position: relative;
          width: 44px;
          height: 24px;
          background: ${hasVariations ? "#2c2c2c" : "#cccccc"};
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lv-toggle::after {
          content: "";
          position: absolute;
          top: 2px;
          left: ${hasVariations ? "22px" : "2px"};
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .lv-section {
          margin-bottom: 2.5rem;
        }

        .lv-section-title {
          font-size: 1rem;
          font-weight: 400;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .lv-form-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .lv-input {
          background: #ffffff;
          border: 1px solid #d0d0d0;
          border-radius: 1px;
          padding: 7px 16px;
          color: #333333;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          min-width: 300px;
        }

        .lv-input:focus {
          outline: none;
          border-color: #eee;
          box-shadow: 0 0 0 1px #ccc;
        }

        .lv-input::placeholder {
          color: #999999;
          font-weight: 400;
        }

        .lv-select {
          background: #ffffff;
          border: 1px solid #d0d0d0;
          border-radius: 1px;
          padding: 6px 16px;
          color: #333333;
          font-size: 0.9rem;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 180px;
        }

        .lv-select:focus {
          outline: none;
          border-color: #2c2c2c;
        }

        .lv-select option {
          background: #ffffff;
          color: #333333;
          font-weight: 500;
        }

        .lv-btn {
          background: #2c2c2c;
          border: none;
          border-radius: 1px;
          padding: 12px 20px;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .lv-btn:hover {
          background: #1a1a1a;
        }

        .lv-btn:active {
          transform: translateY(1px);
        }

        .lv-btn-small {
          padding: 8px 16px;
          font-size: 0.8rem;
        }

        .lv-btn-outline {
          background: transparent;
          border: 1px solid #d0d0d0;
          color: #2c2c2c;
        }

        .lv-btn-outline:hover {
          border-color: #2c2c2c;
          background: #f9f9f9;
        }

        .lv-type-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .lv-type-tag {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 1px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #333333;
          font-weight: 300;
        }

        .lv-type-tag button {
          background: none;
          border: none;
          color: #999999;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .lv-type-tag button:hover {
          color: #666666;
        }

        .lv-combo-builder {
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 1px;
          padding: 2rem;
          margin-top: 1.5rem;
        }

        .lv-combo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .lv-combo-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lv-field-label {
          font-size: 0.8rem;
          color: #666666;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .lv-combos-list {
          margin-top: 2.5rem;
        }

        .lv-combo-card {
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 1px;
          padding: 2rem;
          margin-bottom: 1rem;
          position: relative;
          transition: all 0.2s ease;
        }

        .lv-combo-card:hover {
          border-color: #d0d0d0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .lv-remove-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #cccccc;
          cursor: pointer;
          padding: 4px;
          border-radius: 1px;
          transition: all 0.2s ease;
        }

        .lv-remove-btn:hover {
          color: #999999;
          background: #f5f5f5;
        }

        .lv-combo-attributes {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .lv-attribute {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .lv-attr-label {
          font-size: 0.75rem;
          color: #999999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 400;
        }

        .lv-attr-value {
          font-size: 0.95rem;
          color: #2c2c2c;
          font-weight: 400;
        }

        .lv-pricing-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #fafafa;
          border-radius: 1px;
        }

        .lv-price-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lv-price-input {
          background: #ffffff;
          border: 1px solid #d0d0d0;
          border-radius: 1px;
          padding: 10px 12px;
          color: #333333;
          font-size: 0.9rem;
          font-weight: 300;
          transition: all 0.2s ease;
        }

        .lv-price-input:focus {
          outline: none;
          border-color: #2c2c2c;
        }

        .lv-stock-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .lv-stock-switch {
          position: relative;
          width: 40px;
          height: 20px;
          background: #cccccc;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lv-stock-switch.active {
          background: #4caf50;
        }

        .lv-stock-switch::after {
          content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-radius: 50%;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .lv-stock-switch.active::after {
          left: 22px;
        }

        .lv-stock-label {
          font-size: 0.85rem;
          color: #666666;
          font-weight: 400;
        }

        .lv-actions-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f0f0;
        }

        .lv-file-upload {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lv-file-input {
          display: none;
        }

        .lv-file-label {
          background: #ffffff;
          border: 1px solid #d0d0d0;
          border-radius: 1px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          font-weight: 400;
        }

        .lv-file-label:hover {
          border-color: #2c2c2c;
          color: #2c2c2c;
        }

        .lv-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #999999;
          background: #fafafa;
          border: 1px dashed #e0e0e0;
          border-radius: 1px;
        }

        .lv-empty-icon {
          margin-bottom: 1rem;
          opacity: 0.4;
        }

        .lv-empty-text {
          font-size: 0.9rem;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .lv-content,
          .lv-header {
            padding: 2rem 1rem 3rem;
          }
        }
      `}</style>

      <div className="lv-main-wrapper">
        <div className="lv-header">
          <h1 className="lv-title">Product Variations</h1>
          <p className="lv-subtitle">
            Create and manage product combinations with precision
          </p>
        </div>

        <div className="lv-content">
          <div className="lv-toggle-section">
            <div className="lv-toggle-wrapper">
              <span className="lv-toggle-label">Enable Variations</span>
              <div
                className="lv-toggle"
                onClick={() => setHasVariations(!hasVariations)}
              />
            </div>
            <p>This product has variations (colors, sizes, materials, etc.)</p>
          </div>

          {hasVariations && (
            <>
              <div className="lv-section">
                <h3 className="lv-section-title">Variation Types</h3>

                <div className="lv-form-row">
                  <input
                    type="text"
                    name="variationType"
                    className="lv-input"
                    placeholder="Enter variation type (e.g., Size, Color)"
                  />
                  <button
                    onClick={addVariationType}
                    className="lv-btn lv-btn-small"
                  >
                    <Plus size={14} />
                    Add Type
                  </button>
                </div>

                {variationTypes.length > 0 && (
                  <div className="lv-type-tags">
                    {variationTypes.map((type, index) => (
                      <div key={index} className="lv-type-tag">
                        {type}
                        <button onClick={() => removeVariationType(type)}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {variationTypes.length > 0 && (
                <div className="lv-section">
                  <h3 className="lv-section-title">Variation Values</h3>

                  <div className="lv-form-row">
                    <select
                      name="selectType"
                      id="selectType"
                      className="lv-select"
                    >
                      <option value="">Select Type</option>
                      {variationTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="variationValue"
                      className="lv-input"
                      placeholder="Enter value"
                    />
                    <button
                      onClick={addVariationValue}
                      className="lv-btn lv-btn-small"
                    >
                      <Plus size={14} />
                      Add Value
                    </button>
                  </div>

                  {variations.length > 0 && (
                    <div className="lv-combo-builder">
                      <h4
                        className="lv-section-title"
                        style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}
                      >
                        Create Combination
                      </h4>

                      <div className="lv-combo-grid">
                        {variationTypes.map((type) => {
                          const variationForType = variations.find(
                            (v) => v.type === type
                          );
                          return (
                            <div key={type} className="lv-combo-field">
                              <label className="lv-field-label">{type}</label>
                              <select
                                className="lv-select"
                                value={selectedValues[type] || ""}
                                onChange={(e) =>
                                  setSelectedValues((prev) => ({
                                    ...prev,
                                    [type]: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Select {type}</option>
                                {variationForType?.value.map((val, idx) => (
                                  <option key={idx} value={val}>
                                    {val}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>

                      <button onClick={addCombo} className="lv-btn">
                        <Plus size={16} />
                        Create Combination
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="lv-section">
                <h3 className="lv-section-title">Product Combinations</h3>

                <div className="lv-combos-list">
                  {createdCombos.length === 0 ? (
                    <div className="lv-empty-state">
                      <div className="lv-empty-icon">
                        <Package size={40} />
                      </div>
                      <p className="lv-empty-text">
                        No combinations created yet
                      </p>
                    </div>
                  ) : (
                    createdCombos.map((combo, idx) => (
                      <div key={combo.id} className="lv-combo-card">
                        <button
                          className="lv-remove-btn"
                          onClick={() => removeCombo(idx)}
                        >
                          <X size={16} />
                        </button>

                        <div className="lv-combo-attributes">
                          {Object.entries(combo.attributes).map(
                            ([type, val]) => (
                              <div key={type} className="lv-attribute">
                                <span className="lv-attr-label">{type}</span>
                                <span className="lv-attr-value">{val}</span>
                              </div>
                            )
                          )}
                        </div>

                        <div className="lv-pricing-section">
                          <div className="lv-price-field">
                            <label className="lv-field-label">
                              Regular Price
                            </label>
                            <input
                              type="number"
                              className="lv-price-input"
                              placeholder="0.00"
                              value={combo.price}
                              onChange={(e) =>
                                updateCombo(idx, "price", e.target.value)
                              }
                            />
                          </div>

                          <div className="lv-price-field">
                            <label className="lv-field-label">Sale Price</label>
                            <input
                              type="number"
                              className="lv-price-input"
                              placeholder="0.00"
                              value={combo.discountedPrice}
                              onChange={(e) =>
                                updateCombo(
                                  idx,
                                  "discountedPrice",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className="lv-price-field">
                            <label className="lv-field-label">
                              Stock Status
                            </label>
                            <div className="lv-stock-toggle">
                              <div
                                className={`lv-stock-switch ${
                                  combo.inStock ? "active" : ""
                                }`}
                                onClick={() =>
                                  updateCombo(idx, "inStock", !combo.inStock)
                                }
                              />
                              <span className="lv-stock-label">
                                {combo.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="lv-actions-row">
                          <div className="lv-file-upload">
                            <input
                              type="file"
                              id={`file-${combo.id}`}
                              accept="image/*"
                              onChange={(e) =>
                                updateCombo(idx, "image", e.target.files[0])
                              }
                            />
                            {combo.image && (
                              <div className="luxury-variation-image-preview">
                                <img
                                  src={combo.image}
                                  alt={`Variation ${idx + 1}`}
                                />
                              </div>
                            )}
                            <label
                              htmlFor={`file-${combo.id}`}
                              className="lv-file-label"
                            >
                              <Upload size={14} />
                              Upload Image
                            </label>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Variation;
