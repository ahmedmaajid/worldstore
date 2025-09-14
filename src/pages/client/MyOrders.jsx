import React, { useState, useEffect } from "react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Simulate fetching orders
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: "LX-2024-001",
          date: "2024-09-05",
          status: "delivered",
          total: 2850,
          currency: "USD",
          items: [
            {
              id: 1,
              name: "MONOGRAM CANVAS HANDBAG",
              subtitle: "NOIR COLLECTION",
              color: "Monogram Brown",
              size: "ONE SIZE",
              quantity: 1,
              price: 2850,
              image: "/Watch.png",
            },
          ],
          shipping: {
            method: "Express Delivery",
            address: "123 Luxury Street, Colombo 03, Sri Lanka",
            trackingNumber: "LX789123456",
          },
          payment: "Cash on Delivery",
          deliveredDate: "2024-09-08",
        },
        {
          id: "LX-2024-002",
          date: "2024-09-03",
          status: "processing",
          total: 1450,
          currency: "USD",
          items: [
            {
              id: 2,
              name: "LEATHER WALLET",
              subtitle: "CLASSIC COLLECTION",
              color: "Black",
              size: "ONE SIZE",
              quantity: 1,
              price: 1450,
              image: "/Toy.png",
            },
          ],
          shipping: {
            method: "Standard Delivery",
            address: "456 Fashion Avenue, Kandy, Sri Lanka",
            trackingNumber: "LX789123457",
          },
          payment: "Cash on Delivery",
          estimatedDelivery: "2024-09-10",
        },
        {
          id: "LX-2024-003",
          date: "2024-08-28",
          status: "shipped",
          total: 3200,
          currency: "USD",
          items: [
            {
              id: 3,
              name: "SILK SCARF",
              subtitle: "HERITAGE COLLECTION",
              color: "Royal Blue",
              size: "90x90cm",
              quantity: 2,
              price: 1600,
              image: "/api/placeholder/120/120",
            },
          ],
          shipping: {
            method: "Express Delivery",
            address: "789 Elite Road, Galle, Sri Lanka",
            trackingNumber: "LX789123458",
          },
          payment: "Cash on Delivery",
          estimatedDelivery: "2024-09-09",
        },
        {
          id: "LX-2024-004",
          date: "2024-08-15",
          status: "cancelled",
          total: 950,
          currency: "USD",
          items: [
            {
              id: 4,
              name: "LEATHER BELT",
              subtitle: "CONTEMPORARY COLLECTION",
              color: "Brown",
              size: "95cm",
              quantity: 1,
              price: 950,
              image: "/api/placeholder/120/120",
            },
          ],
          shipping: {
            method: "Standard Delivery",
            address: "321 Modern Street, Negombo, Sri Lanka",
          },
          payment: "Cash on Delivery",
          cancelledDate: "2024-08-16",
          cancelReason: "Customer requested cancellation",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      processing: "#f59e0b",
      shipped: "#3b82f6",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusText = (status) => {
    const texts = {
      processing: "PROCESSING",
      shipped: "SHIPPED",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
    };
    return texts[status] || status.toUpperCase();
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>LOADING YOUR ORDERS...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .orders-container {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: "Manrope", "Inter", Geist, sans-serif;
          font-weight: 500;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .page-subtitle {
          color: #666;
          font-size: 14px;
          letter-spacing: 0.05em;
        }

        .filters-container {
          position: relative;
          margin-bottom: 32px;
        }

        .filters {
          display: flex;
          gap: 16px;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 16px;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .filters::-webkit-scrollbar {
          display: none;
        }

        .filter-btn {
          padding: 8px 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
          color: #666;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .filter-btn.active,
        .filter-btn:hover {
          color: #000;
          border-bottom-color: #000;
        }

        .scroll-fade {
          display: none;
        }

        .orders-grid {
          display: grid;
          gap: 24px;
        }

        .order-card {
          border: 1px solid #e5e5e5;
          background: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .order-header {
          padding: 24px 32px;
          border-bottom: 1px solid #f5f5f5;
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 24px;
          align-items: center;
        }

        .order-info h3 {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .order-info p {
          color: #666;
          font-size: 14px;
        }

        .order-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-align: center;
          min-width: 100px;
        }

        .order-total {
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .order-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #ccc;
          cursor: pointer;
          font-size: 11px;
          letter-spacing: 1px;
          font-weight: 600;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          border-color: #000;
          background: #f9f9f9;
        }

        .action-btn.primary {
          background: #000;
          color: white;
          border-color: #000;
        }

        .action-btn.primary:hover {
          background: #333;
        }

        .order-items {
          padding: 24px 32px;
        }

        .order-item {
          display: grid;
          grid-template-columns: 80px 1fr auto auto;
          gap: 16px;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border: 1px solid #e5e5e5;
        }

        .item-details h4 {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .item-details p {
          color: #666;
          font-size: 12px;
          margin-bottom: 2px;
        }

        .item-quantity {
          color: #666;
          font-size: 14px;
        }

        .item-price {
          font-size: 16px;
          font-weight: 500;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: white;
        }

        .spinner-large {
          width: 40px;
          height: 40px;
          border: 2px solid #e5e5e5;
          border-top: 2px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-state h3 {
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 32px;
        }

        .empty-state-btn {
          padding: 16px 32px;
          background: #000;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: background 0.3s ease;
        }

        .empty-state-btn:hover {
          background: #333;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-header {
          padding: 32px 32px 24px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 0.1em;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 4px;
        }

        .modal-close:hover {
          color: #000;
        }

        .modal-content {
          padding: 32px;
        }

        .detail-section {
          margin-bottom: 32px;
        }

        .detail-section h4 {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 12px;
          color: #666;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .detail-value {
          font-size: 14px;
          color: #000;
        }

        .tracking-section {
          background: #f9f9f9;
          padding: 24px;
          margin: 24px 0;
        }

        .tracking-number {
          font-size: 16px;
          font-weight: bold;
          color: #000;
          background: white;
          padding: 12px 16px;
          border: 1px solid #e5e5e5;
          margin-top: 8px;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .main-content {
            padding: 20px 16px;
          }

          .page-title {
            font-size: 24px;
            margin-bottom: 6px;
          }

          .page-subtitle {
            font-size: 12px;
          }

          /* Mobile filters with scroll indicator */
          .filters-container {
            position: relative;
          }

          .scroll-fade {
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 16px;
            width: 40px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 50%, #ffffff);
            pointer-events: none;
            z-index: 10;
          }

          .filters {
            padding-right: 40px;
            gap: 12px;
            margin-bottom: 24px;
          }

          .filter-btn {
            padding: 6px 12px;
            font-size: 11px;
            letter-spacing: 0.05em;
          }

          /* Mobile card layout */
          .order-card {
            margin: 0 -4px;
            border-radius: 8px;
            overflow: hidden;
          }

          .order-header {
            padding: 16px 20px;
            grid-template-columns: 1fr;
            gap: 12px;
            text-align: left;
          }

          .order-status {
            align-self: flex-start;
            width: fit-content;
            min-width: auto;
            padding: 4px 8px;
            font-size: 10px;
          }

          .order-total {
            font-size: 16px;
            align-self: flex-start;
          }

          .order-actions {
            align-self: flex-start;
            gap: 6px;
          }

          .action-btn {
            padding: 6px 12px;
            font-size: 10px;
            letter-spacing: 0.5px;
          }

          /* Mobile item layout */
          .order-items {
            padding: 16px 20px;
          }

          .order-item {
            grid-template-columns: 60px 1fr;
            gap: 12px;
            padding: 12px 0;
          }

          .item-image {
            width: 60px;
            height: 60px;
          }

          .item-details h4 {
            font-size: 13px;
            margin-bottom: 2px;
          }

          .item-details p {
            font-size: 11px;
          }

          .item-quantity {
            grid-column: 1 / -1;
            font-size: 12px;
            text-align: left;
            margin-top: 4px;
          }

          .item-price {
            grid-column: 1 / -1;
            font-size: 14px;
            text-align: left;
            margin-top: 2px;
          }

          /* Mobile modal */
          .modal-overlay {
            padding: 10px;
          }

          .modal {
            max-height: 95vh;
          }

          .modal-header {
            padding: 20px;
          }

          .modal-title {
            font-size: 18px;
          }

          .modal-content {
            padding: 20px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .detail-section {
            margin-bottom: 24px;
          }

          .detail-section h4 {
            font-size: 14px;
            margin-bottom: 12px;
          }

          .tracking-section {
            padding: 16px;
            margin: 16px 0;
          }

          .tracking-number {
            font-size: 14px;
            padding: 10px 12px;
          }

          .empty-state {
            padding: 60px 20px;
          }

          .empty-state h3 {
            font-size: 20px;
          }
        }

        /* Extra small mobile */
        @media (max-width: 480px) {
          .main-content {
            padding: 16px 12px;
          }

          .order-card {
            margin: 0 -2px;
          }

          .order-header,
          .order-items {
            padding-left: 16px;
            padding-right: 16px;
          }

          .filter-btn {
            padding: 5px 10px;
            font-size: 10px;
          }

          .item-details h4 {
            font-size: 12px;
          }

          .item-details p {
            font-size: 10px;
          }
        }
      `}</style>

      <div className="orders-container">
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">MY ORDERS</h1>
            <p className="page-subtitle">
              Track and manage your luxury purchases
            </p>
          </div>

          {/* Filters with mobile scroll indicator */}
          <div className="filters-container">
            <div className="filters">
              {["all", "processing", "shipped", "delivered", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    className={`filter-btn ${
                      filterStatus === status ? "active" : ""
                    }`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status === "all" ? "ALL ORDERS" : getStatusText(status)}
                  </button>
                )
              )}
            </div>
            <div className="scroll-fade"></div>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <h3>NO ORDERS FOUND</h3>
              <p>
                You haven't placed any orders yet or no orders match the
                selected filter.
              </p>
              <button className="empty-state-btn">START SHOPPING</button>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>ORDER #{order.id}</h3>
                      <p>Placed on {formatDate(order.date)}</p>
                    </div>
                    <div
                      className="order-status"
                      style={{
                        backgroundColor: getStatusColor(order.status),
                        color: "white",
                      }}
                    >
                      {getStatusText(order.status)}
                    </div>
                    <div className="order-total">
                      ${order.total.toLocaleString()}
                    </div>
                    <div className="order-actions">
                      <button
                        className="action-btn primary"
                        onClick={() => setSelectedOrder(order)}
                      >
                        DETAILS
                      </button>
                      {order.status === "processing" && (
                        <button className="action-btn">CANCEL</button>
                      )}
                      {order.status === "shipped" && (
                        <button className="action-btn">TRACK</button>
                      )}
                      {order.status === "delivered" && (
                        <button className="action-btn">REORDER</button>
                      )}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>{item.subtitle}</p>
                          <p>
                            Color: {item.color} | Size: {item.size}
                          </p>
                        </div>
                        <div className="item-quantity">
                          Qty: {item.quantity}
                        </div>
                        <div className="item-price">
                          ${item.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">ORDER #{selectedOrder.id}</h2>
                <button
                  className="modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="detail-section">
                  <h4>Order Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Order Date</span>
                      <span className="detail-value">
                        {formatDate(selectedOrder.date)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span
                        className="detail-value"
                        style={{ color: getStatusColor(selectedOrder.status) }}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Method</span>
                      <span className="detail-value">
                        {selectedOrder.payment}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value">
                        ${selectedOrder.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Items Ordered</h4>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>{item.subtitle}</p>
                        <p>
                          Color: {item.color} | Size: {item.size}
                        </p>
                      </div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                      <div className="item-price">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="detail-section">
                  <h4>Shipping Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Delivery Method</span>
                      <span className="detail-value">
                        {selectedOrder.shipping.method}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Delivery Address</span>
                      <span className="detail-value">
                        {selectedOrder.shipping.address}
                      </span>
                    </div>
                    {selectedOrder.deliveredDate && (
                      <div className="detail-item">
                        <span className="detail-label">Delivered On</span>
                        <span className="detail-value">
                          {formatDate(selectedOrder.deliveredDate)}
                        </span>
                      </div>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <div className="detail-item">
                        <span className="detail-label">Expected Delivery</span>
                        <span className="detail-value">
                          {formatDate(selectedOrder.estimatedDelivery)}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedOrder.shipping.trackingNumber && (
                    <div className="tracking-section">
                      <div className="detail-label">Tracking Number</div>
                      <div className="tracking-number">
                        {selectedOrder.shipping.trackingNumber}
                      </div>
                    </div>
                  )}
                </div>

                {selectedOrder.status === "cancelled" &&
                  selectedOrder.cancelReason && (
                    <div className="detail-section">
                      <h4>Cancellation Details</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Cancelled On</span>
                          <span className="detail-value">
                            {formatDate(selectedOrder.cancelledDate)}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Reason</span>
                          <span className="detail-value">
                            {selectedOrder.cancelReason}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
