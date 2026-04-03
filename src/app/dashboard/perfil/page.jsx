"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { 
  User, Mail, Shield, MapPin, Camera, Save, 
  Award, CheckCircle2, Loader2, Building2, Phone, Hash 
} from "lucide-react";

import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import Skeleton from "../../../components/Skeleton";

export default function PerfilPage() {
  const { data: session, status } = useSession(); 
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState({
    nome: "", email: "", posto: "", re: "", setor: "",
    unidade: "", telefone: "", nivelAcesso: "Operador", image: "" 
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      if (status === "loading") return;
      
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await fetch("/api/user/update");
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao buscar dados");
          }
          
          const dados = await response.json();

          setUser({
            nome: dados.name || session.user.name || "",
            email: dados.email || session.user.email || "",
            posto: dados.posto || "",
            re: dados.re || "",
            setor: dados.setor || "",
            unidade: dados.unidade || "17º BPM",
            telefone: dados.telefone || "",
            nivelAcesso: dados.nivel || "Operador",
            image: dados.image || "" 
          });
        } catch (error) {
          console.error("Erro no carregamento:", error.message);
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false);
      }
    };
    carregarDadosIniciais();
  }, [session, status]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("A imagem é muito grande (máx 4MB).");
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
       method: "POST",
       body: file,
       headers: {
       "content-type": file.type,
  },
});

      if (!response.ok) throw new Error("Falha no upload");
      
      const newBlob = await response.json();
      
      if (newBlob.url) {
        setUser(prev => ({ ...prev, image: newBlob.url }));
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao enviar imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const err = await response.json();
        throw new Error(err.error || "Erro ao salvar");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 max-w-6xl mx-auto"><Skeleton className="w-full h-96 rounded-3xl" /></div>;

  return (
    <div className="animate-in fade-in duration-500 space-y-4 text-left max-w-6xl mx-auto p-2">
      {showSuccess && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg font-bold text-xs">
          <CheckCircle2 size={16} /> Perfil atualizado!
        </div>
      )}

      <div className="flex justify-between items-end px-2">
        <div>
          <Breadcrumb itemAtual="Meu Perfil" />
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Configurações</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col shrink-0">
          <div className="h-24 bg-slate-900 relative">
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl border-4 border-white bg-slate-50 overflow-hidden shadow-lg flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                  ) : user.image ? (
                    <img src={user.image} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-blue-600 text-white border-2 border-white shadow-md hover:bg-blue-700 transition-colors"
                >
                  <Camera size={14} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-4 text-center">
            <h2 className="text-base font-bold text-slate-800 truncate">{user.nome || "Militar"}</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">
              {user.posto || "Posto"} • RG {user.re || "---"}
            </p>
            <div className="my-4 border-t border-slate-50"></div>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 border border-slate-100">
                <Building2 size={14} className="text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Unidade</p>
                  <p className="text-[11px] font-bold text-slate-600 truncate">{user.unidade}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 border border-slate-100">
                <MapPin size={14} className="text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Setor</p>
                  <p className="text-[11px] font-bold text-slate-600 truncate">{user.setor || "Não informado"}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSave} className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
            <Award size={16} className="text-blue-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Dados Cadastrais</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Nome Completo</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="nome" type="text" value={user.nome} onChange={handleInputChange} className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all font-medium text-slate-700" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Registro (RG)</label>
              <div className="relative">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="re" type="text" value={user.re} onChange={handleInputChange} className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Posto</label>
              <input name="posto" type="text" value={user.posto} onChange={handleInputChange} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Unidade</label>
              <input name="unidade" type="text" value={user.unidade} onChange={handleInputChange} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Setor</label>
              <input name="setor" type="text" value={user.setor} onChange={handleInputChange} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">E-mail Institucional</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input value={user.email} disabled className="w-full h-10 pl-9 pr-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-400 cursor-not-allowed font-medium" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Telefone</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="telefone" type="text" value={user.telefone} onChange={handleInputChange} placeholder="(00) 00000-0000" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <ActionButton 
              type="submit"
              disabled={isSaving || isUploading}
              icon={isSaving ? Loader2 : Save}
              label={isSaving ? "Salvando..." : "Salvar Alterações"}
              className="px-8 py-2.5 text-xs h-auto shadow-md"
            />
          </div>
        </form>
      </div>
    </div>
  );
}