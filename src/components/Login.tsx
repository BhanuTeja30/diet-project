import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onSuccess: (user: User) => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    // Simulated Google Auth for Editorial Experience
    setTimeout(() => {
      onSuccess({ 
        name: "Google User", 
        email: "user@gmail.com" 
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-full flex flex-col md:flex-row bg-bg-dark">
      {/* Left Column: Hero */}
      <div className="w-full md:w-3/5 p-12 md:p-24 flex flex-col justify-between border-r border-white/5 relative overflow-hidden min-h-[400px]">
        <div className="z-10">
          <p className="label-micro mb-4">Nutritional Intelligence System</p>
          <div className="w-12 h-[1px] bg-primary"></div>
        </div>

        <div className="relative z-10 my-12">
          <h1 className="text-8xl md:text-[140px] leading-[0.8] font-serif italic tracking-tighter opacity-90 mb-12">
            The<br />Balance
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-white/40 font-light tracking-wide">
            Access your secure health profile using a unified identification protocol. Powered by Google.
          </p>
        </div>

        <div className="z-10 flex items-center gap-12">
          <div className="flex flex-col">
            <span className="label-micro">Auth Server</span>
            <span className="text-xs font-mono mt-1 tracking-widest text-white/60">OAUTH_V2</span>
          </div>
          <div className="flex flex-col">
            <span className="label-micro">Integrity</span>
            <span className="text-xs font-mono mt-1 tracking-widest text-white/60">SECURE_HS256</span>
          </div>
        </div>

        {/* Decorative Background Number */}
        <div className="absolute -bottom-10 -left-10 text-[400px] font-serif italic opacity-[0.03] select-none pointer-events-none text-white">
          01
        </div>
      </div>

      {/* Right Column: Google Login Only */}
      <div className="w-full md:w-2/5 md:bg-bg-alt flex flex-col justify-center items-center p-12 md:p-24 min-h-[500px]">
        <div className="w-full max-w-sm text-center">
          <div className="mb-12 text-left">
            <h2 className="text-3xl font-light tracking-tight mb-2 text-white/90">Identity Proxy</h2>
            <p className="label-micro">Single Sign-On Authentication</p>
          </div>

          <div className="space-y-12">
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-5 bg-white text-black text-[11px] uppercase tracking-[0.3em] font-black hover:bg-white/90 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {loading ? 'Validating Token...' : 'Authorize with Google'}
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-mono text-red-400 uppercase tracking-widest bg-red-400/5 p-4 border border-red-400/20"
              >
                [Error]: {error}
              </motion.div>
            )}

            <div className="pt-12 border-t border-white/5 flex flex-col gap-8 text-left">
              <div className="space-y-4">
                <span className="label-micro opacity-100 text-white italic">Alternative Access</span>
                <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-widest">
                  Authentication requires an active Google identity for real-time synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
