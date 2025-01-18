import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/user/signup",
        {
          email,
          username,
          password,
          newsletter,
        }
      );

      if (response.data.token) {
        // Sauvegarder le token dans les cookies
        Cookies.set("userToken", response.data.token, { expires: 7 });

        // Rediriger l'utilisateur vers la page d'accueil
        navigate("/");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez vérifier vos informations.");
    }
  };

  return (
    <div className="signup-page">
      <h2>S'inscrire</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
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
        <label>
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          />
          S'inscrire à notre newsletter
        </label>
        <p className="signup-info">
          En m'inscrivant je confirme avoir lu et accepté les Termes &
          Conditions et la Politique de Confidentialité de Vinted. Je confirme
          avoir au moins 18 ans.
        </p>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">S'inscrire</button>
      </form>
      <p className="signup-login-redirect">
        Tu as déjà un compte ? <a href="/login">Connecte-toi !</a>
      </p>
    </div>
  );
};

export default Signup;
