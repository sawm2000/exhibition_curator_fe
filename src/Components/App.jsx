import Home from "./Home";
import SingleArt from "./SingleArt";
import Header from "./Header";
import Navigation from "./Navigation";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import Likes from "./Likes";
import Collections from "./Collections";
import SingleCollection from "./SingleCollection";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [loggedInUser]);

  return (
    <>
      <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
        <Header />
        <Navigation isLoggedIn={!!loggedInUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/art/:artId" element={<SingleArt />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/collections" element={<Collections />} />
          <Route
            path="/collections/:collectionName"
            element={<SingleCollection />}
          />
        </Routes>
      </UserContext.Provider>
    </>
  );
}
export default App;
