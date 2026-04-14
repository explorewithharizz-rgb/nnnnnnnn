import { useState, useMemo } from 'react';
import './App.css';
import { songs, playlists, languages } from './data/songs';
import { usePlayer } from './hooks/usePlayer';

// ---- ICONS ----
const Icon = ({ d, size = 24, fill = 'none', stroke = 'currentColor', sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#fff' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M3 9.5L12 3l9 6.5V21H15v-6H9v6H3V9.5z" />
  </svg>
);
const SearchIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const LibIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const PlayIcon = ({ size = 24, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><polygon points="5 3 19 12 5 21 5 3" /></svg>
);
const PauseIcon = ({ size = 24, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);
const SkipPrev = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
    <polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" stroke="#fff" strokeWidth="2" />
  </svg>
);
const SkipNext = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
    <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" stroke="#fff" strokeWidth="2" />
  </svg>
);
const ShuffleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
  </svg>
);
const RepeatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const HeartFilled = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4d4d" stroke="#ff4d4d" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const HeartEmpty = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b3b3b3" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const VolumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#727272" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
  </svg>
);
const VolMaxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#727272" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);
const ChevronDown = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const DotsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" />
  </svg>
);

// ---- SONG ITEM ----
function SongItem({ song, isPlaying, isCurrent, onClick }) {
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return (
    <div className={`song-item${isCurrent ? ' playing' : ''}`} onClick={onClick}>
      <div className="song-thumb" style={{ background: song.color }}>
        {song.emoji}
        <div className="play-overlay">
          {isCurrent && isPlaying ? <PauseIcon size={18} color="#fff" /> : <PlayIcon size={18} color="#fff" />}
        </div>
      </div>
      <div className="song-info">
        <div className="song-title">{song.title}</div>
        <div className="song-meta">
          <span className="song-artist">{song.artist}</span>
          <span className="lang-badge">{song.lang}</span>
        </div>
      </div>
      <span className="song-duration">{fmt(song.duration)}</span>
    </div>
  );
}

// ---- HOME ----
function HomeScreen({ player, onSongClick }) {
  const [lang, setLang] = useState('All');
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const filtered = useMemo(() =>
    lang === 'All' ? songs : songs.filter(s => s.lang === lang),
    [lang]
  );

  return (
    <div className="screen active" id="home-screen">
      <div className="home-header">
        <h1>{greet}</h1>
        <div className="avatar">R</div>
      </div>

      <div className="lang-pills">
        {languages.map(l => (
          <button key={l} className={`pill${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>{l}</button>
        ))}
      </div>

      <div className="scroll-content">
        <div className="section">
          <div className="section-title">Featured Playlists</div>
          <div className="h-scroll">
            {playlists.map(pl => (
              <div key={pl.id} className="feat-card" onClick={() => setLang(pl.lang)}>
                <div className="feat-thumb" style={{ background: pl.color }}>{pl.emoji}</div>
                <div className="feat-name">{pl.name}</div>
                <div className="feat-sub">{pl.count} songs</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">{lang === 'All' ? 'All Songs' : `${lang} Songs`}</div>
          {filtered.length === 0
            ? <div className="empty"><SearchIcon size={40} /><p>No songs found</p></div>
            : filtered.map(s => (
                <SongItem
                  key={s.id}
                  song={s}
                  isCurrent={player.currentSong?.id === s.id}
                  isPlaying={player.isPlaying}
                  onClick={() => onSongClick(s)}
                />
              ))
          }
        </div>
      </div>
    </div>
  );
}

// ---- SEARCH ----
function SearchScreen({ player, onSongClick }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.lang.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)
    );
  }, [query]);

  const cats = [
    { label: 'Tamil', color: '#1a472a', emoji: '🎵' },
    { label: 'Telugu', color: '#3a1a47', emoji: '🎤' },
    { label: 'Hindi', color: '#471a1a', emoji: '🎶' },
    { label: 'English', color: '#1a2a47', emoji: '🎸' },
    { label: 'Malayalam', color: '#473a1a', emoji: '🎺' },
    { label: 'Kannada', color: '#1a3a47', emoji: '🔥' },
  ];

  return (
    <div className="screen" id="search-screen">
      <div className="search-header">
        <h2>Search</h2>
        <div className="search-box">
          <SearchIcon size={18} />
          <input
            placeholder="Songs, artists, languages..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#777', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>}
        </div>
      </div>
      <div className="scroll-content">
        {query.trim() ? (
          <div style={{ padding: '0 0 8px' }}>
            {results.length === 0
              ? <div className="empty"><p>No results for "{query}"</p></div>
              : results.map(s => (
                  <SongItem key={s.id} song={s} isCurrent={player.currentSong?.id === s.id} isPlaying={player.isPlaying} onClick={() => onSongClick(s)} />
                ))
            }
          </div>
        ) : (
          <>
            <div style={{ padding: '8px 16px 12px', fontSize: 20, fontWeight: 800 }}>Browse by Language</div>
            <div className="browse-grid">
              {cats.map(c => (
                <div key={c.label} className="browse-cat" style={{ background: c.color }} onClick={() => setQuery(c.label)}>
                  {c.label}
                  <span className="cat-emoji">{c.emoji}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---- LIBRARY ----
function LibraryScreen({ player, onSongClick }) {
  return (
    <div className="screen" id="library-screen">
      <div className="library-header">
        <h2>Your Library</h2>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        </button>
      </div>
      <div className="scroll-content">
        <div className="lib-item">
          <div className="lib-thumb" style={{ background: '#1a2a47' }}>❤️</div>
          <div>
            <div className="lib-name">Liked Songs</div>
            <div className="lib-sub">Playlist • {player.likedSongs.size} songs</div>
          </div>
        </div>
        {playlists.map(pl => (
          <div key={pl.id} className="lib-item">
            <div className="lib-thumb" style={{ background: pl.color }}>{pl.emoji}</div>
            <div>
              <div className="lib-name">{pl.name}</div>
              <div className="lib-sub">Playlist • {pl.count} songs</div>
            </div>
          </div>
        ))}
        <div style={{ padding: '20px 16px 4px', fontSize: 18, fontWeight: 800 }}>Recently Played</div>
        {songs.slice(0, 6).map(s => (
          <SongItem key={s.id} song={s} isCurrent={player.currentSong?.id === s.id} isPlaying={player.isPlaying} onClick={() => onSongClick(s)} />
        ))}
      </div>
    </div>
  );
}

// ---- NOW PLAYING ----
function NowPlaying({ player, open, onClose }) {
  const { currentSong, isPlaying, progress, isShuffle, isRepeat, likedSongs,
    togglePlay, nextSong, prevSong, seek, setIsShuffle, setIsRepeat, toggleLike, formatTime, currentSeconds } = player;

  if (!currentSong) return null;

  const nextSongs = useMemo(() => {
    const idx = songs.findIndex(s => s.id === currentSong.id);
    return songs.slice(idx + 1, idx + 4);
  }, [currentSong]);

  return (
    <div className={`now-playing-screen${open ? ' open' : ''}`}>
      <div className="np-bg" style={{ background: `radial-gradient(ellipse at top, ${currentSong.color} 0%, #121212 60%)` }} />
      <div className="np-content">
        <div className="np-header">
          <button className="np-icon-btn" onClick={onClose}><ChevronDown /></button>
          <span className="np-header-center">NOW PLAYING</span>
          <button className="np-icon-btn"><DotsIcon /></button>
        </div>

        <div className="np-art-wrap">
          <div className={`np-art${isPlaying ? ' playing' : ''}`} style={{ background: `linear-gradient(135deg, ${currentSong.color}, #1a1a1a)` }}>
            {currentSong.emoji}
          </div>
        </div>

        <div className="np-info">
          <div>
            <div className="np-title">{currentSong.title}</div>
            <div className="np-artist">{currentSong.artist}</div>
          </div>
          <button className="heart-btn" onClick={() => toggleLike(currentSong.id)}>
            {likedSongs.has(currentSong.id) ? <HeartFilled /> : <HeartEmpty />}
          </button>
        </div>

        <div className="lang-badge-np">{currentSong.lang}</div>

        <div className="progress-area">
          <div className="progress-bar-wrap" onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - rect.left) / rect.width) * 100);
          }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-times">
            <span>{formatTime(currentSeconds)}</span>
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        <div className="np-controls">
          <button className={`ctrl-icon-btn${isShuffle ? ' active' : ''}`} onClick={() => setIsShuffle(!isShuffle)}>
            <ShuffleIcon />
          </button>
          <button className="ctrl-icon-btn" style={{ color: '#fff' }} onClick={prevSong}><SkipPrev /></button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <PauseIcon size={28} color="#000" /> : <PlayIcon size={28} color="#000" />}
          </button>
          <button className="ctrl-icon-btn" style={{ color: '#fff' }} onClick={nextSong}><SkipNext /></button>
          <button className={`ctrl-icon-btn${isRepeat ? ' active' : ''}`} onClick={() => setIsRepeat(!isRepeat)}>
            <RepeatIcon />
          </button>
        </div>

        <div className="vol-area">
          <VolumeIcon />
          <div className="vol-bar" onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            player.setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100));
          }}>
            <div className="vol-fill" style={{ width: `${player.volume}%` }} />
          </div>
          <VolMaxIcon />
        </div>

        {nextSongs.length > 0 && (
          <div className="queue-section">
            <div className="queue-title">NEXT UP</div>
            {nextSongs.map(s => (
              <SongItem key={s.id} song={s} isCurrent={false} isPlaying={false} onClick={() => player.playSong(s)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- MINI PLAYER ----
function MiniPlayer({ player, onOpen }) {
  const { currentSong, isPlaying, progress, togglePlay, nextSong, prevSong } = player;
  if (!currentSong) return null;

  return (
    <div className="mini-player" onClick={onOpen}>
      <div className="mini-thumb" style={{ background: currentSong.color }}>{currentSong.emoji}</div>
      <div className="mini-info">
        <div className="mini-title">{currentSong.title}</div>
        <div className="mini-artist">{currentSong.artist}</div>
      </div>
      <div className="mini-controls" onClick={e => e.stopPropagation()}>
        <button className="mini-btn" onClick={prevSong}><SkipPrev /></button>
        <button className="mini-play-btn" onClick={togglePlay}>
          {isPlaying ? <PauseIcon size={16} color="#000" /> : <PlayIcon size={16} color="#000" />}
        </button>
        <button className="mini-btn" onClick={nextSong}><SkipNext /></button>
      </div>
      <div className="mini-progress">
        <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// ---- APP ----
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [npOpen, setNpOpen] = useState(false);
  const player = usePlayer(songs);

  const handleSongClick = (song) => {
    player.playSong(song);
    setNpOpen(true);
  };

  const screenClass = (name) => `screen${activeTab === name ? ' active' : ''}`;

  return (
    <div className="app">
      {/* SCREENS */}
      <div className={screenClass('home')} id="home">
        <HomeScreen player={player} onSongClick={handleSongClick} />
      </div>
      <div className={screenClass('search')} id="search">
        <SearchScreen player={player} onSongClick={handleSongClick} />
      </div>
      <div className={screenClass('library')} id="library">
        <LibraryScreen player={player} onSongClick={handleSongClick} />
      </div>

      {/* MINI PLAYER */}
      <MiniPlayer player={player} onOpen={() => setNpOpen(true)} />

      {/* NOW PLAYING OVERLAY */}
      <NowPlaying player={player} open={npOpen} onClose={() => setNpOpen(false)} />

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button className={`nav-item${activeTab === 'home' ? ' active' : ''}`} onClick={() => setActiveTab('home')}>
          <HomeIcon active={activeTab === 'home'} />
          <span>Home</span>
        </button>
        <button className={`nav-item${activeTab === 'search' ? ' active' : ''}`} onClick={() => setActiveTab('search')}>
          <SearchIcon />
          <span>Search</span>
        </button>
        <button className={`nav-item${activeTab === 'library' ? ' active' : ''}`} onClick={() => setActiveTab('library')}>
          <LibIcon active={activeTab === 'library'} />
          <span>Library</span>
        </button>
      </nav>
    </div>
  );
}
