"use client";
import { useState } from "react";
import { 
  User, Mail, Shield, MapPin, Camera, Save, Lock, 
  Award, CheckCircle2, Loader2, X, UserPlus, Hash
} from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";

export default function PerfilPage() {
  // Estado para os dados do militar logado
  const [user, setUser] = useState({
    nome: "Anderson Silva",
    posto: "1º Sargento",
    re: "123.456-7",
    email: "sargento.silva@pm.pr.gov.br",
    setor: "P4 - Logística",
    unidade: "17º BPM - São José dos Pinhais",
    telefone: "(41) 99999-0000"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModalMilitar, setShowModalMilitar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setShowModalMilitar(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6 relative text-left">
      
      {/* --- NOTIFICAÇÃO DE SUCESSO --- */}
      {showSuccess && (
       <div className="fixed top-24 right-8 z-60 animate-in slide-in-from-right-10 flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 font-bold text-sm">
          <CheckCircle2 size={20} /> Operação realizada com sucesso!
        </div>
      )}

      {/* --- MODAL FLUTUANTE: CADASTRAR NOVO MILITAR --- */}
      {showModalMilitar && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowModalMilitar(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><UserPlus size={20} /></div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Cadastrar Novo Militar</h2>
                  <p className="text-[10px] opacity-90 uppercase font-black tracking-widest mt-1">Inclusão de Efetivo - 17º BPM</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModalMilitar(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nome Completo</label>
                  <input required type="text" placeholder="Nome de Guerra ou Completo" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700"/>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1"><Hash size={10}/> Registro (RE)</label>
                  <input required type="text" placeholder="000.000-0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono font-bold text-slate-700"/>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Posto/Graduação</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 cursor-pointer">
                    <option>Soldado</option>
                    <option>Cabo</option>
                    <option>3º Sargento</option>
                    <option>2º Sargento</option>
                    <option>1º Sargento</option>
                    <option>Subtenente</option>
                    <option>Oficial</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1"><Mail size={10}/> E-mail Institucional</label>
                  <input required type="email" placeholder="militar@pm.pr.gov.br" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-600"/>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModalMilitar(false)}
                  className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer">
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Breadcrumb itemAtual="Meu Perfil" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Configurações de Conta</h1>
        </div>

         {/* --- BOTÃO DE AÇÃO PRINCIPAL --- */}
              <ActionButton 
                  onClick={() => setShowModalMilitar(true)}
                  icon={UserPlus} 
                  label="Adicionar Serviço"
                />
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Card Lateral: Foto e Unidade */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-105">
          <div className="h-28 bg-linear-to-r from-slate-800 to-slate-900 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg flex items-center justify-center">
                  <User size={40} className="text-slate-400" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-6 text-center grow flex flex-col justify-center">
            <h2 className="text-lg font-bold text-slate-800">{user.posto} {user.nome}</h2>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1 italic">RE {user.re}</p>
            
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                <MapPin size={16} className="text-blue-500 shrink-0" /> {user.unidade}
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                <Shield size={16} className="text-blue-500 shrink-0" /> {user.setor}
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário e Segurança */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 grow">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Award size={18} className="text-blue-600" /> Informações Profissionais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nome Completo</label>
                <input name="nome" type="text" value={user.nome} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Registro (RE)</label>
                <input type="text" disabled value={user.re} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed font-mono font-bold"/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">E-mail Institucional</label>
                <input name="email" type="email" value={user.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Telefone de Contato</label>
                <input name="telefone" type="text" value={user.telefone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"/>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-10 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>

          {/* Card de Segurança */}
          <div className="bg-linear-to-br from-slate-800 to-slate-950 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
            <div className="flex items-start gap-4 grow z-10">
               <div className="bg-white/10 p-3 rounded-2xl"><Lock size={20} /></div>
               <div>
                  <h3 className="text-sm font-bold mb-1 tracking-tight">Segurança e Autenticação</h3>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed max-w-sm italic">
                    Última alteração de senha: <b className="text-white">22/02/2026</b>. Mantenha seus dados sempre protegidos.
                  </p>
               </div>
            </div>
            <button 
              onClick={() => alert("Função para abrir modal de troca de senha")}
              className="w-full md:w-auto py-3 px-8 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl cursor-pointer z-10"
            >
               Alterar Minha Senha
            </button>
            {/* Efeito visual de fundo */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          </div>
        </div>
      </div>
    </div>
  );
}