import { Song } from '../types/music';

export const getImageUrl = (song: Song): string => {
  if (!song.image || song.image.length === 0) {
    return 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop';
  }
  
  return song.image.find((img) => img.quality === '500x500')?.url || 
         song.image.find((img) => img.quality === '150x150')?.url || 
         song.image[0]?.url ||
         'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop';
};

export const getThumbnailUrl = (song: Song): string => {
  if (!song.image || song.image.length === 0) {
    return 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
  }
  
  return song.image.find((img) => img.quality === '150x150')?.url || 
         song.image[0]?.url ||
         'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
};

export const getAudioUrl = (song: Song): string => {
  return song.downloadUrl.find((url) => url.quality === '320kbps')?.url ||
         song.downloadUrl.find((url) => url.quality === '160kbps')?.url ||
         song.downloadUrl[0]?.url || '';
};

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generatePlaylist = (songs: Song[], currentSong: Song, isShuffled: boolean): Song[] => {
  if (isShuffled) {
    const otherSongs = songs.filter(song => song.id !== currentSong.id);
    const shuffledOthers = shuffleArray(otherSongs);
    return [currentSong, ...shuffledOthers];
  }
  return songs;
};

export const getNextSong = (
  currentSong: Song,
  playlist: Song[],
  isShuffled: boolean,
  repeatMode: 'none' | 'one' | 'all'
): Song | null => {
  if (repeatMode === 'one') {
    return currentSong;
  }

  const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
  
  if (isShuffled) {
    // Em modo shuffle, escolhe uma música aleatória diferente da atual
    const availableSongs = playlist.filter(song => song.id !== currentSong.id);
    if (availableSongs.length === 0) return null;
    return availableSongs[Math.floor(Math.random() * availableSongs.length)];
  }

  const nextIndex = currentIndex + 1;
  
  if (nextIndex >= playlist.length) {
    // Se chegou ao fim da playlist
    if (repeatMode === 'all') {
      return playlist[0]; // Volta para o início
    } else {
      // Modo 'none' - continua com música aleatória da mesma playlist
      return playlist[Math.floor(Math.random() * playlist.length)];
    }
  }
  
  return playlist[nextIndex];
};

export const getPreviousSong = (
  currentSong: Song,
  playlist: Song[],
  isShuffled: boolean
): Song | null => {
  if (isShuffled) {
    const availableSongs = playlist.filter(song => song.id !== currentSong.id);
    if (availableSongs.length === 0) return null;
    return availableSongs[Math.floor(Math.random() * availableSongs.length)];
  }

  const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
  const prevIndex = currentIndex - 1;
  
  if (prevIndex < 0) {
    return playlist[playlist.length - 1];
  }
  
  return playlist[prevIndex];
};

export const calculatePlaylistDuration = (songs: Song[]): number => {
  return songs.reduce((total, song) => total + song.duration, 0);
};

// Commercial System
export interface Commercial {
  id: string;
  title: string;
  advertiser: string;
  audioUrl: string;
  duration: number;
  image: string;
}

export const brazilianCommercials: Commercial[] = [

  {
    id: 'comm_12',
    title: 'Spotify Premium - Música sem Limites',
    advertiser: 'Spotify',
    audioUrl: 'https://comerciais.netlify.app/mercadopago.mp3',
    duration: 20,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  }
  
];

export const getRandomCommercial = (): Commercial => {
  const randomIndex = Math.floor(Math.random() * brazilianCommercials.length);
  return brazilianCommercials[randomIndex];
};

export const shouldPlayCommercial = (): boolean => {
  // Play commercial before every song (100% chance)
  // You can adjust this logic to play commercials less frequently
  return true;
};




