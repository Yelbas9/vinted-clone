import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
    } else {
      setPaymentSucceeded(true);
    }

    setIsProcessing(false);
  };

  return paymentSucceeded ? (
    <p>Paiement réussi ! Merci pour votre achat.</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements || isProcessing}>
        {isProcessing ? "Paiement en cours..." : "Payer"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default CheckoutForm;
