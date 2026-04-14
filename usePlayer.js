import { useState, useRef, useCallback } from 'react';

export function usePlayer(songs) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          return 0;
        }
        return p + 100 / 60;
      });
    }, 1000);
  }, []);

  const playSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    startTimer();
  }, [startTimer]);

  const togglePlay = useCallback(() => {
    setIsPlaying(p => {
      if (!p) startTimer();
      else clearInterval(timerRef.current);
      return !p;
    });
  }, [startTimer]);

  const nextSong = useCallback(() => {
    if (!currentSong) return;
    const idx = songs.findIndex(s => s.id === currentSong.id);
    const next = isShuffle
      ? songs[Math.floor(Math.random() * songs.length)]
      : songs[(idx + 1) % songs.length];
    playSong(next);
  }, [currentSong, songs, isShuffle, playSong]);

  const prevSong = useCallback(() => {
    if (!currentSong) return;
    const idx = songs.findIndex(s => s.id === currentSong.id);
    playSong(songs[(idx - 1 + songs.length) % songs.length]);
  }, [currentSong, songs, playSong]);

  const seek = useCallback((pct) => {
    setProgress(pct);
  }, []);

  const toggleLike = useCallback((id) => {
    setLikedSongs(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const formatTime = (secs) => {
    const s = Math.floor(secs);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const currentSeconds = currentSong ? (progress / 100) * currentSong.duration : 0;

  return {
    currentSong, isPlaying, progress, volume, isShuffle, isRepeat, likedSongs,
    playSong, togglePlay, nextSong, prevSong, seek,
    setVolume, setIsShuffle, setIsRepeat, toggleLike, formatTime, currentSeconds,
  };
}
