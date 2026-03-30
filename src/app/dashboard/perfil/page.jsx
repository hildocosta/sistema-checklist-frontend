"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User, Mail, Shield, MapPin, Camera, Save, Lock, 
  Award, CheckCircle2, Loader2, KeyRound 
} from "lucide-react";

// Importação dos componentes padronizados
import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import Skeleton from "../../../components/Skeleton";

export default function PerfilPage() {
  const { data: session, status } = useSession(); // Busca sessão real do backend
  
  const [user, setUser] = useState({
    nome: "",
    email: "",
    posto: "Posto/Graduação", // Campo a ser expandido no backend
    re: "000.000-0",           // Campo a ser expandido no backend
    setor: "Não Informado",
    unidade: "17º BPM",
    telefone: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Efeito para alimentar os dados assim que a sessão estiver pronta
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser((prev) => ({
        ...prev,
        nome: session.user.name || "",
        email: session.user.email || "",
        // Aqui, quando você tiver o RE no banco, ele viria via session.user.re
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
    
    // Futuramente aqui entrará um fetch(api/user/update)
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6 relative text-left">
      
      {/* --- NOTIFICAÇÃO DE SUCESSO --- */}
      {showSuccess && (
        <div className="fixed top-24 right-8 z-60 animate-in slide-in-from-right-10 flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 font-bold text-sm">
          <CheckCircle2 size={20} /> Perfil atualizado com sucesso!
        </div>
      )}

      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Breadcrumb itemAtual="Meu Perfil" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Configurações de Conta</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- CARD LATERAL (RESUMO) --- */}
        {isLoading ? (
          <Skeleton className="w-full lg:w-1/3 h-105 rounded-3xl" />
        ) : (
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
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                {user.nome || "Usuário"}
              </h2>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1 italic">
                {user.posto} • RE {user.re}
              </p>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  <MapPin size={16} className="text-blue-500 shrink-0" /> {user.unidade}
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  <Shield size={16} className="text-blue-500 shrink-0" /> {user.setor}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- FORMULÁRIO E SEGURANÇA --- */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-105 w-full rounded-3xl" />
              <Skeleton className="h-32 w-full rounded-3xl" />
            </>
          ) : (
            <>
              <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 grow">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Award size={18} className="text-blue-600" /> Dados Cadastrais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-end">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nome Completo</label>
                    <input 
                      name="nome" 
                      type="text" 
                      value={user.nome} 
                      onChange={handleChange} 
                      className="w-full h-13.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Registro (RE)</label>
                    <input 
                      type="text" 
                      disabled 
                      value={user.re} 
                      className="w-full h-13.5 px-4 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">E-mail Institucional</label>
                    <input 
                      name="email" 
                      type="email" 
                      value={user.email} 
                      disabled
                      className="w-full h-13.5 px-4 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Telefone de Contato</label>
                    <input 
                      name="telefone" 
                      type="text" 
                      value={user.telefone} 
                      onChange={handleChange} 
                      placeholder="(00) 00000-0000"
                      className="w-full h-13.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                    />
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

              {/* --- SEÇÃO DE SEGURANÇA --- */}
              <div className="bg-slate-950 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="flex items-start gap-4 grow z-10 text-left">
                   <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                     <Lock size={20} />
                   </div>
                   <div>
                      <h3 className="text-sm font-bold mb-1 tracking-tight">Segurança da Conta</h3>
                      <p className="text-[11px] text-slate-400 font-light leading-relaxed max-w-sm italic">
                        Recomendamos a troca de senha periodicamente para sua proteção.
                      </p>
                   </div>
                </div>
                
                <div className="z-10 w-full md:w-auto">
                  <ActionButton 
                    type="button"
                    onClick={() => console.log("Abrir modal de senha")}
                    icon={KeyRound}
                    label="Alterar Minha Senha"
                    className="w-full md:w-auto bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-700 shadow-xl transition-all"
                  />
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}