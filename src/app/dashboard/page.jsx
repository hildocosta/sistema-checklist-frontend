"use client";
import { FileText, AlertTriangle, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// Dados baseados na sua planilha para o gráfico
const dadosGrafico = [
  { name: 'Atrasados', valor: 2, color: '#ef4444' }, 
  { name: 'Em Alerta', valor: 11, color: '#f59e0b' }, 
  { name: 'Em Dia', valor: 3, color: '#10b981' },   
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- CABEÇALHO COM BREADCRUMB PADRONIZADO --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-full mb-3 shadow-sm shadow-slate-200/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.15em]">Dashboard</span>
            <ChevronRight size={10} className="text-slate-300 mx-0.5" />
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">Visão Geral</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Painel de Controle Operacional
          </h1>
        </div>
      </div>

      {/* --- GRID DE CARDS DE ESTATÍSTICAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card: SERVIÇOS ATRASADOS */}
        <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group hover:border-red-100 transition-colors">
          <div className="absolute -top-4 left-4 w-12 h-12 bg-linear-to-tr from-red-600 to-red-400 rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <AlertTriangle size={24} />
          </div>
          <div className="text-right pt-2">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Atrasados</p>
            <h3 className="text-3xl font-bold text-slate-700 font-mono">02</h3>
          </div>
          <div className="border-t border-slate-50 mt-4 pt-2">
            <p className="text-[10px] text-red-500 font-bold uppercase italic">
              Ação imediata necessária
            </p>
          </div>
        </div>

        {/* Card: EM ALERTA */}
        <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group hover:border-amber-100 transition-colors">
          <div className="absolute -top-4 left-4 w-12 h-12 bg-linear-to-tr from-amber-500 to-orange-400 rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
          <div className="text-right pt-2">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Em Alerta</p>
            <h3 className="text-3xl font-bold text-slate-700 font-mono">11</h3>
          </div>
          <div className="border-t border-slate-50 mt-4 pt-2">
            <p className="text-[10px] text-amber-600 font-bold uppercase">
              Vencendo nos próximos 30 dias
            </p>
          </div>
        </div>

        {/* Card: CHAMADOS ABERTOS */}
        <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group hover:border-blue-100 transition-colors">
          <div className="absolute -top-4 left-4 w-12 h-12 bg-linear-to-tr from-blue-600 to-blue-400 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <div className="text-right pt-2">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Chamados Ativos</p>
            <h3 className="text-3xl font-bold text-slate-700 font-mono">04</h3>
          </div>
          <div className="border-t border-slate-50 mt-4 pt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <p className="text-[10px] text-slate-400 font-medium italic">
              Vínculo com planilha ativo
            </p>
          </div>
        </div>
      </div>

      {/* --- SEÇÃO DE GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico de Barras */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
          <div className="mb-8 text-left">
            <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wider">Status das Manutenções</h2>
            <p className="text-xs text-slate-400">Distribuição baseada na periodicidade da planilha</p>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]} barSize={45}>
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card Informativo Premium */}
        <div className="bg-linear-to-br from-slate-800 to-slate-950 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between text-left shadow-xl">
           <div className="relative z-10">
              <h2 className="text-xl font-bold mb-3">Resumo Operacional</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Atualmente, <strong className="text-white text-lg">68%</strong> dos serviços do 17º BPM requerem atenção ou atualização de dados no sistema.
              </p>
           </div>
           
           <div className="mt-8 flex gap-4 relative z-10">
              <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 grow">
                <p className="text-[10px] uppercase font-bold text-blue-400 mb-1 tracking-widest">Próximo Vencimento Crítico</p>
                <p className="text-sm font-bold text-slate-100">Dedetização Geral</p>
                <p className="text-xs text-slate-400 mt-1">12 de Março, 2026</p>
              </div>
           </div>

           {/* Detalhes decorativos de UI */}
           <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp size={120} />
           </div>
        </div>
      </div>
    </div>
  );
}