import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import UserContext from "../Contexts/UserContext";
import { likeArt, addArt, unlikeArt, getCollections } from "../api";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import "../CSS/ArtCard.css";
import { AiOutlineClose } from "react-icons/ai";

function ArtCard({ artPiece, onDelete, showDeleteButton }) {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [showCollections, setShowCollections] = useState(false);
  const [userCollections, setUserCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  useEffect(() => {
    if (loggedInUser) {
      getCollections(loggedInUser._id).then((collections) => {
        setUserCollections(collections);
      });
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser && loggedInUser.likes && artPiece) {
      setLiked(loggedInUser.likes.includes(artPiece._id));
    }
  }, [loggedInUser, artPiece._id]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const toggleLike = () => {
    setError(null);
    if (!loggedInUser || !loggedInUser._id) {
      setError("You need to be logged in to like this artwork");
      return;
    }

    if (liked) {
      unlikeArt(loggedInUser._id, artPiece._id)
        .then(() => {
          setLiked(false);

          const updatedUser = {
            ...loggedInUser,
            likes: loggedInUser.likes.filter((id) => id !== artPiece._id),
          };
          setLoggedInUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } else {
      likeArt(loggedInUser._id, artPiece._id)
        .then(() => {
          setLiked(true);
          const updatedUser = {
            ...loggedInUser,
            likes: [...loggedInUser.likes, artPiece._id],
          };
          setLoggedInUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    }
  };

  const toggleCollectionDropdown = () => {
    if (!loggedInUser || !loggedInUser._id) {
      setError("You need to be logged in to add artwork to a collection");
      return;
    }
    setShowCollections((prev) => !prev);
  };

  const handleAddToCollection = () => {
    setError(null);
    setAddSuccess(false);

    const trimmedCollectionName = collectionName.trim();

    if (!selectedCollection && !trimmedCollectionName) {
      setError("Please select a collection or enter a valid collection name");
      return;
    }

    const collectionToUse = selectedCollection
      ? { collectionName: selectedCollection }
      : { collectionName: collectionName };
    addArt(loggedInUser._id, artPiece._id, collectionToUse)
      .then(() => {
        setAddSuccess(true);
        setTimeout(() => setAddSuccess(false), 5000);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.message);
      });
  };

  const handleDelete = () => {
    onDelete(artPiece._id);
  };

  return (
    <li className="art-card">
      {showDeleteButton && (
        <button
          onClick={handleDelete}
          className="delete-item-btn"
          aria-label={`Remove ${artPiece.title} from collection`}
        >
          <AiOutlineClose style={{ fontSize: "20px", color: "darkred" }} />
        </button>
      )}
      <Link className="art-title" to={`/art/${artPiece._id}`}>
        {artPiece.title}
      </Link>
      <p className="art-artist">by: {artPiece.artist}</p>
      <p className="date">{artPiece.date}</p>
      <br></br>
      <img
        className="art-img"
        src={artPiece.imageUrl}
        alt={artPiece.title}
      ></img>
      <br></br>
      <div className="action-buttons">
        <button
          onClick={toggleLike}
          className="like-btn"
          aria-label={liked ? "Unlike this artwork" : "Like this artwork"}
        >
          {liked ? (
            <AiFillHeart style={{ color: "pink", fontSize: "24px" }} />
          ) : (
            <AiOutlineHeart style={{ fontSize: "24px" }} />
          )}
        </button>

        <button
          onClick={toggleCollectionDropdown}
          className="add-btn"
          aria-label="Add artwork to collection"
        >
          <FaPlus style={{ fontSize: "24px" }} />
        </button>
      </div>
      {showCollections && (
        <div className="collection-dropdown">
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            <option value="">Select a collection</option>
            {userCollections.map((collection) => (
              <option key={collection._id} value={collection.collectionName}>
                {collection.collectionName}
              </option>
            ))}
          </select>
          <p id="or">or</p>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="New collection name"
            className="collection-input"
            id="new-name-input"
          />
          <br></br>
          <button onClick={handleAddToCollection} className="add-new-btn">
            Add to Collection
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {addSuccess && <p>Artwork added to collection</p>}
    </li>
  );
}

export default ArtCard;
