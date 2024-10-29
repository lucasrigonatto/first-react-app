import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Movie from "./Movie";
import "./App.css";

const NotFound = () => {
  return <h2>404 Not Found</h2>;
};

const App = () => {
  return (
    <Router basename="/first-react-app">
      {" "}
      {/* Replace 'first-react-app' with your repo name */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Movie Finder
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
