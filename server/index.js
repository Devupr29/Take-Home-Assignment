const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;


const movies = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'movies_metadata.json'))
);

app.get('/api/movies', (req, res) => {
 
  const list = movies.map(({ id, title, tagline, vote_average }) => ({
    id,
    title,
    tagline,
    vote_average,
  }));
  res.json(list);
});


app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => String(m.id) === req.params.id);
  if (!movie) return res.status(404).json({ error: 'Movie not found' });
  res.json(movie);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
