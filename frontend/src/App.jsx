import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Sun, Wind, Droplets, LogOut, Loader2, Thermometer, ShieldCheck } from 'lucide-react';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const [weatherData, setWeatherData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

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
      setWeatherData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // 2. Loading State (Auth0)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  // 3. LOGIN SCREEN (Shown if user is NOT logged in)
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-white">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
            <Sun className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2 text-gray-800 tracking-tight">WeatherIndex</h1>
          <p className="text-gray-500 mb-8 font-medium">Secure analytics for city comfort. Please login to access the dashboard.</p>
          <button 
            onClick={() => loginWithRedirect()}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-blue-200 shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} /> Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  // 4. LOGGED IN DASHBOARD (Shown if user IS logged in)
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">COMFORT <span className="text-blue-600">INDEX</span></h2>
            <p className="text-gray-500 font-medium italic">Welcome back, <span className="text-blue-600 font-bold underline cursor-default">{user.nickname || user.name}</span></p>
          </div>
          <button 
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="flex items-center gap-2 bg-white text-red-500 font-bold border-2 border-red-50 px-6 py-2 rounded-2xl hover:bg-red-50 transition shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </header>

        {/* Weather Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingData ? (
             <div className="col-span-full text-center py-20">
               <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
               <p className="text-gray-400 font-bold">CALCULATING SCORES...</p>
             </div>
          ) : (
            weatherData.map((city) => (
              <div key={city.city} className="bg-white p-7 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors tracking-tight">{city.city}</h3>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">{city.description}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black ring-1 ring-blue-100">
                    RANK #{city.rank}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <Thermometer size={20} className="mx-auto mb-1.5 text-orange-500" />
                    <span className="text-md font-black">{city.temp}°</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <Droplets size={20} className="mx-auto mb-1.5 text-blue-400" />
                    <span className="text-md font-black">{city.humidity}%</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <Wind size={20} className="mx-auto mb-1.5 text-slate-400" />
                    <span className="text-md font-black">{city.windSpeed}m/s</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Comfort Metric</span>
                    <span className="text-3xl font-black text-gray-800 leading-none">{city.comfortScore}<span className="text-sm text-gray-300">/100</span></span>
                  </div>
                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden p-1">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${city.comfortScore > 75 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : city.comfortScore > 50 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.3)]'}`}
                      style={{ width: `${city.comfortScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;