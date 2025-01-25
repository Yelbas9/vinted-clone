import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = ({
  filters,
  userToken,
  setIsLoginModalOpen,
  setRedirectAfterLogin,
}) => {
  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const query = new URLSearchParams({
          page,
          limit,
          ...(filters.title && { title: filters.title }),
          ...(filters.priceMin && { priceMin: filters.priceMin }),
          ...(filters.priceMax && { priceMax: filters.priceMax }),
          ...(filters.sort && { sort: filters.sort }),
        }).toString();

        const response = await axios.get(
          `https://lereacteur-vinted-api.herokuapp.com/offers?${query}`
        );

        setOffers(response.data.offers);
        setTotalPages(Math.ceil(response.data.count / limit));
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, [filters, page]);

  const handleSell = () => {
    if (userToken) {
      navigate("/publish");
    } else {
      setRedirectAfterLogin("/publish");
      setIsLoginModalOpen(true);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Prêts à faire du tri dans vos placards ?</h1>
            <button onClick={handleSell} className="hero-button">
              Commencer à vendre
            </button>
          </div>
        </div>
      </section>

      <section className="offers">
        <div className="offers-grid">
          {offers.map((offer) => {
            const getDetail = (key) =>
              offer.product_details.find((detail) => detail[key])?.[key] ||
              "N/A";

            return (
              <Link
                to={`/offer/${offer._id}`}
                key={offer._id}
                className="offer-card"
              >
                <div className="offer-header">
                  <img
                    src={
                      offer.owner.account.avatar?.secure_url ||
                      "/default-avatar.png"
                    }
                    alt={offer.owner.account.username}
                  />
                  <span>{offer.owner.account.username}</span>
                </div>
                <img
                  src={offer.product_image.secure_url || "/default-product.png"}
                  alt={offer.product_name}
                />
                <div className="offer-preview">
                  <p className="offer-price">{offer.product_price} €</p>
                  <p className="offer-meta">Marque : {getDetail("MARQUE")}</p>
                  <p className="offer-meta">Taille : {getDetail("TAILLE")}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="pagination-button"
          >
            Précédent
          </button>
          <span className="pagination-info">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="pagination-button"
          >
            Suivant
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
