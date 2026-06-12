import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/checkout.css";
import { toast } from "react-toastify";
import locationAPI from "../api/locationApi";
import { MdOutlineMyLocation } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import LocationPicker from "../components/LocationPicker";
import "leaflet/dist/leaflet.css";
import Modal from "react-modal";

function Checkout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedPosition, setSelectedPosition] =
  useState(null);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    fullAddress: "",
    city: "",
    pincode: "",
    addressType: "Home",
  });

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const getImage = (food) =>
    food?.images?.length
      ? `http://localhost:5000${food.images[0]}`
      : "https://via.placeholder.com/100";

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // GET CURRENT LOCATION
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setSelectedPosition([
  latitude,
  longitude,
]);

        try {
          const res = await locationAPI.post("/reverse-geocode", {
            lat: latitude,
            lng: longitude,
          });

          setAddress((prev) => ({
            ...prev,
            fullAddress: res.data.fullAddress || res.data.address || "",
            city: res.data.city || "",
            pincode: res.data.pincode || "",
          }));

          toast.success("Location fetched successfully");
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch address");
        }
      },
      (error) => {
        console.error(error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied");
            break;

          case error.POSITION_UNAVAILABLE:
            toast.error("Location unavailable");
            break;

          case error.TIMEOUT:
            toast.error("Location request timeout");
            break;

          default:
            toast.error("Unable to get location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handlePlaceOrder = async () => {
    try {
      if (
        !address.fullName ||
        !address.phone ||
        !address.email ||
        !address.fullAddress ||
        !address.city ||
        !address.pincode
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      if (paymentMethod === "Online") {
        navigate("/payment", {
          state: {
            address,
            total,
            paymentMethod,
          },
        });
        return;
      }

      const res = await API.post(
        "/orders",
        {
          address,
          paymentMethod: "COD",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Order placed successfully");

      navigate("/order-success", {
        state: {
          order: res.data.order,
        },
      });
    } catch (error) {
      toast.error("Order failed");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>Checkout</h2>

          <div className="checkout-form">
            <h3>Delivery Address</h3>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={address.email}
              onChange={handleChange}
            />

            <button
  type="button"
  className="open-map-btn"
  onClick={() => setShowMap(true)}
>
  <FaMapMarkedAlt />
  Choose Location on Map
</button>

            <div className="address-wrapper">
              <textarea
                name="fullAddress"
                placeholder="Full Delivery Address"
                value={address.fullAddress}
                onChange={handleChange}
              />

              <button
                type="button"
                className="location-icon-btn"
                onClick={getCurrentLocation}
              >
                <MdOutlineMyLocation />
              </button>
            </div>

            

            <Modal
  isOpen={showMap}
  onRequestClose={() => setShowMap(false)}
  className="map-modal"
  overlayClassName="map-overlay"
>
  <div className="modal-header">
    <h3>Select Location</h3>

    <button
      type="button"
      onClick={() => setShowMap(false)}
    >
      ✕
    </button>
  </div>

  <LocationPicker
  setAddress={setAddress}
  position={selectedPosition}
  setPosition={setSelectedPosition}
/>
</Modal>
            <div className="city-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleChange}
              />
            </div>

            {/* ADDRESS TYPE */}
            <div className="address-type-section">
              <h4>Address Type</h4>

              <div className="address-type-buttons">
                <button
                  type="button"
                  className={
                    address.addressType === "Home" ? "active-type" : ""
                  }
                  onClick={() =>
                    setAddress({
                      ...address,
                      addressType: "Home",
                    })
                  }
                >
                  Home
                </button>

                <button
                  type="button"
                  className={
                    address.addressType === "Work" ? "active-type" : ""
                  }
                  onClick={() =>
                    setAddress({
                      ...address,
                      addressType: "Work",
                    })
                  }
                >
                  Work
                </button>

                <button
                  type="button"
                  className={
                    address.addressType === "Other" ? "active-type" : ""
                  }
                  onClick={() =>
                    setAddress({
                      ...address,
                      addressType: "Other",
                    })
                  }
                >
                  Other
                </button>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Method</h3>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "Online"}
                onChange={() => setPaymentMethod("Online")}
              />
              Online Payment
            </label>
          </div>
        </div>

        <div className="checkout-right">
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div className="summary-item" key={item._id}>
              <img src={getImage(item.food)} alt={item.food.name} />

              <div>
                <h4>{item.food.name}</h4>
                <p>Qty: {item.quantity}</p>
              </div>

              <span>₹{item.food.price * item.quantity}</span>
            </div>
          ))}

          <div className="price-details">
            <div>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div>
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="total-price">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
