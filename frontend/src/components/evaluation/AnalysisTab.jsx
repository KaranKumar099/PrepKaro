import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Trophy,
  AlertTriangle,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  MinusCircle,
  TrendingDown,
  Brain,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const accuracyColor = (acc) => {
  if (acc >= 70) return { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: '#10b981', badge: 'bg-emerald-100 text-emerald-700' };
  if (acc >= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', bar: '#f59e0b', badge: 'bg-amber-100 text-amber-700' };
  return { bg: 'bg-red-50', text: 'text-red-700', bar: '#ef4444', badge: 'bg-red-100 text-red-700' };
};

const formatTime = (secs) => {
  if (!secs) return '0s';
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
};

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-sm">
      <p className="font-black text-slate-800 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.value}{unit}
        </p>
      ))}
    </div>
  );
};

// ─── Section 2: Topic-wise Performance Table ──────────────────────────────────

const TopicPerformanceTable = ({ topicStats }) => {
  const [sortKey, setSortKey] = useState('accuracy');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...topicStats].sort((a, b) =>
    sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
  );

  const toggle = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const cols = [
    { key: 'name', label: 'Topic', sortable: false },
    { key: 'accuracy', label: 'Accuracy', sortable: true },
    { key: 'correct', label: 'Correct', sortable: true },
    { key: 'incorrect', label: 'Wrong', sortable: true },
    { key: 'skipped', label: 'Skipped', sortable: true },
    { key: 'avgTime', label: 'Avg Time', sortable: true },
    { key: 'marksLost', label: 'Marks Lost', sortable: true },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-slate-50">
        <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
        <h3 className="text-lg font-black text-slate-900">Topic-wise Performance</h3>
        <div className="ml-auto flex gap-3 text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Strong ≥70%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Fair 40–70%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Weak &lt;40%</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/70 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {cols.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-left ${col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                  onClick={() => col.sortable && toggle(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon col={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => {
              const colors = accuracyColor(t.accuracy);
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`border-t border-slate-50 ${colors.bg} hover:brightness-95 transition-all`}
                >
                  <td className="px-5 py-3.5 font-bold text-slate-800">{t.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full`} style={{ width: `${t.accuracy}%`, backgroundColor: colors.bar }} />
                      </div>
                      <span className={`font-black text-xs ${colors.text}`}>{t.accuracy}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-600">{t.correct}</td>
                  <td className="px-5 py-3.5 font-bold text-red-500">{t.incorrect}</td>
                  <td className="px-5 py-3.5 font-bold text-amber-500">{t.skipped}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-600">{formatTime(t.avgTime)}</td>
                  <td className="px-5 py-3.5 font-bold text-red-500">
                    {t.marksLost > 0 ? `-${t.marksLost}` : '—'}
                  </td>
                </motion.tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-bold text-sm">
                  No topic data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Section 3: Average Time per Topic (Bar Chart) ────────────────────────────

const TimeBarChart = ({ topicStats }) => {
  const data = topicStats.map((t) => ({ name: t.name, 'Avg Time (s)': t.avgTime }));

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-violet-600" />
        <h3 className="text-lg font-black text-slate-900">Average Time per Topic</h3>
        <span className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          Seconds / Question
        </span>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-400 font-bold">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} unit="s" />
            <Tooltip content={<CustomTooltip unit="s" />} />
            <Bar dataKey="Avg Time (s)" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry['Avg Time (s)'] > 120 ? '#f97316' : entry['Avg Time (s)'] > 60 ? '#8b5cf6' : '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="flex gap-4 mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest justify-center">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />&lt;60s Fast</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" />60–120s Moderate</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" />&gt;120s Slow</span>
      </div>
    </div>
  );
};

// ─── Section 4: Negative Marking Breakdown ───────────────────────────────────

const NegativeMarkingChart = ({ topicStats }) => {
  const data = topicStats
    .filter((t) => t.marksLost > 0)
    .sort((a, b) => b.marksLost - a.marksLost);

  const total = data.reduce((sum, t) => sum + t.marksLost, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingDown className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-black text-slate-900">Negative Marking Breakdown</h3>
        {total > 0 && (
          <div className="ml-auto px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black border border-red-100">
            -{total.toFixed(2)} marks total
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
          <p className="text-slate-400 font-bold text-sm">No negative marks! Great discipline.</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} unit=" pts" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} width={75} />
              <Tooltip content={<CustomTooltip unit=" pts" />} />
              <Bar dataKey="marksLost" name="Marks Lost" fill="#ef4444" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {data.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50/60 rounded-xl border border-red-100/50">
                <span className="text-sm font-bold text-slate-700">{t.name}</span>
                <div className="flex items-center gap-3 text-xs font-black">
                  <span className="text-slate-500">{t.incorrect} wrong answers</span>
                  <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded-lg">-{t.marksLost} pts</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Section 5: Attempted vs Skipped Chart ────────────────────────────────────

const AttemptedSkippedChart = ({ topicStats }) => {
  const data = topicStats.map((t) => ({
    name: t.name,
    Attempted: t.attempted,
    Skipped: t.skipped,
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-black text-slate-900">Attempted vs Skipped per Topic</h3>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-400 font-bold">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontWeight: 700 }}
            />
            <Bar dataKey="Attempted" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Skipped" stackId="a" fill="#fbbf24" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// ─── Section 6: Strong / Weak Topics ─────────────────────────────────────────

const StrengthWeaknessPanel = ({ strongTopics, weakTopics, fastestTopics, slowestTopics }) => {
  const panels = [
    {
      title: 'Strong Topics',
      icon: Trophy,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      items: strongTopics,
      emptyText: 'No strong topics yet — keep practicing!',
      badge: (t) => <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{t.accuracy}%</span>,
    },
    {
      title: 'Weak Topics',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
      items: weakTopics,
      emptyText: 'No weak topics — excellent!',
      badge: (t) => <span className="text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full">{t.accuracy}%</span>,
    },
    {
      title: 'Fastest Topics',
      icon: Zap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      items: fastestTopics,
      emptyText: 'No data available',
      badge: (t) => <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">{formatTime(t.avgTime)}/q</span>,
    },
    {
      title: 'Slowest Topics',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      items: slowestTopics,
      emptyText: 'No data available',
      badge: (t) => <span className="text-[10px] font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">{formatTime(t.avgTime)}/q</span>,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {panels.map((panel, pi) => (
        <div key={pi} className={`${panel.bg} rounded-3xl border ${panel.border} p-5`}>
          <h4 className={`text-sm font-black ${panel.color} flex items-center gap-2 mb-4`}>
            <panel.icon className="w-4 h-4" />
            {panel.title}
          </h4>
          {panel.items.length === 0 ? (
            <p className="text-xs font-medium text-slate-400">{panel.emptyText}</p>
          ) : (
            <ul className="space-y-2">
              {panel.items.map((t, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 truncate pr-2">{t.name}</span>
                  {panel.badge(t)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Section 7: AI Recommendations Placeholder ────────────────────────────────

const AIRecommendationsSection = () => (
  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
          <Brain className="w-7 h-7 text-blue-300" />
        </div>
        <div>
          <h3 className="text-xl font-black">AI Recommendations</h3>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Powered by PrepKaro AI</p>
        </div>
        <div className="ml-auto px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-black text-blue-200 uppercase tracking-widest border border-white/10">
          Coming Soon
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {['Personalized Study Plan', 'Topic Priority Queue', 'Time Optimization Strategy'].map((title, i) => (
          <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-400/60 animate-pulse" />
            </div>
            <h5 className="font-black text-sm mb-2">{title}</h5>
            <div className="space-y-1.5">
              <div className="h-2 bg-white/10 rounded-full w-full" />
              <div className="h-2 bg-white/10 rounded-full w-3/4" />
              <div className="h-2 bg-white/10 rounded-full w-1/2" />
            </div>
            <p className="text-blue-300/60 text-[10px] font-bold mt-3 uppercase tracking-wider">
              Awaiting AI analysis...
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PerformanceTab = ({ performanceData, examData }) => {
  const {
    topicStats = [],
    chapterStats = [],
  } = performanceData || {};

  // Derive chapter-based panels
  const strongChapters = chapterStats.filter((c) => c.accuracy >= 70);
  const weakChapters = chapterStats.filter((c) => c.accuracy < 40);
  const sortedByTime = [...chapterStats].sort((a, b) => a.avgTime - b.avgTime);
  const fastestChapters = sortedByTime.slice(0, 3);
  const slowestChapters = [...sortedByTime].reverse().slice(0, 3);

  return (
    <motion.div
      key="performance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-8 space-y-8"
    >
      <StrengthWeaknessPanel
        strongTopics={strongChapters}
        weakTopics={weakChapters}
        fastestTopics={fastestChapters}
        slowestTopics={slowestChapters}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <TimeBarChart topicStats={chapterStats} />
        <NegativeMarkingChart topicStats={topicStats} />
      </div>

      <AttemptedSkippedChart topicStats={chapterStats} />
      
      <TopicPerformanceTable topicStats={topicStats} />

      <AIRecommendationsSection />
    </motion.div>
  );
};

export default PerformanceTab;

