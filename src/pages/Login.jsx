import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/user/login",
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        // Enregistrer le token dans les cookies
        Cookies.set("userToken", response.data.token, { expires: 7 });

        // Mettre à jour l'état utilisateur
        setUser(response.data.token);

        // Rediriger vers la page d'accueil
        navigate("/");
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="login-page">
      <h2>Se connecter</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
      <p className="login-signup-redirect">
        Pas encore de compte ? <a href="/signup">Inscris-toi !</a>
      </p>
    </div>
  );
};

export default Login;
