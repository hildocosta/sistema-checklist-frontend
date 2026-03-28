/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  User, 
  FileText, 
  Tag,
  AlertCircle,
  ChevronRight
} from "lucide-react";

const solicitacoesBaseadasNaPlanilha = [
  { 
    id: "001", 
    titulo: "Limpeza de Caixa D'Água (Urgente)", 
    solicitante: "Sgt. Responsável - Logística", 
    status: "Pendente", 
    data: "22/03/2026",
    vinculo: "Serviço ID #01" 
  },
  { 
    id: "002", 
    titulo: "Manutenção Ar Condicionado - Bloco A", 
    solicitante: "Cap. Administrativo", 
    status: "Em Andamento", 
    data: "22/03/2026",
    vinculo: "Serviço ID #02"
  },
  { 
    id: "003", 
    titulo: "Troca de Filtros de Água - Refeitório", 
    solicitante: "Nutrição", 
    status: "Concluído", 
    data: "21/03/2026",
    vinculo: "Serviço ID #03"
  },
  { 
    id: "004", 
    titulo: "Dedetização Geral Trimestral", 
    solicitante: "Sgt. Auxiliar", 
    status: "Pendente", 
    data: "20/03/2026",
    vinculo: "Serviço ID #04"
  },
];

export default function SolicitacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    titulo: "", 
    solicitante: "", 
    servicoVinculado: "Limpeza de Caixa D'Água (ID #01)" 
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setFormData({ titulo: "", solicitante: "", servicoVinculado: "Limpeza de Caixa D'Água (ID #01)" });
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6">
      
      {/* --- CABEÇALHO --- */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
  <div>
    <nav className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-full mb-3 shadow-sm shadow-slate-200/10">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">Gestão Interna</span>
      <ChevronRight size={10} className="text-slate-300 mx-0.5" />
      <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.15em]">Solicitações</span>
    </nav>
    <h1 className="text-xl font-bold text-slate-800 tracking-tight">
      Chamados e Ordens de Serviço
     
    </h1>
  </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={16} strokeWidth={3} /> Abrir Chamado
        </button>
      </div>

      {/* --- TABELA COM CORES FIXAS NAS AÇÕES --- */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        
        <div className="p-5 bg-slate-50/40 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar chamado por ID ou título..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all outline-none focus:border-blue-300"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-50/50 rounded-lg border border-blue-100/50 text-[10px] font-black text-blue-600 uppercase tracking-widest">
            <AlertCircle size={14} className="animate-pulse" />
            Sincronizado com Planilha Master
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">Chamado / Vínculo Operacional</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {solicitacoesBaseadasNaPlanilha.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6 text-xs font-black text-slate-300">#{item.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-700 leading-none">{item.titulo}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">{item.vinculo}</span>
                        <span className="text-slate-200 text-[10px]">|</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{item.solicitante}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                      item.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      item.status === 'Em Andamento' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  
                  {/* BOTÕES COM CORES FIXAS E SUAVES */}
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 cursor-pointer shadow-xs active:scale-90 transition-transform">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 cursor-pointer shadow-xs active:scale-90 transition-transform">
                        <Trash2 size={14} />
                      </button>
                      <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 cursor-pointer shadow-xs active:scale-90 transition-transform">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
          <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            
            <div className="bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-black uppercase tracking-tight">Novo Chamado</h2>
                <p className="text-[10px] opacity-90 uppercase font-black tracking-widest mt-1">Integração Digital de Manutenção</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="relative z-10 hover:bg-white/20 p-2.5 rounded-2xl transition-all cursor-pointer active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 italic">
                  <Tag size={12} className="text-blue-500" /> Vínculo com Serviço da Planilha
                </label>
                <div className="relative">
                   <select 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none appearance-none cursor-pointer font-bold text-slate-700 shadow-xs"
                    value={formData.servicoVinculado}
                    onChange={(e) => setFormData({...formData, servicoVinculado: e.target.value})}
                  >
                    <option>Limpeza de Caixa D'Água (ID #01)</option>
                    <option>Ar Condicionado (ID #02)</option>
                    <option>Filtros de Água (ID #03)</option>
                    <option>Dedetização (ID #04)</option>
                    <option>Extintores (ID #05)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <FileText size={12} className="text-blue-500" /> Descrição da Ocorrência
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Vazamento identificado na boia lateral"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all shadow-xs"
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <User size={12} className="text-blue-500" /> Responsável pela Abertura
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="Seu nome ou graduação"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all shadow-xs"
                  onChange={(e) => setFormData({...formData, solicitante: e.target.value})}
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 border border-slate-100 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-[1.5] py-4 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} strokeWidth={3} /> Abrir Ordem de Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}