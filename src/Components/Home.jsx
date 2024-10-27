import { useEffect, useState } from "react";
import { searchArt, viewArt } from "../api";
import { useSearchParams } from "react-router-dom";
import ArtCard from "./ArtCard";
import Loading from "./Loading";
import "../CSS/Home.css";

const Home = () => {
  const [art, setArt] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const sortBy = searchParams.get("sortBy") || "title";
  const orderBy = searchParams.get("orderBy") || "asc";
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  useEffect(() => {
    const getArt = async () => {
      try {
        setArt([]);
        setIsLoading(true);

        let response;

        if (!searchQuery) {
          response = await viewArt(sortBy, orderBy, page, limit);
          } else {
            response = await searchArt(searchQuery, sortBy, orderBy, page, limit);
        }
        setArt(response)
        setError("");
      } catch (error) {
        setError(error.response.data.message);
      }finally{
        setIsLoading(false)
      }
    };

    getArt();
  }, [searchQuery, sortBy, orderBy, page, limit]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("query", query);
      newParams.set("page", 1);
      return newParams;
    });
    setSearchQuery(query)
  };

  function handleSort(event) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", event.target.value);
    newParams.set("page", 1);
    setSearchParams(newParams);
  }

  function handleOrder() {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("orderBy", orderBy === "asc" ? "desc" : "asc");
    setSearchParams(newParams);
  }

  function handleNext() {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page + 1);
    setSearchParams(newParams);
  }

  function handlePrev() {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", Math.max(page - 1, 1));
    setSearchParams(newParams);
  }

  function handleLimit(event) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("limit", event.target.value);
    setSearchParams(newParams);
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <form onSubmit={handleSearch}>
        <label htmlFor="search" aria-label="Search for artwork"></label>
        <input
          id="search"
          type="text"
          placeholder="Search by title or artist..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />
        <button type="submit">Search</button>
      </form>
      <div className="sort-container">
        <label id="sort-by-label" htmlFor="sortBy">
          Sort By
        </label>
        <select id="sortBy" value={sortBy} onChange={handleSort}>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="date">Date</option>
        </select>
        <button id="order-button" onClick={handleOrder}>
          {orderBy === "asc" ? "Asc" : "Desc"}
        </button>
      </div>
      {isLoading ? (
        <Loading loading={"artwork"} />
      ) : (
        <>
          <ul className="artwork-list">
            {art.map((artPiece) => (
              <ArtCard key={artPiece.artId} artPiece={artPiece} />
            ))}
          </ul>
          <div className="button-container">
            <button id="prev-button" disabled={page === 1} onClick={handlePrev}>
              Previous
            </button>
            <button id="next-button" onClick={handleNext}>
              Next
            </button>
          </div>
          <p id="page-num">{page}</p>
          <div className="limit-container">
          <label htmlFor="limit"></label>
            <select id="limit" value={limit} onChange={handleLimit} aria-label="Select Limit">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
