import catalog from './catalog.json';

const BASE_CDN_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-';

const getPic = (idx) => `https://picsum.photos/seed/track${idx}/300/300`;

const PODCAST_SHOWS = ['Lofi Talk', 'Developer Mindset', 'Cozy Code Podcast', 'Deep Focus Sessions', 'Study Sound Bites', 'Ambient Talks', 'Creative Routine', 'Brainwave Frequency'];
const PODCAST_TOPICS = ['Deep Work Hacks', 'TypeScript Sorcery', 'Overcoming Burnout', 'Keyboard Mechanics', 'Synthesizer History', 'Coffee Brewing Science', 'Sci-Fi Soundtracks', 'Mindful Relaxation'];

const PLAYLIST_THEMES = ['Chill Coding Beats', 'Late Night Hacking', 'Rainy Sunday Loops', 'Cyberpunk Study Focus', 'Morning Coffee Melodies', 'Lofi Girl Favorites', 'Ambient Focus Wave', 'Pixel Art Chill'];

// Curated Lofi Artists / Singers
export const ARTISTS = [
  { id: 'art-1', name: 'Purrple Cat', bio: 'Wholesome cozy lofi beats, perfect for wrapping yourself in a warm blanket and coding.', avatar: getPic(101), monthlyListeners: '1.2M', followers: '450K' },
  { id: 'art-2', name: 'Lofi Girl', bio: 'The global standard of study and focus. The soundtrack of millions of developer journeys.', avatar: getPic(102), monthlyListeners: '3.5M', followers: '1.8M' },
  { id: 'art-3', name: 'Idealism', bio: 'Atmospheric piano and dusty vinyl cuts for melancholic programming sessions.', avatar: getPic(103), monthlyListeners: '980K', followers: '320K' },
  { id: 'art-4', name: 'Chillhop Music', bio: 'Upbeat jazzy lofi beats with bouncing basslines and sunny café vibes.', avatar: getPic(104), monthlyListeners: '2.1M', followers: '950K' },
  { id: 'art-5', name: 'Wun Two', bio: 'Minimalistic organic beats layered with bird chirps, vinyl dust, and warm guitars.', avatar: getPic(105), monthlyListeners: '850K', followers: '280K' }
];

// Map 166 real songs from catalog.json + 5 live streams
export const SONGS = [
  ...catalog.tracks.map((track, idx) => {
    const artistObj = ARTISTS[idx % ARTISTS.length];
    const minutes = String(Math.floor(2 + (idx % 2))).padStart(2, '0');
    const seconds = String((idx * 17) % 60).padStart(2, '0');
    const soundHelixVal = (idx % 16) + 1;
    
    return {
      id: `song-${idx}`,
      name: track.title,
      artist: artistObj.name,
      artistId: artistObj.id,
      url: `${BASE_CDN_URL}${soundHelixVal}.mp3`,
      desc: `Relaxing ${track.category} vibes for deep focus.`,
      cover: getPic(idx),
      duration: `${minutes}:${seconds}`,
      isLive: false
    };
  }),
  // 5 live streams at the very end
  {
    id: 'song-live-1',
    name: 'LIVE: Laut.fm Lofi',
    artist: 'Lofi Girl',
    artistId: 'art-2',
    url: 'https://stream.laut.fm/lofi',
    desc: '24/7 global lofi study stream',
    cover: getPic(501),
    duration: 'LIVE',
    isLive: true
  },
  {
    id: 'song-live-2',
    name: 'LIVE: Chillhop Radio',
    artist: 'Chillhop Music',
    artistId: 'art-4',
    url: 'https://stream.zeno.fm/fyn8eh3h5f8uv',
    desc: '24/7 global lofi study stream',
    cover: getPic(502),
    duration: 'LIVE',
    isLive: true
  },
  {
    id: 'song-live-3',
    name: 'LIVE: Bootleg Boy',
    artist: 'Idealism',
    artistId: 'art-3',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
    desc: '24/7 global lofi study stream',
    cover: getPic(503),
    duration: 'LIVE',
    isLive: true
  },
  {
    id: 'song-live-4',
    name: 'LIVE: Lofi Radio Focus',
    artist: 'Purrple Cat',
    artistId: 'art-1',
    url: 'https://stream.zeno.fm/fyn8eh3h5f8uv',
    desc: '24/7 global lofi study stream',
    cover: getPic(504),
    duration: 'LIVE',
    isLive: true
  },
  {
    id: 'song-live-5',
    name: 'LIVE: Ambient Dreams',
    artist: 'Wun Two',
    artistId: 'art-5',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
    desc: '24/7 global lofi study stream',
    cover: getPic(505),
    duration: 'LIVE',
    isLive: true
  }
];

// Map 52 podcasts to stable high-availability CDN mp3s from catalog.json
export const PODCASTS = Array.from({ length: 52 }).map((_, idx) => {
  const show = PODCAST_SHOWS[idx % PODCAST_SHOWS.length];
  const topic = PODCAST_TOPICS[(idx + 2) % PODCAST_TOPICS.length];
  const episodeName = `Ep. ${idx + 1}: ${topic}`;
  
  const minutes = String(Math.floor(15 + (idx % 25))).padStart(2, '0');
  const seconds = String((idx * 7) % 60).padStart(2, '0');
  const soundHelixVal = ((idx + 5) % 16) + 1;
  
  return {
    id: `pod-${idx}`,
    name: show,
    episodeName,
    host: `Host ${String.fromCharCode(65 + (idx % 6))}`,
    url: `${BASE_CDN_URL}${soundHelixVal}.mp3`,
    desc: `In this episode, we dive deep into ${topic.toLowerCase()} and share actionable focus tips.`,
    cover: getPic(200 + idx),
    duration: `${minutes}:${seconds}`
  };
});

// Map 50 playlists/albums using catalog.json song indices
export const PLAYLISTS = Array.from({ length: 50 }).map((_, idx) => {
  const theme = PLAYLIST_THEMES[idx % PLAYLIST_THEMES.length];
  const isAlbum = idx % 2 === 0;
  const name = isAlbum ? `${theme} (Album)` : `${theme} Playlist`;
  
  // Assign a subset of 8-12 song IDs to this playlist (excluding live streams)
  const songsCount = 8 + (idx % 6);
  const trackIds = Array.from({ length: songsCount }).map((_, songIdx) => {
    return `song-${(idx * 3 + songIdx) % catalog.tracks.length}`;
  });

  return {
    id: `playlist-${idx}`,
    name,
    desc: `Focus playlist curated by NEXUS. ${isAlbum ? 'Original Album compilation' : 'High quality selected beats'}.`,
    cover: getPic(300 + idx),
    songsCount,
    trackIds,
    isAlbum
  };
});
