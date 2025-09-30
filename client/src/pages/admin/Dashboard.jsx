import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingBag,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboardData } from "../../api/admin";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: { revenue: 0, users: 0, orders: 0 },
    recentOrders: [],
    topProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getDashboardData();
        console.log("Dashboard Data:", data);
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate conversion rate (orders/users * 100)
  const conversionRate =
    dashboardData.stats.users > 0
      ? (
          (dashboardData.stats.orders / dashboardData.stats.users) *
          100
        ).toFixed(2)
      : 0;

  const stats = [
    {
      title: "Total Revenue",
      value: `LKR ${dashboardData.stats.revenue.toLocaleString()}`,
      change: "+12.5%", // You can calculate this based on previous period data
      trend: "up",
      period: "vs last month",
    },
    {
      title: "Active Users",
      value: dashboardData.stats.users.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      period: "vs last month",
    },
    {
      title: "Total Orders",
      value: dashboardData.stats.orders.toLocaleString(),
      change: "-2.1%",
      trend: "down",
      period: "vs last month",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      change: "+0.8%",
      trend: "up",
      period: "vs last month",
    },
  ];

  const getOrderStatus = (status) => {
    const statusMap = {
      pending: "Processing",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Completed",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, here's what's happening with your store today.
          </p>
        </div>
        <div className="header-actions">
          <Link to="/admin/products/" className="dashboard-btn-primary">
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <h3 className="stat-title">{stat.title}</h3>
              <div className={`stat-trend ${stat.trend}`}>
                {stat.trend === "up" ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">
              <span className={stat.trend}>{stat.change}</span>
              <span className="stat-period">{stat.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Orders */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Recent Orders</h2>
            <Link to="/admin/orders" className="view-all">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="orders-cards">
            {dashboardData.recentOrders.length > 0 ? (
              dashboardData.recentOrders.map((order, index) => (
                <div key={order._id || index} className="order-card">
                  <div className="order-info">
                    <span className="order-id">#{order.orderNumber}</span>
                    <span className="customer-name">
                      {order.shippingAddress
                        ? `${order.shippingAddress.firstName || ""} ${
                            order.shippingAddress.lastName || ""
                          }`
                        : "(Guest)"}
                    </span>

                    <span className="product-name">
                      {order.items?.[0]?.name || "Multiple Items"}
                      {order.items?.length > 1 &&
                        ` +${order.items.length - 1} more`}
                    </span>
                  </div>
                  <div className="order-stats">
                    <span className="amount">
                      LKR {order.total.toLocaleString()}
                    </span>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {getOrderStatus(order.status)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No recent orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Top Products by Sales</h2>
          </div>
          <div className="products-list">
            {dashboardData.topProducts.length > 0 ? (
              dashboardData.topProducts.map((product, index) => (
                <div key={product._id || index} className="product-item">
                  <div className="product-info">
                    <div>{product.name}</div>
                    <p className="product-description">
                      {product.sales} units sold • Total revenue: LKR
                      {product.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="product-stats">
                    <span className="product-sales">{product.sales} sold</span>
                    <div className={`product-trend up`}>
                      <TrendingUp size={14} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No product sales data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #666;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 2px solid #e5e5e5;
          border-top: 2px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .product-stats {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .product-sales {
          font-size: 14px;
          color: #666;
        }

        .product-trend {
          color: #10b981;
        }

        .dashboard-btn-primary {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
