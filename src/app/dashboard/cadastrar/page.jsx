"use client";
import { useState } from "react";
import { 
  UserPlus, 
  Shield, 
  ClipboardCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Database
} from "lucide-react";

export default function CadastrarPage() {
  const [abaAtiva, setAbaAtiva] = useState("militar");
  const [formEnviado, setFormEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormEnviado(true);
    setTimeout(() => setFormEnviado(false), 3000);
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      
      {/* Notificação de Sucesso */}
      {formEnviado && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 font-bold text-sm border border-white/20">
          <CheckCircle2 size={20} strokeWidth={3} /> Cadastro realizado com sucesso!
        </div>
      )}

      {/* --- CABEÇALHO COM CÁPSULA OPÇÃO 1 --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-full mb-3 shadow-sm shadow-slate-200/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">Dashboard</span>
            <ChevronRight size={10} className="text-slate-300 mx-0.5" />
            <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.15em]">Novo Registro</span>
          </nav>
          
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Gestão de Entradas
            
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Inclusão de novos dados no banco de dados do 17º BPM.</p>
        </div>

        {/* SELETOR DE CATEGORIA (ABAS) ESTILIZADO */}
        <div className="flex gap-2 p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-inner">
          <button 
            onClick={() => setAbaAtiva("militar")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              abaAtiva === "militar" 
              ? "bg-white text-blue-600 shadow-md scale-100" 
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <UserPlus size={14} strokeWidth={3} /> Militar
          </button>
          <button 
            onClick={() => setAbaAtiva("servico")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              abaAtiva === "servico" 
              ? "bg-white text-blue-600 shadow-md scale-100" 
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Database size={14} strokeWidth={3} /> Serviço
          </button>
        </div>
      </div>

      {/* --- FORMULÁRIOS COM DESIGN REFINADO --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 to-cyan-400 opacity-20"></div>
        
        <form onSubmit={handleSubmit} className="p-10">
          
          {abaAtiva === "militar" ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Shield size={20} strokeWidth={2.5} /></div>
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Dados do Efetivo</h2>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mt-1 italic">Vínculo Direto com a SJD</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label>
                  <input required type="text" placeholder="Ex: Anderson Silva" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all font-medium text-slate-700 shadow-xs"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">RE (Registro Estadual)</label>
                  <input required type="text" placeholder="000.000-0" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all font-mono font-bold text-slate-600 shadow-xs"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Posto/Graduação</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all font-bold text-slate-600 cursor-pointer shadow-xs">
                    <option>Soldado</option>
                    <option>Cabo</option>
                    <option>3º Sargento</option>
                    <option>2º Sargento</option>
                    <option>1º Sargento</option>
                    <option>Subtenente</option>
                    <option>Oficial</option>
                  </select>
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Institucional (@pm.pr.gov.br)</label>
                  <input required type="email" placeholder="militar@pm.pr.gov.br" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all font-medium text-slate-700 shadow-xs"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nível de Acesso</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all font-black text-blue-600 cursor-pointer shadow-xs">
                    <option>Operador (Padrão)</option>
                    <option>Gestor de Logística</option>
                    <option>Administrador</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><ClipboardCheck size={20} strokeWidth={2.5} /></div>
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Novo Item de Manutenção</h2>
                  <p className="text-[10px] text-amber-600 uppercase font-bold tracking-tight mt-1 italic">Sincronização Automática com Planilha Master</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Descrição do Serviço</label>
                  <input required type="text" placeholder="Ex: Manutenção Preventiva Freezer" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all font-bold text-slate-700 shadow-xs"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Periodicidade</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all font-black text-slate-600 cursor-pointer shadow-xs">
                    <option>Mensal</option>
                    <option>Trimestral</option>
                    <option>Semestral</option>
                    <option>Anual</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Data da Última Execução</label>
                  <input type="date" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all text-slate-500 font-bold shadow-xs cursor-pointer"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vínculo OPM / Setor</label>
                  <input type="text" placeholder="Ex: Rancho / Estante de Tiro" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 outline-none transition-all font-medium text-slate-600 shadow-xs"/>
                </div>
              </div>
              
              <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-100/50 flex gap-4">
                <div className="p-2 bg-amber-500 rounded-xl h-fit shadow-md shadow-amber-500/20">
                  <AlertCircle className="text-white" size={16} />
                </div>
                <p className="text-[11px] text-amber-900/80 font-bold leading-relaxed tracking-tight">
                  <span className="text-amber-600 font-black uppercase mr-1 underline">Atenção:</span>
                  O sistema calculará automaticamente o próximo vencimento. Certifique-se de que a data da última execução está correta para evitar divergências na planilha de auditoria.
                </p>
              </div>
            </div>
          )}

          {/* RODAPÉ DO FORMULÁRIO COM BOTÃO IMPACTANTE */}
          <div className="mt-16 pt-8 border-t border-slate-50 flex justify-end">
            <button 
              type="submit"
              className="group flex items-center gap-4 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer overflow-hidden relative"
            >
              <span className="relative z-10">Concluir Registro Militar</span>
              <ArrowRight size={18} strokeWidth={3} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}