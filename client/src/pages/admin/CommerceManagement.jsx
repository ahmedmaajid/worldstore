import React, { useState, useEffect } from "react";
import PopMessage from "../../components/client/PopMessage";
import { X } from "lucide-react";
import {
  addShippingFee,
  addCoupon,
  deleteCoupon,
  deleteShippingFee,
  getCommerceData,
} from "../../api/admin";
import { ConfirmationDialog } from "../../components/client/ConfirmationDialog";

export const CommerceManagement = () => {
  // shipping state
  const [shippingFee, setShippingFee] = useState("");
  const [freeShippingOver, setFreeShippingOver] = useState("");

  // coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [couponData, setCouponData] = useState([]);

  // saved data state
  const [savedShipping, setSavedShipping] = useState({
    shippingFee: null,
    freeShippingOver: null,
  });
  const [savedCoupons, setSavedCoupons] = useState([]);

  const [popup, setPopup] = useState(null);

  const showPopup = (status, message) => {
    setPopup({ status, message });
  };
  const handleClosePopup = () => {
    setPopup(null);
  };

  useEffect(() => {
    async function getData() {
      const res = await getCommerceData(); // res is an array
      if (res.length > 0) {
        const shop = res[0]; // first object
        setSavedShipping({
          shippingFee: shop.shippingFee,
          freeShippingOver: shop.freeShippingOver,
        });

        setSavedCoupons(
          shop.coupons.map((c) => ({
            code: c.code,
            discountType: c.discountType,
            discountValue: c.discountValue,
          }))
        );
      }
    }
    getData();
  }, []);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Handle shipping deletion with confirmation
  const handleDeleteShippingConfirm = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Shipping Settings?",
      message:
        "Are you sure you want to delete the current shipping configuration? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await deleteShippingFee();
          if (res.status === 200) {
            setSavedShipping({ shippingFee: null, freeShippingOver: null });
            showPopup("success", "Shipping settings deleted successfully!");
          }
        } catch (error) {
          console.log(error);
          showPopup("error", "Failed to delete shipping settings.");
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Handle coupon deletion with confirmation
  const handleDeleteCouponConfirm = (code) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Coupon?",
      message: `Are you sure you want to delete the coupon "${code}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await deleteCoupon(code);
          if (res.status === 200) {
            setSavedCoupons((prev) => prev.filter((c) => c.code !== code));
            showPopup("success", `Coupon ${code} deleted successfully!`);
          }
        } catch (error) {
          console.log(error);
          showPopup("error", "Failed to delete coupon.");
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };
  const handleSaveShipping = async () => {
    try {
      const adding = await addShippingFee({ shippingFee, freeShippingOver });
      setSavedShipping({ shippingFee, freeShippingOver });
      showPopup("success", "Shipping details saved successfully!");
      setShippingFee("");
      setFreeShippingOver("");
    } catch (error) {
      console.log(error);
      showPopup("error", "Failed to save shipping details.");
    }
  };

  // add coupon
  const handleAddCoupon = async () => {
    try {
      if (!couponCode || !discountValue) {
        showPopup("error", "Please fill coupon details");
        return;
      }

      const newCoupon = {
        code: couponCode,
        discountType,
        discountValue,
      };

      const adding = await addCoupon(newCoupon);
      showPopup("success", "Coupon added successfully!");
      setSavedCoupons((prev) => [...prev, newCoupon]);
      setCouponCode("");
      setDiscountValue("");
    } catch (error) {
      console.log(error);
      showPopup("error", "Failed to add coupon");
    }
  };

  return (
    <div className="commerce-main-container">
      {popup && (
        <PopMessage
          status={popup.status}
          message={popup.message}
          autoClose={true}
          duration={4000}
          onClose={handleClosePopup}
        />
      )}

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <div className="commerce-header">
        <h1 className="commerce-title">COMMERCE MANAGEMENT</h1>
        <div className="commerce-divider"></div>
      </div>

      <div className="commerce-content-grid">
        {/* SHIPPING SECTION */}
        <div className="commerce-section">
          <h2 className="commerce-section-title">SHIPPING CONFIGURATION</h2>

          {/* Current Shipping Settings */}
          {(savedShipping.shippingFee || savedShipping.freeShippingOver) && (
            <div className="commerce-saved-box">
              <div className="commerce-saved-header">
                CURRENT SETTINGS
                <button
                  className="commerce-delete-btn"
                  onClick={handleDeleteShippingConfirm}
                  title="Delete shipping settings"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="commerce-saved-content">
                {savedShipping.shippingFee && (
                  <div className="commerce-saved-item">
                    <span className="commerce-saved-label">Shipping Fee</span>
                    <span className="commerce-saved-value">
                      LKR {savedShipping.shippingFee}
                    </span>
                  </div>
                )}
                {savedShipping.freeShippingOver && (
                  <div className="commerce-saved-item">
                    <span className="commerce-saved-label">
                      Free Shipping Over
                    </span>
                    <span className="commerce-saved-value">
                      LKR {savedShipping.freeShippingOver}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="commerce-form-box">
            <div className="commerce-form-group">
              <label className="commerce-label">SHIPPING FEE</label>
              <input
                type="number"
                className="commerce-input"
                placeholder="Enter fee amount"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
              />
            </div>

            <div className="commerce-form-group">
              <label className="commerce-label">FREE SHIPPING THRESHOLD</label>
              <input
                type="number"
                className="commerce-input"
                placeholder="Enter minimum amount"
                value={freeShippingOver}
                onChange={(e) => setFreeShippingOver(e.target.value)}
              />
            </div>

            <button className="commerce-btn" onClick={handleSaveShipping}>
              UPDATE SHIPPING
            </button>
          </div>
        </div>

        {/* COUPON SECTION */}
        <div className="commerce-section">
          <h2 className="commerce-section-title">COUPON MANAGEMENT</h2>

          {/* Active Coupons */}
          {savedCoupons.length > 0 && (
            <div className="commerce-saved-box">
              <div className="commerce-saved-header">ACTIVE COUPONS</div>
              <div className="commerce-coupon-list">
                {savedCoupons.map((coupon, idx) => (
                  <div key={idx} className="commerce-coupon-item">
                    <div className="commerce-coupon-code">{coupon.code}</div>
                    <div className="commerce-coupon-details">
                      <span className="commerce-coupon-type">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% OFF`
                          : `LKR ${coupon.discountValue} OFF`}
                      </span>
                    </div>
                    <button
                      className="commerce-coupon-delete-btn"
                      onClick={() => handleDeleteCouponConfirm(coupon.code)}
                      title="Delete coupon"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="commerce-form-box">
            <div className="commerce-form-group">
              <label className="commerce-label">COUPON CODE</label>
              <input
                type="text"
                className="commerce-input"
                placeholder="e.g. LUXURY20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
            </div>

            <div className="commerce-form-group">
              <label className="commerce-label">DISCOUNT TYPE</label>
              <select
                className="commerce-select"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="commerce-form-group">
              <label className="commerce-label">DISCOUNT VALUE</label>
              <input
                type="number"
                className="commerce-input"
                placeholder={
                  discountType === "percentage"
                    ? "Enter percentage"
                    : "Enter amount"
                }
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>

            <button className="commerce-btn" onClick={handleAddCoupon}>
              CREATE COUPON
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .commerce-main-container {
          min-height: 100vh;
          background: #fafafa;
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .commerce-header {
          padding: 60px 0 40px 0;
          text-align: center;
          background: #ffffff;
          border-bottom: 1px solid #e8e8e8;
        }

        .commerce-title {
          font-size: 32px;
          font-weight: 200;
          letter-spacing: 3px;
          color: #000000;
          margin: 0;
          text-transform: uppercase;
        }

        .commerce-divider {
          width: 80px;
          height: 1px;
          background: #000000;
          margin: 20px auto 0;
        }

        .commerce-content-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .commerce-section {
          background: #ffffff;
          border: 1px solid #e0e0e0;
        }

        .commerce-section-title {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 2px;
          color: #000000;
          margin: 0;
          padding: 30px 30px 20px 30px;
          text-transform: uppercase;
          border-bottom: 1px solid #f0f0f0;
        }

        .commerce-saved-box {
          margin: 0 30px 30px 30px;
          border: 1px solid #e8e8e8;
          background: #f8f8f8;
        }

        .commerce-saved-header {
          background: #000000;
          color: #ffffff;
          padding: 12px 20px;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .commerce-delete-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }

        .commerce-delete-btn:hover {
          opacity: 0.7;
        }

        .commerce-saved-content {
          padding: 20px;
        }

        .commerce-saved-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eeeeee;
        }

        .commerce-saved-item:last-child {
          border-bottom: none;
        }

        .commerce-saved-label {
          font-size: 13px;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .commerce-saved-value {
          font-size: 16px;
          font-weight: 400;
          color: #000000;
        }

        .commerce-coupon-list {
          padding: 20px;
        }

        .commerce-coupon-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eeeeee;
          gap: 15px;
        }

        .commerce-coupon-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex: 1;
        }

        .commerce-coupon-delete-btn {
          background: transparent;
          border: none;
          color: #999999;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }

        .commerce-coupon-delete-btn:hover {
          color: #000000;
        }

        .commerce-coupon-item:last-child {
          border-bottom: none;
        }

        .commerce-coupon-code {
          font-size: 16px;
          font-weight: 500;
          color: #000000;
          letter-spacing: 1px;
        }

        .commerce-coupon-type {
          font-size: 12px;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .commerce-form-box {
          padding: 30px;
        }

        .commerce-form-group {
          margin-bottom: 25px;
        }

        .commerce-label {
          display: block;
          font-size: 11px;
          font-weight: 400;
          color: #000000;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .commerce-input,
        .commerce-select {
          width: 100%;
          padding: 15px;
          border: 1px solid #d0d0d0;
          background: #ffffff;
          color: #000000;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .commerce-input:focus,
        .commerce-select:focus {
          border-color: #000000;
        }

        .commerce-input::placeholder {
          color: #aaaaaa;
          font-style: italic;
        }

        .commerce-btn {
          width: 100%;
          padding: 18px;
          background: #000000;
          color: #ffffff;
          border: none;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-family: inherit;
        }

        .commerce-btn:hover {
          background: #333333;
        }

        .commerce-btn:active {
          background: #000000;
        }

        @media (max-width: 1000px) {
          .commerce-content-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 40px 20px;
          }
        }
        @media (max-width: 768px) {
          .commerce-title {
            font-size: 24px;
            letter-spacing: 2px;
          }

          .commerce-header {
            padding: 40px 0 30px 0;
          }
        }

        @media (max-width: 480px) {
          .commerce-form-box,
          .commerce-section-title {
            padding: 20px;
          }

          .commerce-saved-box {
            margin: 0 20px 20px 20px;
          }
        }
      `}</style>
    </div>
  );
};
