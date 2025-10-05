import React, { useEffect, useState } from 'react'; 
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { TrendingUp, Calendar, Award, Clock, PlayCircle, RefreshCw } from 'lucide-react';

interface HomePageProps {
  trendingSongs: Song[];
  newReleases: Song[];
  classicSongs: Song[];
  recentSongs: Song[];
  currentSong: Song | null;
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  isLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({
  trendingSongs: initialTrending,
  newReleases: initialNewReleases,
  classicSongs: initialClassics,
  recentSongs,
  currentSong,
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  isLoading,
}) => {
  const [trendingSongs, setTrendingSongs] = useState(initialTrending);
  const [newReleases, setNewReleases] = useState(initialNewReleases);
  const [classicSongs, setClassicSongs] = useState(initialClassics);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { setTrendingSongs(initialTrending); }, [initialTrending]);
  useEffect(() => { setNewReleases(initialNewReleases); }, [initialNewReleases]);
  useEffect(() => { setClassicSongs(initialClassics); }, [initialClassics]);

  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      if (!isLoading && !refreshing) {
        setTrendingSongs(prev => [...prev].sort(() => Math.random() - 0.5));
        setNewReleases(prev => [...prev].sort(() => Math.random() - 0.5));
        setClassicSongs(prev => [...prev].sort(() => Math.random() - 0.5));
      }
    }, 30000);
    return () => clearInterval(shuffleInterval);
  }, [isLoading, refreshing]);

  const playPlaylist = (songs: Song[], startIndex: number = 0) => {
    if (songs.length > 0) onPlaySong(songs[startIndex], songs);
  };

  const refreshSections = async () => {
    setRefreshing(true);
    try {
      setTrendingSongs(prev => [...prev].sort(() => Math.random() - 0.5));
      setNewReleases(prev => [...prev].sort(() => Math.random() - 0.5));
      setClassicSongs(prev => [...prev].sort(() => Math.random() - 0.5));
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 bg-gray-900 min-h-screen p-4">
        <div className="animate-pulse">
          <div className="bg-gray-800 rounded-2xl h-48"></div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-gray-800 rounded-lg w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="animate-pulse">
                  <div className="bg-gray-800 aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-900 min-h-screen p-4 text-white">
      {/* Hero Section */}
      <div className="bg-gray-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://portalpopline.com.br/wp-content/uploads/2018/12/mosaico.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">
                Bem-vindo ao Music Brasil!
              </h1>
              <p className="text-xl text-gray-300 mb-6 drop-shadow">
                Descubra o melhor da música brasileira - dos clássicos aos hits do momento
              </p>
            </div>
            <button
              onClick={refreshSections}
              disabled={refreshing}
              className={`
                flex items-center gap-2 bg-gray-700/40 hover:bg-gray-600/50 text-white 
                px-4 py-2 rounded-xl font-medium transition-all duration-200 
                border border-gray-600 hover:scale-105
                ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title="Embaralhar músicas"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {refreshing ? 'Atualizando...' : 'Embaralhar'}
              </span>
            </button>
          </div>

          {recentSongs.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <section>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {recentSongs.map((song, index) => (
                    <div key={index} className="flex flex-col items-center min-w-[70px] sm:min-w-[80px]">
                      <img src={song.image?.[0]?.url} alt={song.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-600 object-cover mb-1"/>
                      <span className="text-xs sm:text-sm text-center text-gray-300 truncate">{song.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Sections (Recent, Trending, New Releases, Classics) */}
      {[{ title: 'Tocadas Recentemente', icon: Clock, data: recentSongs },
        { title: 'Em Alta no Brasil', icon: TrendingUp, data: trendingSongs },
        { title: 'Novos Lançamentos', icon: Calendar, data: newReleases },
        { title: 'Clássicos Brasileiros', icon: Award, data: classicSongs }].map((section, idx) => (
        section.data.length > 0 && (
          <section key={idx}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <section.icon className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
                {section.title}
              </h2>
              <button 
                onClick={() => playPlaylist(section.data)}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                Tocar Todas
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {section.data.slice(0, 10).map((song, index) => (
                <SongCard
                  key={`${section.title}-${song.id}-${index}`}
                  song={song}
                  isPlaying={currentSong?.id === song.id}
                  isFavorite={isFavorite(song.id)}
                  badge={idx === 1 ? 'TRENDING' : idx === 2 ? 'NOVO' : idx === 3 ? 'CLÁSSICO' : undefined}
                  badgeColor={idx === 1 ? 'bg-red-600' : idx === 2 ? 'bg-blue-600' : idx === 3 ? 'bg-yellow-600' : undefined}
                  onClick={() => onPlaySong(song, section.data)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                />
              ))}
            </div>
          </section>
        )
      ))}

      {/* Diversity Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-gray-300">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          🎵 Diversidade Musical Brasileira
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-white mb-2">🔥 Em Alta</h4>
            <p>Sertanejo, Funk, Pop, Forró, Pagode, Rock Nacional, Eletrônica e Rap - sempre atualizando com novos hits!</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🆕 Lançamentos</h4>
            <p>As mais novas músicas de todos os gêneros brasileiros, de artistas consagrados e novos talentos.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🏆 Clássicos</h4>
            <p>MPB, Bossa Nova, Samba, Rock Nacional e sucessos atemporais que marcaram a música brasileira.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
