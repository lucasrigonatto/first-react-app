import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { json, checkStatus } from "./utils";

const Movie = () => {
  const { id } = useParams(); // Access the movie ID from the URL
  const [movie, setMovie] = useState(null); // Initialize movie state
  const [error, setError] = useState(""); // Initialize error state

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=b7da8d63`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        setMovie(data); // Set movie data in state if request is successful
        setError(""); // Clear any previous errors
      })
      .catch((error) => {
        setError(error.message); // Set error message in state if request fails
        console.log(error);
      });
  }, [id]);

  if (!movie) {
    return null; // Render nothing if movie data hasn't loaded
  }

  // Destructure movie properties for easier access
  const { Title, Year, Plot, Director, imdbRating, Poster } = movie;

  return (
    <div className="container">
      <div className="row pt-5">
        <div className="col-6">
          <h1>{Title}</h1>
          <ul className="list-unstyled">
            <li>
              <p>Year: {Year}</p>
            </li>
            <li>
              <p>Director: {Director}</p>
            </li>
            <li>
              <p>Plot: {Plot}</p>
            </li>
            <li>
              <p>imdbRating: {imdbRating} / 10</p>
            </li>
          </ul>
        </div>
        <div className="col-6">
          <img src={Poster} className="img-fluid" alt={`${Title} poster`} />
        </div>
      </div>
      {error && <p>Error: {error}</p>} {/* Display error if there's an issue */}
    </div>
  );
};

export default Movie;
