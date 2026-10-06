import { initDatabase, pool } from "./database.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import movies from "./data/movies.js";
import { PORT } from "./config.js";

const randomMovieView = (movie) => ({
  id: movie.id,
  title: movie.title,
  posterUrl: movie.posterUrl,
  backdropUrl: movie.backdropUrl,
  releaseYear: movie.releaseYear,
  imdbRating: movie.imdbRating,
  genres: movie.genres,
});

const movieListView = movies.map((movie) => ({
  id: movie.id,
  title: movie.title,
  posterUrl: movie.posterUrl,
  backdropUrl: movie.backdropUrl,
  releaseYear: movie.releaseYear,
  imdbRating: movie.imdbRating,
  genres: movie.genres,
}));

const moviesSortedByRating = [...movieListView].sort(
  (firstMovie, secondMovie) => secondMovie.imdbRating - firstMovie.imdbRating,
);

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/images",
  express.static(path.join(__dirname, "public/images"), {
    maxAge: "1d",
  }),
);
app.use("/genres", express.static(path.join(__dirname, "public/genres")));

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/movie/random", (req, res) => {
  const movie = movies[Math.floor(Math.random() * movies.length)];
  res.json(randomMovieView(movie));
});

app.get("/movie/top10", (req, res) => {
  const limit = Number(req.query.limit) || 10;
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  res.json(moviesSortedByRating.slice(0, limit));
});

app.get("/movie/genres", (req, res) => {
  const genres = [...new Set(movies.flatMap((movie) => movie.genres))];
  res.json(genres);
});

app.get("/movie/:id", (req, res) => {
  const movie = movies.find((item) => item.id === Number(req.params.id));
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

app.get("/movie", (req, res) => {
  const { genre, title } = req.query;

  let result = [...movies];

  if (genre) {
    result = result.filter((movie) =>
      movie.genres.some(
        (item) => item.toLowerCase() === String(genre).toLowerCase(),
      ),
    );
  }

  if (title) {
    result = result.filter((movie) =>
      movie.title.toLowerCase().includes(String(title).toLowerCase()),
    );
  }

  res.json(result);
});

app.get("/favorites", authMiddleware, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT movie_id
    FROM favorite_movies
    WHERE user_id = $1
    ORDER BY created_at DESC`,
    [req.user.id],
  );

  const moviesById = new Map(movies.map((movie) => [movie.id, movie]));
  const favoriteMovies = rows
    .map(({ movie_id }) => moviesById.get(movie_id))
    .filter((movie) => movie !== undefined);

  res.json(favoriteMovies);
});

app.post("/register", async (req, res) => {
  const { email, password, name, surname } = req.body ?? {};
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedSurname = typeof surname === "string" ? surname.trim() : "";
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  if (
    !isValidEmail ||
    typeof password !== "string" ||
    password.length < 8 ||
    !normalizedName ||
    !normalizedSurname
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `INSERT INTO users (email, password_hash, name, surname)
       VALUES ($1, $2, $3, $4)`,
      [normalizedEmail, passwordHash, normalizedName, normalizedSurname],
    );
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "User already exists" });
    }

    throw error;
  }

  res.status(201).json({
    message: "User registered successfully",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail || typeof password !== "string" || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const { rows } = await pool.query(
    `SELECT id, email, password_hash, name, surname
     FROM users
     WHERE email = $1`,
    [normalizedEmail],
  );
  const user = rows[0];

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = createToken(user);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
    },
  });
});

app.post("/favorites", authMiddleware, async (req, res) => {
  const movieId = Number(req.body?.id);

  if (!Number.isSafeInteger(movieId)) {
    return res.status(400).json({ message: "Valid movie id is required" });
  }

  const movie = movies.find((item) => item.id === movieId);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  await pool.query(
    `INSERT INTO favorite_movies (user_id, movie_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, movie_id) DO NOTHING`,
    [req.user.id, movieId],
  );

  res.status(201).json({ message: "Added to favorites" });
});

app.delete("/favorites/:id", authMiddleware, async (req, res) => {
  const movieId = Number(req.params.id);

  if (!Number.isSafeInteger(movieId)) {
    return res.status(400).json({ message: "Valid movie id is required" });
  }

  await pool.query(
    `DELETE FROM favorite_movies
    WHERE user_id = $1 AND movie_id = $2`,
    [req.user.id, movieId],
  );
  
  res.json({ message: "Remove from favorites" });
});

app.get("/me", authMiddleware, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, email, name, surname
     FROM users
     WHERE id = $1`,
    [req.user.id],
  );
  const user = rows[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

app.use((error, req, res, next) => {
  console.error("Request failed:", error);
  res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`Backend started on ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exitCode = 1;
});
