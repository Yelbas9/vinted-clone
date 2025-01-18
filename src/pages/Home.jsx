import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-vinted-api.herokuapp.com/offers?page=${page}&limit=${limit}`
        );
        setOffers(response.data.offers);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, [page]);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Prêts à faire du tri dans vos placards ?</h1>
          <button>Commencer à vendre</button>
        </div>
      </section>
      <section className="offers">
        <div className="offers-grid">
          {offers.map((offer) => (
            <Link
              to={`/offer/${offer._id}`}
              key={offer._id}
              className="offer-card"
            >
              <img
                src={offer.product_image.secure_url}
                alt={offer.product_name}
              />
              <div className="offer-details">
                <p>{offer.product_name}</p>
                <p>{offer.product_price} €</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="pagination">
          {page > 1 && (
            <button onClick={() => setPage(page - 1)}>Précédent</button>
          )}
          <button onClick={() => setPage(page + 1)}>Suivant</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
