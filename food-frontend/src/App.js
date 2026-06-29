import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";
import socket from "./socket/socket";

import Home from "./pages/Home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Categories from "./pages/allCategories";
import FoodPage from "./pages/foodPage";
import SearchPage from "./pages/SearchPage";
import FoodDetail from "./pages/FoodDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/profile";
import Layout from "./layout";
import EditAccount from "./pages/EditAccount";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ScrollToTop from "./homeComponent/ScrollToTop";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Payment from "./pages/Payment";



function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="foodpage/:id" element={<FoodPage />} />
          <Route path="search/:keyword" element={<SearchPage />} />
          <Route path="food/:id" element={<FoodDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-account" element={<EditAccount />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/payment" element={<Payment />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;