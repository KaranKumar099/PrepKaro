import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Trophy, Target, Clock, BookOpen, TrendingUp, AlertTriangle,
  CheckCircle, ChevronDown, ChevronUp, ExternalLink, Brain,
  BarChart3, Zap, Filter, Calendar,
} from 'lucide-react';

import SideBar from './SideBar';
import DashboardHeader from './shared/DashboardHeader.jsx';
import { useUserStore } from '../store/UseUserStore';
import { useSidebarStore } from '../store/UseSidebarStore';

const API = import.meta.env.VITE_BACKEND_URL;
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
const fmtTime = (s) => { if (!s) return '0s'; if (s < 60) return `${s}s`; return `${Math.floor(s/60)}m ${s%60}s`; };
const accColor = (a) => a >= 70 ? '#10b981' : a >= 40 ? '#f59e0b' : '#ef4444';
const accBadge = (a) => a >= 70 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : a >= 40 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
const token = () => localStorage.getItem('accessToken');
const authH = () => ({ headers: { Authorization: `Bearer ${token()}` }, withCredentials: true });

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-black text-slate-800 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value}</p>)}
    </div>
  );
};

const Skeleton = () => (
  <div className="p-8 space-y-6 animate-pulse">
    <div className="h-8 w-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />)}</div>
    <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    <div className="grid grid-cols-2 gap-4"><div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" /><div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" /></div>
    <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
  </div>
);

export default function Performance() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { isSidebarOpen, openSidebar, closeSidebar, setActiveTab } = useSidebarStore();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [sortKey, setSortKey] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  useEffect(() => {
    setActiveTab('analytics');
  }, [setActiveTab]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/user/performance`, authH());
        setData(res.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const fetchAI = async () => {
    if (!data || aiLoading) return;
    setAiLoading(true);
    try {
      const strong = (data.chapterStats || []).filter(c => c.accuracy >= 70).slice(0, 5).map(c => c.name);
      const weak = (data.chapterStats || []).filter(c => c.accuracy < 40).slice(0, 5).map(c => c.name);
      const slow = [...(data.chapterStats || [])].sort((a, b) => b.avgTime - a.avgTime).slice(0, 3).map(c => c.name);
      const res = await axios.post(`${API}/user/ai-insight`, {
        totalExams: data.summary.totalExams,
        avgAccuracy: data.summary.avgAccuracy,
        strongTopics: strong, weakTopics: weak, slowTopics: slow,
        scoreTrend: data.scoreTrend,
      }, authH());
      setAiInsight(res.data.data.insight);
    } catch (e) { setAiInsight('Could not load AI insight. Please check your API key configuration.'); }
    finally { setAiLoading(false); }
  };

  const examTypes = useMemo(() => {
    if (!data?.attempts) return [];
    return ['all', ...new Set(data.attempts.map(a => a.examType))];
  }, [data]);

  const filteredAttempts = useMemo(() => {
    if (!data?.attempts) return [];
    return data.attempts
      .filter(a => filterType === 'all' || a.examType === filterType)
      .filter(a => !filterFrom || new Date(a.date) >= new Date(filterFrom))
      .filter(a => !filterTo || new Date(a.date) <= new Date(filterTo))
      .sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      });
  }, [data, filterType, filterFrom, filterTo, sortKey, sortAsc]);

  const toggleSort = (k) => { if (sortKey === k) setSortAsc(!sortAsc); else { setSortKey(k); setSortAsc(false); } };
  const SortIcon = ({ col }) => sortKey === col ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />;

  const renderContent = () => {
    if (loading) return <Skeleton />;

    if (!data || data.isEmpty) return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 max-w-sm">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">No Attempts Yet</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Complete a mock exam to start tracking your performance.</p>
          <button onClick={() => navigate('/tool')} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all">
            Generate Your First Exam
          </button>
        </motion.div>
      </div>
    );

    const { summary, scoreTrend, chapterStats, topicStats, examTypeBreakdown } = data;

    const summaryCards = [
      { label: 'Total Exams', value: summary.totalExams, icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', sub: 'attempts completed' },
      { label: 'Avg Accuracy', value: `${summary.avgAccuracy}%`, icon: Target, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', sub: 'across all attempts' },
      { label: 'Best Score', value: `${summary.bestScorePercent}%`, icon: Trophy, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', sub: `${summary.bestScore}/${summary.bestScoreMax} marks` },
      { label: 'Study Time', value: `${summary.totalTimeHours}h`, icon: Clock, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/20', sub: 'total on platform' },
    ];

    const strongChapters = chapterStats.filter(c => c.accuracy >= 70).slice(0, 5);
    const weakChapters = chapterStats.filter(c => c.accuracy < 40).slice(0, 5);

    const tableCols = [
      { key: 'examName', label: 'Exam' },
      { key: 'date', label: 'Date' },
      { key: 'scorePercent', label: 'Score' },
      { key: 'accuracyPercent', label: 'Accuracy' },
      { key: 'correct', label: 'Correct' },
      { key: 'incorrect', label: 'Wrong' },
      { key: 'skipped', label: 'Skipped' },
      { key: 'timeTakenSeconds', label: 'Time' },
    ];

    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`${c.bg} dark:bg-slate-900 rounded-3xl p-5 border border-transparent dark:border-slate-800`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                  <c.icon className={`w-4 h-4 ${c.color}`} />
                </div>
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{c.label}</p>
              </div>
              <p className={`text-2xl font-black ${c.color}`}>{c.value}</p>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Score Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Score Progression</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={scoreTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} unit="%" domain={[0, 100]} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-xs">
                  <p className="font-black text-slate-800">{d.examName}</p>
                  <p className="text-slate-400">{d.dateLabel}</p>
                  <p className="font-bold text-blue-600 mt-1">Score: {d.scorePercent}%</p>
                </div>;
              }} />
              <Line type="monotone" dataKey="scorePercent" stroke="#3b82f6" strokeWidth={2.5}
                dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} name="Score %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy + Time charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Accuracy by Chapter</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chapterStats.slice(0, 10)} margin={{ top: 5, right: 10, left: -10, bottom: 55 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} unit="%" domain={[0, 100]} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="accuracy" name="Accuracy %" radius={[5, 5, 0, 0]}>
                  {chapterStats.slice(0, 10).map((e, i) => <Cell key={i} fill={accColor(e.accuracy)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Avg Time per Chapter</h3>
              <span className="ml-auto text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">sec/q</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={[...chapterStats].sort((a,b)=>b.avgTime-a.avgTime).slice(0,10)} margin={{ top: 5, right: 10, left: -10, bottom: 55 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} unit="s" />
                <Tooltip content={<Tip />} />
                <Bar dataKey="avgTime" name="Avg Time (s)" radius={[5, 5, 0, 0]}>
                  {[...chapterStats].sort((a,b)=>b.avgTime-a.avgTime).slice(0,10).map((e, i) => (
                    <Cell key={i} fill={e.avgTime > 120 ? '#f97316' : e.avgTime > 60 ? '#8b5cf6' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie + Strong/Weak */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Exam Type Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={examTypeBreakdown} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
                  {examTypeBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} attempts`, n]} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800 p-6">
            <h3 className="text-base font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4" /> Strong Chapters
            </h3>
            {strongChapters.length === 0
              ? <p className="text-xs text-slate-400 font-medium">Keep practicing to build strengths!</p>
              : <ul className="space-y-2">
                {strongChapters.map((c, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate pr-2">{c.name}</span>
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">{c.accuracy}%</span>
                  </li>
                ))}
              </ul>}
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-100 dark:border-red-800 p-6">
            <h3 className="text-base font-black text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" /> Weak Chapters
            </h3>
            {weakChapters.length === 0
              ? <p className="text-xs text-slate-400 font-medium">No weak chapters — excellent!</p>
              : <ul className="space-y-2">
                {weakChapters.map((c, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate pr-2">{c.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-black text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">{c.accuracy}%</span>
                      <span className="text-[9px] font-black text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded-full">Needs Attention</span>
                    </div>
                  </li>
                ))}
              </ul>}
          </div>
        </div>

        {/* Attempts Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Session History
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 mr-4">
                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
                  className="text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none" />
                <span className="text-slate-400 dark:text-slate-500 text-xs">–</span>
                <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
                  className="text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none" />
              </div>
              <select 
                value={filterType} 
                onChange={e => setFilterType(e.target.value)}
                className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-300"
              >
                {examTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <tr>
                  {tableCols.map(c => (
                    <th key={c.key} className="px-6 py-4 text-left cursor-pointer hover:text-slate-600 dark:hover:text-slate-300" onClick={() => toggleSort(c.key)}>
                      <span className="flex items-center gap-1">{c.label} <SortIcon col={c.key} /></span>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredAttempts.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer" onClick={() => navigate(`/attempt/${a._id}`)}>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{a.examName}</td>
                    <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-black text-blue-600 dark:text-blue-400">{Math.round(a.scorePercent)}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-black ${accBadge(a.accuracyPercent)}`}>{a.accuracyPercent}%</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">{a.correct}</td>
                    <td className="px-6 py-4 font-bold text-red-500 dark:text-red-400">{a.incorrect}</td>
                    <td className="px-6 py-4 font-bold text-amber-500 dark:text-amber-400">{a.skipped}</td>
                    <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">{fmtTime(a.timeTakenSeconds)}</td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        View <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAttempts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-bold text-sm">
                      No attempts match the current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-black">AI Coach Insight</h3>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Powered by Claude</p>
              </div>
              {!aiInsight && (
                <button onClick={fetchAI} disabled={aiLoading}
                  className="ml-auto px-5 py-2.5 bg-blue-500 hover:bg-blue-400 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2">
                  {aiLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Analysing...</> : <><Zap className="w-4 h-4" />Get Insight</>}
                </button>
              )}
            </div>
            {aiInsight
              ? <div className="p-6 bg-white/10 rounded-2xl border border-white/10 whitespace-pre-wrap text-sm text-blue-50 font-medium leading-relaxed">{aiInsight}</div>
              : !aiLoading && (
                <div className="grid md:grid-cols-3 gap-4">
                  {['Personalized Study Plan', 'Topic Priority Queue', 'Strategy Recommendation'].map((t, i) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10">
                      <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                        <div className="w-3 h-3 rounded-full bg-blue-400/50 animate-pulse" />
                      </div>
                      <p className="font-black text-sm mb-2">{t}</p>
                      <div className="space-y-1.5">{[100,75,50].map((w,j) => <div key={j} className="h-1.5 bg-white/10 rounded-full" style={{width:`${w}%`}} />)}</div>
                      <p className="text-blue-300/50 text-[10px] font-bold mt-3 uppercase tracking-wider">Click "Get Insight" above</p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-inter text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <SideBar />

      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <DashboardHeader user={user} onOpenSidebar={openSidebar} />

        <div className="max-w-[1600px] mx-auto p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Performance Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Your all-time performance across every exam on PrepKaro</p>
          </div>

          {renderContent()}
        </div>
      </main>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

