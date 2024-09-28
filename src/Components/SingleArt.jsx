import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSingleArt } from "../api";
import Loading from "./Loading";
import "../CSS/SingleArt.css";

function SingleArt() {
  const { artId } = useParams();
  const [artPiece, setArtPiece] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState()

  useEffect(() => {
    getSingleArt(artId)
      .then((response) => {
        setArtPiece(response);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data.message)
        setLoading(false);
      });
  }, [artId]);

  if (loading) {
    return <Loading loading={"art piece"} />;
  }

  return (
    <>
      <div className="single-art-container">
        <h1 className="single-art-title">{artPiece.title}</h1>
        <h2 className="artist">Artist: {artPiece.artist}</h2>
        <div className="image-wrapper">
          <img
            className="single-art-img"
            src={artPiece.imageUrl}
            alt={artPiece.title}
          />
        </div>
        <div className="art-details">
          <p>
            <strong>Description:</strong> {artPiece.description}
          </p>
          <p>
            <strong>Date:</strong> {artPiece.date}
          </p>
          <p>
            <strong>Medium:</strong> {artPiece.medium}
          </p>
          <p>
            <strong>Dimensions:</strong> {artPiece.dimensions}
          </p>
          <p>
            <strong>Culture:</strong> {artPiece.culture}
          </p>
          <p>
            <strong>Period:</strong> {artPiece.period}
          </p>
          <p>
            <strong>Museum:</strong> {artPiece.museum}
          </p>
        </div>
      </div>
    </>
  );
}

export default SingleArt;
