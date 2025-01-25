import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Offer = ({ userToken }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-vinted-api.herokuapp.com/offer/${id}`
        );
        setOffer(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id]);

  const handleBuy = () => {
    if (userToken) {
      navigate("/payment", {
        state: { title: offer.product_name, price: offer.product_price },
      });
    } else {
      navigate("/login", {
        state: { redirectTo: `/offer/${id}` },
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong. Please try again later.</p>;

  return (
    <div className="offer-page">
      <div className="offer-container">
        <div className="offer-image">
          {offer.product_pictures.length > 0 ? (
            <img
              src={offer.product_pictures[0].secure_url}
              alt={offer.product_name}
              className="single-image"
            />
          ) : (
            <img
              src={offer.product_image.secure_url}
              alt={offer.product_name}
              className="single-image"
            />
          )}
        </div>

        <div className="offer-details">
          <p className="offer-price">{offer.product_price} €</p>
          <div className="offer-meta">
            {offer.product_details.map((detail, index) => (
              <p key={index}>
                <span>{Object.keys(detail)[0]}</span>:{" "}
                {Object.values(detail)[0]}
              </p>
            ))}
          </div>

          <div className="offer-description">
            <h3>{offer.product_name}</h3>
            <p>{offer.product_description}</p>
          </div>

          <div className="offer-owner">
            <div className="owner-avatar">
              <img
                src={
                  offer.owner.account.avatar?.secure_url ||
                  "/default-avatar.png"
                }
                alt={offer.owner.account.username}
              />
            </div>
            <p>{offer.owner.account.username}</p>
          </div>

          <button className="buy-button" onClick={handleBuy}>
            Acheter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offer;
