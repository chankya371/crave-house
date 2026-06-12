import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/profileComponentCSs/addressTab.css";
import { MapPin, Home, Briefcase } from "lucide-react";
import { toast } from "react-toastify";

function AddressTab() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      setAddresses(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Address deleted");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const getIcon = (index) => {
    if (index === 0) return <Home size={22} />;
    if (index === 1) return <Briefcase size={22} />;
    return <MapPin size={22} />;
  };

  const getLabel = (index) => {
    if (index === 0) return "Home";
    if (index === 1) return "Work";
    return "Saved Address";
  };

  if (loading) return <h3>Loading addresses...</h3>;

  if (!addresses.length) {
    return (
      <div className="address-wrapper">
        <h2>Manage Addresses</h2>

        <div className="empty-address">
          No saved addresses found
        </div>
      </div>
    );
  }

  return (
    <div className="address-wrapper">
      <h2>Manage Addresses</h2>

      <div className="address-grid">
        {addresses.map((item, index) => (
          <div className="address-card" key={item._id}>
            <div className="address-top">
              <div className="address-icon">
                {getIcon(index)}
              </div>

              <div className="address-content">
                <h3>{getLabel(index)}</h3>

                <p>
                  {item.fullAddress}, {item.city},{" "}
                  {item.pincode}
                </p>

                <span>{item.fullName}</span>
                <span>{item.phone}</span>
              </div>
            </div>

            <div className="address-actions">
              <button className="edit-btn-address">
                EDIT
              </button>

              <button
                className="delete-btn-address"
                onClick={() => deleteAddress(item._id)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddressTab;