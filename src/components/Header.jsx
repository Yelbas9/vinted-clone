import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LoginModal from "./LoginModal";

const Header = ({ userToken, setUser }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    Cookies.remove("userToken");
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          Vinted
        </Link>
        <nav>
          {userToken ? (
            <>
              <button onClick={handleLogout} className="logout-button">
                Se déconnecter
              </button>
              <button className="sell-button">Vends tes articles</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsLoginModalOpen(true)}>
                Se connecter
              </button>
              <Link to="/signup">
                <button>S'inscrire</button>
              </Link>
              <button className="sell-button">Vends tes articles</button>
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
