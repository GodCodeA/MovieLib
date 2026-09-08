import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const PORT = process.env.PORT || 3001;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

const movies = [
  {
    id: 1,
    title: "The Matrix",
    posterUrl: `${PUBLIC_URL}/images/matrix_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/matrix_bg.avif`,
    releaseYear: 1999,
    imdbRating: 8.7,
    quantityImdbRating: 2200000,
    genres: ["action", "sci-fi"],
    plot: "Thomas Anderson's life is divided into two halves: by day, he's an ordinary office worker, scolded by his boss, and by night, he transforms into a hacker named Neo, with no place on the internet he can't penetrate. But one day, everything changes. Thomas discovers a terrifying truth about reality.",
    trailerDailyMotionId: "x19nlra",
    director: ["Lana Wachowski", "Lilly Wachowski"],
    writer: ["Lana Wachowski", "Lilly Wachowski"],
    producer: ["Joel Silver"],
    composer: ["Don Davis"],
    runtime: 136,
    budget: 63000000,
    worldEarning: 463517383,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States", "Australia"],
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
    posterUrl: `${PUBLIC_URL}/images/shawshank_redemption_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/shawshank_redemption_bg.avif`,
    releaseYear: 1994,
    imdbRating: 9.3,
    quantityImdbRating: 3200000,
    genres: ["drama"],
    plot: "Accountant Andy Dufresne is accused of murdering his wife and her lover. Thrown into Shawshank State Penitentiary, he encounters the cruelty and lawlessness that reign on both sides of the bars. Anyone who finds themselves within these walls becomes their slave for life. But Andy, with his quick wit and kind soul, finds a way to connect with both prisoners and guards, earning them a special favor.",
    trailerDailyMotionId: "x7ryyfw",
    director: ["Frank Darabont"],
    writer: ["Stephen King", "Frank Darabont"],
    producer: ["Niki Marvin"],
    composer: ["Thomas Newman"],
    runtime: 142,
    budget: 25000000,
    worldEarning: 28418687,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States"],
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
    posterUrl: `${PUBLIC_URL}/images/pirates_of_the_carribean_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/pirates_of_the_carribean_bg.avif`,
    releaseYear: 2003,
    imdbRating: 8.1,
    quantityImdbRating: 1300000,
    genres: ["action", "sci-fi", "adventure"],
    plot: "The life of charismatic adventurer Captain Jack Sparrow, full of exciting adventures, changes dramatically when his sworn enemy Captain Barbossa steals Jack's ship, the Black Pearl, and then attacks Port Royal and kidnaps the governor's beautiful daughter, Elizabeth Swann. Elizabeth's childhood friend, Will Turner, leads a rescue expedition with Jack on Britain's fastest ship to rescue the girl and, in the process, recover the Black Pearl from the villain. The ambitious Commodore Norrington, also Elizabeth's fiancé, sets out to pursue the pair. However, Will is unaware that Barbossa is under an eternal curse, which turns him and his crew into living skeletons in the moonlight. The curse will only be lifted when the pirates return the stolen Aztec gold to its original location.",
    trailerDailyMotionId: "x19mwmb",
    director: ["Gore Verbinski"],
    writer: ["Ted Elliott", "Terry Rossio", "Stuart Beattie", "Jay Wolpert"],
    producer: ["Jerry Bruckheimer"],
    composer: ["Klaus Badelt"],
    runtime: 143,
    budget: 140000000,
    worldEarning: 654264015,
    ratingMPPA: "PG-13",
    ageWatch: "12+",
    country: ["United States"],
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
  {
    id: 4,
    title: "Harry Potter and Sorcerer's Stone",
    posterUrl: `${PUBLIC_URL}/images/harry_potter_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/harry_potter_bg.avif`,
    releaseYear: 2001,
    imdbRating: 7.7,
    quantityImdbRating: 965000,
    genres: ["fantasy", "adventure", "family"],
    plot: "Ten-year-old Harry Potter's life isn't exactly a bed of roses: his parents died when he was just a year old, and the aunt and uncle who took him in are nothing but slaps and slaps. But on Harry's eleventh birthday, everything changes. A strange visitor unexpectedly appears on his doorstep, bearing a letter from which the boy learns that he is, in fact, a wizard and has been accepted into a school of magic called Hogwarts. And in just a few weeks, Harry will be riding the Hogwarts Express toward a new life where incredible adventures, true friends, and, most importantly, the key to solving the mystery of his parents' death await him.",
    trailerDailyMotionId: "x7m8adc",
    director: ["Chris Columbus"],
    writer: ["J.K. Rowling"],
    producer: ["David Heyman"],
    composer: ["John Williams"],
    runtime: 152,
    budget: 125000000,
    worldEarning: 1024392020,
    ratingMPPA: "PG",
    ageWatch: "12+",
    country: ["United Kingdom", "United States"],
    movieStars: [
      "Daniel Radcliffe",
      "Rupert Grint",
      "Emma Watson",
      "Richard Harris",
      "Alan Rickman",
      "Robbie Coltrane",
      "Maggie Smith",
      "Tom Felton",
      "Matthew Lewis",
      "Ian Hart",
    ],
  },
  {
    id: 5,
    title: "Gladiator",
    posterUrl: `${PUBLIC_URL}/images/gladiator_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/gladiator_bg.avif`,
    releaseYear: 2000,
    imdbRating: 8.5,
    quantityImdbRating: 1900000,
    genres: ["history", "action", "drama"],
    plot: "Roman Empire. The fearless and noble general Maximus is idolized by his soldiers, and the elderly Emperor Marcus Aurelius trusts him implicitly, treating him like a son. However, this seasoned warrior, ready to face any opponent in a fair fight, finds himself powerless against the wily intrigues of the court. Commodus, Marcus Aurelius's son, murders his father, who had planned to make Maximus his successor instead of him, and seizes power. Determined to rid himself of a dangerous rival who refuses to swear allegiance to him, Commodus orders the death of Maximus and his entire family. Miraculously surviving but unable to save his loved ones, Maximus is captured by a slave trader, who sells him to Proximo, the organizer of gladiatorial fights. Thus, the legendary general becomes a gladiator. But soon he will have the chance to meet his mortal enemy face to face.",
    trailerDailyMotionId: "x7bbmqg",
    director: ["Ridley Scott"],
    writer: ["David Franzoni", "John Logan", "William Nicholson"],
    producer: ["David Franzoni", "Branko Lustig", "Douglas Wick"],
    composer: ["Hans Zimmer", "Lisa Gerrard"],
    runtime: 155,
    budget: 103000000,
    worldEarning: 465518644,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States", "United Kingdom", "Malta", "Morocco"],
    movieStars: [
      "Russell Crowe",
      "Joaquin Phoenix",
      "Connie Nielsen",
      "Oliver Reed",
      "Richard Harris",
      "Derek Jacobi",
      "Djimon Hounsou",
      "David Schofield",
      "John Shrapnel",
      "Tomas Arana",
    ],
  },
  {
    id: 6,
    title: "Twilight",
    posterUrl: `${PUBLIC_URL}/images/twilight_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/twilight_bg.avif`,
    releaseYear: 2008,
    imdbRating: 5.4,
    quantityImdbRating: 534000,
    genres: ["drama", "fantasy", "romance"],
    plot: "Bella Swan has always been a little bit different. Never one to run with the crowd, Bella never cared about fitting in with the trendy girls at her Phoenix, Arizona high school. When her mother remarries and Bella chooses to live with her father in the rainy little town of Forks, Washington, she doesn't expect much of anything to change. But things do change when she meets the mysterious and dazzlingly beautiful Edward Cullen. For Edward is nothing like any boy she's ever met. He's nothing like anyone she's ever met, period. He's intelligent and witty, and he seems to see straight into her soul. In no time at all, they are swept up in a passionate and decidedly unorthodox romance - unorthodox because Edward really isn't like the other boys. He can run faster than a mountain lion. He can stop a moving car with his bare hands. Oh, and he hasn't aged since 1918. Like all vampires, he's immortal. That's right - vampire. But he doesn't have fangs - that's just in the movies. And he doesn't drink human blood, though Edward and his family are unique among vampires in that lifestyle choice. To Edward, Bella is that thing he has waited 90 years for - a soul mate. But the closer they get, the more Edward must struggle to resist the primal pull of her scent, which could send him into an uncontrollable frenzy. Somehow or other, they will have to manage their unmanageable love. But when unexpected visitors come to town and realize that there is a human among them Edward must fight to save Bella? A modern, visual, and visceral Romeo and Juliet story of the ultimate forbidden love affair - between vampire and mortal",
    trailerDailyMotionId: "x12cjl5",
    director: ["Catherine Hardwicke"],
    writer: ["Melissa Rosenberg", "Stephenie Meyer"],
    producer: ["Wyck Godfrey", "Greg Mooradian", "Mark Morgan"],
    composer: ["Carter Burwell"],
    runtime: 122,
    budget: 37000000,
    worldEarning: 400123654,
    ratingMPPA: "PG-13",
    ageWatch: "18+",
    country: ["United States"],
    movieStars: [
      "Kristen Stewart",
      "Robert Pattinson",
      "Billy Burke",
      "Ashley Greene",
      "Anna Kendrick",
      "Taylor Lautner",
      "Jackson Rathbone",
      "Peter Facinelli",
      "Rachelle Lefevre",
      "Cam Gigandet",
    ],
  },
  {
    id: 7,
    title: "Fight Club",
    posterUrl: `${PUBLIC_URL}/images/fight_club_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/fight_club_bg.avif`,
    releaseYear: 1999,
    imdbRating: 8.8,
    quantityImdbRating: 2700000,
    genres: ["crime", "drama", "thriller"],
    plot: "A nameless first-person narrator attends support groups in an attempt to subdue his emotional state and relieve his insomniac state. When he meets Marla, another fake attendee of support groups, his life seems to become a little more bearable. However, when he associates himself with Tyler he is dragged into an underground fight club and soap-making scheme. Together the two men spiral out of control and engage in competitive rivalry for love and power.",
    trailerDailyMotionId: "x78fhwi",
    director: ["David Fincher"],
    writer: ["Chuck Palahniuk", "Jim Uhls"],
    producer: ["Ross Grayson Bell", "Ceán Chaffin", "Art Linson"],
    composer: ["Dust Brothers", "John King", "Michael Simpson"],
    runtime: 139,
    budget: 63000000,
    worldEarning: 102438967,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States", "Germany"],
    movieStars: [
      "Edward Norton",
      "Brad Pitt",
      "Helena Bonham Carter",
      "Meat Loaf",
      "Zach Grenier",
      "Holt McCallany",
      "Jared Leto",
      "Eion Bailey",
      "Richmond Arquette",
      "David Andrews",
    ],
  },
  {
    id: 8,
    title: "Hachi: A Dog's Tale",
    posterUrl: `${PUBLIC_URL}/images/hachiko_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/hachiko_bg.avif`,
    releaseYear: 2009,
    imdbRating: 8.1,
    quantityImdbRating: 348000,
    genres: ["biography", "drama", "family"],
    plot: "A schoolboy reports on his hero: Hachiko, his grandfather's dog. In a flashback, a puppy at a Japanese monastery is crated and sent to the US. The crate's tag tears, and when the puppy pushes his way out of the crate at the train station of a small Rhode Island town, Parker Wilson, a professor of music in nearby Providence, takes the dog home for the night. His wife isn't happy about it, but after failing to find the owner, she lets the dog stay. A Japanese friend reads the dog's tag - 'Hachiko' or 'Eight,' a lucky number. Parker can't teach the dog to fetch, but the friend explains that the dog will forge a different kind of loyalty. Tragedy tests that loyalty.",
    trailerDailyMotionId: "x128raq",
    director: ["Lasse Hallström"],
    writer: ["Stephen P. Lindsey", "Kaneto Shindō"],
    producer: ["Richard Gere", "Bill Johnson", "Vicki Shigekuni Wong"],
    composer: ["Jan A.P. Kaczmarek"],
    runtime: 93,
    budget: 16000000,
    worldEarning: 46749646,
    ratingMPPA: "G",
    ageWatch: "0+",
    country: ["United Kingdom", "United States"],
    movieStars: [
      "Richard Gere",
      "Joan Allen",
      "Cary-Hiroyuki Tagawa",
      "Sarah Roemer",
      "Jason Alexander",
      "Erick Avari",
      "Davenia McFadden",
      "Robbie Sublett",
      "Kevin DeCoste",
      "Rob Degnan",
    ],
  },
  {
    id: 9,
    title: "Sinister",
    posterUrl: `${PUBLIC_URL}/images/sinister_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/sinister_bg.avif`,
    releaseYear: 2012,
    imdbRating: 6.8,
    quantityImdbRating: 322000,
    genres: ["horror", "mystery", "thriller"],
    plot: "Crime writer Ellison Oswalt moves his family into a house where a horrific crime took place earlier, but his family doesn't know. He begins researching the crime in hopes of writing a book about it. Oswalt examines video footage that he finds in the house to help him in his research, but he soon discovers more than he bargained for.",
    trailerDailyMotionId: "x9su4ee",
    director: ["Scott Derrickson"],
    writer: ["Scott Derrickson", "C. Robert Cargill"],
    producer: ["Jason Blum", "Brian Kavanaugh-Jones"],
    composer: ["Christopher Young"],
    runtime: 110,
    budget: 3000000,
    worldEarning: 82515113,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States", "United Kingdom", "Canada"],
    movieStars: [
      "Ethan Hawke",
      "Juliet Rylance",
      "Fred Thompson",
      "James Ransone",
      "Michael Hall D'Addario",
      "Clare Foley",
      "Rob Riley",
      "Tavis Smiley",
      "Janet Zappala",
      "Victoria Leigh",
    ],
  },
  {
    id: 10,
    title: "Home Alone",
    posterUrl: `${PUBLIC_URL}/images/home_alone_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/home_alone_bg.avif`,
    releaseYear: 1999,
    imdbRating: 7.8,
    quantityImdbRating: 754000,
    genres: ["comedy", "family"],
    plot: "It is Christmas time and the McCallister family is preparing for a vacation in Paris, France. But the youngest in the family, Kevin (Macaulay Culkin), got into a scuffle with his older brother Buzz (Devin Ratray) and was sent to his room, which is on the third floor of his house. Then, the next morning, while the rest of the family was in a rush to make it to the airport on time, they completely forgot about Kevin, who now has the house all to himself. Being home alone was fun for Kevin, having a pizza all to himself, jumping on his parents' bed, and making a mess. Then, Kevin discovers about two burglars, Harry (Joe Pesci) and Marv (Daniel Stern), about to rob his house on Christmas Eve. Kevin acts quickly by wiring his own house with makeshift booby traps to stop the burglars and to bring them to justice.",
    trailerDailyMotionId: "x7mv7d6",
    director: ["Chris Columbus"],
    writer: ["John Hughes"],
    producer: ["John Hughes"],
    composer: ["John Williams"],
    runtime: 103,
    budget: 18000000,
    worldEarning: 477383642,
    ratingMPPA: "PG",
    ageWatch: "0+",
    country: ["United States"],
    movieStars: [
      "Macaulay Culkin",
      "Joe Pesci",
      "Daniel Stern",
      "Catherine O'Hara",
      "John Heard",
      "Roberts Blossom",
      "Gerry Bamman",
      "Devin Ratray",
      "John Candy",
      "Kieran Culkin",
    ],
  },
];

const favoriteMoviesByUser = new Map();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "public/images")));

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
  console.log(`Backend started on ${PORT}`);
});

// {
//   id: ,
//   title: "",
//   posterUrl: `${PUBLIC_URL}/images/`,
//   backdropUrl: `${PUBLIC_URL}/images/`,
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
