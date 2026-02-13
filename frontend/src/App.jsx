import React, { useEffect, useState, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Sun, Wind, Droplets, LogOut, Loader2, Thermometer, ShieldCheck, Moon, Search, X, AlertCircle, ChevronDown, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const [weatherData, setWeatherData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Dark Mode State (persists in localStorage)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank'); // 'rank' or 'temperature'
  
  // Logout Confirmation Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isSortOpen, setIsSortOpen] = useState(false);

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 1. Fetch data only when the user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchWeather();
    }
  }, [isAuthenticated]);

  const fetchWeather = async () => {
    setLoadingData(true);
    try {
      // Connect to your backend running on 5001
      const response = await axios.get('http://localhost:5001/api/weather');
      // Add mock temperature trends for chart visualization
      const dataWithTrends = response.data.data.map(city => ({
        ...city,
        tempTrend: generateTempTrend(city.temp)
      }));
      setWeatherData(dataWithTrends);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // Generate temperature trend data for charts
  const generateTempTrend = (currentTemp) => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      temp: currentTemp + (Math.random() * 6 - 3) // Variation of ±3 degrees
    }));
  };

  // Generate safe ID for gradients (remove spaces and special characters)
  const getSafeId = (cityName) => {
    return cityName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  };

  // Get first name from user object
  const getFirstName = () => {
    if (!user) return '';
    const name = user.given_name || user.nickname || user.name || '';
    return name.split(' ')[0];
  };

  // Filter and Sort Logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = weatherData.filter(city =>
      city.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'rank') {
      filtered.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'temperature') {
      filtered.sort((a, b) => b.temp - a.temp);
    }

    return filtered;
  }, [weatherData, searchQuery, sortBy]);

  // Handle Logout
  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // 2. Loading State (Auth0)
  if (isLoading) {
    return (
      <div className={`flex h-screen items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  // 3. LOGIN SCREEN (Shown if user is NOT logged in)
  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex h-screen flex-col items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-6`}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white'} p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full border`}
        >
          <motion.div 
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Sun className="text-white" size={32} />
          </motion.div>
          <h1 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>COMFORT INDEX</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-8 font-medium`}>Secure analytics for city comfort. Please login to access the dashboard.</p>
          <button 
            onClick={() => loginWithRedirect()}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-blue-200 shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} /> Login 
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // 4. LOGGED IN DASHBOARD (Shown if user IS logged in)
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6 md:p-10 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.header 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h2 className="text-3xl font-black tracking-tight italic">
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>COMFORT</span>{' '}
              <span className="text-blue-600">INDEX</span>
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium italic`}>
              Welcome back, <span className="text-blue-600 font-bold cursor-default">{getFirstName()}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-2xl font-bold transition-all shadow-sm ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-400 border-2 border-gray-700' 
                  : 'bg-white text-gray-700 border-2 border-gray-100'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center gap-2 ${
                darkMode 
                  ? 'bg-gray-800 text-red-400 border-2 border-gray-700' 
                  : 'bg-white text-red-500 border-2 border-red-50'
              } font-bold px-6 py-2 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition shadow-sm`}
            >
              <LogOut size={18} /> Logout
            </motion.button>
          </div>
        </motion.header>

        {/* Filter & Sort Controls */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col md:flex-row gap-4"
        >
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
            <input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-10 py-3 rounded-2xl font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                darkMode 
                  ? 'bg-gray-800 text-white border-2 border-gray-700 placeholder-gray-500' 
                  : 'bg-white text-gray-900 border-2 border-gray-100 placeholder-gray-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition`}
              >
                <X size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
         {/* Custom Sort Dropdown */}
<div className="relative min-w-[220px] z-20">
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={() => setIsSortOpen(!isSortOpen)}
    className={`w-full flex items-center justify-between px-6 py-3.5 rounded-2xl font-bold transition-all border-2 ${
      darkMode 
        ? 'bg-gray-800 text-white border-gray-700 hover:border-blue-500/50' 
        : 'bg-white text-gray-900 border-gray-100 hover:border-blue-200 shadow-sm'
    }`}
  >
    <span>{sortBy === 'rank' ? 'Sort by Rank' : 'Sort by Temperature'}</span>
    <motion.div
      animate={{ rotate: isSortOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <ChevronDown size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
    </motion.div>
  </motion.button>

  {/* Dropdown Options List */}
  <AnimatePresence>
    {isSortOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 5, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl shadow-2xl border-2 z-30 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-50'
        }`}
      >
        <button
          onClick={() => { setSortBy('rank'); setIsSortOpen(false); }}
          className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${
            sortBy === 'rank' 
              ? 'bg-blue-600 text-white' 
              : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          Sort by Rank
        </button>
        <button
          onClick={() => { setSortBy('temperature'); setIsSortOpen(false); }}
          className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors mt-1 ${
            sortBy === 'temperature' 
              ? 'bg-blue-600 text-white' 
              : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          Sort by Temperature
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</div>
        </motion.div>

        {/* Weather Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loadingData ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-20"
              >
                <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} font-bold`}>CALCULATING SCORES...</p>
              </motion.div>
            ) : filteredAndSortedData.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full text-center py-20"
              >
                <Search className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} size={48} />
                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} font-bold`}>No cities found matching "{searchQuery}"</p>
              </motion.div>
            ) : (
              filteredAndSortedData.map((city, index) => (
                <motion.div
                  key={city.city}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-blue-500/50' 
                      : 'bg-white border-gray-100 hover:shadow-2xl'
                  } p-6 rounded-[2rem] shadow-sm transition-all duration-300 border-2 group`}
                >
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3 className={`text-2xl font-black ${
                        darkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'
                      } transition-colors tracking-tight`}>
                        {city.city}
                      </h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-black uppercase tracking-[0.2em]`}>
                        {city.description}
                      </p>
                    </div>
                    <div className={`${
                      darkMode ? 'bg-blue-900/30 text-blue-400 ring-blue-800' : 'bg-blue-50 text-blue-600 ring-blue-100'
                    } px-4 py-1.5 rounded-full text-xs font-black ring-1`}>
                      RANK #{city.rank}
                    </div>
                  </div>

                  {/* Temperature Trend Chart */}
                  {city.tempTrend && (
                    <div className={`mb-5 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'} rounded-2xl p-3 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-[9px] font-black ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mb-2`}>7-Day Trend</p>
                      <ResponsiveContainer width="100%" height={60}>
                        <AreaChart data={city.tempTrend}>
                          <defs>
                            <linearGradient id={`gradient-${getSafeId(city.city)}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            labelStyle={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                            formatter={(value) => [`${value.toFixed(1)}°C`, 'Temp']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="temp" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fill={`url(#gradient-${getSafeId(city.city)})`} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className={`text-center p-3 ${
                      darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'
                    } rounded-2xl border`}>
                      <Thermometer size={18} className="mx-auto mb-1.5 text-orange-500" />
                      <span className={`text-sm font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{city.temp}°</span>
                    </div>
                    <div className={`text-center p-3 ${
                      darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'
                    } rounded-2xl border`}>
                      <Droplets size={18} className="mx-auto mb-1.5 text-blue-400" />
                      <span className={`text-sm font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{city.humidity}%</span>
                    </div>
                    <div className={`text-center p-3 ${
                      darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'
                    } rounded-2xl border`}>
                      <Wind size={18} className="mx-auto mb-1.5 text-slate-400" />
                      <span className={`text-sm font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{city.windSpeed}m/s</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className={`text-[10px] font-black ${
                        darkMode ? 'text-gray-600' : 'text-gray-300'
                      } uppercase tracking-widest leading-none`}>
                        Comfort Metric
                      </span>
                      <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-800'} leading-none`}>
                        {city.comfortScore}
                        <span className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>/100</span>
                      </span>
                    </div>
                    <div className={`w-full ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} h-4 rounded-full overflow-hidden p-1`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${city.comfortScore}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          city.comfortScore > 75 
                            ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                            : city.comfortScore > 50 
                            ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                            : 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.3)]'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              } rounded-3xl p-8 max-w-md w-full shadow-2xl border-2`}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
              </div>
              <h3 className={`text-2xl font-black text-center mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirm Logout
              </h3>
              <p className={`text-center mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you sure you want to logout from your account?
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutModal(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 transition-all"
                >
                  Yes, Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`mt-16 border-t-2 ${
          darkMode ? 'border-gray-800' : 'border-gray-100'
        } pt-8 pb-6`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left Section - Brand */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <Sun className="text-white" size={18} />
                </div>
                <span className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  COMFORT INDEX
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center md:text-left`}>
                City comfort analytics powered by weather data
              </p>
            </div>

            {/* Right Section - Social Links */}
            <div className="flex items-center gap-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/SavinduS/weather-comfort-index"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl transition-colors ${
                  darkMode
                    ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
                title="GitHub"
              >
                <Github size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="http://linkedin.com/in/savinduweerarathna"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl transition-colors ${
                  darkMode
                    ? 'bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-gray-200'
                }`}
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:savinduweerarathna@gmail.com"
                className={`p-2 rounded-xl transition-colors ${
                  darkMode
                    ? 'bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:text-red-600 hover:bg-gray-200'
                }`}
                title="Email"
              >
                <Mail size={18} />
              </motion.a>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className={`mt-6 pt-4 border-t ${
            darkMode ? 'border-gray-800' : 'border-gray-100'
          } text-center`}>
            <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              © {new Date().getFullYear()} WeatherIndex. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}

export default App;