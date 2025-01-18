import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Carousel from "react-multi-carousel"; // Import du carousel
import "react-multi-carousel/lib/styles.css"; // Styles pour le carousel

const Offer = () => {
  const { id } = useParams(); // Récupère l'ID de l'annonce dans l'URL
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Responsive settings for react-multi-carousel
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong. Please try again later.</p>;
  }

  return (
    <div className="offer-page">
      <div className="offer-container">
        {/* Product Images with Carousel */}
        <div className="offer-image">
          <Carousel responsive={responsive}>
            {offer.product_pictures.length > 0 ? (
              offer.product_pictures.map((picture, index) => (
                <img
                  key={index}
                  src={picture.secure_url}
                  alt={`Product ${index}`}
                />
              ))
            ) : (
              <img
                src={offer.product_image.secure_url}
                alt={offer.product_name}
              />
            )}
          </Carousel>
        </div>

        {/* Product Details */}
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

          {/* Product Description */}
          <div className="offer-description">
            <h3>{offer.product_name}</h3>
            <p>{offer.product_description}</p>
          </div>

          {/* Owner Info */}
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

          {/* Buy Button */}
          <button className="buy-button">Acheter</button>
        </div>
      </div>
    </div>
  );
};

export default Offer;
