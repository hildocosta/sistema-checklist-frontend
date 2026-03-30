"use client";
import { useState, useEffect } from "react";
import { 
  ClipboardCheck, 
  AlertCircle, 
  Activity, 
  Search, 
  ArrowUpRight, 
  Zap, 
  Filter,
  MoreHorizontal,
  LayoutGrid,
  List
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  AreaChart, Area 
} from 'recharts';
import Breadcrumb from "../../components/Breadcrumb";
import Skeleton from "../../components/Skeleton";
export const dynamic = 'force-dynamic';

// Dados simulados com curva de atividade
const dadosAtividadeTurno = [
  { hora: '07:00', checklists: 2 },
  { hora: '08:00', checklists: 12 },
  { hora: '09:00', checklists: 8 },
  { hora: '10:00', checklists: 4 },
  { hora: '11:00', checklists: 15 },
  { hora: '12:00', checklists: 20 },
];

export default function DashboardSeniorPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SkeletonDashboard />;

  return (
    <div className="min-h-screen space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-left pb-20">
      
      {/* --- HEADER ULTRA CLEAN --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-1">
          <Breadcrumb itemAtual="Overview Operacional" />
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Checklist <span className="text-blue-600">Live</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm">Monitoramento em tempo real do efetivo e carga do 17º BPM.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status do Servidor</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Sincronizado
            </span>
          </div>
          <button className="h-12 px-6 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
            Novo Checklist
          </button>
        </div>
      </div>

      {/* --- BENTO GRID DE MÉTRICAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 01 - Eficiência */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <Zap size={80} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Aderência do Turno</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-slate-900 leading-none">92%</h3>
            <span className="text-emerald-500 text-xs font-bold flex items-center mb-1">
              <ArrowUpRight size={14} /> +4%
            </span>
          </div>
          <div className="mt-6 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
             <div className="bg-blue-600 h-full w-[92%] rounded-full"></div>
          </div>
        </div>

        {/* Card 02 - Alertas */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group border-l-4 border-l-amber-400">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Avarias Detectadas</p>
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-black text-slate-900 leading-none">05</h3>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-all">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="mt-4 text-[10px] font-bold text-amber-600 uppercase tracking-tight italic">Requer inspeção da P4</p>
        </div>

        {/* Card 03 - Volume */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Checklists Hoje</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900 leading-none">42</h3>
            <span className="text-slate-300 font-bold text-sm">/ 48</span>
          </div>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase">6 restantes para o fechamento</p>
        </div>

        {/* Card 04 - Tempo Médio */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tempo de Conferência</p>
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-black text-slate-900 leading-none">04' <span className="text-xl">min</span></h3>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Activity size={20} />
            </div>
          </div>
          <p className="mt-4 text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Otimização: -12s vs ontem</p>
        </div>
      </div>

      {/* --- SEÇÃO ANALÍTICA COMPLEXA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRÁFICO DE ÁREA - FLUXO DE TRABALHO */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Atividade de Conferência</h2>
              <p className="text-xs text-slate-400 font-medium italic">Picos de entrega de carga por horário</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
               <button className="px-4 py-1.5 bg-white shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest">Matutino</button>
               <button className="px-4 py-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">Noturno</button>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosAtividadeTurno}>
                <defs>
                  <linearGradient id="colorCheck" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
                />
                <Area type="monotone" dataKey="checklists" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCheck)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FEED DE ÚLTIMOS CHECKLISTS - ESTILO "GLASS" */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-sm font-black uppercase tracking-widest">Atividade Recente</h2>
              <MoreHorizontal size={20} className="text-slate-500" />
           </div>

           <div className="space-y-6 relative z-10">
              {[
                { ref: "L0102", status: "Crítico", time: "14:10", label: "Sgt Anderson" },
                { ref: "L0145", status: "OK", time: "13:55", label: "Cabo Castro" },
                { ref: "L0120", status: "OK", time: "13:30", label: "Sd Oliveira" },
                { ref: "L0109", status: "Atenção", time: "12:15", label: "Sgt Silva" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'OK' ? 'bg-emerald-500' : log.status === 'Atenção' ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`}></div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest">{log.ref}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{log.label}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-mono text-slate-400">{log.time}</p>
                      <p className={`text-[9px] font-black uppercase ${log.status === 'OK' ? 'text-emerald-500' : 'text-red-500'}`}>{log.status}</p>
                   </div>
                </div>
              ))}
           </div>

           <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Ver Histórico Completo
           </button>

           {/* Gradient Decorativo */}
           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
}

// Componente de Skeleton
function SkeletonDashboard() {
  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-end">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <Skeleton className="h-12 w-48 rounded-2xl" />
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-[2.5rem]" />)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <Skeleton className="h-80 col-span-2 rounded-[3rem]" />
        <Skeleton className="h-80 rounded-[3rem]" />
      </div>
    </div>
  );
}