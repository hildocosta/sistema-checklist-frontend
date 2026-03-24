"use client";
import { useState } from "react";
import { 
  UserPlus, 
  Settings, 
  Shield, 
  ClipboardCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
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
    <div className="animate-in fade-in duration-700 space-y-6">
      {/* Notificação de Sucesso */}
      {formEnviado && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 font-bold text-sm">
          <CheckCircle2 size={20} /> Cadastro realizado com sucesso!
        </div>
      )}

      {/* --- CABEÇALHO --- */}
      <div>
         <nav className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
          Dashboard /<span className="text-blue-600">Cadastrar</span>
        </nav>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Novo Registro</h1>
        <p className="text-xs text-slate-400 mt-1 italic">Selecione a categoria para adicionar ao sistema do 17º BPM.</p>
      </div>

      {/* --- SELETOR DE CATEGORIA (ABAS) --- */}
      <div className="flex gap-4 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-200">
        <button 
          onClick={() => setAbaAtiva("militar")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            abaAtiva === "militar" 
            ? "bg-white text-blue-600 shadow-sm" 
            : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <UserPlus size={16} /> Militar
        </button>
        <button 
          onClick={() => setAbaAtiva("servico")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            abaAtiva === "servico" 
            ? "bg-white text-blue-600 shadow-sm" 
            : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Settings size={16} /> Serviço
        </button>
      </div>

      {/* --- FORMULÁRIOS --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          
          {abaAtiva === "militar" ? (
            /* FORMULÁRIO DE MILITAR */
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Shield size={18} /></div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Dados do Efetivo</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label>
                  <input required type="text" placeholder="Ex: Anderson Silva" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">RE (Registro)</label>
                  <input required type="text" placeholder="000.000-0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Posto/Graduação</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all">
                    <option>Soldado</option>
                    <option>Cabo</option>
                    <option>3º Sargento</option>
                    <option>2º Sargento</option>
                    <option>1º Sargento</option>
                    <option>Subtenente</option>
                    <option>Oficial</option>
                  </select>
                </div>
                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Institucional</label>
                  <input required type="email" placeholder="militar@pm.pr.gov.br" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nível de Acesso</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-blue-600">
                    <option>Operador (Padrão)</option>
                    <option>Gestor de Logística</option>
                    <option>Administrador</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* FORMULÁRIO DE SERVIÇO (PLANILHA) */
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ClipboardCheck size={18} /></div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Novo Item de Manutenção</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Descrição do Serviço</label>
                  <input required type="text" placeholder="Ex: Manutenção Preventiva Freezer" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Periodicidade</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700">
                    <option>Mensal</option>
                    <option>Trimestral</option>
                    <option>Semestral</option>
                    <option>Anual</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Data da Última Execução</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-500"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vínculo OPM / Setor</label>
                  <input type="text" placeholder="Ex: Rancho / Estante de Tiro" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"/>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-600 shrink-0" size={18} />
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed italic">
                  Ao cadastrar um novo serviço, o sistema calculará automaticamente a <b>Previsão da Próxima Execução</b> baseada na periodicidade e na data informada.
                </p>
              </div>
            </div>
          )}

          {/* RODAPÉ DO FORMULÁRIO */}
          <div className="mt-12 pt-6 border-t border-slate-50 flex justify-end">
  <button 
    type="submit"
    className="flex items-center gap-3 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-10 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
  >
    Concluir Cadastro <ArrowRight size={16} />
  </button>
</div>
        </form>
      </div>
    </div>
  );
}