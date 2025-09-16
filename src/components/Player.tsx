import React, { useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Shuffle, Repeat, ChevronDown, ChevronUp, Share,
  ListMusic, Settings, Maximize2, RotateCcw, X
} from 'lucide-react';
import { Song } from '../types/music';
import { getImageUrl, formatTime } from '../utils/audioUtils';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playerExpanded: boolean;
  isFavorite: boolean;
  autoPlay: boolean;
  autoPlayNotification?: string | null;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleExpanded: () => void;
  onToggleFavorite: () => void;
  onToggleAutoPlay: () => void;
  onClearAutoPlayNotification?: () => void;
}

const Player: React.FC<PlayerProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffled,
  repeatMode,
  playerExpanded,
  isFavorite,
  autoPlay,
  autoPlayNotification,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleExpanded,
  onToggleFavorite,
  onToggleAutoPlay,
  onClearAutoPlayNotification,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentSong) return null;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onSeek(value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onVolumeChange(value);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return '🔂';
      case 'all':
        return '🔁';
      default:
        return '🔁';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/20 z-50">
      {/* Auto-play Notification */}
      {autoPlayNotification && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up">
          <span className="text-sm font-medium">{autoPlayNotification}</span>
          {onClearAutoPlayNotification && (
            <button
              onClick={onClearAutoPlayNotification}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Mobile Expanded Player */}
      {playerExpanded && (
        <div className="md:hidden">
          <div className="p-6 text-center border-b border-white/20">
            <img
              src={getImageUrl(currentSong)}
              alt={currentSong.name}
              className="w-64 h-64 rounded-2xl object-cover mx-auto mb-6 shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop';
              }}
            />
            <h2 className="text-xl font-bold text-white mb-2">{currentSong.name}</h2>
            <p className="text-gray-400 mb-6">
              {currentSong.artists.primary.map((artist) => artist.name).join(', ')}
            </p>

            {/* Mobile Controls */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <button
                onClick={onToggleShuffle}
                className={`p-3 rounded-full transition-colors ${
                  isShuffled ? 'text-green-400 bg-green-400/20' : 'text-gray-400 hover:text-white'
                }`}
                title="Modo Aleatório"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button onClick={onPrevious} className="text-white hover:text-gray-300 p-3">
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={onPlayPause}
                className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>

              <button onClick={onNext} className="text-white hover:text-gray-300 p-3">
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={onToggleRepeat}
                className={`p-3 rounded-full transition-colors relative ${
                  repeatMode !== 'none' ? 'text-green-400 bg-green-400/20' : 'text-gray-400 hover:text-white'
                }`}
                title={`Repetir: ${repeatMode === 'none' ? 'Desligado' : repeatMode === 'one' ? 'Uma música' : 'Todas'}`}
              >
                <span className="text-lg">{getRepeatIcon()}</span>
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 text-xs bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onToggleMute} className="text-gray-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${isMuted ? 0 : volume}%, #4b5563 ${isMuted ? 0 : volume}%, #4b5563 100%)`
                }}
              />
              <span className="text-sm text-gray-400 w-8">{isMuted ? 0 : volume}</span>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
                title="Adicionar aos Favoritos"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button 
                onClick={onToggleAutoPlay}
                className={`p-2 rounded-full transition-colors ${
                  autoPlay ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
                }`}
                title={`Reprodução Automática: ${autoPlay ? 'Ligada' : 'Desligada'}`}
              >
                <RotateCcw className={`w-5 h-5 ${autoPlay ? 'animate-pulse' : ''}`} />
              </button>
              
              <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                <Share className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                <ListMusic className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Auto-play Status */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-sm">
                <RotateCcw className={`w-4 h-4 ${autoPlay ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
                <span className={autoPlay ? 'text-green-400' : 'text-gray-400'}>
                  Reprodução Automática: {autoPlay ? 'Ativada' : 'Desativada'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {autoPlay ? 'Músicas continuarão tocando automaticamente' : 'Clique para ativar reprodução contínua'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="px-4 pt-2">
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${progressPercentage}%, #4b5563 ${progressPercentage}%, #4b5563 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Player Controls */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative group">
              <img
                src={getImageUrl(currentSong)}
                alt={currentSong.name}
                className="w-14 h-14 rounded-lg object-cover shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
                }}
              />
              <button className="md:hidden absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-white truncate text-sm md:text-base">
                {currentSong.name}
              </h4>
              <p className="text-gray-400 text-xs md:text-sm truncate">
                {currentSong.artists.primary.map((artist) => artist.name).join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
                title="Adicionar aos Favoritos"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              {/* Auto-play Toggle */}
              <button
                onClick={onToggleAutoPlay}
                className={`hidden md:flex p-2 rounded-lg transition-colors ${
                  autoPlay ? 'text-green-400 bg-green-400/10' : 'text-gray-400 hover:text-green-400'
                }`}
                title={`Reprodução Automática: ${autoPlay ? 'Ligada' : 'Desligada'}`}
              >
                <RotateCcw className={`w-4 h-4 ${autoPlay ? 'animate-pulse' : ''}`} />
              </button>
              
              {/* Mobile Expand Button */}
              <button
                onClick={onToggleExpanded}
                className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
              >
                {playerExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            <button
              onClick={onToggleShuffle}
              className={`transition-colors ${
                isShuffled ? 'text-green-400' : 'text-gray-400 hover:text-white'
              }`}
              title="Modo Aleatório"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button onClick={onPrevious} className="text-white hover:text-gray-300 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={onPlayPause}
              className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button onClick={onNext} className="text-white hover:text-gray-300 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleRepeat}
              className={`transition-colors relative ${
                repeatMode !== 'none' ? 'text-green-400' : 'text-gray-400 hover:text-white'
              }`}
              title={`Repetir: ${repeatMode === 'none' ? 'Desligado' : repeatMode === 'one' ? 'Uma música' : 'Todas'}`}
            >
              <span className="text-base">{getRepeatIcon()}</span>
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 text-xs bg-green-500 rounded-full w-3 h-3 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={onPrevious} className="text-white hover:text-gray-300">
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={onPlayPause}
              className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button onClick={onNext} className="text-white hover:text-gray-300">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Volume */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end relative">
            <button 
              onClick={onToggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className={`h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer transition-all duration-200 ${
                  showVolumeSlider ? 'w-24' : 'w-16'
                }`}
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${isMuted ? 0 : volume}%, #4b5563 ${isMuted ? 0 : volume}%, #4b5563 100%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auto-play Status Bar (Desktop) */}
      {autoPlay && (
        <div className="hidden md:block px-4 pb-2">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            <div className="flex items-center justify-center gap-2 text-xs">
              <RotateCcw className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-green-400 font-medium">
                🎵 Reprodução Automática Ativada - Músicas continuarão tocando automaticamente
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;