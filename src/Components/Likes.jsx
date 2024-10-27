import { useContext, useEffect, useState } from "react";
import UserContext from "../Contexts/UserContext";
import ArtCard from "./ArtCard";
import { getSingleArt } from "../api";
import Loading from "./Loading";

export const getArtByIds = async (artIds) => {
  const artPromises = artIds.map((id) => getSingleArt(id));
  const artPieces = await Promise.all(artPromises);
  return artPieces;
};


function Likes() {
  const { loggedInUser } = useContext(UserContext);
  const [likedArt, setLikedArt] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loggedInUser && loggedInUser.likes) {
      const validArtIds = loggedInUser.likes.filter(id => id != null);
      if (validArtIds.length > 0) {
      getArtByIds(loggedInUser.likes).then((art) => {
        setLikedArt(art);
        setIsLoading(false);
      })
      }
      else{
        setIsLoading(false)
      };
    }
  }, [loggedInUser]);

  

  return (
    <div className="likes-container">
      <h2>Your Liked Artworks</h2>
      {isLoading ? (
        <Loading loading={"liked artwork"} />
      ) : likedArt.length === 0 ? (
        <p>You have not liked any artworks yet.</p>
      ) : (
        <ul className="artwork-list">
          {likedArt.map((artPiece) => (
            <ArtCard key={artPiece.artId} artPiece={artPiece} />
          ))}
        </ul>
      )}
    </div>
  );
}
export default Likes;
