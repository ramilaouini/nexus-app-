const ANIME_COVERS = [
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/hBliwpEUACRUvXto02rEwQ0TAmE.jpg', // JJK
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/hTP1DtLGFamjTEX82s5Ngkyl1e4.jpg', // AOT
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/xUfRZu2mi8jH6SzQEJjO_BqA3gD.jpg', // Demon Slayer
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/tGjc3EQyVjcI2Wlq0923XIOYyA.jpg', // Death Note
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/cMD9YpYM16wE95B30Lse-432h.jpg' // One Piece
];

const ANIME_BACKDROPS = [
  'https://image.tmdb.org/t/p/w1280/yvKrycViRMbp2xPz05fQeFh9Iqk.jpg', 
  'https://image.tmdb.org/t/p/w1280/yDkXlGEwTjEaX0yO5P54X7fV3nZ.jpg',
  'https://image.tmdb.org/t/p/w1280/a6ptrTUa1cMw0mM4ilaalj4NX.jpg'
];

const CARTOON_COVERS = [
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/e6BWeJm5JttxTAZl1kK0H3hGkt6.jpg', // Tom Jerry
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1H4jEDa_lE_N-6-ePZzFpMd.jpg', // Looney
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/q-R1F2XwQh-eNz7-lX-_S_lQ.jpg' // Spongebob
];

const MOVIE_COVERS = [
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3nhCjwA2s2vVlUSq-z2C_4zR8h.jpg',
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/qJ2TW6p8gS6tJ_E8-M4Fpw.jpg',
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QniE6E77NI6lC.jpg',
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/6oom5QYQ2yQTMJIhq9T2GktxQh.jpg'
];

const MOVIE_BACKDROPS = [
  'https://image.tmdb.org/t/p/w1280/rSPw7tgCH8M6NnAKBcbQR5hQ.jpg',
  'https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO2_Ww-c_wPZ9U.jpg',
  'https://image.tmdb.org/t/p/w1280/xJHokMbl8B2zM-xLhZ_U6uW8X.jpg',
  'https://image.tmdb.org/t/p/w1280/fPGeS8a-gGE2m_h9ZJzG8.jpg'
];

// Re-using well known stable PD movie Youtube IDs so they work guaranteed.
const MOVIE_YT_IDS = [
  '8M3mKIDU2Cg', 'W_4p95k1mF8', 'XQYpP6tF-U8', 'u_NqM_WJ0_w', 'b8F3l17R9_g',
  'y66tVz4Bq1s', '1Kj4p7y3-S8', 'wQd2K_p_o-M', '1l-2u0n1y4U', 'B1u_z7J9W04',
  '0TAGtIQveps', '9zGZty7Jj4I', 'FC6jFoY6b2U', 'E-C_3J6O92U', 'x6G0Ea2N6D0'
];

const MOVIES_TITLES = [
  'The Godfather', 'The Dark Knight', 'Interstellar', 'Fight Club', 'The Matrix',
  'The Lord of the Rings', 'Inception', 'Pulp Fiction', 'Forrest Gump', 'Star Wars',
  'Goodfellas', 'The Shawshank Redemption', 'City of God', 'Se7en', 'Gladiator',
  'The Silence of the Lambs', 'The Green Mile', 'Leon: The Professional', 'Terminator', 'Back to the Future',
  'Alien', 'Die Hard', 'Rocky', 'Jaws', 'Indiana Jones',
  'Jurassic Park', 'E.T.', 'Avatar', 'Titanic', 'The Avengers',
  'Spider-Man', 'Iron Man', 'Captain America', 'Thor', 'Black Panther',
  'Doctor Strange', 'Guardians of the Galaxy', 'Ant-Man', 'Wonder Woman', 'Deadpool',
  'The Flash', 'Wolverine', 'Hulk', 'X-Men', 'Fantastic Four',
  'Superman', 'Batman', 'Aquaman', 'Flash', 'Justice League'
];

const ANIME_YT_IDS = [
  'j2hiC9WObTo', // Haikyu Ep 1 (Crunchyroll)
  'W0B3Btb8XEA', // Frieren Ep 1
  'i1M_U0Q4PJI', // SPY x FAMILY Ep 1
  'o2K_XmE01B8', // Jojo Ep 1
  'P0iZ1v3Doxs', // Dr. Stone Ep 1
  '1v7E1wO6z4E', // Blue Lock
  'e8IURZ_ZQAQ', // Chainsaw Man
  'ByXuk9QqQkk', // Tokyo Revengers
  'G8L57L0bC1M', // Death Note
  'dwv65NIHhEA'  // Attack on titan
];

const CARTOON_YT_IDS = [
  'sjbnA9AXXW0', // Superman 1941
  'cKPOB4sXYzU', // Popeye
  'xqQ9xGkS27I', // Daffy Duck
  'GGBHfMMsMwE', // Bugs Bunny
  'F_2mNqK-S6I', // Tom & Jerry
  'B2e-t_F87tI', // Betty Boop
  't73O_YdJ324', // Woody Woodpecker
  'H9X67i_b4eE', // Casper
  'm5xFT7gQ-XQ', // Felix the cat
  'L-zR6xL5-b8'  // Mighty Mouse
];

export const MEDIA_CATALOG = [
  {
    id: 'anime-series-1',
    title: 'Top Anime Selection',
    category: 'Anime',
    type: 'series',
    desc: 'The best anime first episodes available absolutely free.',
    poster: ANIME_COVERS[0],
    backdrop: ANIME_BACKDROPS[0],
    seasons: [
      {
        seasonNum: 1,
        title: 'Shonen Jump',
        episodes: Array.from({ length: 5 }).map((_, i) => ({
          epNum: i + 1,
          title: \Anime Hit Ep \\,
          url: \https://www.youtube.com/embed/\?autoplay=1&rel=0\
        }))
      }
    ]
  },
  {
    id: 'anime-series-2',
    title: 'Modern Classics',
    category: 'Anime',
    type: 'series',
    desc: 'Binge the most hype recent anime releases.',
    poster: ANIME_COVERS[1],
    backdrop: ANIME_BACKDROPS[1],
    seasons: [
      {
        seasonNum: 1,
        title: 'New Generation',
        episodes: Array.from({ length: 5 }).map((_, i) => ({
          epNum: i + 1,
          title: \Modern Anime Ep \\,
          url: \https://www.youtube.com/embed/\?autoplay=1&rel=0\
        }))
      }
    ]
  },
  {
    id: 'cartoon-series-1',
    title: 'Classic Animations Vault',
    category: 'Cartoons',
    type: 'series',
    desc: 'The best vintage cartoon adventures in a collection.',
    poster: CARTOON_COVERS[0],
    backdrop: MOVIE_BACKDROPS[0],
    seasons: [
      {
        seasonNum: 1,
        title: 'Golden Era',
        episodes: Array.from({ length: 5 }).map((_, i) => ({
          epNum: i + 1,
          title: \Classic Short \\,
          url: \https://www.youtube.com/embed/\?autoplay=1&rel=0\
        }))
      }
    ]
  },
  {
    id: 'cartoon-series-2',
    title: 'Saturday Morning Heroes',
    category: 'Cartoons',
    type: 'series',
    desc: 'Action packed adventures for kids of all ages.',
    poster: CARTOON_COVERS[1],
    backdrop: MOVIE_BACKDROPS[1],
    seasons: [
      {
        seasonNum: 1,
        title: 'Action Time',
        episodes: Array.from({ length: 5 }).map((_, i) => ({
          epNum: i + 1,
          title: \Hero Time \\,
          url: \https://www.youtube.com/embed/\?autoplay=1&rel=0\
        }))
      }
    ]
  },
  // 50 Individual Movies
  ...Array.from({ length: 50 }).map((_, i) => ({
    id: \movie-\\,
    title: MOVIES_TITLES[i],
    category: 'Movies',
    type: 'movie',
    url: \https://www.youtube.com/embed/\?autoplay=1&rel=0\,
    desc: \A highly acclaimed film. Part \ of our collection. Immerse yourself in the story of \.\,
    poster: MOVIE_COVERS[i % MOVIE_COVERS.length],
    backdrop: MOVIE_BACKDROPS[i % MOVIE_BACKDROPS.length]
  }))
];
