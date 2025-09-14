import React from "react";
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

export default function Dashboard() {
  const stats = [
    {
      title: "Total price",
      value: "$124,856",
      change: "+12.5%",
      trend: "up",
      period: "vs last month",
    },
    {
      title: "Active Users",
      value: "8,249",
      change: "+8.2%",
      trend: "up",
      period: "vs last month",
    },
    {
      title: "Orders",
      value: "1,429",
      change: "-2.1%",
      trend: "down",
      period: "vs last month",
    },
    {
      title: "Conversion",
      value: "3.24%",
      change: "+0.8%",
      trend: "up",
      period: "vs last month",
    },
  ];

  const recentOrders = [
    {
      id: "#LX001",
      customer: "Sarah Chen",
      product: "Premium Handbag",
      amount: "$2,450",
      status: "Completed",
    },
    {
      id: "#LX002",
      customer: "Michael Ross",
      product: "Leather Wallet",
      amount: "$890",
      status: "Processing",
    },
    {
      id: "#LX003",
      customer: "Emma Stone",
      product: "Silk Scarf",
      amount: "$620",
      status: "Shipped",
    },
    {
      id: "#LX004",
      customer: "James Wilson",
      product: "Watch Collection",
      amount: "$4,200",
      status: "Completed",
    },
    {
      id: "#LX005",
      customer: "Isabella Garcia",
      product: "Jewelry Set",
      amount: "$1,850",
      status: "Processing",
    },
  ];

  const topProducts = [
    {
      name: "Premium Leather Handbag",
      sales: 89,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolor doloremque adipisci recusandae beatae in, facere deleniti perferendis cumque quasi dicta",
      price: "$21,780",
      trend: "up",
    },
    {
      name: "Silk Evening Dress",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolor doloremque adipisci recusandae beatae in, facere deleniti perferendis cumque quasi dicta",
      sales: 67,
      price: "$18,900",
      trend: "up",
    },
    {
      name: "Gold Watch Collection",
      sales: 45,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolor doloremque adipisci recusandae beatae in, facere deleniti perferendis cumque quasi dicta",
      price: "$31,500",
      trend: "down",
    },
    {
      name: "Diamond Jewelry Set",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolor doloremque adipisci recusandae beatae in, facere deleniti perferendis cumque quasi dicta",
      sales: 34,
      price: "$28,200",
      trend: "up",
    },
    {
      name: "Cashmere Coat",
      sales: 29,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolor doloremque adipisci recusandae beatae in, facere deleniti perferendis cumque quasi dicta",
      price: "$14,500",
      trend: "up",
    },
  ];

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
          <button className="dashboard-btn-secondary">Export</button>
          <button className="dashboard-btn-primary">Add Product</button>
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
        {/* Recent Orders as cards */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Recent Orders</h2>
            <button className="view-all">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="orders-cards">
            {recentOrders.map((order, index) => (
              <div key={index} className="order-card">
                <div className="order-info">
                  <span className="order-id">{order.id}</span>
                  <span className="customer-name">{order.customer}</span>
                  <span className="product-name">{order.product}</span>
                </div>
                <div className="order-stats">
                  <span className="amount">{order.amount}</span>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Recent Products</h2>
          </div>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-info">
                  <Link to="#" className="product-name">
                    {product.name}
                  </Link>
                  <p className="product-description">
                    {product.description} units sold
                  </p>
                </div>
                <div className="product-stats">
                  <span className="product-price">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
