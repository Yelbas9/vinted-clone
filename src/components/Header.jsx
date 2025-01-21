import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LoginModal from "./LoginModal";
import { Range } from "react-range";

const Header = ({ userToken, setUser, setFilters }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // État local des filtres
  const [title, setTitle] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [priceRange, setPriceRange] = useState([10, 100]);

  const handleLogout = () => {
    setUser(null);
    Cookies.remove("userToken");
  };

  const applyFilters = () => {
    setFilters({
      title,
      sort,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    });
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          Vinted
        </Link>

        {/* Recherche par titre */}
        <input
          type="text"
          placeholder="Recherche des articles"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Trier par prix */}
        <div className="sort-container">
          <span>Trier par prix :</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        {/* Slider pour plage de prix */}
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
                  background: "#007bff",
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

        {/* Bouton pour appliquer les filtres */}
        <button onClick={applyFilters}>Appliquer les filtres</button>

        <nav>
          {userToken ? (
            <>
              <button onClick={handleLogout}>Se déconnecter</button>
              <button>Vends tes articles</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsLoginModalOpen(true)}>
                Se connecter
              </button>
              <Link to="/signup">
                <button>S'inscrire</button>
              </Link>
              <button>Vends tes articles</button>
            </>
          )}
        </nav>
      </div>

      {/* Modal Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        setUser={setUser}
      />
    </header>
  );
};

export default Header;
