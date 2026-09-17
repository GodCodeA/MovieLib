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
  {
    id: 11,
    title: "The Dark Knight",
    posterUrl: `${PUBLIC_URL}/images/the_dark_knight_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/the_dark_knight_bg.avif`,
    releaseYear: 2008,
    imdbRating: 9.1,
    quantityImdbRating: 3200000,
    genres: ["crime", "thriller"],
    plot: "Set within a year after the events of Batman Begins (2005), Batman, Lieutenant James Gordon, and new District Attorney Harvey Dent successfully begin to round up the criminals that plague Gotham City, until a mysterious and sadistic criminal mastermind known only as 'The Joker' appears in Gotham, creating a new wave of chaos. Batman's struggle against The Joker becomes deeply personal, forcing him to 'confront everything he believes' and improve his technology to stop him. A love triangle develops between Bruce Wayne, Dent, and Rachel Dawes.",
    trailerDailyMotionId: "x7zv19h",
    director: ["Christopher Nolan"],
    writer: ["Jonathan Nolan", "Christopher Nolan", "David S. Goyer"],
    producer: [
      "Christopher Nolan",
      "Lorne Orleans",
      "Charles Roven",
      "Emma Thomas",
    ],
    composer: ["Hans Zimmer", "James Newton Howard"],
    runtime: 152,
    budget: 185000000,
    worldEarning: 1008480529,
    ratingMPPA: "PG-13",
    ageWatch: "18+",
    country: ["United States", "United Kingdom"],
    movieStars: [
      "Christian Bale",
      "Heath Ledger",
      "Aaron Eckhart",
      "Maggie Gyllenhaal",
      "Gary Oldman",
      "Michael Caine",
      "Morgan Freeman",
      "Qin Han",
      "Nestor Carbonell",
      "Eric Roberts",
    ],
  },

  //ai filled down
  {
    id: 12,
    title: "The Lord of the Rings: The Return of the King",
    posterUrl: `${PUBLIC_URL}/images/lotr_3_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/lotr_3_bg.avif`,
    releaseYear: 2003,
    imdbRating: 9.0,
    quantityImdbRating: 2200000,
    genres: ["adventure", "drama", "fantasy"],
    plot: "'One ring to rule them all. One ring to find them. One ring to bring them all and in the darkness bind them.' In the conclusion of J.R.R. Tolkien's epic masterpiece, The Lord of the Rings, as armies mass for a final battle that will decide the fate of the world--and powerful, ancient forces of Light and Dark compete to determine the outcome--one member of the Fellowship of the Ring is revealed as the noble heir to the throne of the Kings of Men. Yet, the sole hope for triumph over evil lies with a brave hobbit, Frodo, who, accompanied only by his loyal friend Sam and the hideous, wretched Gollum, ventures deep into the very dark heart of Mordor on his seemingly impossible quest to destroy the Ring of Power.",
    trailerDailyMotionId: "xa1ta30",
    director: ["Peter Jackson"],
    writer: [
      "Fran Walsh",
      "Philippa Boyens",
      "Peter Jackson",
      "J.R.R. Tolkien",
    ],
    producer: ["Barrie M. Osborne", "Fran Walsh", "Peter Jackson"],
    composer: ["Howard Shore"],
    runtime: 201,
    budget: 94000000,
    worldEarning: 1146030912,
    ratingMPPA: "PG-13",
    ageWatch: "12+",
    country: ["New Zealand", "United States"],
    movieStars: [
      "Elijah Wood",
      "Ian McKellen",
      "Viggo Mortensen",
      "Sean Astin",
      "Orlando Bloom",
      "John Rhys-Davies",
      "Billy Boyd",
      "Dominic Monaghan",
      "Andy Serkis",
      "Liv Tyler",
    ],
  },
  {
    id: 13,
    title: "Schindler's List",
    posterUrl: `${PUBLIC_URL}/images/schindler's_list_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/schindler's_list_bg.avif`,
    releaseYear: 1993,
    imdbRating: 9.0,
    quantityImdbRating: 1600000,
    genres: ["biography", "drama", "history"],
    plot: "Oskar Schindler is a vain and greedy German businessman who becomes an unlikely humanitarian amid the barbaric German Nazi reign when he feels compelled to turn his factory into a refuge for Jews. Based on the true story of Oskar Schindler who managed to save about 1100 Jews from being gassed at the Auschwitz concentration camp, it is a testament to the good in all of us.",
    trailerDailyMotionId: "x7xj2t4",
    director: ["Steven Spielberg"],
    writer: ["Steven Zaillian", "Thomas Keneally"],
    producer: ["Branko Lustig", "Gerald R. Molen", "Steven Spielberg"],
    composer: ["John Williams"],
    runtime: 195,
    budget: 22000000,
    worldEarning: 322161245,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States"],
    movieStars: [
      "Liam Neeson",
      "Ben Kingsley",
      "Ralph Fiennes",
      "Caroline Goodall",
      "Jonathan Sagall",
      "Embeth Davidtz",
      "Malgorzata Gebel",
      "Shmuel Levy",
      "Mark Ivanir",
      "Beatrice Macola",
    ],
  },
  {
    id: 14,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    posterUrl: `${PUBLIC_URL}/images/lotr_1_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/lotr_1_bg.avif`,
    releaseYear: 2001,
    imdbRating: 8.9,
    quantityImdbRating: 2200000,
    genres: ["adventure", "drama", "fantasy"],
    plot: "In the first part of J.R.R. Tolkien's epic masterpiece, The Lord of the Rings, a shy young hobbit named Frodo Baggins inherits a simple gold ring. He knows the ring has power, but not that he alone holds the secret to the survival--or enslavement--of the entire world. Now Frodo, accompanied by a wizard, an elf, a dwarf, two men and three loyal hobbit friends, must become the greatest hero the world has ever known to save the land and the people he loves.",
    trailerDailyMotionId: "x80zwlp",
    director: ["Peter Jackson"],
    writer: [
      "Fran Walsh",
      "Philippa Boyens",
      "Peter Jackson",
      "J.R.R. Tolkien",
    ],
    producer: ["Barrie M. Osborne", "Tim Sanders", "Peter Jackson"],
    composer: ["Howard Shore"],
    runtime: 178,
    budget: 93000000,
    worldEarning: 888420000,
    ratingMPPA: "PG-13",
    ageWatch: "12+",
    country: ["New Zealand", "United States"],
    movieStars: [
      "Elijah Wood",
      "Ian McKellen",
      "Viggo Mortensen",
      "Sean Astin",
      "Orlando Bloom",
      "John Rhys-Davies",
      "Billy Boyd",
      "Dominic Monaghan",
      "Liv Tyler",
      "Cate Blanchett",
    ],
  },
  {
    id: 15,
    title: "Pulp Fiction",
    posterUrl: `${PUBLIC_URL}/images/pulp_fiction_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/pulp_fiction_bg.avif`,
    releaseYear: 1994,
    imdbRating: 8.9,
    quantityImdbRating: 2400000,
    genres: ["crime", "drama"],
    plot: "Jules Winnfield and Vincent Vega are two hitmen who are out to retrieve a suitcase stolen from their employer, mob boss Marsellus Wallace. Wallace has also asked Vincent to take his wife Mia out a few days later when Wallace himself will be out of town. Butch Coolidge is an aging boxer who is paid by Wallace to lose his fight. The lives of these seemingly unrelated people are woven together comprising of a series of funny, bizarre and uncalled-for incidents.",
    trailerDailyMotionId: "x9waoam",
    director: ["Quentin Tarantino"],
    writer: ["Quentin Tarantino", "Roger Avary"],
    producer: ["Lawrence Bender"],
    composer: ["Various Artists"],
    runtime: 154,
    budget: 8000000,
    worldEarning: 213928762,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States"],
    movieStars: [
      "John Travolta",
      "Samuel L. Jackson",
      "Uma Thurman",
      "Harvey Keitel",
      "Tim Roth",
      "Amanda Plummer",
      "Maria de Medeiros",
      "Ving Rhames",
      "Eric Stoltz",
      "Bruce Willis",
    ],
  },
  {
    id: 16,
    title: "The Good, the Bad and the Ugly",
    posterUrl: `${PUBLIC_URL}/images/the_good_the_bad_and_the_ugly_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/the_good_the_bad_and_the_ugly_bg.avif`,
    releaseYear: 1966,
    imdbRating: 8.8,
    quantityImdbRating: 900000,
    genres: ["adventure", "western"],
    plot: "During the American Civil War, three men set off to find $200,000.00 in buried gold coins. Tuco and Blondie have known each other for some time, having used the reward on Tuco's head as a way of earning money. They come across a dying man, Bill Carson, who tells them of a treasure in gold coins. By chance, he reveals the name of the cemetery and the name of the grave where the gold is buried. Now rivals, the two men have good reason to keep each other alive. The third man, Angel Eyes, hears of the gold stash from someone he's been hired to kill. All he knows is to look for someone named Bill Carson. The three ultimately meet in a showdown that takes place amid a major battle between Confederate and Union forces.",
    trailerDailyMotionId: "x98y0yq",
    director: ["Sergio Leone"],
    writer: [
      "Luciano Vincenzoni",
      "Sergio Leone",
      "Agenore Incrocci",
      "Furio Scarpelli",
    ],
    producer: ["Alberto Grimaldi"],
    composer: ["Ennio Morricone"],
    runtime: 178,
    budget: 1200000,
    worldEarning: 25253887,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["Italy", "Spain", "West Germany"],
    movieStars: [
      "Clint Eastwood",
      "Eli Wallach",
      "Lee Van Cleef",
      "Aldo Giuffrè",
      "Luigi Pistilli",
      "Rada Rassimov",
      "Enzo Petito",
      "Claudio Scarchilli",
      "Mario Brega",
      "Antonio Casale",
    ],
  },
  {
    id: 17,
    title: "Forrest Gump",
    posterUrl: `${PUBLIC_URL}/images/forrest_gump_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/forrest_gump_bg.avif`,
    releaseYear: 1994,
    imdbRating: 8.8,
    quantityImdbRating: 2400000,
    genres: ["drama", "romance"],
    plot: "Forrest Gump is a simple man with a low I.Q. but good intentions. He is running through childhood with his best and only friend Jenny. His 'mama' teaches him the ways of life and leaves him to choose his destiny. Forrest joins the army for service in Vietnam, finding new friends called Dan and Bubba, he wins medals, creates a famous shrimp fishing fleet, inspires people to jog, starts a ping-pong craze, creates the smiley, writes bumper stickers and songs, donates to people and meets the president several times. However, this is all irrelevant to Forrest who can only think of his childhood sweetheart Jenny Curran, who has messed up her life. Although in the end all he wants to prove is that anyone can love anyone.",
    trailerDailyMotionId: "x1cp00n",
    director: ["Robert Zemeckis"],
    writer: ["Eric Roth", "Winston Groom"],
    producer: ["Wendy Finerman", "Steve Tisch", "Steve Starkey"],
    composer: ["Alan Silvestri"],
    runtime: 142,
    budget: 55000000,
    worldEarning: 678229452,
    ratingMPPA: "PG-13",
    ageWatch: "12+",
    country: ["United States"],
    movieStars: [
      "Tom Hanks",
      "Robin Wright",
      "Gary Sinise",
      "Mykelti Williamson",
      "Sally Field",
      "Rebecca Williams",
      "Michael Conner Humphreys",
      "Harold G. Herthum",
      "George Kelly",
      "Bob Penny",
    ],
  },
  {
    id: 18,
    title: "Inception",
    posterUrl: `${PUBLIC_URL}/images/inception_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/inception_bg.avif`,
    releaseYear: 2010,
    imdbRating: 8.8,
    quantityImdbRating: 2700000,
    genres: ["action", "adventure", "sci-fi"],
    plot: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible, inception. Instead of the perfect heist, Cobb and his team of specialists have to pull off the reverse: their task is not to steal an idea, but to plant one. If they succeed, it could be the perfect crime. But no amount of careful planning or expertise can prepare the team for the dangerous enemy that seems to predict their every move. An enemy that only Cobb could have seen coming.",
    trailerDailyMotionId: "x7mw4pk",
    director: ["Christopher Nolan"],
    writer: ["Christopher Nolan"],
    producer: ["Emma Thomas", "Christopher Nolan"],
    composer: ["Hans Zimmer"],
    runtime: 148,
    budget: 160000000,
    worldEarning: 839030630,
    ratingMPPA: "PG-13",
    ageWatch: "12+",
    country: ["United States", "United Kingdom"],
    movieStars: [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Elliot Page",
      "Tom Hardy",
      "Ken Watanabe",
      "Dileep Rao",
      "Cillian Murphy",
      "Tom Berenger",
      "Marion Cotillard",
      "Michael Caine",
    ],
  },
  {
    id: 19,
    title: "The Lord of the Rings: The Two Towers",
    posterUrl: `${PUBLIC_URL}/images/lotr_2_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/lotr_2_bg.avif`,
    releaseYear: 2002,
    imdbRating: 8.8,
    quantityImdbRating: 2000000,
    genres: ["adventure", "drama", "fantasy"],
    plot: "In the second part of the Tolkien trilogy, Frodo Baggins and the other members of the Fellowship continue on their sacred quest to destroy the One Ring--but on separate paths. Their destinies lie at two towers--Orthanc Tower in Isengard, where the corrupt wizard Saruman awaits, and Sauron's fortress at Barad-dur, deep within the dark lands of Mordor.",
    trailerDailyMotionId: "x6ivu29",
    director: ["Peter Jackson"],
    writer: [
      "Fran Walsh",
      "Philippa Boyens",
      "Stephen Sinclair",
      "Peter Jackson",
      "J.R.R. Tolkien",
    ],
    producer: ["Barrie M. Osborne", "Fran Walsh", "Peter Jackson"],
    composer: ["Howard Shore"],
    runtime: 179,
    budget: 94000000,
    worldEarning: 947495095,
    ratingMPPA: "PG-13",
    ageWatch: "12+",
    country: ["New Zealand", "United States"],
    movieStars: [
      "Elijah Wood",
      "Ian McKellen",
      "Viggo Mortensen",
      "Sean Astin",
      "Orlando Bloom",
      "John Rhys-Davies",
      "Bernard Hill",
      "Miranda Otto",
      "David Wenham",
      "Brad Dourif",
    ],
  },
  {
    id: 20,
    title: "Interstellar",
    posterUrl: `${PUBLIC_URL}/images/interstellar_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/interstellar_bg.avif`,
    releaseYear: 2014,
    imdbRating: 8.7,
    quantityImdbRating: 2300000,
    genres: ["adventure", "drama", "sci-fi"],
    plot: "In the near future around the American Midwest, Cooper, an ex-science engineer and pilot, is tied to his farming land with his daughter Murph and son Tom. As devastating sandstorms ravage Earth's crops, the people of Earth realize their life here is coming to an end as food begins to run out. Eventually stumbling upon a N.A.S.A. base 6 hours from Cooper's home, he is asked to go on a daring mission with a few other scientists into a wormhole because of Cooper's scientific intellect and ability to pilot aircraft unlike the other crew members. In order to find a new home while Earth decays, Cooper must decide to either stay, or risk never seeing his children again in order to save the human race by finding another habitable planet.",
    trailerDailyMotionId: "x7t80rc",
    director: ["Christopher Nolan"],
    writer: ["Jonathan Nolan", "Christopher Nolan"],
    producer: ["Emma Thomas", "Christopher Nolan", "Lynda Obst"],
    composer: ["Hans Zimmer"],
    runtime: 169,
    budget: 165000000,
    worldEarning: 731079857,
    ratingMPPA: "PG-13",
    ageWatch: "12+",
    country: ["United States", "United Kingdom", "Canada"],
    movieStars: [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Bill Irwin",
      "Ellen Burstyn",
      "Michael Caine",
      "Mackenzie Foy",
      "John Lithgow",
      "Timothée Chalamet",
      "Casey Affleck",
    ],
  },
  {
    id: 21,
    title: "Goodfellas",
    posterUrl: `${PUBLIC_URL}/images/good_fellas_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/good_fellas_bg.avif`,
    releaseYear: 1990,
    imdbRating: 8.7,
    quantityImdbRating: 1300000,
    genres: ["biography", "crime", "drama"],
    plot: "Henry Hill recounts his life in the mob, from his teenage years to his eventual downfall. Immersed in organized crime, he experiences wealth, power, and violence alongside friends Jimmy Conway and Tommy DeVito. The film blends crime, drama, and dark humor, exploring loyalty, ambition, betrayal, and the consequences of criminal life. Themes of family, morality, and the fleeting nature of power underpin the story.",
    trailerDailyMotionId: "x8txkfa",
    director: ["Martin Scorsese"],
    writer: ["Nicholas Pileggi", "Martin Scorsese"],
    producer: ["Irwin Winkler"],
    composer: ["Various Artists"],
    runtime: 145,
    budget: 25000000,
    worldEarning: 47036343,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States"],
    movieStars: [
      "Robert De Niro",
      "Ray Liotta",
      "Joe Pesci",
      "Lorraine Bracco",
      "Paul Sorvino",
      "Frank Sivero",
      "Tony Darrow",
      "Mike Starr",
      "Frank Vincent",
      "Chuck Low",
    ],
  },
  {
    id: 22,
    title: "Se7en",
    posterUrl: `${PUBLIC_URL}/images/se7en_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/se7en_bg.avif`,
    releaseYear: 1995,
    imdbRating: 8.6,
    quantityImdbRating: 1900000,
    genres: ["crime", "drama", "mystery", "thriller"],
    plot: "Taking place in a nameless city, Se7en follows the story of two homicide detectives tracking down a sadistic serial killer who chooses his victims according to the seven deadly sins. Brad Pitt stars as Detective David Mills, a hopeful but naive rookie who finds himself partnered with veteran Detective William Somerset (Morgan Freeman). Together they trace the killer's every step, witnessing the aftermath of his horrific crimes one by one as the victims pile up in rapid succession, all the while moving closer to a gruesome fate neither of them could have predicted.",
    trailerDailyMotionId: "x99mwku",
    director: ["David Fincher"],
    writer: ["Andrew Kevin Walker"],
    producer: ["Arnold Kopelson", "Phyllis Carlyle", "Anne Kopelson"],
    composer: ["Howard Shore"],
    runtime: 127,
    budget: 33000000,
    worldEarning: 327333559,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States"],
    movieStars: [
      "Morgan Freeman",
      "Brad Pitt",
      "Gwyneth Paltrow",
      "R. Lee Ermey",
      "John C. McGinley",
      "Julie Araskog",
      "Mark Boone Junior",
      "John Cassini",
      "Reg E. Cathey",
      "Peter Crombie",
    ],
  },
  {
    id: 23,
    title: "The Silence of the Lambs",
    posterUrl: `${PUBLIC_URL}/images/the_silence_of_the_lambs_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/the_silence_of_the_lambs_bg.avif`,
    releaseYear: 1991,
    imdbRating: 8.6,
    quantityImdbRating: 1700000,
    genres: ["crime", "drama", "thriller"],
    plot: "F.B.I. trainee Clarice Starling (Jodie Foster) works hard to advance her career, while trying to hide or put behind her West Virginia roots, of which if some knew, would automatically classify her as being backward or white trash. After graduation, she aspires to work in the agency's Behavioral Science Unit under the leadership of Jack Crawford (Scott Glenn). While she is still a trainee, Crawford asks her to question Dr. Hannibal Lecter (Sir Anthony Hopkins), a psychiatrist imprisoned, thus far, for eight years in maximum security isolation for being a serial killer who cannibalized his victims. Clarice is able to figure out the assignment is to pick Lecter's brains to help them solve another serial murder case, that of someone coined by the media as 'Buffalo Bill' (Ted Levine), who has so far killed five victims, all located in the eastern U.S., all young women, who are slightly overweight (especially around the hips), all who were drowned in natural bodies of water, and all who were stripped of large swaths of skin. She also figures that Crawford chose her, as a woman, to be able to trigger some emotional response from Lecter. After speaking to Lecter for the first time, she realizes that everything with him will be a psychological game, with her often having to read between the very cryptic lines he provides. She has to decide how much she will play along, as his request in return for talking to him is to expose herself emotionally to him. The case takes a more dire turn when a sixth victim is discovered, this one from who they are able to retrieve a key piece of evidence, if Lecter is being forthright as to its meaning. A potential seventh victim is high profile Catherine Martin (Brooke Smith), the daughter of Senator Ruth Martin (Diane Baker), which places greater scrutiny on the case as they search for a hopefully still alive Catherine. Who may factor into what happens is Dr. Frederick Chilton (Anthony Heald), the warden at the prison, an opportunist who sees the higher profile with Catherine, meaning a higher profile for himself if he can insert himself successfully into the proceedings.",
    trailerDailyMotionId: "x7tendk",
    director: ["Jonathan Demme"],
    writer: ["Ted Tally", "Thomas Harris"],
    producer: ["Kenneth Utt", "Edward Saxon", "Ron Bozman"],
    composer: ["Howard Shore"],
    runtime: 118,
    budget: 19000000,
    worldEarning: 272742922,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States"],
    movieStars: [
      "Jodie Foster",
      "Anthony Hopkins",
      "Scott Glenn",
      "Ted Levine",
      "Anthony Heald",
      "Brooke Smith",
      "Diane Baker",
      "Kasi Lemmons",
      "Frankie Faison",
      "Tracey Walter",
    ],
  },
  {
    id: 24,
    title: "Saving Private Ryan",
    posterUrl: `${PUBLIC_URL}/images/saving_private_ryan_poster.avif`,
    backdropUrl: `${PUBLIC_URL}/images/saving_private_ryan_bg.avif`,
    releaseYear: 1998,
    imdbRating: 8.6,
    quantityImdbRating: 1600000,
    genres: ["drama", "war"],
    plot: "Opening with the Allied invasion of Normandy on 6 June 1944, members of the 2nd Ranger Battalion under Cpt. Miller fight ashore to secure a beachhead. Amidst the fighting, two brothers are killed in action. Earlier in New Guinea, a third brother is KIA. Their mother, Mrs. Ryan, is to receive all three of the grave telegrams on the same day. The United States Army Chief of Staff, George C. Marshall, is given an opportunity to alleviate some of her grief when he learns of a fourth brother, Private James Ryan, and decides to send out 8 men (Cpt. Miller and select members from 2nd Rangers) to find him and bring him back home to his mother...",
    trailerDailyMotionId: "x7tf6qy",
    director: ["Steven Spielberg"],
    writer: ["Robert Rodat"],
    producer: [
      "Ian Bryce",
      "Mark Gordon",
      "Gary Levinsohn",
      "Steven Spielberg",
    ],
    composer: ["John Williams"],
    runtime: 169,
    budget: 70000000,
    worldEarning: 485035085,
    ratingMPPA: "R",
    ageWatch: "18+",
    country: ["United States"],
    movieStars: [
      "Tom Hanks",
      "Tom Sizemore",
      "Edward Burns",
      "Barry Pepper",
      "Adam Goldberg",
      "Vin Diesel",
      "Giovanni Ribisi",
      "Jeremy Davies",
      "Matt Damon",
      "Ted Danson",
    ],
  },
];

const favoriteMoviesByUser = new Map();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "public/images")));
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
