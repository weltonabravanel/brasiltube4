import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, Bell, Settings, User, History, Filter } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  setSidebarOpen: (open: boolean) => void;
  searchHistory: string[];
  onHistorySearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  setSidebarOpen,
  searchHistory,
  onHistorySearch,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const popularSearches = [
    'Anitta', 'Gusttavo Lima', 'Sertanejo 2024', 'Funk Brasileiro',
    'Marília Mendonça', 'Jorge e Mateus', 'Henrique e Juliano',
    'Maiara e Maraisa', 'Zé Neto e Cristiano', 'Wesley Safadão'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowHistory(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch();
      setShowHistory(false);
      setIsSearchFocused(false);
    }
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    onHistorySearch(query);
    setShowHistory(false);
    setIsSearchFocused(false);
  };

  return (
    <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-400 hover:text-white transition-colors p-2 -ml-2"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar artistas, músicas, álbuns brasileiros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setShowHistory(true);
                  }}
                  className={`
                    w-full pl-12 pr-12 py-3 rounded-2xl text-white placeholder:text-gray-400 
                    bg-white/10 border border-white/20 backdrop-blur-sm
                    focus:outline-none focus:border-green-500 focus:bg-white/15
                    transition-all duration-200
                    ${isSearchFocused ? 'shadow-lg shadow-green-500/20' : ''}
                  `}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    title="Filtros"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Search History/Suggestions Dropdown */}
            {showHistory && (isSearchFocused || searchQuery) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                {searchHistory.length > 0 && (
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <History className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-300">Buscas recentes</span>
                    </div>
                    <div className="space-y-2">
                      {searchHistory.slice(0, 5).map((query, index) => (
                        <button
                          key={index}
                          onClick={() => handleHistoryClick(query)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <span className="text-sm font-medium text-gray-300 mb-3 block">Buscas populares</span>
                  <div className="grid grid-cols-2 gap-2">
                    {popularSearches.slice(0, 6).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(query)}
                        className="text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200">
              <Bell className="w-5 h-5" />
            </button>
            
            <button className="hidden sm:flex text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">
                BR
              </div>
              <span className="hidden sm:block text-sm font-medium text-white">Premium</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;