const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

let movies = [];
try {
  const raw = fs.readFileSync(
    path.join(__dirname, "movies_metadata.json"),
    "utf8"
  );
  movies = JSON.parse(raw);
  console.log(`✅ Loaded ${movies.length} movies from movies_metadata.json`);
} catch (err) {
  console.error("⚠️ Could not load movies_metadata.json:", err.message);
  movies = [];
}

app.get("/api/ping", (req, res) => {
  console.log("❇️ Received GET request to /api/ping");
  res.send("pong!");
});

app.get("/api/movies", (req, res) => {
  console.log("❇️ Received GET request to /api/movies");
  const list = movies.map(({ id, title, tagline, vote_average }) => ({
    id,
    title,
    tagline,
    vote_average,
  }));
  res.json(list);
});

app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  console.log(`❇️ Received GET request to /api/movies/${id}`);
  const movie = movies.find((m) => String(m.id) === id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json(movie);
});

const port = process.env.PORT || 4000;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  console.log("⚠️ Development mode: Express server running separately");
}

app.listen(port, () => {
  console.log(`❇️ Express server is running on port ${port}`);
});