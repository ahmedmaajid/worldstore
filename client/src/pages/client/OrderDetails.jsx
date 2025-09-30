import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Spinner } from "../../components/client/Spinner";
import { fetchOrderById } from "../../api/order";
import { checkAuth } from "../../api/checkAuth";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      try {
        const loggedIn = await checkAuth();
        if (!loggedIn) {
          navigate("/account/login", { replace: true });
          return;
        }
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/account/login", { replace: true });
      }
    }
    verifyAuth();
  }, [navigate]);

  // Fetch order only after auth is verified
  useEffect(() => {
    if (isCheckingAuth) return; // Don't fetch if still checking auth

    const getOrder = async () => {
      try {
        const fetchedOrder = await fetchOrderById(id);

        const transformedOrder = {
          id: fetchedOrder.orderNumber,
          _id: fetchedOrder._id,
          coupon: fetchedOrder.coupon,
          date: fetchedOrder.createdAt,
          status: fetchedOrder.status,
          total: fetchedOrder.total,
          items: fetchedOrder.items || [],
          shipping: {
            method:
              fetchedOrder.shippingFee > 0
                ? "Standard Delivery"
                : "Free Delivery",
            address: `${fetchedOrder.shippingAddress.address}, ${fetchedOrder.shippingAddress.city}, ${fetchedOrder.shippingAddress.country}`,
          },
          shippingFee: fetchedOrder.shippingFee,
          subtotal: fetchedOrder.subtotal,
          discount: fetchedOrder.discount,
          customerInfo: {
            name: `${fetchedOrder.shippingAddress.firstName} ${fetchedOrder.shippingAddress.lastName}`,
            email: fetchedOrder.shippingAddress.email,
            phone: fetchedOrder.shippingAddress.phone,
          },
        };

        setOrder(transformedOrder);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setIsLoading(false);
      }
    };

    getOrder();
  }, [id, isCheckingAuth]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "PENDING",
      processing: "PROCESSING",
      paid: "PAID",
      shipped: "SHIPPED",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
    };
    return texts[status] || status.toUpperCase();
  };

  const orderSteps = [
    {
      id: 1,
      status: "pending",
      label: "Order Placed",
      description: "We have received your order",
      icon: "📋",
    },
    {
      id: 2,
      status: "processing",
      label: "Processing",
      description: "Your order is being prepared",
      icon: "⚙️",
    },
    {
      id: 4,
      status: "shipped",
      label: "Shipped",
      description: "Your order is on its way",
      icon: "🚚",
    },
    {
      id: 5,
      status: "delivered",
      label: "Delivered",
      description: "Order has been delivered",
      icon: "📦",
    },
  ];

  const getStepStatus = (stepStatus, currentStatus) => {
    if (currentStatus === "cancelled") {
      return "cancelled";
    }

    const statusOrder = [
      "pending",
      "processing",
      "paid",
      "shipped",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex <= currentIndex) {
      return "completed";
    } else if (stepIndex === currentIndex + 1) {
      return "current";
    }
    return "upcoming";
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!order) {
    return (
      <div style={styles.notFound}>
        <h2>Order not found</h2>
        <button
          onClick={() => navigate("/my-orders")}
          style={styles.backButton}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @media(max-width: 480px){
        .card-child{
            grid-template-columns: 1fr 1fr !important}
            
        .card-section .card-child img{
            width: auto !important;
            height: auto !important;
        }

            .card-child div:last-child{
            grid-column:2 span !important
            }
        
        }

        @keyframes fillProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .order-step {
          animation: slideIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .order-step:nth-child(1) { animation-delay: 0.1s; }
        .order-step:nth-child(2) { animation-delay: 0.2s; }
        .order-step:nth-child(3) { animation-delay: 0.3s; }
        .order-step:nth-child(4) { animation-delay: 0.4s; }
        .order-step:nth-child(5) { animation-delay: 0.5s; }
        
        .step-icon-current {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .progress-fill {
          animation: fillProgress 1s ease-out forwards;
        }
        
        .card-section {
          animation: slideIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div style={styles.header}>
        <button onClick={() => navigate("/my-orders")} style={styles.backLink}>
          ← Back to Orders
        </button>
        <h1 style={styles.title}>Order Details</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.section}>
          <div style={styles.row}>
            <div style={styles.col}>
              <div style={styles.label}>Order Number</div>
              <div style={styles.value}>{order.id}</div>
            </div>
            <div style={styles.col}>
              <div style={styles.label}>Order Date</div>
              <div style={styles.value}>{formatDate(order.date)}</div>
            </div>
            <div style={styles.col}>
              <div style={styles.label}>Status</div>
              <div style={styles.statusBadge}>
                {getStatusText(order.status)}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.divider}></div>

        {/* Order Tracking Timeline */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Order Tracking</h3>
          <div style={styles.trackingContainer}>
            {order.status === "cancelled" ? (
              <div style={styles.cancelledMessage}>
                <span style={styles.cancelledIcon}>✕</span>
                <div>
                  <div style={styles.cancelledTitle}>Order Cancelled</div>
                  <div style={styles.cancelledDesc}>
                    This order has been cancelled
                  </div>
                </div>
              </div>
            ) : (
              orderSteps.map((step, index) => {
                const stepStatusResult = getStepStatus(
                  step.status,
                  order.status
                );
                const isCompleted = stepStatusResult === "completed";
                const isCurrent = stepStatusResult === "current";
                const isLast = index === orderSteps.length - 1;

                return (
                  <div key={step.id} className="order-step">
                    <div style={styles.stepContainer}>
                      <div style={styles.stepIconContainer}>
                        <div
                          className={isCurrent ? "step-icon-current" : ""}
                          style={{
                            ...styles.stepIcon,
                            ...(isCompleted && styles.stepIconCompleted),
                            ...(isCurrent && styles.stepIconCurrent),
                          }}
                        >
                          {isCompleted ? "✓" : step.icon}
                        </div>
                        {!isLast && (
                          <div style={styles.stepLine}>
                            <div
                              className={isCompleted ? "progress-fill" : ""}
                              style={{
                                ...styles.stepLineFill,
                                ...(isCompleted && styles.stepLineFillActive),
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div style={styles.stepContent}>
                        <div
                          style={{
                            ...styles.stepLabel,
                            ...(isCurrent && styles.stepLabelCurrent),
                          }}
                        >
                          {step.label}
                        </div>
                        <div style={styles.stepDescription}>
                          {step.description}
                        </div>
                        {isCurrent && (
                          <div style={styles.currentBadge}>In Progress</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={styles.divider}></div>

        <div className="card-section" style={styles.section}>
          <h3 style={styles.sectionTitle}>Items Ordered</h3>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => {
              const attributes = Object.entries(item.attributes || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");

              return (
                <div className="card-child" key={index} style={styles.item}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={styles.itemImage}
                  />
                  <div style={styles.itemDetails}>
                    <div style={styles.itemName}>{item.name}</div>
                    {attributes && (
                      <div style={styles.itemVariant}>{attributes}</div>
                    )}
                    <div style={styles.itemMeta}>
                      Qty: {item.quantity} × Rs {item.price.toLocaleString()}.00
                    </div>
                  </div>
                  <div style={styles.itemPrice}>
                    Rs {item.totalPrice.toLocaleString()}.00
                  </div>
                </div>
              );
            })
          ) : (
            <div style={styles.emptyMessage}>No items found</div>
          )}
        </div>

        <div style={styles.divider}></div>

        <div className="card-section" style={styles.section}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Subtotal</span>
            <span style={styles.summaryValue}>
              Rs {order.subtotal.toLocaleString()}.00
            </span>
          </div>
          {order.discount > 0 && (
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Discount</span>
              <span style={styles.summaryValue}>
                -Rs {order.discount.toLocaleString()}.00
              </span>
            </div>
          )}
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Shipping</span>
            <span style={styles.summaryValue}>
              {order.shippingFee === 0
                ? "Free"
                : `Rs ${order.shippingFee.toLocaleString()}.00`}
            </span>
          </div>
          <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
            <span style={styles.summaryLabel}>Total</span>
            <span style={styles.summaryValue}>
              Rs {order.total.toLocaleString()}.00
            </span>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div className="card-section" style={styles.section}>
          <h3 style={styles.sectionTitle}>Customer Information</h3>
          <div style={styles.row}>
            <div style={styles.col}>
              <div style={styles.label}>Name</div>
              <div style={styles.value}>{order.customerInfo.name}</div>
            </div>
            <div style={styles.col}>
              <div style={styles.label}>Email</div>
              <div style={styles.value}>{order.customerInfo.email}</div>
            </div>
            <div style={styles.col}>
              <div style={styles.label}>Phone</div>
              <div style={styles.value}>{order.customerInfo.phone}</div>
            </div>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div className="card-section" style={styles.section}>
          <h3 style={styles.sectionTitle}>Shipping Information</h3>
          <div style={styles.row}>
            <div style={styles.col}>
              <div style={styles.label}>Method</div>
              <div style={styles.value}>{order.shipping.method}</div>
            </div>
            <div style={{ ...styles.col, flex: 2 }}>
              <div style={styles.label}>Address</div>
              <div style={styles.value}>{order.shipping.address}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Inter', -apple-system, sans-serif",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "40px",
  },
  backLink: {
    background: "none",
    border: "none",
    color: "#666666",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "16px",
    padding: "0",
    fontFamily: "inherit",
    transition: "color 0.2s ease",
  },
  title: {
    fontSize: "28px",
    fontWeight: "300",
    color: "#1a1a1a",
    letterSpacing: "0.5px",
    margin: "0",
  },
  card: {
    border: "1px solid #e5e5e5",
    backgroundColor: "#ffffff",
  },
  section: {
    padding: "32px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#f5f5f5",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "11px",
    color: "#999999",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "500",
  },
  value: {
    fontSize: "14px",
    color: "#1a1a1a",
    lineHeight: "1.6",
  },
  statusBadge: {
    fontSize: "11px",
    color: "#1a1a1a",
    textTransform: "uppercase",
    letterSpacing: "1px",
    padding: "6px 12px",
    border: "1px solid #e5e5e5",
    display: "inline-block",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: "12px",
    color: "#999999",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "500",
    marginBottom: "24px",
  },
  // Tracking Timeline Styles
  trackingContainer: {
    position: "relative",
  },
  stepContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "8px",
  },
  stepIconContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },
  stepIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "2px solid #e5e5e5",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: "#999999",
    fontWeight: "500",
    transition: "all 0.3s ease",
    zIndex: 2,
  },
  stepIconCompleted: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
    color: "#ffffff",
  },
  stepIconCurrent: {
    borderColor: "#1a1a1a",
    borderWidth: "3px",
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    boxShadow: "0 0 0 4px rgba(26, 26, 26, 0.1)",
  },
  stepLine: {
    width: "2px",
    height: "60px",
    backgroundColor: "#e5e5e5",
    marginTop: "4px",
    position: "relative",
    overflow: "hidden",
  },
  stepLineFill: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "0%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    transition: "width 0.6s ease",
  },
  stepLineFillActive: {
    width: "100%",
  },
  stepContent: {
    paddingTop: "8px",
    paddingBottom: "16px",
    flex: 1,
  },
  stepLabel: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: "4px",
    transition: "color 0.3s ease",
  },
  stepLabelCurrent: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
  stepDescription: {
    fontSize: "13px",
    color: "#666666",
    lineHeight: "1.5",
  },
  currentBadge: {
    display: "inline-block",
    marginTop: "8px",
    padding: "4px 10px",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    borderRadius: "3px",
  },
  cancelledMessage: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "4px",
  },
  cancelledIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "600",
    flexShrink: 0,
  },
  cancelledTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#991b1b",
    marginBottom: "4px",
  },
  cancelledDesc: {
    fontSize: "14px",
    color: "#7f1d1d",
  },
  // Item Styles
  item: {
    display: "grid",
    gridTemplateColumns: "80px 1fr auto",
    gap: "20px",
    alignItems: "start",
    padding: "20px 0",
    borderBottom: "1px solid #f5f5f5",
  },
  itemImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    border: "1px solid #f0f0f0",
  },
  itemDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  itemName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1a1a1a",
  },
  itemVariant: {
    textTransform: "capitalize",
    fontSize: "13px",
    color: "#999999",
  },
  itemMeta: {
    fontSize: "13px",
    color: "#666666",
  },
  itemPrice: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#1a1a1a",
    textAlign: "right",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f5f5f5",
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#666666",
  },
  summaryValue: {
    fontSize: "14px",
    color: "#1a1a1a",
    fontWeight: "400",
  },
  summaryTotal: {
    borderTop: "1px solid #e5e5e5",
    borderBottom: "none",
    paddingTop: "16px",
    marginTop: "8px",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999999",
    fontSize: "14px",
    padding: "20px 0",
  },
  notFound: {
    textAlign: "center",
    padding: "80px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  backButton: {
    marginTop: "20px",
    padding: "12px 24px",
    background: "#1a1a1a",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontWeight: "500",
  },
};
