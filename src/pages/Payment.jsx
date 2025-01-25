import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51HCObyDVswqktOkX6VVcoA7V2sjOJCUB4FBt3EOiAdSz5vWudpWxwcSY8z2feWXBq6lwMgAb5IVZZ1p84ntLq03H00LDVc2RwP"
);

const Payment = ({ userToken }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null);
  const { title, price } = location.state || {};

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken, navigate]);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post(
          "https://lereacteur-vinted-api.herokuapp.com/v2/payment",
          {
            title,
            amount: Math.round(price * 100),
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setClientSecret(response.data.client_secret);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du clientSecret :",
          error
        );
      }
    };

    if (title && price) {
      fetchClientSecret();
    } else {
      navigate("/");
    }
  }, [title, price, userToken, navigate]);

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return clientSecret ? (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-summary">
          <h2>Résumé de la commande</h2>
          <div className="summary-details">
            <p>
              <span>Commande</span> <span>{price} €</span>
            </p>
            <p>
              <span>Frais protection acheteurs</span> <span>2.00 €</span>
            </p>
            <p>
              <span>Frais de port</span> <span>4.00 €</span>
            </p>
          </div>
          <div className="summary-total">
            <h3>
              <span>Total</span> <span>{price + 6} €</span>
            </h3>
          </div>
          <p className="summary-footer">
            Il ne vous reste plus qu'une étape pour vous offrir{" "}
            <strong>{title}</strong>. Vous allez payer{" "}
            <strong>{price + 6} €</strong> (frais de protection et frais de port
            inclus).
          </p>
        </div>
        <div className="payment-form">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  ) : (
    <p>Chargement...</p>
  );
};

export default Payment;
