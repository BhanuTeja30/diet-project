import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Utensils, Calendar, Clock, Sparkles } from 'lucide-react';
import { Meal } from '../types';

interface MealFormProps {
  onAdd: (meal: Omit<Meal, 'id'>) => void;
  onClose: () => void;
}

export default function MealForm({ onAdd, onClose }: MealFormProps) {
  const [descriptions, setDescriptions] = useState<Record<Meal['category'], string>>({
    'Breakfast': '',
    'Lunch': '',
    'Dinner': '',
    'Snack': '',
    'Full Week': ''
  });
  const [category, setCategory] = useState<Meal['category']>('Breakfast');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAdd({
      description: descriptions[category],
      category,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
    });
  };

  const handleDescriptionChange = (val: string) => {
    setDescriptions(prev => ({
      ...prev,
      [category]: val
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-dark/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 40 }}
        className="relative w-full max-w-2xl bg-bg-alt border border-white/5 rounded-none shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="border-b border-white/5 p-8 flex justify-between items-center bg-bg-dark">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-2 text-primary border border-primary/20">
              <Utensils size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] font-display">Data Ingestion</h2>
              <span className="label-micro">{category === 'Full Week' ? 'Aggregate Weekly Framework' : 'Single Event Capture'}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            <label className="label-micro text-white/30">Classification Protocol</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Full Week'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-3 px-2 text-[9px] font-bold uppercase tracking-widest transition-all border ${
                    category === cat 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent border-white/10 text-white/40 hover:border-white/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="label-micro block text-primary">
                {category === 'Full Week' ? 'Analysis Context: Weekly Behavioral Pattern' : 'Inquiry: Describe contents'}
              </label>
              <textarea 
                autoFocus
                required
                value={descriptions[category]}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full min-h-[250px] p-6 bg-bg-dark border border-white/5 focus:border-primary outline-none transition-all resize-none text-white font-light text-sm leading-relaxed placeholder:text-white/5"
                placeholder={category === 'Full Week' ? "Suggested Format:\nMonday - Sunday overview...\nTypical proteins: [list]\nDaily hydration: [amount]\nRecurring snacks: [list]\nAny recurring deficits you've noticed..." : "Record the specifics for heuristic analysis..."}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <p className="label-micro flex items-center gap-2">
                <Sparkles size={12} className="text-primary" />
                Active Analysis Powered by Gemini AI
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-white hover:bg-primary hover:text-white text-black font-black py-5 text-xs uppercase tracking-[0.4em] transition-all transform active:scale-95 shadow-xl shadow-white/5"
            >
              Analyze & Archive
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
