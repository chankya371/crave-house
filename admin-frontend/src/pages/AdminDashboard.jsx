import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";
import "../styles/admin.css";

import {
  FaUtensils,
  FaShoppingCart,
  FaCheckCircle,
  FaTags,
} from "react-icons/fa";

import Sidebar from "../components/AdminSidebar";
import Topbar from "../components/AdminTopbar";
import UsersList from "../components/UsersList";
import CategoryList from "../components/CategoryList";
import AddCategory from "../components/addCategory";
import EditCategory from "../components/EditCategory";
import FoodList from "../components/FoodList";
import AddFood from "../components/AddFood";
import EditFood from "../components/EditFood";
import Orders from "../components/Orders";
import OrderStatus from "../components/OrderStatus";

function AdminDashboard() {
  const navigate = useNavigate();

  const [food, setFood] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin auth check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      const user = jwtDecode(token);

      if (user.role !== "admin") {
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  setLoading(true);

  try {
    const [foodRes, categoryRes, orderRes] = await Promise.allSettled([
      API.get("/food"),
      API.get("/category"),
      API.get("/orders"),
    ]);

    // Food
    if (foodRes.status === "fulfilled") {
      setFood(foodRes.value.data?.data || []);
    } else {
      console.error("Food fetch failed:", foodRes.reason);
      setFood([]);
    }

    // Categories
    if (categoryRes.status === "fulfilled") {
      setCategories(categoryRes.value.data || []);
    } else {
      console.error("Category fetch failed:", categoryRes.reason);
      setCategories([]);
    }

    // Orders
    if (orderRes.status === "fulfilled") {
      setOrders(orderRes.value.data || []);
    } else {
      console.error("Orders fetch failed:", orderRes.reason);
      setOrders([]);
    }
  } catch (err) {
    console.error("Dashboard Error:", err);
  } finally {
    setLoading(false);
  }
};

  const fetchFood = async () => {
  try {
    const res = await API.get("/food");
    setFood(res.data?.data || []);
  } catch (err) {
    console.log(err);
    setFood([]);
  }
};

 const fetchCategories = async () => {
  try {
    const res = await API.get("/category");
    setCategories(res.data || []);
  } catch (err) {
    console.log(err);
    setCategories([]);
  }
};

  const successOrders = orders.filter(
    (order) =>
      order?.status === "Delivered" ||
      order?.status === "Completed"
  );

  if (loading && page === "dashboard") {
    return (
      <div className="dashboard-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar page={page} setPage={setPage} />

      <div className="content">
        <Topbar page={page} />

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <div className="dashboard-home">
            <div className="dashboard-header">
              <div>
                <h1>Admin Dashboard</h1>
                <p>Manage your restaurant business efficiently</p>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-box food-card">
                <div className="stat-icon">
                  <FaUtensils />
                </div>
                <div>
                  <h2>{food.length}</h2>
                  <p>Total Food</p>
                </div>
              </div>

              <div className="stat-box order-card">
                <div className="stat-icon">
                  <FaShoppingCart />
                </div>
                <div>
                  <h2>{orders.length}</h2>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="stat-box success-card">
                <div className="stat-icon">
                  <FaCheckCircle />
                </div>
                <div>
                  <h2>{successOrders.length}</h2>
                  <p>Completed Orders</p>
                </div>
              </div>

              <div className="stat-box category-card-stat">
                <div className="stat-icon">
                  <FaTags />
                </div>
                <div>
                  <h2>{categories.length}</h2>
                  <p>Categories</p>
                </div>
              </div>
            </div>

            {/* Main Dashboard */}
            <div className="dashboard-main">
              {/* LEFT */}
              <div className="dashboard-left">
                {/* Categories */}
                <div className="dashboard-card">
                  <div className="section-header">
                    <h2>Categories</h2>
                    <button onClick={() => setPage("categories")}>
                      View All
                    </button>
                  </div>

                  <div className="category-grid">
                    {categories.slice(0, 4).map((cat) => (
                      <div key={cat._id} className="category-card">
                        <img src={cat.image} alt={cat.name} />
                        <div className="overlay">
                          <p>{cat.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div className="dashboard-card">
                  <div className="section-header">
                    <h2>Best Selling Products</h2>
                    <button onClick={() => setPage("food")}>
                      View All
                    </button>
                  </div>

                  <div className="product-grid">
                    {food.slice(0, 4).map((item) => (
                      <div key={item._id} className="product-card">
                        <img src={item.image} alt={item.name} />

                        <div className="product-info">
                          <h4>{item.name}</h4>
                          <p>₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="dashboard-right">
                <div className="dashboard-card orders-box">
                  <div className="section-header">
                    <h2>Recent Orders</h2>
                    <button onClick={() => setPage("orders")}>
                      View All
                    </button>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Dish</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.slice(0, 6).map((order, index) => (
                        <tr key={order?._id || index}>
                          <td>#{order?._id?.slice(-6) || "N/A"}</td>

                          <td className="dish-cell">
                            {order?.food ? (
                              <>
                                <img
                                  src={order.food.image}
                                  alt={order.food.name}
                                />
                                <span>{order.food.name}</span>
                              </>
                            ) : (
                              "No Food"
                            )}
                          </td>

                          <td>₹{order?.totalAmount || 0}</td>

                          <td>
                            <span
                              className={`status-badge ${
                                order?.status?.toLowerCase() || ""
                              }`}
                            >
                              {order?.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {page === "users" && <UsersList />}

        {/* CATEGORIES */}
        {page === "categories" && !selectedCategory && (
          <CategoryList
            categories={categories}
            setCategories={setCategories}
            setPage={setPage}
            setSelectedCategory={setSelectedCategory}
            onAdd={() => setPage("addCategory")}
          />
        )}

        {page === "editCategory" && selectedCategory && (
          <EditCategory
            category={selectedCategory}
            onBack={() => {
              setSelectedCategory(null);
              fetchCategories();
              setPage("categories");
            }}
          />
        )}

        {page === "addCategory" && (
          <AddCategory
            onBack={() => {
              fetchCategories();
              setPage("categories");
            }}
          />
        )}

        {/* FOOD */}
        {page === "food" && (
          <FoodList
            food={food}
            categories={categories}
            setFood={setFood}
            setPage={setPage}
            setSelectedFood={setSelectedFood}
          />
        )}

        {page === "addFood" && (
          <AddFood
            categories={categories}
            onBack={() => {
              fetchFood();
              setPage("food");
            }}
          />
        )}

        {page === "editFood" && selectedFood && (
          <EditFood
            food={selectedFood}
            categories={categories}
            onBack={() => {
              fetchFood();
              setPage("food");
            }}
          />
        )}

        {/* ORDERS */}
        {page === "orders" && <Orders />}
        {page === "orderStatus" && <OrderStatus />}
      </div>
    </div>
  );
}

export default AdminDashboard;