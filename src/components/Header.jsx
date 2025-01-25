import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginModal from "./LoginModal";
import { Range } from "react-range";
import logo from "/public/images/vinted.svg";

const Header = ({ userToken, setUser, setFilters }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [title, setTitle] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [priceRange, setPriceRange] = useState([10, 140]);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    Cookies.remove("userToken");
    navigate("/");
  };

  const handleSell = () => {
    if (userToken) {
      navigate("/publish");
    } else {
      setRedirectAfterLogin("/publish");
      setIsLoginModalOpen(true);
    }
  };

  useEffect(() => {
    setFilters({
      title,
      sort,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    });
  }, [title, sort, priceRange, setFilters]);

  const handleLoginSuccess = (token) => {
    setUser(token);
    setIsLoginModalOpen(false);
    if (redirectAfterLogin) {
      navigate(redirectAfterLogin);
      setRedirectAfterLogin(null);
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logo} alt="vinted" />;
      </Link>

      <div className="search-container">
        <input
          type="text"
          placeholder="Recherche des articles"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="filters">
          <div className="sort-container">
            <span>Trier par prix :</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
          <div className="price-range">
            <span>Prix entre :</span>
            <Range
              step={5}
              min={0}
              max={500}
              values={priceRange}
              onChange={(values) => setPriceRange(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    height: "6px",
                    width: "100%",
                    background: "#ccc",
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    height: "20px",
                    width: "20px",
                    background: "#00c1c0",
                    borderRadius: "50%",
                  }}
                />
              )}
            />
            <div className="price-values">
              <span>{priceRange[0]}€</span>
              <span>{priceRange[1]}€</span>
            </div>
          </div>
        </div>
      </div>

      <nav>
        {userToken ? (
          <>
            <button onClick={handleLogout}>Se déconnecter</button>
            <button className="sell-button" onClick={handleSell}>
              Vends tes articles
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsLoginModalOpen(true)}>
              Se connecter
            </button>
            <Link to="/signup">
              <button>S'inscrire</button>
            </Link>
            <button className="sell-button" onClick={handleSell}>
              Vends tes articles
            </button>
          </>
        )}
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        setUser={handleLoginSuccess}
      />
    </header>
  );
};

export default Header;
