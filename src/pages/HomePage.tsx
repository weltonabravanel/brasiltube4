import React, { useEffect, useState } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { TrendingUp, Calendar, Award, Clock, PlayCircle, Star, RefreshCw } from 'lucide-react';

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
  // Estados locais para permitir atualização independente
  const [trendingSongs, setTrendingSongs] = useState(initialTrending);
  const [newReleases, setNewReleases] = useState(initialNewReleases);
  const [classicSongs, setClassicSongs] = useState(initialClassics);
  const [refreshing, setRefreshing] = useState(false);

  // Atualiza quando as props mudam
  useEffect(() => {
    setTrendingSongs(initialTrending);
  }, [initialTrending]);

  useEffect(() => {
    setNewReleases(initialNewReleases);
  }, [initialNewReleases]);

  useEffect(() => {
    setClassicSongs(initialClassics);
  }, [initialClassics]);

  // Embaralha as músicas a cada renderização para mais variedade
  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      if (!isLoading && !refreshing) {
        setTrendingSongs(prev => [...prev].sort(() => Math.random() - 0.5));
        setNewReleases(prev => [...prev].sort(() => Math.random() - 0.5));
        setClassicSongs(prev => [...prev].sort(() => Math.random() - 0.5));
      }
    }, 30000); // Embaralha a cada 30 segundos

    return () => clearInterval(shuffleInterval);
  }, [isLoading, refreshing]);

  const playPlaylist = (songs: Song[], startIndex: number = 0) => {
    if (songs.length > 0) {
      onPlaySong(songs[startIndex], songs);
    }
  };

  const refreshSections = async () => {
    setRefreshing(true);
    try {
      // Força embaralhamento imediato
      setTrendingSongs(prev => [...prev].sort(() => Math.random() - 0.5));
      setNewReleases(prev => [...prev].sort(() => Math.random() - 0.5));
      setClassicSongs(prev => [...prev].sort(() => Math.random() - 0.5));
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  if (isLoading) {
    return (
      // Mantendo o loader em tons escuros
      <div className="space-y-8 text-gray-400">
        <div className="animate-pulse">
          <div className="bg-gray-800 rounded-2xl h-48"></div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-gray-700 rounded-lg w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="animate-pulse">
                  <div className="bg-gray-700 aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    // Certifique-se de que o fundo principal (fora deste componente) também seja escuro, como `bg-black` ou `bg-gray-900`.
    <div className="space-y-8 text-white"> 
      {/* Hero Section */}
      <div className="bg-gray-800 rounded-2xl p-8 relative overflow-hidden shadow-xl">
        {/* Camada escura por cima da imagem */}
        <div className="absolute inset-0 bg-black/50 opacity-70"></div> 
        {/* Imagem de fundo opcional */}
        <div className="absolute inset-0 bg-[url('https://portalpopline.com.br/wp-content/uploads/2018/12/mosaico.jpg')] bg-cover bg-center opacity-10"></div>
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
            
            {/* Botão de atualizar */}
            <button
              onClick={refreshSections}
              disabled={refreshing}
              className={`
                flex items-center gap-2 bg-white/10 hover:bg-white/20 text-green-400 
                px-4 py-2 rounded-xl font-medium transition-all duration-200 
                border border-white/20 hover:scale-105
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
            <div className="flex flex-col sm:flex-row gap-4">
              <section className="mt-8">
                <h2 className="text-3xl font-semibold mb-4 text-green-400"></h2> {/* Removido o texto do h2 */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {/* ... Mapeamento de Artistas (Cores ajustadas) ... */}
                  {[].map((station, index) => (
                    <a
                      key={index}
                      href={station.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center hover:scale-105 transition-transform duration-200 min-w-[70px] sm:min-w-[80px]"
                    >
                      {/* Borda de destaque na cor verde */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-green-400 overflow-hidden shadow-lg"> 
                        <img src={station.logo} alt={station.name} className="object-cover w-full h-full" />
                      </div>
                      <span className="text-xs sm:text-sm text-center mt-1 max-w-[80px] truncate text-gray-300">{station.name}</span> 
                    </a>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Recent Songs */}
      {recentSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Clock className="w-6 md:w-8 h-6 md:h-8 text-indigo-400" /> {/* Cor de ícone ajustada */}
              🎵 <span className='text-white'>Tocadas Recentemente</span>
            </h2>
            <button 
              onClick={() => playPlaylist(recentSongs)}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Todas
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSongs.slice(0, 6).map((song) => (
              <div
                key={song.id}
                // Fundo sutilmente escuro e borda discreta
                className="bg-gray-800/70 border border-gray-700 hover:bg-gray-700 transition-all duration-200 cursor-pointer group rounded-xl p-4" 
              >
                <div className="flex items-center gap-4">
                  <img
                    src={song.image?.[0]?.url || 'https://img.freepik.com/fotos-premium/fundo-de-concerto-turva-com-cantores-e-feixes-de-projetor-de-palco_186673-3056.jpg'}
                    alt={song.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{song.name}</h3>
                    <p className="text-sm text-gray-400 truncate">
                      {song.artists.primary.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                  <button 
                    onClick={() => onPlaySong(song, recentSongs)}
                    className="opacity-0 group-hover:opacity-100 bg-green-500 hover:bg-green-400 text-white p-2 rounded-full transition-all duration-200"
                  >
                    <PlayCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Brasil */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-red-500" /> {/* Cor de ícone ajustada */}
            🔥 <span className='text-white'>Em Alta no Brasil</span>
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTrendingSongs(prev => [...prev].sort(() => Math.random() - 0.5))}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
              title="Embaralhar seção"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => playPlaylist(trendingSongs)}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Tudo
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trendingSongs.slice(0, 12).map((song, index) => (
            <SongCard
              key={`trending-${song.id}-${index}`}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              showIndex={true}
              index={index + 1}
              badge="TRENDING"
              badgeColor="bg-red-600"
              // Observação: Assumindo que SongCard usa fundos escuros e texto claro por padrão.
              // Se não, você precisará ajustar o SongCard.
              onClick={() => onPlaySong(song, trendingSongs)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Calendar className="w-6 md:w-8 h-6 md:h-8 text-cyan-400" /> {/* Cor de ícone ajustada */}
            🆕 <span className='text-white'>Novos Lançamentos</span>
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewReleases(prev => [...prev].sort(() => Math.random() - 0.5))}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              title="Embaralhar seção"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => playPlaylist(newReleases)}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Ver Mais
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newReleases.slice(0, 10).map((song, index) => (
            <SongCard
              key={`releases-${song.id}-${index}`}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              badge="NOVO"
              badgeColor="bg-cyan-600"
              onClick={() => onPlaySong(song, newReleases)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* Classics */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Award className="w-6 md:w-8 h-6 md:h-8 text-yellow-400" />
            🏆 <span className='text-white'>Clássicos Brasileiros</span>
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setClassicSongs(prev => [...prev].sort(() => Math.random() - 0.5))}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              title="Embaralhar seção"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => playPlaylist(classicSongs)}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Tudo
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {classicSongs.slice(0, 10).map((song, index) => (
            <SongCard
              key={`classics-${song.id}-${index}`}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              badge="CLÁSSICO"
              badgeColor="bg-yellow-600"
              onClick={() => onPlaySong(song, classicSongs)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* Diversity Info */}
      <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🎵 Diversidade Musical Brasileira
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
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
