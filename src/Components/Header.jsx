import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../Contexts/UserContext";
import "../CSS/Header.css";

function Header() {
  const { loggedInUser } = useContext(UserContext);

  return (
    <div className="header">
      <Link to="/art" className="header-link">
        <h1 className="exhibitArt"> exhibitArt</h1>
      </Link>
      {loggedInUser && (
        <Link to="/profile">
          <div className="profile">
            {loggedInUser.img ? (
              <img
                src={loggedInUser.img}
                alt={`${loggedInUser.username}'s profile`}
                className="profile-image"
              />
            ) : (
              <span className="default-avatar">👤</span>
            )}
          </div>
        </Link>
      )}
    </div>
  );
}

export default Header;
