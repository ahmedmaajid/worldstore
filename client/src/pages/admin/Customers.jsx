import React, { useState, useEffect } from "react";
import { Eye, Calendar, ShoppingBag, Mail, Phone, User } from "lucide-react";
import { getCustomers } from "../../api/admin.js";
import "../../styles/admin/customer.css"; // separate CSS file

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await getCustomers();
        setCustomers(Array.isArray(response) ? response : []);
      } catch (error) {
        console.log(error);
        setCustomers([]);
      }
    }
    fetchCustomers();
  }, []);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#27AE60";
      case "Shipped":
        return "#3498DB";
      case "Processing":
        return "#F39C12";
      default:
        return "#95A5A6";
    }
  };

  return (
    <div className="customer-container">
      <div className="customer-header">
        <div className="customer-header-inner">
          <h1>Customer Management</h1>
          <p>Manage and view all registered customers</p>
        </div>
      </div>

      <div className="customer-main">
        {/* Stats Overview */}
        <div className="customer-stats">
          {[
            { label: "Total Customers", value: customers.length, icon: User },
            {
              label: "Total Orders",
              value: customers.reduce(
                (acc, c) => acc + (c.totalOrders || 0),
                0
              ),
              icon: ShoppingBag,
            },
            {
              label: "Revenue",
              value: `LKR ${customers
                .reduce((acc, c) => acc + (c.totalSpent || 0), 0)
                .toLocaleString()}`,
              icon: Calendar,
            },
          ].map((stat, index) => (
            <div key={index} className="customer-stat-card">
              <div className="customer-stat-header">
                <stat.icon size={24} color="#666" />
                <span>{stat.label}</span>
              </div>
              <div className="customer-stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Customer Cards */}
        <div className="customer-cards">
          {customers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-card-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    {customer.firstName
                      ? customer.firstName[0] + customer.lastName[0]
                      : "?"}
                  </div>
                  <h3>
                    {customer.firstName + " " + customer.lastName ||
                      "Unknown Customer"}
                  </h3>
                </div>
                <button
                  className="customer-toggle-btn"
                  onClick={() =>
                    setSelectedCustomer(
                      selectedCustomer === customer.id ? null : customer.id
                    )
                  }
                >
                  <Eye size={16} />
                  {selectedCustomer === customer.id
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </div>

              <div className="customer-info-grid">
                <div className="customer-info-item">
                  <Mail size={16} />
                  <span>{customer.email || "-"}</span>
                </div>
                <div className="customer-info-item">
                  <Phone size={16} />
                  <span>{customer.phone || "-"}</span>
                </div>
                <div className="customer-info-item">
                  <Calendar size={16} />
                  <span>
                    Joined{" "}
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="customer-stats-row">
                <div className="customer-stats-item">
                  <div>{customer.totalOrders || "0"}</div>
                  <div>Total Orders</div>
                </div>
                <div className="customer-stats-item">
                  <div>LKR {customer.totalSpent?.toLocaleString() || "0"}</div>
                  <div>Total Spent</div>
                </div>
                <div className="customer-stats-item">
                  <div>{customer.lastOrder || "-"}</div>
                  <div>Last Order</div>
                </div>
              </div>

              {selectedCustomer === customer.id && (
                <div className="customer-orders">
                  <h4>Order History</h4>
                  {customer.orders && customer.orders.length > 0 ? (
                    <div className="customer-orders-list">
                      {customer.orders.map((order) => (
                        <div key={order.id} className="customer-order-item">
                          <div className="customer-order-info">
                            <div>{order.id}</div>
                            <div>{order.date}</div>
                            <div
                              className="customer-order-status"
                              style={{
                                backgroundColor: getOrderStatusColor(
                                  order.status
                                ),
                              }}
                            >
                              {order.status}
                            </div>
                          </div>
                          <div>LKR {order.amount}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No orders available</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customers;
