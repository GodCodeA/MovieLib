import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const movies = [
  {
    id: 1,
    title: "The Matrix",
    posterUrl: "https://6a98121ed601bb7bf57b000e.imgix.net/sandbox/1890.jpg",
    backdropUrl: "https://6a98121ed601bb7bf57b000e.imgix.net/sandbox/1892.jpg",
    releaseYear: 1999,
    imdbRating: 8.7,
    quantityImdbRating: 2200000,
    language: "en",
    genres: ["Action", "Sci-Fi"],
    plot: "Thomas Anderson's life is divided into two halves: by day, he's an ordinary office worker, scolded by his boss, and by night, he transforms into a hacker named Neo, with no place on the internet he can't penetrate. But one day, everything changes. Thomas discovers a terrifying truth about reality.",
    trailerYouTubeId: "vKQi3bBA1y8",
    director: ["Lana Wachowski", "Lilly Wachowski"],
    writer: ["Lana Wachowski", "Lilly Wachowski"],
    producer: ["Joel Silver"],
    composer: ["Don Davis"],
    runtime: 136,
    budget: 63000000,
    worldEarning: 463517383,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["USA", "Australia"],
    movieStars: [
      "Keanu Reeves",
      "Laurence Fishburne",
      "Carrie-Anne Moss",
      "Hugo Weaving",
      "Gloria Foster",
      "Joe Pantoliano",
      "Marcus Chong",
      "Julian Arahanga",
      "Matt Doran",
      "Belinda McClory",
    ],
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    posterUrl: "https://6a98121ed601bb7bf57b000e.imgix.net/sandbox/1970.jpg",
    backdropUrl: "https://6a98121ed601bb7bf57b000e.imgix.net/sandbox/1971.jpg",
    releaseYear: 1994,
    imdbRating: 9.3,
    quantityImdbRating: 3200000,
    language: "en",
    genres: ["Drama"],
    plot: "Accountant Andy Dufresne is accused of murdering his wife and her lover. Thrown into Shawshank State Penitentiary, he encounters the cruelty and lawlessness that reign on both sides of the bars. Anyone who finds themselves within these walls becomes their slave for life. But Andy, with his quick wit and kind soul, finds a way to connect with both prisoners and guards, earning them a special favor.",
    trailerYouTubeId: "NmzuHjWmXOc",
    director: ["Frank Darabont"],
    writer: ["Stephen King", "Frank Darabont"],
    producer: ["Niki Marvin"],
    composer: ["Thomas Newman"],
    runtime: 142,
    budget: 25000000,
    worldEarning: 28418687,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["USA"],
    movieStars: [
      "Tim Robbins",
      "Morgan Freeman",
      "Bob Gunton",
      "William Sadler",
      "Clancy Brown",
      "Gil Bellows",
      "Mark Rolston",
      "James Whitmore",
      "Jeffrey DeMunn",
      "Larry Brandenburg",
    ],
  },
  {
    id: 3,
    title: "Pirates of the Caribbean: The Curse of the Black Pearl",
    posterUrl: "https://6a98121ed601bb7bf57b000e.imgix.net/sandbox/1972.jpg",
    backdropUrl: "https://6a98121ed601bb7bf57b000e.imgix.net/1973.jpg",
    releaseYear: 2003,
    imdbRating: 8.1,
    quantityImdbRating: 1300000,
    language: "en",
    genres: ["Action", "Sci-Fi", "Adventure"],
    plot: "The life of charismatic adventurer Captain Jack Sparrow, full of exciting adventures, changes dramatically when his sworn enemy Captain Barbossa steals Jack's ship, the Black Pearl, and then attacks Port Royal and kidnaps the governor's beautiful daughter, Elizabeth Swann. Elizabeth's childhood friend, Will Turner, leads a rescue expedition with Jack on Britain's fastest ship to rescue the girl and, in the process, recover the Black Pearl from the villain. The ambitious Commodore Norrington, also Elizabeth's fiancé, sets out to pursue the pair. However, Will is unaware that Barbossa is under an eternal curse, which turns him and his crew into living skeletons in the moonlight. The curse will only be lifted when the pirates return the stolen Aztec gold to its original location.",
    trailerYouTubeId: "naQrOuTrH_s",
    director: ["Gore Verbinski"],
    writer: ["Ted Elliott", "Terry Rossio", "Stuart Beattie", "Jay Wolpert"],
    producer: ["Jerry Bruckheimer"],
    composer: ["Klaus Badelt"],
    runtime: 143,
    budget: 140000000,
    worldEarning: 654264015,
    ratingMPPA: "PG-13",
    ageWatch: "12+",
    country: ["USA"],
    movieStars: [
      "Johnny Depp",
      "Geoffrey Rush",
      "Orlando Bloom",
      "Keira Knightley",
      "Jack Davenport",
      "Jonathan Pryce",
      "Lee Arenberg",
      "Mackenzie Crook",
      "Damian O'Hare",
      "Giles New",
      "Angus Barnett",
      "David Bailie",
    ],
  },
];

const favoriteMoviesByUser = new Map();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

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
  res.json(movie);
});

app.get("/movie/top10", (req, res) => {
  res.json(movies.slice(0, 10));
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
    return res.status(400).json({ message: "User already exists" });
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
  console.log(`Backend started on http://localhost:${PORT}`);
});

// {
//   id: ,
//   title: "",
//   posterUrl: "https://6a98121ed601bb7bf57b000e.imgix.net/PUTHERE.jpg",
//   backdropUrl: "https://6a98121ed601bb7bf57b000e.imgix.net/PUTHERE.jpg",
//   releaseYear: ,
//   imdbRating: ,
//   quantityImdbRating: "",
//   language: "en",
//   genres: ["", ""],
//   plot: "",
//   trailerYouTubeId: "",
//   director: "Lana Wachowski",
//   writer: "",
//   producer: "",
//   composer: "",
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
