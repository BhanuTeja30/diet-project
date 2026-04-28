import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Calendar, Clock, Activity, AlertTriangle, CheckCircle2, Utensils } from 'lucide-react';
import { User, Meal, NutrientAnalysis } from '../types';
import MealForm from './MealForm';
import { analyzeNutrients } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [analysis, setAnalysis] = useState<NutrientAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await fetch('/api/meals');
      const data = await res.json();
      setMeals(data);
      if (data.length > 0) {
        runAnalysis(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (mealList: Meal[]) => {
    setAnalyzing(true);
    const combinedDescription = mealList.map(m => m.description).join(', ');
    const result = await analyzeNutrients(combinedDescription);
    if (result) {
      setAnalysis(result);
    }
    setAnalyzing(false);
  };

  const handleAddMeal = async (meal: Omit<Meal, 'id'>) => {
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meal),
      });
      const newMeal = await res.json();
      const updatedMeals = [...meals, newMeal];
      setMeals(updatedMeals);
      setShowAddForm(false);
      runAnalysis(updatedMeals);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-12 space-y-12 bg-bg-dark min-h-full">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-12 border-b border-white/5">
        <div className="flex flex-col gap-4">
          <p className="label-micro text-primary font-bold">Secure Health Monitoring</p>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter opacity-90">
            System<br />Analysis
          </h1>
          <p className="max-w-md text-sm text-white/40 font-light leading-relaxed">
            Nutritional integrity assessment for <span className="text-white font-medium">{user.name}</span>. Syncing real-time dietary heuristics.
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-12 py-5 bg-white text-black text-xs uppercase tracking-[0.3em] font-black hover:bg-primary hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-white/5"
        >
          Input Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Analysis Results */}
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Metrics */}
          {analysis && analysis.summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-bg-alt border border-white/5 p-8 flex justify-between items-center group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="relative z-10">
                  <span className="label-micro text-primary">Energy Density</span>
                  <div className="text-4xl font-serif italic mt-2">{analysis.totalCalories || 0} <span className="text-xs uppercase font-sans font-bold tracking-widest text-white/40 not-italic ml-2">KCAL</span></div>
                </div>
                <Activity className="text-primary/20 group-hover:text-primary transition-colors" size={40} />
              </div>
              <div className="bg-bg-alt border border-white/5 p-8 flex justify-between items-center group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl ${
                  analysis.summary.assessment === 'Optimal' ? 'bg-emerald-500/10' : analysis.summary.assessment === 'Caution' ? 'bg-amber-500/10' : 'bg-red-500/10'
                }`}></div>
                <div className="relative z-10">
                  <span className="label-micro text-white/40">Integrity Score</span>
                  <div className={`text-4xl font-serif italic mt-2 ${
                    analysis.summary.assessment === 'Optimal' ? 'text-emerald-400' : analysis.summary.assessment === 'Caution' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {analysis.summary.score || 0}<span className="text-sm font-sans not-italic font-black text-white/20">/100</span>
                  </div>
                </div>
                <span className="label-micro font-black uppercase text-white/5 group-hover:text-white/10 transition-colors text-3xl">
                  {analysis.summary.assessment}
                </span>
              </div>
            </div>
          )}

          {/* Chart Section */}
          <section className="bg-bg-alt rounded-sm p-10 border border-white/5 relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-baseline mb-12">
              <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-white/50 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-white/20"></span>
                Nutrient Map
              </h2>
              {analyzing && <span className="label-micro text-primary animate-pulse italic">AI_CALCULATING...</span>}
            </div>
            
            <div className="h-[340px] w-full">
              {analysis ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.nutrients}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono', letterSpacing: '0.1em'}} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.02)'}}
                      contentStyle={{backgroundColor: '#0F0F10', borderRadius: '0', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none'}}
                      itemStyle={{color: '#fff', fontSize: '10px', fontFamily: 'JetBrains Mono'}}
                    />
                    <Bar dataKey="amount" radius={0} barSize={40}>
                      {analysis.nutrients.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.status === 'deficit' ? '#F87171' : entry.status === 'excess' ? '#FBBF24' : '#10B981'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/10 border border-dashed border-white/5 uppercase tracking-[0.3em] text-[10px] gap-4">
                  <Activity size={32} className="opacity-20" />
                  Awaiting ingestion sequence
                </div>
              )}
            </div>
          </section>

          {/* Assessment Summary */}
          {analysis && analysis.summary && (
            <div className="p-10 border border-white/5 bg-bg-alt">
              <div className="label-micro text-white/40 mb-4">Core Assessment</div>
              <p className="text-xl font-serif italic text-white/80 leading-relaxed border-l-4 border-primary pl-8 py-2">
                "{analysis.summary.description}"
              </p>
            </div>
          )}

          {/* Recommendations and Deficits */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 overflow-hidden">
            <div className="bg-bg-dark p-10 space-y-8">
              <h3 className="label-micro flex items-baseline gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                System Deficits
              </h3>
              <div className="space-y-4">
                {analysis?.nutrients.filter(n => n.status === 'deficit').map((n, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 group hover:bg-white/[0.02] px-2 -mx-2 transition-colors">
                    <span className="text-xs uppercase tracking-widest font-bold text-white/80">{n.name}</span>
                    <span className="label-micro text-red-400 opacity-100 bg-red-400/10 px-2 py-1 border border-red-400/20">DEFICIT_STATE</span>
                  </div>
                )) || <p className="text-white/20 text-[10px] uppercase tracking-widest italic">All systems optimal.</p>}
              </div>
            </div>

            <div className="bg-bg-alt p-10 space-y-8">
              <h3 className="label-micro flex items-baseline gap-2 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Intervention Protocol
              </h3>
              <ul className="space-y-6">
                {analysis?.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-white/60 leading-relaxed flex gap-4 border-l-2 border-primary/20 pl-6 py-1 italic font-serif">
                    {rec}
                  </li>
                )) || <p className="text-white/20 text-[10px] uppercase tracking-widest italic">Ready for analysis.</p>}
              </ul>
            </div>
          </section>
        </div>

        {/* Right Column: Meal History */}
        <div className="space-y-12">
          <section className="bg-bg-dark border border-white/5 flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-white/5">
              <h2 className="label-micro flex items-center gap-4">
                <span className="w-6 h-[1px] bg-white/20"></span>
                Temporal Records
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-[400px]">
              {meals.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="label-micro">No ingestion history detected.</p>
                </div>
              ) : (
                meals.slice().reverse().map((meal, index) => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={meal.id} 
                    className="p-8 border-b border-white/5 hover:bg-white/[0.02] transition-all group relative"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="label-micro opacity-100 text-primary">ID_{meal.id.toString().slice(-4)}</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-4">
                      <span className={`label-micro opacity-100 px-2 py-1 border ${
                        meal.category === 'Full Week' 
                        ? 'bg-white text-black border-white font-black' 
                        : 'text-primary bg-primary/5 border-primary/10'
                      }`}>
                        {meal.category === 'Full Week' ? 'AGGREGATE_WEEK' : meal.category}
                      </span>
                      <span className="font-mono text-[9px] text-white/20 uppercase tracking-tighter">{meal.date}</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed font-light font-display">
                      {meal.description}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddForm && (
        <MealForm 
          onAdd={handleAddMeal} 
          onClose={() => setShowAddForm(false)} 
        />
      )}
    </div>
  );
}
