import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "./components/Header";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import "./App.css";

const App = () => {
  const [userToken, setUserToken] = useState(Cookies.get("userToken") || null);
  const [filters, setFilters] = useState({}); // État global des filtres

  const setUser = (token) => {
    if (token) {
      Cookies.set("userToken", token, { expires: 7 });
    } else {
      Cookies.remove("userToken");
    }
    setUserToken(token);
  };

  return (
    <Router>
      <Header
        userToken={userToken}
        setUser={setUser}
        setFilters={setFilters} // Transmet la fonction pour mettre à jour les filtres
      />
      <Routes>
        <Route path="/" element={<Home filters={filters} />} />{" "}
        {/* Passe les filtres à Home */}
        <Route path="/offer/:id" element={<Offer />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
