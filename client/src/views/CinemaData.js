const ANIME_COVERS = [
  'https://upload.wikimedia.org/wikipedia/en/8/85/Jujutsu_Kaisen_manga_vol_1.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/d6/Shingeki_no_Kyojin_manga_volume_1.jpg',
  'https://upload.wikimedia.org/wikipedia/en/0/09/Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg',
  'https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg',
  'https://upload.wikimedia.org/wikipedia/en/a/a3/One_Piece%2C_Volume_1.jpg'
];

const ANIME_BACKDROPS = [
  'https://picsum.photos/seed/anime1/1200/600', 
  'https://picsum.photos/seed/anime2/1200/600',
  'https://picsum.photos/seed/anime3/1200/600'
];

const CARTOON_COVERS = [
  'https://upload.wikimedia.org/wikipedia/en/5/5a/TomandJerryTitleCardc.jpg',
  'https://upload.wikimedia.org/wikipedia/en/3/36/Looney_Tunes_logo.jpg',
  'https://upload.wikimedia.org/wikipedia/en/2/24/SpongeBob_SquarePants_logo.svg'
];

const MOVIE_COVERS = [
  'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_vhs.jpg',
  'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
  'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
  'https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg',
  'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg',
  'https://upload.wikimedia.org/wikipedia/en/8/87/Ringstrilogyposter.jpg'
];

const MOVIE_BACKDROPS = [
  'https://picsum.photos/seed/moviebg1/1200/600',
  'https://picsum.photos/seed/moviebg2/1200/600',
  'https://picsum.photos/seed/moviebg3/1200/600',
  'https://picsum.photos/seed/moviebg4/1200/600'
];

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
          title: `Anime Hit Ep ${i + 1}`,
          url: `https://www.youtube.com/embed/${ANIME_YT_IDS[i % ANIME_YT_IDS.length]}?autoplay=1&rel=0`
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
          title: `Modern Anime Ep ${i + 1}`,
          url: `https://www.youtube.com/embed/${ANIME_YT_IDS[(i + 5) % ANIME_YT_IDS.length]}?autoplay=1&rel=0`
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
          title: `Classic Short ${i + 1}`,
          url: `https://www.youtube.com/embed/${CARTOON_YT_IDS[i % CARTOON_YT_IDS.length]}?autoplay=1&rel=0`
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
          title: `Hero Time ${i + 1}`,
          url: `https://www.youtube.com/embed/${CARTOON_YT_IDS[(i + 5) % CARTOON_YT_IDS.length]}?autoplay=1&rel=0`
        }))
      }
    ]
  },
  // 50 Individual Movies
  ...Array.from({ length: 50 }).map((_, i) => ({
    id: `movie-${i + 1}`,
    title: MOVIES_TITLES[i],
    category: 'Movies',
    type: 'movie',
    url: `https://www.youtube.com/embed/${MOVIE_YT_IDS[i % MOVIE_YT_IDS.length]}?autoplay=1&rel=0`,
    desc: `A highly acclaimed film. Part ${i + 1} of our collection. Immerse yourself in the story of ${MOVIES_TITLES[i]}.`,
    poster: MOVIE_COVERS[i % MOVIE_COVERS.length],
    backdrop: MOVIE_BACKDROPS[i % MOVIE_BACKDROPS.length]
  }))
];