import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Movie from "./Movie";
import "./App.css";

const NotFound = () => {
  return <h2>404 Not Found</h2>;
};

function routerBasename() {
  const url = process.env.PUBLIC_URL;
  if (!url) return undefined;
  try {
    const path = new URL(url).pathname.replace(/\/$/, "");
    return path || undefined;
  } catch (error) {
    return undefined;
  }
}

const App = () => {
  return (
    <Router basename={routerBasename()}>
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
