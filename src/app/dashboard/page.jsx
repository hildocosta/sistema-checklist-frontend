"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, Shield, BarChart3, Clock, User, HardDrive, LayoutDashboard, Activity } from "lucide-react";
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

  // Tela de carregamento segura
  if (!data) return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-bold gap-3 animate-pulse">
      <Shield size={40}/> 
      SINCROZINANDO COM A RESERVA DE ARMAS...
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 text-slate-900 p-3 flex flex-col gap-3 overflow-hidden font-sans antialiased">
      
      {/* HEADER SUPERIOR */}
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
                 Responsável Atual: {data.ultimoChecklist?.responsavel || "NÃO IDENTIFICADO"}
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

      {/* GRID DE CARDS PRINCIPAIS */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        <StatCard 
          label="Status da Conferência" 
          value={data.stats?.aderencia || "---"} 
          sub={data.isPendente ? "⚠️ CONFERÊNCIA ATRASADA" : `FEITO ÀS ${data.ultimoChecklist?.hora || '--:--'}`} 
          color={data.isPendente ? "text-red-600" : "text-emerald-600"} 
          icon={<Clock size={18}/>} 
          alert={data.isPendente}
        />
        <StatCard 
          label="DISPONÍVEL" 
          value={data.stats?.reserva || 0} 
          sub="PRONTO PARA USO" 
          color="text-slate-950" 
          icon={<HardDrive size={18} className="text-emerald-500"/>} 
        />
        <StatCard 
          label="Em Cautela (Rua)" 
          value={data.stats?.emCautela || 0} 
          sub="POSSE DE TERCEIROS" 
          color="text-slate-950" 
          icon={<User size={18} className="text-sky-600"/>} 
        />
        <StatCard 
          label="Avarias/Críticos" 
          value={data.stats?.avarias || 0} 
          sub="NECESSITA MANUTENÇÃO" 
          color={data.stats?.avarias > 0 ? "text-red-600" : "text-slate-950"} 
          icon={<AlertTriangle size={18} className={data.stats?.avarias > 0 ? "text-red-500" : "text-slate-300"}/>} 
          alert={data.stats?.avarias > 0} 
        />
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        
        {/* GRÁFICO DE DISTRIBUIÇÃO */}
        <div className="col-span-7 bg-white border border-slate-100 rounded-3xl p-5 flex flex-col relative shadow-sm">
          <div className="flex justify-between items-center mb-5 shrink-0">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} className="text-slate-400" /> Panorama de Disponibilidade
            </h2>
            {data.isPendente && (
              <span className="text-[9px] bg-red-600 text-white px-2.5 py-1 rounded-full font-black animate-bounce uppercase">
                Aguardando Nova Conferência
              </span>
            )}
          </div>
          
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data.grafico || []} 
                  innerRadius={85} 
                  outerRadius={115} 
                  paddingAngle={8} 
                  dataKey="valor"
                >
                  {data.grafico?.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} stroke="#fff" strokeWidth={2} name={entry.name.toUpperCase()} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '11px', fontWeight: 'bold'}} />
                <Legend verticalAlign="bottom" height={30} wrapperStyle={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOGS DO LIVRO DE CARGA */}
        <div className="col-span-5 bg-white border border-slate-100 rounded-3xl p-5 flex flex-col shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <LayoutDashboard size={16} className="text-slate-400" /> Histórico / Observações
            </h2>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
              Último Reg: {data.ultimoChecklist?.data || "--/--"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-100 scrollbar-track-transparent min-h-0">
            {data.logs?.length > 0 ? (
              data.logs.map((log, i) => (
                <div key={i} className={`p-3 rounded-2xl border transition-all ${log.status === 'CRÍTICO' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[10px] font-mono text-sky-700 font-black tracking-widest uppercase bg-sky-50 px-1.5 py-0.5 rounded">{log.id}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${log.status === 'CRÍTICO' ? 'bg-red-600 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-black text-slate-950 uppercase leading-snug mb-1">{log.militar}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase italic">Conferido às {log.hora} por {log.responsavel}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs font-bold italic uppercase">Sem movimentações registradas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, color, alert }) {
  return (
    <div className={`bg-white border p-5 rounded-2xl shadow-sm relative overflow-hidden group transition-all ${alert ? 'border-red-100 bg-red-50/30' : 'border-slate-100'}`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 text-slate-300 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 leading-none">{label}</p>
      <h3 className={`text-3xl font-black leading-none mb-1.5 tracking-tighter ${color}`}>{value}</h3>
      <p className={`text-[9px] font-bold uppercase tracking-tighter ${alert ? 'text-red-500' : 'text-slate-500'}`}>{sub}</p>
    </div>
  );
}