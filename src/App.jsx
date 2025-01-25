import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import Header from "./components/Header";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Publish from "./pages/Publish";
import Payment from "./pages/Payment";
import LoginModal from "./components/LoginModal";
import "./App.css";

const App = () => {
  const [userToken, setUserToken] = useState(Cookies.get("userToken") || null);
  const [filters, setFilters] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

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
        setFilters={setFilters}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setRedirectAfterLogin={setRedirectAfterLogin}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              filters={filters}
              userToken={userToken}
              setIsLoginModalOpen={setIsLoginModalOpen}
              setRedirectAfterLogin={setRedirectAfterLogin}
            />
          }
        />
        <Route path="/offer/:id" element={<Offer userToken={userToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/publish"
          element={
            userToken ? (
              <Publish userToken={userToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/payment"
          element={
            userToken ? (
              <Payment userToken={userToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        setUser={(token) => {
          setUser(token);
          if (redirectAfterLogin) {
            window.location.href = redirectAfterLogin;
            setRedirectAfterLogin(null);
          }
        }}
      />
    </Router>
  );
};

export default App;
