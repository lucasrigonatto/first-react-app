import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Movie from "./Movie";
import App from "./App";
beforeEach(() => {
  process.env.REACT_APP_OMDB_API_KEY = "test-key";
  global.fetch = jest.fn();
  window.history.pushState({}, "", "/");
});
test("searches for a movie and provides a link to its details", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      Response: "True",
      Search: [
        {
          Title: "Arrival",
          Year: "2016",
          imdbID: "tt1",
          Type: "movie",
          Poster: "N/A",
        },
      ],
    }),
  });
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByPlaceholderText("frozen"), {
    target: { value: "Arrival" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  expect(await screen.findByText("Arrival")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Arrival" }).closest("a"),
  ).toHaveAttribute("href", "/movie/tt1/");
});
test("does not send an empty query", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  expect(fetch).not.toHaveBeenCalled();
});
test("loads a movie from its route identifier", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      Response: "True",
      Title: "Arrival",
      Year: "2016",
      Plot: "A language mystery",
      Director: "Denis Villeneuve",
      imdbRating: "7.9",
      Poster: "N/A",
    }),
  });
  render(
    <MemoryRouter initialEntries={["/movie/tt1"]}>
      <Routes>
        <Route path="/movie/:id" element={<Movie />} />
      </Routes>
    </MemoryRouter>,
  );
  expect(
    await screen.findByRole("heading", { name: "Arrival" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Plot: A language mystery")).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("i=tt1"));
});
test("shows detail request failures instead of an empty page", async () => {
  fetch.mockRejectedValueOnce(new Error("Network unavailable"));
  render(
    <MemoryRouter initialEntries={["/movie/tt1"]}>
      <Routes>
        <Route path="/movie/:id" element={<Movie />} />
      </Routes>
    </MemoryRouter>,
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Network unavailable",
  );
});
test("renders a not-found page for an unknown route", () => {
  const base = process.env.PUBLIC_URL
    ? new URL(process.env.PUBLIC_URL).pathname.replace(/\/$/, "")
    : "";
  window.history.pushState({}, "", base + "/missing");
  render(<App />);
  expect(
    screen.getByRole("heading", { name: "404 Not Found" }),
  ).toBeInTheDocument();
});
