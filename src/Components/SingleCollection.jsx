import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  getSingleCollection,
  getSingleArt,
  deleteCollection,
  deleteFromCollection,
} from "../api";
import ArtCard from "./ArtCard";
import UserContext from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import "../CSS/SingleCollection.css";

function SingleCollection() {
  const { loggedInUser } = useContext(UserContext);
  const { collectionName } = useParams();
  const [collection, setCollection] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser && collectionName) {
      getSingleCollection(loggedInUser._id, collectionName)
        .then((response) => {
          setCollection(response);
          const artworkPromises = response.artworks.map((artId) =>
            getSingleArt(artId)
          );
          return Promise.all(artworkPromises);
        })
        .then((response) => {
          setArtworks(response);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.response.data.message);
          setIsLoading(false);
        });
    }
  }, [loggedInUser, collectionName]);

  if (isLoading) {
    return <Loading loading={"collection"} />;
  }
  if (error) {
    return <p className="error">{error}</p>;
  }

  function handleDelete() {
    deleteCollection(loggedInUser._id, collectionName)
      .then(() => {
        navigate("/collections");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  function handleDeleteFromCollection(artId) {
    deleteFromCollection(loggedInUser._id, collectionName, artId)
      .then(() => {
        setArtworks((prevArtworks) =>
          prevArtworks.filter((artPiece) => artPiece._id !== artId))
        navigate(`/collections/${collectionName}`)
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  return (
    <div>
      <h2>{collection.collectionName}</h2>
      {collection.artworks.length === 0 ? (
        <p>No artworks in this collection</p>
      ) : (
        <ul className="artwork-list">
          {artworks.map((artPiece) => (
            <ArtCard
              key={artPiece._id}
              artPiece={artPiece}
              onDelete={handleDeleteFromCollection}
              showDeleteButton={true}
            />
          ))}
        </ul>
      )}
      <button
        onClick={handleDelete}
        className="delete-btn"
        aria-label={`Delete ${collection.collectionName}`}
      >
        Delete collection
      </button>
    </div>
  );
}

export default SingleCollection;
