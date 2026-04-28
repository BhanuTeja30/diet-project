import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface SignupProps {
  onSuccess: (user: User) => void;
}

export default function Signup({ onSuccess }: SignupProps) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: userName }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.user);
      } else {
        setError(data.message || 'Registration Rejected');
      }
    } catch (err) {
      setError('System Fault: Registration Unavailable.');
    } finally {
      setLoading(false);
    }
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
            New<br />Access
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-white/40 font-light tracking-wide">
            Create an identity within the NutriBalance framework. Begin your journey towards optimized nutritional stability and health monitoring.
          </p>
        </div>

        <div className="z-10 flex items-center gap-12">
          <div className="flex flex-col">
            <span className="label-micro">Registration</span>
            <span className="text-xs font-mono mt-1 tracking-widest text-white/60">OPEN_INVITE</span>
          </div>
          <div className="flex flex-col">
            <span className="label-micro">Protocol</span>
            <span className="text-xs font-mono mt-1 tracking-widest text-white/60">SECURE_AUTH</span>
          </div>
        </div>

        <div className="absolute -bottom-10 -left-10 text-[400px] font-serif italic opacity-[0.03] select-none pointer-events-none text-white">
          02
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full md:w-2/5 md:bg-bg-alt flex flex-col justify-center items-center p-12 md:p-24 min-h-[500px]">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <h2 className="text-2xl font-light tracking-tight mb-2 text-white/90">Identity Initiation</h2>
            <p className="label-micro">Establish secure credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="group relative">
              <label className="label-micro mb-2 block transition-all group-focus-within:opacity-100 group-focus-within:text-white">Legal Identity / Full Name</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-white transition-colors font-light text-sm text-white placeholder:text-white/10"
                  placeholder="JOHN_DOE"
                />
              </div>
            </div>

            <div className="group relative">
              <label className="label-micro mb-2 block transition-all group-focus-within:opacity-100 group-focus-within:text-white">Credentials / Email</label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-white transition-colors font-light text-sm text-white placeholder:text-white/10"
                  placeholder="user@balance.system"
                />
              </div>
            </div>

            <div className="group relative">
              <label className="label-micro mb-2 block transition-all group-focus-within:opacity-100 group-focus-within:text-white">Access Key</label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-white transition-colors font-light text-sm text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-mono text-red-400 uppercase tracking-widest bg-red-400/5 p-4 border border-red-400/20"
              >
                [Error]: {error}
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-8">
              <a href="#" className="label-micro hover:opacity-100 transition-opacity">Terms of Use</a>
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white/90 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Initiating...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
