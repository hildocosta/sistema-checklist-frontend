"use client";
import { useState, useEffect } from "react";
import { 
  AlertTriangle, Shield, BarChart3, Clock, 
  User, HardDrive, LayoutDashboard, Activity, BookOpen 
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function DashboardComando() {
  const [data, setData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Sincroniza apenas uma vez no carregamento
  useEffect(() => {
    setIsClient(true);
    
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error("Erro na rede");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Erro na busca de dados:", err);
      }
    };

    fetchStats();
    const timer = setInterval(fetchStats, 10000); 
    return () => clearInterval(timer);
  }, []);

  // Enquanto não estiver no cliente ou sem dados, mostra o skeleton
  if (!isClient || !data) return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-bold gap-3 animate-pulse">
      <Shield size={40} className="text-slate-400"/> 
      <p className="tracking-widest text-[10px] uppercase font-black">Sincronizando com a Reserva de Armas...</p>
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 text-slate-900 p-3 flex flex-col gap-3 overflow-hidden font-sans antialiased">
      
      {/* HEADER INSTITUCIONAL */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-all shadow-lg ${data.isPendente ? 'bg-red-600 animate-pulse shadow-red-200' : 'bg-slate-900 shadow-slate-200'}`}>
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              17º BPM - Painel de Controle de Armamento
            </h1>
            <div className="flex items-center gap-3 mt-2">
               <span className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border shadow-sm ${data.isPendente ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                 <Activity size={12} strokeWidth={3} /> 
                 {data.isPendente ? `ALERTA: TURNO ${data.turnoAlvo} PENDENTE` : `CONFERÊNCIA ATIVA: TURNO ${data.turnoAlvo}`}
               </span>
               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                 <User size={12} /> Responsável: {data.ultimoChecklist?.responsavel || "NÃO IDENTIFICADO"}
               </span>
            </div>
          </div>
        </div>
        
        <div className="text-right border-l border-slate-100 pl-6">
          <p className="text-slate-400 text-[10px] font-black uppercase italic leading-none mb-1 tracking-widest">Hora do Sistema</p>
          <div className="text-3xl font-mono font-black text-slate-950 leading-none tracking-tighter">
            {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICAS (KPIs) */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        <StatCard 
          label="Status Conferência" 
          value={data.stats?.aderencia} 
          sub={data.isPendente ? "AGUARDANDO ENVIO" : `CONCLUÍDO ÀS ${data.ultimoChecklist?.hora}`} 
          color={data.isPendente ? "text-red-600" : "text-emerald-600"} 
          icon={<Clock size={20}/>} 
          alert={data.isPendente} 
        />
        <StatCard 
          label="DISPONÍVEL / RESERVA" 
          value={data.stats?.reserva} 
          sub="EM ESTOQUE / PRONTO" 
          color="text-emerald-600" 
          icon={<HardDrive size={20} className="text-emerald-500"/>} 
        />
        <StatCard 
          label="CAUTELADO / SERVIÇO" 
          value={data.stats?.emCautela} 
          sub="POSSE DE EFETIVO" 
          color="text-sky-700" 
          icon={<User size={20} className="text-sky-600"/>} 
        />
        <StatCard 
          label="AVARIAS / EXTRAVIOS" 
          value={data.stats?.avarias} 
          sub="CRÍTICOS / MANUTENÇÃO" 
          color={data.stats?.avarias > 0 ? "text-red-600" : "text-slate-400"} 
          icon={<AlertTriangle size={20} className={data.stats?.avarias > 0 ? "text-red-500" : "text-slate-300"}/>} 
          alert={data.stats?.avarias > 0} 
        />
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
        
        {/* GRÁFICO DE PIZZA (PANORAMA) */}
        <div className="col-span-7 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-sm">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2 border-b border-slate-50 pb-3">
            <BarChart3 size={16} className="text-blue-600" /> Panorama de Disponibilidade de Carga
          </h2>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ bottom: 30 }}>
                <Pie 
                  data={data.grafico} 
                  innerRadius={85} 
                  outerRadius={115} 
                  paddingAngle={8} 
                  dataKey="valor"
                  stroke="none"
                  cy="45%" 
                >
                  {data.grafico?.map((entry, i) => (
                    <Cell 
                      key={`cell-${i}`} 
                      fill={entry.name === 'Disponível' && !data.isPendente ? '#10b981' : entry.fill} 
                      className="transition-all duration-500 hover:opacity-80 outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Legend 
                   verticalAlign="bottom" 
                   align="center"
                   iconType="circle"
                   iconSize={8}
                   wrapperStyle={{ paddingTop: "25px" }} 
                   formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Total</p>
                <p className="text-4xl font-black text-slate-900 leading-none">
                    {(data.stats?.reserva + data.stats?.emCautela + data.stats?.avarias) || 0}
                </p>
            </div>
          </div>
        </div>

        {/* MONITORAMENTO (DIREITA) */}
        <div className="col-span-5 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-5 shrink-0 border-b border-slate-50 pb-3">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <LayoutDashboard size={16} className="text-blue-600" /> Monitoramento em Tempo Real
            </h2>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">LIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {data.logs?.length > 0 ? (
              data.logs.map((log, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-all ${log.status === 'CRÍTICO' || log.status === 'EXTRAVIO' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-[10px] font-mono text-white bg-slate-900 px-2 py-0.5 rounded-md mr-2 uppercase tracking-tighter">{log.id}</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{log.equipamento}</span>
                    </div>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full shadow-sm ${
                        log.status === 'CRÍTICO' || log.status === 'EXTRAVIO' ? 'bg-red-600 text-white' : 
                        log.status === 'MANUTENÇÃO' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  
                  <p className="text-[11px] font-bold text-slate-800 uppercase leading-relaxed bg-white/70 p-3 rounded-xl border border-white/50 shadow-inner italic">
                    &quot;{log.militar}&quot;
                  </p>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/50">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-700">
                        <BookOpen size={12} strokeWidth={3} /> 
                        LIVRO: {log.livro || "---"}
                    </div>
                    <span className="text-[9px] text-slate-400 font-black uppercase italic flex items-center gap-1">
                        <Clock size={10} /> {log.hora} • {log.responsavel.split(' ')[0]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <Activity size={32} className="opacity-20" />
                  <p className="text-[10px] font-black uppercase italic tracking-widest">Nenhuma movimentação atípica.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, color, alert }) {
  return (
    <div className={`bg-white border p-5 rounded-2xl shadow-sm relative group transition-all duration-300 hover:scale-[1.02] ${alert ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
      <div className={`absolute top-4 right-4 transition-transform group-hover:scale-110 opacity-20 ${color}`}>{icon}</div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{label}</p>
      <h3 className={`text-4xl font-black leading-none mb-2 tracking-tighter ${color}`}>{value}</h3>
      <div className="flex items-center gap-1.5">
          {alert && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />}
          <p className={`text-[9px] font-black uppercase tracking-tight ${alert ? 'text-red-600' : 'text-slate-500'}`}>{sub}</p>
      </div>
    </div>
  );
}