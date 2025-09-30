import React, { useState, useEffect } from "react";
import { getOrders, updateOrderStatuses } from "../../api/admin";
import PopMessage from "../../components/client/PopMessage";
import { Spinner } from "../../components/client/Spinner";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const mockOrders = [
    {
      _id: "68d7b29bad8948bccad4c7da",
      user: {
        _id: "68caddc0555a49b32d5deea2",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      items: [
        {
          productId: "68c83a253298e0a973c12cb5",
          variationId: "68c989aafe21aa47798bc093",
          name: "Product name will be here",
          price: 1000,
          quantity: 1,
          totalPrice: 1000,
          image:
            "https://res.cloudinary.com/dg0fncqyz/image/upload/v1758038441/wswyipjn…",
          attributes: {
            Colors: "Blue",
          },
          _id: "68d7b29bad8948bccad4c7db",
        },
      ],
      shippingFee: 500,
      freeShippingOver: 5000,
      subtotal: 1000,
      discount: 0,
      total: 1500,
      shippingAddress: {
        firstName: "Hamthy",
        lastName: "Zainul",
        email: "hamthyzainul@gmail.com",
        phone: "0773398946",
        address: "Market Road",
        city: "Colombo, Western Province, Sri Lanka",
        postalCode: "30100",
        country: "Sri Lanka",
      },
      status: "pending",
      createdAt: "2025-09-27T09:47:07.936Z",
      updatedAt: "2025-09-27T09:47:07.936Z",
      orderNumber: "WS-427937",
    },
    {
      _id: "68d801b87f7e93433181a81f",
      user: null,
      items: [
        {
          productId: "68c83a253298e0a973c12cb5",
          variationId: "68c989aafe21aa47798bc093",
          name: "Product name will be here",
          price: 1000,
          quantity: 1,
          totalPrice: 1000,
          image:
            "https://res.cloudinary.com/dg0fncqyz/image/upload/v1758038441/wswyipjn…",
          attributes: {
            Colors: "Blue",
          },
          _id: "68d801b87f7e93433181a820",
        },
      ],
      shippingFee: 500,
      freeShippingOver: 5000,
      subtotal: 1000,
      discount: 0,
      total: 1500,
      shippingAddress: {
        firstName: "Hamthy",
        lastName: "Zainul",
        email: "hamthyzainul@gmail.com",
        phone: "0773398946",
        address: "Market Road",
        city: "Colombo, Western Province, Sri Lanka",
        postalCode: "30100",
        country: "Sri Lanka",
      },
      status: "processing",
      createdAt: "2025-09-27T15:24:40.231Z",
      updatedAt: "2025-09-27T15:24:40.231Z",
      orderNumber: "WS-680233",
    },
  ];
  useEffect(() => {
    async function fetchOrders() {
      const allOrders = await getOrders();
      setOrders(allOrders);
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const [popUp, setPopUp] = useState({ state: false, message: "", status: "" });
  const [showSpinner, setShowSpinner] = useState(false);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setShowSpinner(true);
      // call backend
      const updated = await updateOrderStatuses(orderId, newStatus);

      // update orders list in state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, ...updated.order } : order
        )
      );

      // update selected order in state
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated.order);
      }

      setShowSpinner(false);
      setPopUp({ state: true, message: updated.message, status: "success" });
    } catch (err) {
      setShowSpinner(false);
      setPopUp({
        state: true,
        message: err ? err : "Something went wrong!",
        status: "error",
      });
    }
  };

  return (
    <>
      <style>{`
        .admin-orders-container {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: "Inter", "Manrope", Geist, sans-serif;
          color: #000000;
        }

        .admin-orders-header {
          background: #ffffff;
          border-bottom: 1px solid #e5e5e5;
          padding: 24px 0;
        }

        .admin-orders-header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .admin-orders-title {
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 0.05em;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .admin-orders-subtitle {
          font-size: 14px;
          color: #666666;
          margin: 0;
        }

        .admin-orders-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .admin-orders-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .admin-orders-stat-card {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          padding: 24px;
          text-align: center;
        }

        .admin-orders-stat-number {
          font-size: 32px;
          font-weight: 300;
          margin-bottom: 8px;
          color: #000000;
        }

        .admin-orders-stat-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666666;
        }

        .admin-orders-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .admin-orders-search {
          flex: 1;
          min-width: 250px;
          padding: 12px 16px;
          border: 1px solid #e5e5e5;
          background: #ffffff;
          font-size: 14px;
          outline: none;
        }

        .admin-orders-search:focus {
          border-color: #000000;
        }

        .admin-orders-filter-select {
          padding: 12px 16px;
          border: 1px solid #e5e5e5;
          background: #ffffff;
          font-size: 14px;
          outline: none;
          cursor: pointer;
        }

        .admin-orders-filter-select:focus {
          border-color: #000000;
        }

        .admin-orders-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 32px;
          align-items: start;
        }

        .admin-orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-orders-order-card {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          padding: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .admin-orders-order-card:hover {
          border-color: #000000;
        }

        .admin-orders-order-card.selected {
          border-color: #000000;
          background: #fafafa;
        }

        .admin-orders-order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .admin-orders-order-number {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .admin-orders-order-status {
          padding: 4px 12px;
          color: white;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .admin-orders-order-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          font-size: 14px;
        }

        .admin-orders-order-info-item {
          display: flex;
          flex-direction: column;
        }

        .admin-orders-order-info-label {
          font-size: 11px;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .admin-orders-order-info-value {
          color: #000000;
        }

        .admin-orders-details-panel {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          padding: 24px;
          position: sticky;
          top: 24px;
          max-height: calc(100vh - 48px);
          overflow-y: auto;
        }

        .admin-orders-details-title {
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.05em;
          margin: 0 0 24px 0;
          text-transform: uppercase;
        }

        .admin-orders-details-section {
          margin-bottom: 32px;
        }

        .admin-orders-details-section:last-child {
          margin-bottom: 0;
        }

        .admin-orders-details-section-title {
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          color: #000000;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 8px;
        }

        .admin-orders-details-grid {
          display: grid;
          grid-template-columns: 2fr 1fr ;
          gap: 16px;
        }

        .admin-orders-details-item {
          display: flex;
          flex-direction: column;
        }

        .admin-orders-details-label {
          font-size: 11px;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .admin-orders-details-value {
          color: #000000;
          font-size: 14px;
        }

        .admin-orders-product-item {
          display: flex;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .admin-orders-product-item:last-child {
          border-bottom: none;
        }

        .admin-orders-product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border: 1px solid #e5e5e5;
          flex-shrink: 0;
        }

        .admin-orders-product-info {
          flex: 1;
        }

        .admin-orders-product-name {
          font-weight: 500;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .admin-orders-product-attributes {
          font-size: 12px;
          color: #666666;
          margin-bottom: 4px;
        }

        .admin-orders-product-price {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-top: 8px;
        }

        .admin-orders-status-update {
          margin-top: 24px;
        }

        .admin-orders-status-select {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e5e5;
          background: #ffffff;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .admin-orders-update-btn {
          width: 100%;
          padding: 12px;
          background: #000000;
          color: #ffffff;
          border: none;
          cursor: pointer;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: background 0.2s ease;
        }

        .admin-orders-update-btn:hover {
          background: #333333;
        }

        .admin-orders-empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #666666;
        }

        .admin-orders-no-selection {
          text-align: center;
          padding: 80px 20px;
          color: #666666;
        }
          @media(max-width: 990px){
               .admin-orders-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
            }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .admin-orders-main {
            padding: 24px 16px;
          }

     

          .admin-orders-details-panel {
            position: static;
            max-height: none;
          }

          .admin-orders-controls {
            flex-direction: column;
          }

          .admin-orders-search {
            min-width: auto;
          }
        }
      `}</style>
      {showSpinner && <Spinner />}
      {popUp.state && (
        <PopMessage message={popUp.message} status={popUp.status} />
      )}
      <div className="admin-orders-container">
        <div className="admin-orders-header">
          <div className="admin-orders-header-content">
            <h1 className="admin-orders-title">Order Management</h1>
            <p className="admin-orders-subtitle">
              Manage all customer orders and track order status
            </p>
          </div>
        </div>

        <div className="admin-orders-main">
          {/* Stats Cards */}
          <div className="admin-orders-stats">
            <div className="admin-orders-stat-card">
              <div className="admin-orders-stat-number">{orders.length}</div>
              <div className="admin-orders-stat-label">Total Orders</div>
            </div>
            <div className="admin-orders-stat-card">
              <div className="admin-orders-stat-number">
                {orders.filter((o) => o.status === "pending").length}
              </div>
              <div className="admin-orders-stat-label">Pending</div>
            </div>
            <div className="admin-orders-stat-card">
              <div className="admin-orders-stat-number">
                {orders.filter((o) => o.status === "processing").length}
              </div>
              <div className="admin-orders-stat-label">Processing</div>
            </div>
            <div className="admin-orders-stat-card">
              <div className="admin-orders-stat-number">
                LKR
                {orders
                  .reduce((sum, order) => sum + order.total, 0)
                  .toLocaleString()}
              </div>
              <div className="admin-orders-stat-label">Total Revenue</div>
            </div>
          </div>

          {/* Controls */}
          <div className="admin-orders-controls">
            <input
              type="text"
              className="admin-orders-search"
              placeholder="Search by order number, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="admin-orders-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Main Grid */}
          <div className="admin-orders-grid">
            {/* Orders List */}
            <div className="admin-orders-list">
              {filteredOrders.length === 0 ? (
                <div className="admin-orders-empty-state">
                  <h3>No orders found</h3>
                  <p>No orders match your current filter criteria.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className={`admin-orders-order-card ${
                      selectedOrder?._id === order._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="admin-orders-order-header">
                      <div className="admin-orders-order-number">
                        #{order.orderNumber}
                      </div>
                      <div
                        className="admin-orders-order-status"
                        style={{
                          backgroundColor: getStatusColor(order.status),
                        }}
                      >
                        {order.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="admin-orders-order-info">
                      <div className="admin-orders-order-info-item">
                        <div className="admin-orders-order-info-label">
                          Customer
                        </div>
                        <div className="admin-orders-order-info-value">
                          {order.shippingAddress
                            ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                            : `${order.shippingAddress.firstName} ${order.shippingAddress.lastName} (Guest)`}
                        </div>
                      </div>
                      <div className="admin-orders-order-info-item">
                        <div className="admin-orders-order-info-label">
                          Total
                        </div>
                        <div className="admin-orders-order-info-value">
                          LKR {order.total.toLocaleString()}
                        </div>
                      </div>
                      <div className="admin-orders-order-info-item">
                        <div className="admin-orders-order-info-label">
                          Date
                        </div>
                        <div className="admin-orders-order-info-value">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="admin-orders-order-info-item">
                        <div className="admin-orders-order-info-label">
                          Items
                        </div>
                        <div className="admin-orders-order-info-value">
                          {order.items.length} item(s)
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Details Panel */}
            <div className="admin-orders-details-panel">
              {selectedOrder ? (
                <>
                  <h2 className="admin-orders-details-title">
                    Order #{selectedOrder.orderNumber}
                  </h2>

                  {/* Order Information */}
                  <div className="admin-orders-details-section">
                    <h3 className="admin-orders-details-section-title">
                      Order Information
                    </h3>
                    <div className="admin-orders-details-grid">
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Order ID
                        </div>
                        <div className="admin-orders-details-value">
                          {selectedOrder._id}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">Status</div>
                        <div
                          className="admin-orders-details-value"
                          style={{
                            color: getStatusColor(selectedOrder.status),
                          }}
                        >
                          {selectedOrder.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Created
                        </div>
                        <div className="admin-orders-details-value">
                          {formatDate(selectedOrder.createdAt)}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Last Updated
                        </div>
                        <div className="admin-orders-details-value">
                          {formatDate(selectedOrder.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="admin-orders-details-section">
                    <h3 className="admin-orders-details-section-title">
                      Customer Information
                    </h3>
                    <div className="admin-orders-details-grid">
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Customer Type
                        </div>
                        <div className="admin-orders-details-value">
                          {selectedOrder.user
                            ? "Registered User"
                            : "Guest User"}
                        </div>
                      </div>
                      {selectedOrder.user && (
                        <div className="admin-orders-details-item">
                          <div className="admin-orders-details-label">
                            User ID
                          </div>
                          <div className="admin-orders-details-value">
                            {selectedOrder.user}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="admin-orders-details-section">
                    <h3 className="admin-orders-details-section-title">
                      Shipping Address
                    </h3>
                    <div className="admin-orders-details-grid">
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">Name</div>
                        <div className="admin-orders-details-value">
                          {selectedOrder.shippingAddress.firstName}{" "}
                          {selectedOrder.shippingAddress.lastName}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">Email</div>
                        <div className="admin-orders-details-value">
                          {selectedOrder.shippingAddress.email}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">Phone</div>
                        <div className="admin-orders-details-value">
                          {selectedOrder.shippingAddress.phone}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Address
                        </div>
                        <div className="admin-orders-details-value">
                          {selectedOrder.shippingAddress.address}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">City</div>
                        <div className="admin-orders-details-value">
                          {selectedOrder.shippingAddress.city}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Postal Code
                        </div>
                        <div className="admin-orders-details-value">
                          {selectedOrder.shippingAddress.postalCode}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Country
                        </div>
                        <div className="admin-orders-details-value">
                          {selectedOrder.shippingAddress.country}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="admin-orders-details-section">
                    <h3 className="admin-orders-details-section-title">
                      Order Items
                    </h3>
                    {selectedOrder.items.map((item) => (
                      <div key={item._id} className="admin-orders-product-item">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="admin-orders-product-image"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/80/80";
                          }}
                        />
                        <div className="admin-orders-product-info">
                          <div className="admin-orders-product-name">
                            {item.name}
                          </div>
                          <div className="admin-orders-product-attributes">
                            Product ID: {item.productId}
                            <br />
                            {item.variationId &&
                              `Variation ID: ${item.variationId}`}
                            <br />
                            {Object.entries(item.attributes)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")}
                          </div>
                          <div className="admin-orders-product-price">
                            <span>Qty: {item.quantity}</span>
                            <span>Unit: LKR {item.price.toLocaleString()}</span>
                            <span>
                              Total: LKR {item.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="admin-orders-details-section">
                    <h3 className="admin-orders-details-section-title">
                      Order Summary
                    </h3>
                    <div className="admin-orders-details-grid">
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Subtotal
                        </div>
                        <div className="admin-orders-details-value">
                          LKR {(selectedOrder.subtotal || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Discount
                        </div>
                        <div className="admin-orders-details-value">
                          LKR {(selectedOrder.discount || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Shipping Fee
                        </div>
                        <div className="admin-orders-details-value">
                          LKR{" "}
                          {(selectedOrder.shippingFee || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">
                          Free Shipping Over
                        </div>
                        <div className="admin-orders-details-value">
                          LKR{" "}
                          {(
                            selectedOrder.freeShippingOver || 0
                          ).toLocaleString()}
                        </div>
                      </div>
                      <div className="admin-orders-details-item">
                        <div className="admin-orders-details-label">Total</div>
                        <div
                          className="admin-orders-details-value"
                          style={{ fontWeight: "bold" }}
                        >
                          LKR {(selectedOrder.total || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="admin-orders-status-update">
                    <h3 className="admin-orders-details-section-title">
                      Update Order Status
                    </h3>
                    <select
                      className="admin-orders-status-select"
                      value={selectedOrder.status}
                      onChange={(e) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          status: e.target.value, // only update state
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      className="admin-orders-update-btn"
                      onClick={
                        () =>
                          updateOrderStatus(
                            selectedOrder._id,
                            selectedOrder.status
                          ) // now update db
                      }
                    >
                      Update Status
                    </button>
                  </div>
                </>
              ) : (
                <div className="admin-orders-no-selection">
                  <h3>Select an Order</h3>
                  <p>
                    Click on an order from the list to view detailed
                    information.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
