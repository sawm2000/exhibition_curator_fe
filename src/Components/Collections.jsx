import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import { getCollections } from "../api";
import Loading from "./Loading";
import "../CSS/Collections.css";

function Collections() {
  const { loggedInUser } = useContext(UserContext);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loggedInUser && loggedInUser._id) {
      getCollections(loggedInUser._id)
        .then((response) => {
          setCollections(response);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [loggedInUser]);

  if (isLoading) {
    return <Loading loading={"collections"} />;
  }

  if (!collections.length) {
    return <p>No collections found</p>;
  }

  return (
    <div className="collection-container">
      <h2 id="collections-title">Your Collections</h2>
      <ul className="collection-list">
        {collections.map((collection) => (
          <li key={collection._id}>
            <Link to={`/collections/${collection.collectionName}`}>
              {collection.collectionName}
            </Link>
            <span className="artwork-count">
              {collection.artworks.length} artwork(s)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Collections;
