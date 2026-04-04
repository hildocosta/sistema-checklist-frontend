"use client";
import { useState, useEffect } from "react";
import { 
  AlertTriangle, Shield, BarChart3, Clock, 
  User, HardDrive, LayoutDashboard, Activity, BookOpen 
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function DashboardComando() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
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

  if (!data) return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-bold gap-3 animate-pulse">
      <Shield size={40}/> 
      SINCROZINANDO COM A RESERVA DE ARMAS...
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 text-slate-900 p-3 flex flex-col gap-3 overflow-hidden font-sans antialiased">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white border border-slate-100 p-3.5 rounded-2xl shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-all ${data.isPendente ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}>
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              17º BPM - Painel de Controle de Armamento
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
               <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${data.isPendente ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                 <Activity size={10} /> 
                 {data.isPendente ? `ALERTA: TURNO ${data.turnoAlvo} PENDENTE` : `ATIVO: TURNO ${data.turnoAlvo}`}
               </span>
               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                 Responsável: {data.ultimoChecklist?.responsavel || "NÃO IDENTIFICADO"}
               </span>
            </div>
          </div>
        </div>
        
        <div className="text-right border-l border-slate-100 pl-6">
          <p className="text-slate-400 text-[10px] font-black uppercase italic leading-none mb-1">Hora do Sistema</p>
          <div className="text-3xl font-mono font-black text-slate-950 leading-none tracking-tighter">
            {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        <StatCard label="Status Conferência" value={data.stats?.aderencia} sub={data.isPendente ? "ATRASADA" : `FEITO ÀS ${data.ultimoChecklist?.hora}`} color={data.isPendente ? "text-red-600" : "text-emerald-600"} icon={<Clock size={18}/>} alert={data.isPendente} />
        <StatCard label="DISPONÍVEL" value={data.stats?.reserva} sub="PRONTO PARA USO" color="text-slate-950" icon={<HardDrive size={18} className="text-emerald-500"/>} />
        <StatCard label="Cautelado" value={data.stats?.emCautela} sub="POSSE DE TERCEIROS" color="text-slate-950" icon={<User size={18} className="text-sky-600"/>} />
        <StatCard label="Avarias/Críticos" value={data.stats?.avarias} sub="MANUTENÇÃO" color={data.stats?.avarias > 0 ? "text-red-600" : "text-slate-950"} icon={<AlertTriangle size={18} className={data.stats?.avarias > 0 ? "text-red-500" : "text-slate-300"}/>} alert={data.stats?.avarias > 0} />
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
        
        <div className="col-span-7 bg-white border border-slate-100 rounded-3xl p-5 flex flex-col shadow-sm">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
            <BarChart3 size={16} /> Panorama de Disponibilidade
          </h2>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.grafico} innerRadius={85} outerRadius={115} paddingAngle={8} dataKey="valor">
                  {data.grafico?.map((entry, i) => <Cell key={i} fill={entry.fill} stroke="#fff" strokeWidth={2} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MOTOR DE BUSCA / LISTA DE OBS ÍNTEGRA */}
        <div className="col-span-5 bg-white border border-slate-100 rounded-3xl p-5 flex flex-col shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <LayoutDashboard size={16} /> Movimentações e Observações
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {data.logs?.length > 0 ? (
              data.logs.map((log, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-all ${log.status === 'CRÍTICO' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-[10px] font-mono text-white bg-slate-800 px-2 py-0.5 rounded mr-2 uppercase">{log.id}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{log.equipamento}</span>
                    </div>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${log.status === 'CRÍTICO' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {log.status}
                    </span>
                  </div>
                  
                  {/* TEXTO NA ÍNTEGRA */}
                  <p className="text-xs font-bold text-slate-800 uppercase leading-relaxed bg-white/50 p-2 rounded-lg border border-white">
                    {log.militar}
                  </p>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/50">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600">
                        <BookOpen size={10} /> 
                        LIVRO: {log.livro || "N/A"}
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase italic">
                        {log.hora} - {log.responsavel.split(' ')[0]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs font-bold italic uppercase">Nenhuma observação relevante.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, color, alert }) {
  return (
    <div className={`bg-white border p-5 rounded-2xl shadow-sm relative group transition-all ${alert ? 'border-red-200 bg-red-50' : 'border-slate-100'}`}>
      <div className="absolute top-4 right-4 opacity-20">{icon}</div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{label}</p>
      <h3 className={`text-3xl font-black leading-none mb-1.5 tracking-tighter ${color}`}>{value}</h3>
      <p className={`text-[9px] font-bold uppercase ${alert ? 'text-red-500' : 'text-slate-500'}`}>{sub}</p>
    </div>
  );
}