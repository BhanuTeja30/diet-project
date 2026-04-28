import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, LogIn, UserPlus, LogOut, PieChart, Utensils, Activity, Plus } from 'lucide-react';
import { User, Meal } from './types';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('nutri_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nutri_user', JSON.stringify(userData));
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nutri_user');
    setView('login');
  };

  if (loading) return (
    <div className="min-h-screen grid place-items-center bg-bg-dark text-primary">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Activity size={48} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-bg-dark border-b border-border-subtle px-10 py-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-2 rounded-lg text-primary border border-primary/20">
            <Utensils size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-display uppercase tracking-widest leading-none">NutriBalance</span>
            <span className="label-micro mt-1">Architecture v2.0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-primary text-xs font-bold font-mono">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white/80">{user.name}</span>
                  <span className="label-micro text-primary">System Auth Active</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold border-l border-white/10 pl-8 ml-4"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Terminate Session</span>
              </button>
            </>
          ) : (
            <div className="flex gap-8">
              <button 
                onClick={() => setView('login')}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${view === 'login' ? 'text-primary' : 'text-white/40 hover:text-white'}`}
              >
                Authorization
              </button>
              <button 
                onClick={() => setView('signup')}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all px-6 py-2 border rounded-full ${view === 'signup' ? 'bg-white text-black border-white' : 'border-white/20 text-white/40 hover:border-white hover:text-white'}`}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 overflow-auto bg-bg-dark">
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <Login onSuccess={handleAuthSuccess} />
            </motion.div>
          )}

          {view === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <Signup onSuccess={handleAuthSuccess} />
            </motion.div>
          )}

          {view === 'dashboard' && user && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              <Dashboard user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="py-8 bg-bg-dark text-white/20 text-center text-[10px] uppercase tracking-widest border-t border-white/5">
        <p>© 2024 NutriBalance Platform • Unified Data Protocol</p>
      </footer>
    </div>
  );
}
