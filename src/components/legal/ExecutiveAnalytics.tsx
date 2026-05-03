import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, 
  BarChart3, PieChart, Calendar, AlertCircle,
  Briefcase, DollarSign, Target, Clock,
  ArrowUpRight, ArrowDownRight, Users
} from 'lucide-react';
import { useAnalyticsStore } from '@/lib/analytics-service';

const StatCard = ({ label, value, trend, trendType, icon: Icon, delay }: { label: string, value: string | number, trend?: string, trendType?: 'up' | 'down', icon: React.ElementType, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 flex flex-col justify-between group hover:border-gold-primary/30 transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-xl border border-gold-dark/10 text-gold-primary group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
          trendType === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-white font-playfair">{value}</h3>
    </div>
  </motion.div>
);

const LineChart = ({ data }: { data: { month: string, count: number }[] }) => {
  const max = Math.max(...data.map(d => d.count));
  const height = 150;
  const width = 400;
  const padding = 20;

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * (width - padding * 2) + padding,
    y: height - ((d.count / max) * (height - padding * 2) + padding)
  }));

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => (
          <line key={p} x1={padding} y1={height * p} x2={width - padding} y2={height * p} stroke="rgba(212,175,55,0.05)" strokeWidth="1" />
        ))}
        
        {/* Path */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={pathD}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Area fill */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5, duration: 1 }}
          d={`${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`}
          fill="url(#goldGradient)"
        />

        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Dots */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#D4AF37"
            stroke="#000"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-4 px-2">
        {data.map(d => (
          <span key={d.month} className="text-[8px] font-bold text-gray-500 uppercase">{d.month}</span>
        ))}
      </div>
    </div>
  );
};

const Heatmap = ({ data }: { data: { day: string, hour: number, intensity: number }[] }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i);

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[500px]">
        <div className="grid grid-cols-13 gap-1">
          <div className="h-6" /> {/* Corner */}
          {hours.map(h => (
            <div key={h} className="text-[8px] font-bold text-gray-600 text-center uppercase tracking-tighter">{h}:00</div>
          ))}
          
          {days.map(day => (
            <React.Fragment key={day}>
              <div className="text-[8px] font-bold text-gray-500 flex items-center pr-2">{day}</div>
              {hours.map(hour => {
                const item = data.find(d => d.day === day && d.hour === hour);
                const intensity = item?.intensity || 0;
                return (
                  <motion.div
                    key={`${day}-${hour}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.random() * 0.5 }}
                    style={{ backgroundColor: `rgba(212, 175, 55, ${intensity / 100})` }}
                    className="aspect-square rounded-[2px] border border-black/50 hover:border-white/20 transition-colors cursor-pointer"
                    title={`${day} ${hour}:00 - ${intensity}% Intensity`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const DonutChart = ({ data }: { data: { area: string, value: number, color?: string }[] }) => {
  const size = 160;
  const center = size / 2;
  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const colors = ['#D4AF37', '#B8860B', '#DAA520', '#8B4513'];

  // Pre-calculate offsets to avoid mutation during render
  const chartData = data.reduce((acc, item, i) => {
    const percentage = (item.value / 100) * circumference;
    const offset = i === 0 ? 0 : acc[i - 1].offset + acc[i - 1].percentage;
    acc.push({ ...item, percentage, offset });
    return acc;
  }, [] as { area: string, value: number, percentage: number, offset: number }[]);

  return (
    <div className="flex items-center gap-8">
      <div className="relative w-40 h-40">
        <svg viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {chartData.map((item, i) => (
            <motion.circle
              key={item.area}
              initial={{ strokeDasharray: `0, ${circumference}` }}
              animate={{ strokeDasharray: `${item.percentage}, ${circumference}` }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={strokeWidth}
              strokeDashoffset={-item.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Total</span>
          <span className="text-xl font-bold text-white font-playfair">100%</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={item.area} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.area}</span>
            <span className="text-[10px] text-white font-mono ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ExecutiveAnalytics() {
  const { data } = useAnalyticsStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Top Layer: Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Active Cases" value={data.activeCases} trend="12%" trendType="up" icon={Briefcase} delay={0.1} />
        <StatCard label="Upcoming Hearings" value={data.upcomingHearings} trend="4 today" trendType="up" icon={Calendar} delay={0.2} />
        <StatCard label="Urgent Deadlines" value={data.urgentDeadlines} trend="Critical" trendType="down" icon={AlertCircle} delay={0.3} />
        <StatCard label="Unpaid Invoices" value={`₦${(data.unpaidInvoices / 1000000).toFixed(1)}M`} trend="8% increase" trendType="up" icon={DollarSign} delay={0.4} />
      </div>

      {/* Middle Layer: Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 glass-card p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-2">
                <Activity className="text-gold-primary" size={20} /> Case Filing Trends
              </h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Monthly volume comparison</p>
            </div>
            <button className="w-full sm:w-auto btn-outline px-4 py-2 text-[10px]">Download Report</button>
          </div>
          <LineChart data={data.monthlyFilings} />
        </div>

        <div className="glass-card p-4 sm:p-8">
          <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-2 mb-8">
            <PieChart className="text-gold-primary" size={20} /> Practice Distribution
          </h3>
          <div className="flex justify-center xl:block">
            <DonutChart data={data.practiceAreaAnalytics} />
          </div>
        </div>
      </div>

      {/* Bottom Layer: Specialized Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-2">
                <BarChart3 className="text-gold-primary" size={20} /> Workload Intensity Map
              </h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Hourly heat index across chambers</p>
            </div>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-[1px] bg-gold-primary/10" />
              <span className="w-2 h-2 rounded-[1px] bg-gold-primary/40" />
              <span className="w-2 h-2 rounded-[1px] bg-gold-primary/80" />
            </div>
          </div>
          <Heatmap data={data.workloadHeatmap} />
        </div>

        <div className="glass-card p-4 sm:p-8">
          <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-2 mb-8">
            <Users className="text-gold-primary" size={20} /> Associate Performance Index
          </h3>
          <div className="space-y-6">
            {data.associatePerformance.map((assoc, i) => (
              <div key={assoc.name} className="space-y-2">
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-[10px] font-bold text-gold-primary">
                      {assoc.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs font-bold text-gray-200">{assoc.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gold-primary">{assoc.score}% KPI Score</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${assoc.score}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-full bg-gold-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  />
                </div>
                <div className="flex justify-between text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                  <span>Billable Hours: {assoc.billable}h</span>
                  <span>Efficiency: 92%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Footer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass-card p-4 sm:p-6 border-gold-primary/20 bg-gold-primary/5 flex items-center gap-4">
          <div className="p-3 bg-gold-primary text-black rounded-lg shadow-lg">
            <Target size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gold-primary uppercase tracking-widest mb-1">Litigation Success Rate</p>
            <h4 className="text-lg sm:text-xl font-bold text-white font-playfair">88.4%</h4>
          </div>
        </div>
        
        <div className="glass-card p-4 sm:p-6 border-gold-primary/20 bg-gold-primary/5 flex items-center gap-4">
          <div className="p-3 bg-gold-primary text-black rounded-lg shadow-lg">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gold-primary uppercase tracking-widest mb-1">Avg Case Aging</p>
            <h4 className="text-lg sm:text-xl font-bold text-white font-playfair">114 Days</h4>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-6 border-gold-primary/20 bg-gold-primary/5 flex items-center gap-4 sm:col-span-2 xl:col-span-1">
          <div className="p-3 bg-gold-primary text-black rounded-lg shadow-lg">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gold-primary uppercase tracking-widest mb-1">Chamber Utilization</p>
            <h4 className="text-lg sm:text-xl font-bold text-white font-playfair">94.2%</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
