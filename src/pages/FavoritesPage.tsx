import React from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Heart, PlayCircle, Download, Share, Trash2 } from 'lucide-react';

interface FavoritesPageProps {
  favorites: {
    favoriteSongs: Song[];
    count: number;
    toggleFavorite: (song: Song) => void;
    clearAllFavorites: () => void;
    exportFavorites: () => void;
    getRecommendationsBasedOnFavorites: () => Promise<Song[]>;
  };
  currentSong: Song | null;
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  currentSong,
  onPlaySong,
  onToggleFavorite,
  isFavorite,
}) => {
  const playAllFavorites = () => {
    if (favorites.favoriteSongs.length > 0) {
      onPlaySong(favorites.favoriteSongs[0], favorites.favoriteSongs);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja remover todas as músicas favoritas?')) {
      favorites.clearAllFavorites();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              ❤️ Suas Favoritas
            </h1>
            <p className="text-red-100">
              {favorites.count} música{favorites.count !== 1 ? 's' : ''} brasileira{favorites.count !== 1 ? 's' : ''} que você ama
            </p>
          </div>
        </div>

        {favorites.favoriteSongs.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={playAllFavorites}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Todas
            </button>
            
            <button
              onClick={favorites.exportFavorites}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-white/20"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
            
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-white/20">
              <Share className="w-5 h-5" />
              Compartilhar
            </button>
            
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-red-500/30"
            >
              <Trash2 className="w-5 h-5" />
              Limpar Tudo
            </button>
          </div>
        )}
      </div>

      {/* Favorites List */}
      {favorites.favoriteSongs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Nenhuma música favorita ainda</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Comece a curtir suas músicas brasileiras favoritas! 
            Clique no ❤️ ao lado de qualquer música para adicioná-la aos seus favoritos.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>💡 Dica: Suas favoritas ficarão sempre disponíveis aqui</p>
            <p>🎵 Você pode tocar todas de uma vez ou criar playlists</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.favoriteSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={true}
              showIndex={true}
              index={index + 1}
              layout="list"
              onClick={() => onPlaySong(song, favorites.favoriteSongs)}
              onToggleFavorite={() => onToggleFavorite(song)}
              onAddToQueue={() => {
                console.log('Add to queue:', song.name);
              }}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {favorites.favoriteSongs.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Estatísticas das Favoritas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{favorites.count}</div>
              <div className="text-sm text-gray-400">Total de Músicas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {new Set(favorites.favoriteSongs.flatMap(s => s.artists.primary.map(a => a.name))).size}
              </div>
              <div className="text-sm text-gray-400">Artistas Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.floor(favorites.favoriteSongs.reduce((acc, song) => acc + song.duration, 0) / 60)}
              </div>
              <div className="text-sm text-gray-400">Minutos de Música</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">❤️</div>
              <div className="text-sm text-gray-400">Muito Amor</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;