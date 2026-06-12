import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import API from "../api/api";
import "../styles/payment.css";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!state) {
      navigate("/checkout");
      return;
    }

    const createIntent = async () => {
      const { data } = await API.post(
        "/payment/create-payment-intent",
        {
          amount: state.total,
        }
      );

      setClientSecret(data.clientSecret);
    };

    createIntent();
  }, [state, navigate]);

  if (!state) return null;

  const { total, address } = state;

  return (
    <div className="payment-page">
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <CheckoutForm
            total={total}
            address={address}
          />
        </Elements>
      )}
    </div>
  );
}

export default Payment;