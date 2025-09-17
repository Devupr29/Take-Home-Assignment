import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

function MoviesList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch('/api/movies'); 
      const payload = await response.json();
      setMovies(payload);
    }
    getData();
  }, []);

  return (
    <div className="App">
      <h1>Movies</h1>
      <div className="grid">
        {movies.map(m => (
          <Link to={`/movie/${m.id}`} key={m.id} className="card">
            <h3>{m.title}</h3>
            <p>{m.tagline}</p>
            <p>Rating: {m.vote_average}/10</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function getMovie() {
      const res = await fetch(`/api/movies/${id}`);
      const data = await res.json();
      setMovie(data);
    }
    getMovie();
  }, [id]);

  if (!movie) return <p>Loading…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{movie.title}</h2>
      <p>{movie.tagline}</p>
      <p>Release: {new Date(movie.release_date).toLocaleDateString()}</p>
      <p>Runtime: {movie.runtime} minutes</p>
      <pre>{JSON.stringify(movie, null, 2)}</pre>
      <Link to="/">← Back to list</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}
