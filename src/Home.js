import React from "react";
import { Link } from "react-router-dom";
import { json, checkStatus } from "./utils";

const Movie = (props) => {
  const { Title, Year, imdbID, Type, Poster } = props.movie;
  const hasPoster = Poster && Poster !== "N/A";

  return (
    <div className="row">
      <div className="col-4 col-md-2 col-lg-1 mb-3">
        <Link to={`/movie/${imdbID}/`}>
          {hasPoster ? (
            <img src={Poster} className="img-fluid" alt={Title + " poster"} />
          ) : (
            <span className="text-muted">No poster</span>
          )}
        </Link>
      </div>
      <div className="col-8 col-md-10 col-lg-11 mb-3">
        <Link to={`/movie/${imdbID}/`}>
          <h4>{Title}</h4>
          <p>
            {Type} | {Year}
          </p>
        </Link>
      </div>
    </div>
  );
};

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      results: [],
      error: "",
      loading: false,
      searched: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = searchTerm.trim();
    if (!searchTerm) {
      return;
    }
    if (!process.env.REACT_APP_OMDB_API_KEY) {
      this.setState({
        error: "Set REACT_APP_OMDB_API_KEY in .env.local to search OMDb.",
        results: [],
      });
      return;
    }

    this.setState({ loading: true, error: "", results: [], searched: true });

    fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`,
    )
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === "False") {
          const message =
            data.Error === "Movie not found!"
              ? "No movies found. Try another title."
              : data.Error;
          throw new Error(message);
        }

        if (data.Response === "True" && data.Search) {
          this.setState({ results: data.Search, error: "", loading: false });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false, results: [] });
      });
  }

  render() {
    const { searchTerm, results, error, loading, searched } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <label className="visually-hidden" htmlFor="movie-query">
                Movie title
              </label>
              <input
                id="movie-query"
                type="text"
                className="form-control mr-sm-2"
                placeholder="frozen"
                value={searchTerm}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                Submit
              </button>
            </form>
            {loading && <p role="status">Searching for movies…</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && searched && !error && results.length === 0 && (
              <p>No movies found. Try another title.</p>
            )}
            {!error &&
              results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default MovieFinder;
