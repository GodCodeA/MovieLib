# MovieLib

MovieLib is an application for discovering movies and choosing a film for the evening. The project consists of a React client and a custom Express API.

## Features

- Random movie recommendation on the home page;
- Top 9 movie collection;
- Genre list and movies from a selected genre;
- Movie search by title with a request debounce;
- Detailed movie page with rating, plot, cast and crew, budget, earnings, and a YouTube trailer;
- Registration and email/password login;
- JWT authentication and automatic session restoration;
- Adding and removing movies from favorites;
- User profile with a list of favorite movies;
- Responsive movie cards and a Top 9 carousel powered by Swiper.

## Tech Stack

### Frontend

- React 18;
- TypeScript;
- Vite;
- React Router;
- Redux Toolkit and React Redux;
- Axios;
- Swiper.

### Backend

- Node.js;
- Express 5;
- CORS and dotenv;
- JWT (`jsonwebtoken`);
- Password hashing with `bcryptjs`.

## Getting Started

Node.js and npm are required.

### 1. Backend

Install the dependencies and start the API:

```bash
cd backend
npm install
npm start
```

The server starts on `http://localhost:3001` by default.

Backend settings are stored in `backend/.env`:

```env
PORT=3001
JWT_SECRET=replace_with_a_secure_secret
```

`JWT_SECRET` must be a unique secret and must not be committed to the repository.

### 2. Frontend

From the project root, install the dependencies:

```bash
npm install
```

Create or update `.env`:

```env
VITE_API_URL=http://localhost:3001
```

Start the client:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Scripts

From the project root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite in development mode |
| `npm run build` | TypeScript check and production build |
| `npm run preview` | Preview the production build locally |

From `backend/`:

| Command | Description |
| --- | --- |
| `npm start` | Start the Express API |

## Frontend Routes

| Route | Description |
| --- | --- |
| `/` | Home page with a random movie and Top 9 |
| `/genres` | Genre list |
| `/genres/:genreName` | Movies from the selected genre |
| `/movie/:movieId` | Detailed movie information |
| `/profile` | Profile and favorite movies for the authenticated user |

Search and authentication forms open in modal windows from the application header. Sign-in is required to view the profile and manage favorites.

## Backend API

All client requests use the address from `VITE_API_URL`. The token from `localStorage` is automatically sent in the `Authorization: Bearer <token>` header.

### Movies

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check server availability |
| `GET` | `/movie/random` | Get a random movie |
| `GET` | `/movie/top10` | Get the movie collection; the client displays Top 9 |
| `GET` | `/movie/genres` | Get the genre list |
| `GET` | `/movie/:id` | Get a movie by ID |
| `GET` | `/movie?genre=<name>` | Get movies from a selected genre |
| `GET` | `/movie?title=<name>` | Search movies by title |

### Authentication and Profile

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/register` | Register with `email`, `password`, `name`, and `surname` |
| `POST` | `/login` | Sign in and receive a JWT and user data |
| `GET` | `/me` | Get the current user; requires a JWT |

### Favorites

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/favorites` | Get favorite movies; requires a JWT |
| `POST` | `/favorites` | Add a movie, body: `{ "id": 1 }`; requires a JWT |
| `DELETE` | `/favorites/:id` | Remove a movie; requires a JWT |

## Project Structure

```text
.
├── backend/
│   ├── server.js       # Express API, authentication, and movie data
│   ├── package.json
│   └── .env
├── public/             # static files
├── src/
│   ├── api/            # Axios client and API methods
│   ├── components/     # Authentication, search, and trailer modals
│   ├── layouts/        # Main layout and navigation
│   ├── pages/          # Application pages
│   ├── router/         # Routing
│   ├── store/          # Redux slices for the user and favorites
│   ├── types/          # TypeScript types
│   └── utils/          # Formatters and utility functions
├── .env                # VITE_API_URL for the frontend
└── package.json
```

## Important Limitations

- Movie, user, and favorite data are stored in the backend process memory.
- Registered users and favorites are reset when the backend restarts.
- JWTs expire after one hour.
- For production, set a secure `JWT_SECRET` and a separate `VITE_API_URL`.

## Live demo

https://movielib.pages.dev

To deploy the frontend, run `npm run build` and publish the `dist` directory. The backend must be hosted separately on a Node.js platform.

## License

MIT - the project can be used and modified.

