import React, { useState, useEffect } from 'react';
import { Song } from './types/music';
import { musicApi } from './services/musicApi';
import { storage } from './utils/storageUtils';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useFavorites } from './hooks/useFavorites';
import { usePlayback } from './hooks/usePlayback';
import { useCommercialPlayer } from './hooks/useCommercialPlayer';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import CommercialPlayer from './components/CommercialPlayer';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import TrendingPage from './pages/TrendingPage';
import DiscoverPage from './pages/DiscoverPage';
import RadioPage from './pages/RadioPage';
import LibraryPage from './pages/LibraryPage';
import NewReleasesPage from './pages/NewReleasesPage';
import ClassicsPage from './pages/ClassicsPage';
import RegionalPage from './pages/RegionalPage';
import InstrumentalPage from './pages/InstrumentalPage';
import StylesPage from './pages/StylesPage';
import DecadesPage from './pages/DecadesPage';
import MoodPage from './pages/MoodPage';

export default function MusicPlatform() {
  // UI State
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Music Data
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [newReleases, setNewReleases] = useState<Song[]>([]);
  const [classicSongs, setClassicSongs] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);

  // Pending song to play after commercial
  const [pendingSong, setPendingSong] = useState<{ song: Song; playlist: Song[] } | null>(null);
  const [shouldAutoPlayAfterCommercial, setShouldAutoPlayAfterCommercial] = useState(false);

  // Custom Hooks
  const favorites = useFavorites();
  const playback = usePlayback();

  // Commercial Player
  const commercialPlayer = useCommercialPlayer({
    onCommercialEnded: () => {
      // After commercial ends, set up the song but don't auto-play yet
      if (pendingSong) {
        playback.playSong(pendingSong.song, pendingSong.playlist);
        setPendingSong(null);
        setShouldAutoPlayAfterCommercial(true);
      }
    },
    volume: playback.volume,
  });

  // Audio Player
  const audioPlayer = useAudioPlayer({
    currentSong: playback.currentSong,
    volume: playback.volume,
    onTimeUpdate: (currentTime) => playback.updatePlaybackState({ currentTime }),
    onLoadedMetadata: (duration) => playback.updatePlaybackState({ duration }),
    onEnded: playback.handleSongEnded,
    onError: () => {
      console.error('Audio playback error');
      playback.updatePlaybackState({ isPlaying: false });
    },
    onPlay: () => playback.updatePlaybackState({ isPlaying: true }),
    onPause: () => playback.updatePlaybackState({ isPlaying: false }),
  });

  // Set up commercial audio event listeners
  useEffect(() => {
    return commercialPlayer.setupCommercialAudio();
  }, [commercialPlayer.setupCommercialAudio]);

  // Auto-play music ONLY after commercial ends and when explicitly allowed
  useEffect(() => {
    if (playback.currentSong && shouldAutoPlayAfterCommercial && !commercialPlayer.currentCommercial) {
      const timer = setTimeout(() => {
        audioPlayer.play();
        setShouldAutoPlayAfterCommercial(false);
      }, 500); // Small delay to ensure everything is ready
      
      return () => clearTimeout(timer);
    }
  }, [playback.currentSong, shouldAutoPlayAfterCommercial, commercialPlayer.currentCommercial, audioPlayer]);

  // Stop music when commercial starts
  useEffect(() => {
    if (commercialPlayer.currentCommercial && playback.isPlaying) {
      audioPlayer.pause();
      audioPlayer.stop(); // Stop completely
    }
  }, [commercialPlayer.currentCommercial, audioPlayer]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
    loadStoredData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [trending, newReleases, classics] = await Promise.all([
        musicApi.getTrendingSongs(),
        musicApi.getNewReleases(),
        musicApi.getClassicSongs(),
      ]);

      setTrendingSongs(trending);
      setNewReleases(newReleases);
      setClassicSongs(classics);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStoredData = () => {
    setSearchHistory(storage.getSearchHistory());
    setRecentSongs(storage.getRecentSongs());
  };

  // Search functionality - Agora busca até 200 músicas
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Aumentado o limite para 200 músicas
      const results = await musicApi.searchSongs(searchQuery, 200);
      setSearchResults(results);
      setActiveTab('search');
      setSidebarOpen(false);

      // Update search history
      const updatedHistory = storage.addToSearchHistory(searchQuery);
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySearch = (query: string) => {
    setSearchQuery(query);
    musicApi.searchSongs(query, 200).then(results => {
      setSearchResults(results);
      setActiveTab('search');
    });
  };

  // Playback controls
  const handlePlaySong = async (song: Song, playlist: Song[] = []) => {
    // First, stop any current music playback completely
    audioPlayer.pause();
    audioPlayer.stop();
    
    // Store the song to play after commercial
    setPendingSong({ song, playlist });
    
    // Reset auto-play flag
    setShouldAutoPlayAfterCommercial(false);
    
    // Play commercial first (this will handle the music after it ends)
    await commercialPlayer.playCommercial();
    
    // Update recent songs immediately
    const updatedRecent = storage.addToRecent(song);
    setRecentSongs(updatedRecent);
  };

  const handlePlayPause = () => {
    // If commercial is playing, control commercial
    if (commercialPlayer.currentCommercial) {
      if (commercialPlayer.isPlayingCommercial) {
        commercialPlayer.pauseCommercial();
      } else {
        commercialPlayer.resumeCommercial();
      }
      return;
    }

    // Otherwise control music
    if (playback.isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
  };

  const handleSeek = (time: number) => {
    audioPlayer.seek(time);
  };

  const handleVolumeChange = (volume: number) => {
    playback.updatePlaybackState({ volume, isMuted: volume === 0 });
  };

  const handleToggleMute = () => {
    const newMuted = !playback.isMuted;
    playback.updatePlaybackState({ isMuted: newMuted });
    audioPlayer.setMuted(newMuted);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    const commonProps = {
      onPlaySong: handlePlaySong,
      onToggleFavorite: favorites.toggleFavorite,
      isFavorite: favorites.isFavorite,
      currentSong: playback.currentSong,
      isLoading,
    };

    switch (activeTab) {
      case 'search':
        return (
          <SearchPage
            {...commonProps}
            searchQuery={searchQuery}
            searchResults={searchResults}
            isLoading={isLoading}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            {...commonProps}
            favorites={favorites}
          />
        );
      case 'trending':
        return (
          <TrendingPage
            {...commonProps}
            trendingSongs={trendingSongs}
          />
        );
      case 'discover':
        return (
          <DiscoverPage
            {...commonProps}
            onSearch={handleSearch}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'radio':
        return (
          <RadioPage
            {...commonProps}
          />
        );
      case 'library':
        return (
          <LibraryPage
            {...commonProps}
            recentSongs={recentSongs}
            favorites={favorites}
          />
        );
      case 'new-releases':
        return (
          <NewReleasesPage
            {...commonProps}
          />
        );
      case 'classics':
        return (
          <ClassicsPage
            {...commonProps}
          />
        );
      case 'regional':
        return (
          <RegionalPage
            {...commonProps}
          />
        );
      case 'instrumental':
        return (
          <InstrumentalPage
            {...commonProps}
          />
        );
      case 'styles':
        return (
          <StylesPage
            {...commonProps}
          />
        );
      case 'decades':
        return (
          <DecadesPage
            {...commonProps}
          />
        );
      case 'mood':
        return (
          <MoodPage
            {...commonProps}
          />
        );
      default:
        return (
          <HomePage
            {...commonProps}
            trendingSongs={trendingSongs}
            newReleases={newReleases}
            classicSongs={classicSongs}
            recentSongs={recentSongs}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-yellow-900 to-blue-900 text-white">
      <div className="flex h-screen">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          favoritesCount={favorites.count}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            setSidebarOpen={setSidebarOpen}
            searchHistory={searchHistory}
            onHistorySearch={handleHistorySearch}
          />

          <main className="flex-1 overflow-auto p-4 md:p-6 pb-32">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Commercial Player Overlay */}
      {commercialPlayer.currentCommercial && (
        <CommercialPlayer
          commercial={commercialPlayer.currentCommercial}
          isPlaying={commercialPlayer.isPlayingCommercial}
          currentTime={commercialPlayer.commercialTime}
          duration={commercialPlayer.commercialDuration}
          canSkip={commercialPlayer.canSkipCommercial}
          onPlayPause={handlePlayPause}
          onSkip={commercialPlayer.skipCommercial}
        />
      )}

      <Player
        currentSong={playback.currentSong}
        isPlaying={playback.isPlaying}
        currentTime={playback.currentTime}
        duration={playback.duration}
        volume={playback.volume}
        isMuted={playback.isMuted}
        isShuffled={playback.isShuffled}
        repeatMode={playback.repeatMode}
        playerExpanded={playerExpanded}
        autoPlay={playback.autoPlay}
        autoPlayNotification={playback.autoPlayNotification}
        isFavorite={playback.currentSong ? favorites.isFavorite(playback.currentSong.id) : false}
        onPlayPause={handlePlayPause}
        onNext={playback.playNext}
        onPrevious={playback.playPrevious}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleShuffle={playback.toggleShuffle}
        onToggleRepeat={playback.toggleRepeat}
        onToggleExpanded={() => setPlayerExpanded(!playerExpanded)}
        onToggleFavorite={() => {
          if (playback.currentSong) {
            favorites.toggleFavorite(playback.currentSong);
          }
        }}
        onToggleAutoPlay={playback.toggleAutoPlay}
        onClearAutoPlayNotification={playback.clearAutoPlayNotification}
      />

      <audio ref={audioPlayer.audioRef} />
      <audio ref={commercialPlayer.commercialAudioRef} />
    </div>
  );
}