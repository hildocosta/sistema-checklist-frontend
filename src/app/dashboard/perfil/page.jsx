"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User, Mail, Shield, MapPin, Camera, Save, 
  Award, CheckCircle2, Loader2, Building2, Phone, Hash 
} from "lucide-react";

// Importação dos componentes padronizados
import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import Skeleton from "../../../components/Skeleton";

export default function PerfilPage() {
  const { data: session, status } = useSession(); 
  
  const [user, setUser] = useState({
    nome: "",
    email: "",
    posto: "Soldado", 
    re: "000.000-0",           
    setor: "P4 - Logística",
    unidade: "17º BPM - São José dos Pinhais",
    telefone: "",
    nivelAcesso: "Operador (Checklist)"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser((prev) => ({
        ...prev,
        nome: session.user.name || "",
        email: session.user.email || "",
      }));
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [session, status]);

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
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6 relative text-left">
      
      {showSuccess && (
        <div className="fixed top-24 right-8 z-60 animate-in slide-in-from-right-10 flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 font-bold text-sm">
          <CheckCircle2 size={20} /> Perfil atualizado com sucesso!
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Breadcrumb itemAtual="Meu Perfil" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Configurações de Conta</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- CARD LATERAL (RESUMO LAPIDADO) --- */}
        {isLoading ? (
          <Skeleton className="w-full lg:w-1/3 h-105 rounded-3xl" />
        ) : (
          <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-105">
            {/* Header com degradê sutil */}
            <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl border-4 border-white bg-slate-50 overflow-hidden shadow-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                    <User size={48} className="text-slate-300" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-lg shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo Centralizado */}
            <div className="pt-16 pb-10 px-6 text-center flex flex-col items-center">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {user.nome || "Hildo Pereira Costa"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{user.posto}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">RE {user.re}</span>
              </div>
              
              {/* Divisor sutil */}
              <div className="w-full h-px bg-slate-100 my-8"></div>

              {/* Infos de Lotação */}
              <div className="w-full space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left transition-colors hover:bg-slate-100/50">
                  <Building2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Unidade</p>
                    <p className="text-xs font-bold text-slate-600 leading-tight">{user.unidade}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left transition-colors hover:bg-slate-100/50">
                  <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Setor / Seção</p>
                    <p className="text-xs font-bold text-slate-600 leading-tight">{user.setor}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* --- FORMULÁRIO --- */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {isLoading ? (
            <Skeleton className="h-105 w-full rounded-3xl" />
          ) : (
            <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 grow">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Award size={18} className="text-blue-600" /> Dados Cadastrais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-end">
                
                {/* NOME COMPLETO */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nome Completo</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      name="nome" 
                      type="text" 
                      value={user.nome} 
                      onChange={handleChange} 
                      className="w-full h-13.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                {/* POSTO / GRADUAÇÃO */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Posto / Graduação</label>
                  <div className="relative">
                    <Award size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      name="posto" 
                      type="text" 
                      value={user.posto} 
                      onChange={handleChange} 
                      className="w-full h-13.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                {/* REGISTRO (RE) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Registro (RE)</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      disabled 
                      value={user.re} 
                      className="w-full h-13.5 pl-12 pr-4 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed font-mono font-bold"
                    />
                  </div>
                </div>

                {/* UNIDADE */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Lotação (Unidade)</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      name="unidade" 
                      type="text" 
                      value={user.unidade} 
                      onChange={handleChange} 
                      className="w-full h-13.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                {/* SETOR */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Setor / Seção</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      name="setor" 
                      type="text" 
                      value={user.setor} 
                      onChange={handleChange} 
                      className="w-full h-13.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">E-mail Institucional</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      name="email" 
                      type="email" 
                      value={user.email} 
                      disabled
                      className="w-full h-13.5 pl-12 pr-4 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                {/* TELEFONE */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Telefone de Contato</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      name="telefone" 
                      type="text" 
                      value={user.telefone} 
                      onChange={handleChange} 
                      placeholder="(00) 00000-0000"
                      className="w-full h-13.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                {/* NÍVEL DE PERMISSÃO */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nível de Permissão</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      disabled 
                      value={user.nivelAcesso} 
                      className="w-full h-13.5 pl-12 pr-4 bg-slate-100 border border-slate-200 rounded-xl text-sm text-blue-600 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <ActionButton 
                  type="submit"
                  disabled={isSaving}
                  icon={isSaving ? Loader2 : Save}
                  label={isSaving ? "Salvando..." : "Atualizar Perfil"}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}