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
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 rounded-2xl h-48"></div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-white/10 rounded-lg w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="animate-pulse">
                  <div className="bg-white/10 aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-00 to-yellow-20 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://portalpopline.com.br/wp-content/uploads/2018/12/mosaico.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">
                Bem-vindo ao Music Brasil!
              </h1>
              <p className="text-xl text-green-100 mb-6 drop-shadow">
                Descubra o melhor da música brasileira - dos clássicos aos hits do momento
              </p>
            </div>
            
            {/* Botão de atualizar */}
            <button
              onClick={refreshSections}
              disabled={refreshing}
              className={`
                flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white 
                px-4 py-2 rounded-xl font-medium transition-all duration-200 
                border border-white/30 hover:scale-105
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
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400"></h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {[{ name: 'Ana Castela', logo: 'https://versoseprosas.com.br/wp-content/uploads/2023/07/Ana-Castela.jpg', url: 'https://www.instagram.com/qgdaanacastela/' },
                    { name: 'Leonardo', logo: 'https://imagem.natelinha.uol.com.br/original/leonardo-lanca-dvd-em-homenagem-a-leandro-e-fala-de-emocao-vou-me-segurar_9717.jpeg', url: 'https://www.instagram.com/leonardo/' },
                    { name: 'Zezê de Camargo', logo: 'https://veja.abril.com.br/wp-content/uploads/2017/01/zeze-di-camargo-amarelas.jpg?crop=1&resize=1212,909', url: 'https://www.instagram.com/zezedicamargo/' },
                    { name: 'Paula fernandes', logo: 'https://s2.glbimg.com/jv3e89_AtGsMcJcyCL_-1KRJ34I=/e.glbimg.com/og/ed/f/original/2019/08/28/paula-fernandes.jpg', url: 'https://www.instagram.com/paulafernandes/' },
                    { name: 'Marília Mendonça', logo: 'https://ogimg.infoglobo.com.br/in/25267458-480-fc7/FT1086A/95939655_RE-Rio-de-Janeiro-RJ-29102021Retomada-dos-sertanejos-aos-palcos-com-caches-inflaci.jpg', url: 'https://www.instagram.com/mariliamendoncacantora/' },
                    { name: 'Alok', logo: 'https://static.ndmais.com.br/2022/08/alok.png', url: 'https://www.instagram.com/alok/' },
                    { name: 'Gustavo Lima', logo: 'https://www.diariodecontagem.com.br/fotos/materias/22072024093142_gusttavo-lima-credito-augusto-albuquerque-1-1.jpg', url: 'https://www.instagram.com/gustavolima_oembaixador/' },
                    { name: 'Luan Santana', logo: 'https://f.i.uol.com.br/fotografia/2022/01/14/164218087461e1b10ab0d32_1642180874_3x4_md.jpg', url: 'https://www.instagram.com/luansantana/' },
                    { name: 'Lady Gaga', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGfzvCg7dgk-2DB7HdaBX3BnzyIBQvIwTPR8ekSqEbZ7jFLdwaB9IXxE4Ka730dU0otrk0aKUYLzYTgujBqLBkBA', url: 'https://www.instagram.com/ladygaga/' },
                    { name: 'Beyoncé', logo: 'https://forbes.com.br/wp-content/uploads/2024/11/beyonce-curso-yale.jpg', url: 'https://www.instagram.com/beyonce/' },
                    { name: 'Gilberto Gil', logo: 'https://aloalobahia.com/wp-content/uploads/2025/04/gilentrevi_alo_alo_bahia.jpg', url: 'https://www.instagram.com/gilbertogil/' },
                    { name: 'Michael Jackson', logo: 'https://s.rfi.fr/media/display/8a033dc0-0d8a-11ea-89f1-005056a9aa4d/w:1280/p:1x1/michael-jackson-xscape-album-cover.jpg', url: 'https://www.instagram.com/michaeljackson/' },
                    { name: 'Madonna', logo: 'https://www2.ufjf.br/noticias/wp-content/uploads/sites/2/2024/04/whatsapp-image-2024-04-30-at-15-25-31.jpeg', url: 'https://www.instagram.com/madonna/' },
                    { name: 'Mariah Carey', logo: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/03/mariah-carey.jpg?w=1200&h=900&crop=1', url: 'https://www.instagram.com/mariahcarey/' },
                    { name: 'Chris Brown', logo: 'https://people.com/thmb/03mCNQS1gc1KPKmJD2asw7-yKaE=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(742x331:744x333)/chris-brown-tout-061324-15c5e4c3935a4672a1e9c9eb988d9b3d.jpg', url: 'https://www.instagram.com/chrisbrownofficial/'},
                    { name: 'Adele', logo: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR2brq_dHZdVsJiyv8S8riEHdC2Q33BgM7yztq8zctdslFEddo3_DIW6xltMQU_NQE06H_eYG6PphGtDDfcug4BaQ', url: 'https://www.instagram.com/adele/' }].map((station, index) => (
                    <a
                      key={index}
                      href={station.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center hover:scale-105 transition-transform duration-200 min-w-[70px] sm:min-w-[80px]"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400 overflow-hidden shadow-md">
                        <img src={station.logo} alt={station.name} className="object-cover w-full h-full" />
                      </div>
                      <span className="text-xs sm:text-sm text-center mt-1 max-w-[80px] truncate">{station.name}</span>
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
              <Clock className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
              🎵 Tocadas Recentemente
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
                className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group rounded-xl p-4"
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
                    className="opacity-0 group-hover:opacity-100 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-200"
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
            <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-red-400" />
            🔥 Em Alta no Brasil
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
            <Calendar className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
            🆕 Novos Lançamentos
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewReleases(prev => [...prev].sort(() => Math.random() - 0.5))}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
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
              badgeColor="bg-blue-600"
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
            🏆 Clássicos Brasileiros
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
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🎵 Diversidade Musical Brasileira
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
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
