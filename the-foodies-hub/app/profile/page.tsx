// profile-page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import UserHeader from "../../public/components/fixed/userheader";
import Footer from "../../public/components/fixed/footer";
import "../profile/profile.css";
import {
  FiMapPin,
  FiCheckCircle,
  FiLoader,
  FiXCircle,
  FiPackage,
  FiAlertCircle,
  FiCalendar,
  FiHash,
  FiHome,
} from "react-icons/fi";

// Interfaces
interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  restaurantName: string;
  restaurantLocation: string;
  deliveryAddress: {
    name: string;
    address: string;
    deliveryTime: string;
  };
  paymentMethod: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: "Pending" | "Confirmed" | "Delivered" | "Cancelled";
}

// Status Configuration
const statusConfig = {
  Pending: { icon: <FiLoader />, color: "#E6A23C", text: "Pending" },
  Confirmed: { icon: <FiPackage />, color: "#409EFF", text: "Confirmed" },
  Delivered: { icon: <FiCheckCircle />, color: "#67C23A", text: "Delivered" },
  Cancelled: { icon: <FiXCircle />, color: "#F56C6C", text: "Cancelled" },
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        setUserId(parsedUser._id || parsedUser.id);
      } catch (e) {
        showMessage("User data issue. Please log in again.");
        router.push("/login");
      }
    } else {
      showMessage("Please log in to view your orders.");
      router.push("/login");
    }
  }, [router]);

  const fetchOrderHistory = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/cart/${userId}`);
      if (response.ok) {
        let data: Order[] = await response.json();
        data.sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        setOrderHistory(data);
      } else {
        setError("Failed to fetch orders. Please try again later.");
      }
    } catch (err) {
      setError("Network error. Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchOrderHistory();
    }
  }, [userId, fetchOrderHistory]);

  return (
    <div className="profile-page-container">
      <UserHeader />
      <div className="profile-content-wrapper">
        {error && (
          <div className="message-banner error">
            <FiAlertCircle /> {error}
          </div>
        )}

        <div className="profile-main-content">
          <div className="order-history-section">
            <h2 className="order-history-heading">Your Food Journey</h2>
            <p className="order-history-subheading">
              A look back at all the delicious meals you've enjoyed.
            </p>

            {loading ? (
              <div className="loading-container">
                <FiLoader className="loading-spinner" />
                <p>Gathering your order history...</p>
              </div>
            ) : orderHistory.length === 0 ? (
              <div className="empty-orders">
                <h3>Your Order History is Empty</h3>
                <p>Ready for your next culinary adventure?</p>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push("/")}
                >
                  Start Ordering
                </button>
              </div>
            ) : (
              <div className="order-list">
                {orderHistory.map((order) => {
                  const currentStatus = statusConfig[order.status];
                  return (
                    <div key={order._id} className="order-card-new">
                      {/* Card Header */}
                      <div className="order-card-new-header">
                        <div className="restaurant-info-new">
                          <h4>{order.restaurantName}</h4>
                          <span>
                            <FiMapPin /> {order.restaurantLocation}
                          </span>
                        </div>
                        <div
                          className="order-status-new"
                          style={{
                            backgroundColor: currentStatus.color + "20", // Lighter bg
                            color: currentStatus.color, // Stronger text/icon
                          }}
                        >
                          {currentStatus.icon}
                          <span>{currentStatus.text}</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="order-card-new-body">
                        <div className="order-details-grid">
                          <div className="detail-item">
                            <FiHash />
                            <div>
                              <span>Order ID</span>
                              <strong>
                                #{order._id.slice(-8).toUpperCase()}
                              </strong>
                            </div>
                          </div>
                          <div className="detail-item">
                            <FiCalendar />
                            <div>
                              <span>Ordered On</span>
                              <strong>{formatDate(order.orderDate)}</strong>
                            </div>
                          </div>
                          <div className="detail-item full-span">
                            <FiHome />
                            <div>
                              <span>Delivery Address</span>
                              <strong>
                                {order.deliveryAddress.name} -{" "}
                                {order.deliveryAddress.address}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="order-items-section">
                          <h5>What you ordered:</h5>
                          <ul className="order-items-list-new">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                <span>
                                  {item.quantity} x {item.name}
                                </span>
                                <span>₹{item.price.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="order-card-new-footer">
                        <div className="order-total-new">
                          <span>Total Paid</span>
                          <strong>₹{order.totalAmount.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
