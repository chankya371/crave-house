import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api";

function CheckoutForm({ address, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is loading...");
      return;
    }

    setLoading(true);

    try {
      const { error, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          redirect: "if_required",
        });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (
        !paymentIntent ||
        paymentIntent.status !== "succeeded"
      ) {
        toast.error("Payment Failed");
        return;
      }

      const res = await API.post(
        "/orders",
        {
          address,
          paymentMethod: "Online",
          paymentStatus: "Paid",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Payment Successful");

      navigate("/order-success", {
        state: {
          order: res.data.order,
        },
      });
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Payment Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-card">
      <h2>Choose Payment Method</h2>

      <p className="payment-amount">
        Total Amount: ₹{total}
      </p>

      <form onSubmit={handleSubmit}>
        <PaymentElement />

        <button
          type="submit"
          className="pay-btn"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : `Pay ₹${total}`}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;