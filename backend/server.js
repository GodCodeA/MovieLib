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

const favoriteMoviesByUser = new Map();

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

const users = [];

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
  res.json(movieListView.slice(0, limit));
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

app.get("/favorites", authMiddleware, (req, res) => {
  const userFavorites = favoriteMoviesByUser.get(req.user.id) || [];
  res.json(userFavorites);
});

app.post("/register", async (req, res) => {
  const { email, password, name, surname } = req.body;

  if (!email || !password || !name || !surname) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    email,
    password: passwordHash,
    name,
    surname,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = users.find((item) => item.email === email);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

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

app.post("/favorites", authMiddleware, (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  const currentFavorites = favoriteMoviesByUser.get(userId) || [];
  const movieExists = currentFavorites.some((movie) => movie.id === Number(id));

  if (!movieExists) {
    const movie = movies.find((item) => item.id === Number(id));

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    currentFavorites.push(movie);
    favoriteMoviesByUser.set(userId, currentFavorites);
  }

  res.status(201).json({ message: "Added to favorites" });
});

app.delete("/favorites/:id", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const movieId = Number(req.params.id);

  const currentFavorites = favoriteMoviesByUser.get(userId) || [];
  const filtered = currentFavorites.filter((movie) => movie.id !== movieId);

  favoriteMoviesByUser.set(userId, filtered);

  res.json({ message: "Remove from favorites" });
});

app.get("/me", authMiddleware, (req, res) => {
  const user = users.find((item) => item.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  });
});

app.listen(PORT, () => {
  console.log(`Backend started on ${PORT}`);
});

// {
//   id: ,
//   title: "",
//   posterUrl: `${PUBLIC_URL}/images/`, "auto=enhance,compress,format&h=720&w=480&q=100"
//   backdropUrl: `${PUBLIC_URL}/images/`, "auto=enhance,compress,format&h=1080&w=1920&q=80"
//   releaseYear: ,
//   imdbRating: ,
//   quantityImdbRating: ,
//   genres: ["", ""],
//   plot: "",
//   trailerDailyMotionId: "",
//   director: [""],
//   writer: [""],
//   producer: [""],
//   composer: [""],
//   runtime: ,
//   budget: ,
//   worldEarning: ,
//   ratingMPPA: "R",
//   ageWatch: "18+",
//   country: ["", ""],
//   movieStars: [
//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
//   ],
// },
