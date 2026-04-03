"use client";

import { useState, useEffect } from "react";
import { 
  UserPlus, Shield, CheckCircle2, PackagePlus, Hash, FileText, 
  Layers, Archive, Mail, Phone, Building2, User, Save, Loader2, KeyRound, AlertCircle
} from "lucide-react";

import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import SecondaryButton from "../../../components/SecondaryButton";
import Skeleton from "../../../components/Skeleton";

export default function CadastrarPage() {
  const [abaAtiva, setAbaAtiva] = useState("militar");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ tipo: "", msg: "" });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ tipo: "", msg: "" });

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const endpoint = abaAtiva === "militar" ? "/api/militares" : "/api/itens";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao processar cadastro");

      setFeedback({ tipo: "sucesso", msg: "Cadastro realizado com sucesso!" });
      e.target.reset();
    } catch (error) {
      setFeedback({ tipo: "erro", msg: error.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback({ tipo: "", msg: "" }), 4000);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-4 text-left max-w-6xl mx-auto p-2">
      
      {/* FEEDBACK FLUTUANTE */}
      {feedback.msg && (
        <div className={`fixed top-20 right-8 z-50 flex items-center gap-3 px-5 py-2.5 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-wider animate-in slide-in-from-right-5 ${
          feedback.tipo === "sucesso" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {feedback.tipo === "sucesso" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {feedback.msg}
        </div>
      )}

      {/* HEADER E NAVEGAÇÃO SLIM */}
      <div className="flex flex-col md:flex-row justify-between items-end px-2 gap-4">
        <div>
          <Breadcrumb itemAtual="Novo Cadastro" />
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Gestão de Entradas</h1>
        </div>

        {/* SELETOR DE ABAS ULTRA-SLIM */}
        <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
          <SecondaryButton 
            onClick={() => setAbaAtiva("militar")}
            icon={UserPlus}
            label="Militar"
            className={`!px-4 !py-1 !min-h-0 !h-8 border-none transition-all !text-[9px] !font-black uppercase tracking-widest ${
              abaAtiva === "militar" 
                ? "!bg-white !text-blue-600 shadow-sm" 
                : "!bg-transparent !text-slate-400 opacity-60"
            }`}
          />
          <SecondaryButton 
            onClick={() => setAbaAtiva("item")}
            icon={PackagePlus}
            label="Novo Item"
            className={`!px-4 !py-1 !min-h-0 !h-8 border-none transition-all !text-[9px] !font-black uppercase tracking-widest ${
              abaAtiva === "item" 
                ? "!bg-white !text-blue-600 shadow-sm" 
                : "!bg-transparent !text-slate-400 opacity-60"
            }`}
          />
        </div>
      </div>

      {/* CARD DE FORMULÁRIO */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-5">
          {isLoading ? (
            <div className="space-y-6">
               <Skeleton className="h-6 w-40 rounded-lg" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              <div className="flex items-center gap-2 mb-5 border-b border-slate-50 pb-3">
                {abaAtiva === "militar" ? (
                  <>
                    <Shield size={16} className="text-blue-600" />
                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Credenciamento de Usuário</h3>
                  </>
                ) : (
                  <>
                    <Archive size={16} className="text-emerald-600" />
                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Inclusão de Material</h3>
                  </>
                )}
              </div>

              {/* GRID DE CAMPOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {abaAtiva === "militar" ? (
                  <>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label>
                      <div className="relative group">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
                        <input required name="name" type="text" placeholder="Ex: Anderson Silva" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 focus:bg-white font-bold text-slate-700" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">RG / RE</label>
                      <div className="relative group">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required name="re" type="text" placeholder="000.000-0" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 focus:bg-white font-mono font-bold text-slate-600" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Posto/Graduação</label>
                      <select name="posto" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 font-bold text-slate-600 cursor-pointer">
                        <option>Sd. QP PM</option>
                        <option>Cb. QP PM</option>
                        <option>3º Sgt. QP PM</option>
                        <option>2º Sgt. QP PM</option>
                        <option>1º Sgt. QP PM</option>
                        <option>Subtenente QP PM</option>
                        <option>Tenente / Oficial</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Unidade</label>
                      <input required name="unidade" type="text" defaultValue="17º BPM" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 font-bold text-slate-700" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nível de Acesso</label>
                      <select name="nivel" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 font-black text-blue-600 cursor-pointer">
                        <option value="Operador">Operador</option>
                        <option value="Gestor">Gestor</option>
                        <option value="Admin">Administrador</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Institucional</label>
                      <div className="relative group">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required name="email" type="email" placeholder="militar@pm.pr.gov.br" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 font-bold text-slate-700" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Senha de Acesso</label>
                      <div className="relative group">
                        <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required name="password" type="password" placeholder="Mínimo 6 dígitos" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 font-bold text-slate-600" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Categoria</label>
                      <select name="categoria" required className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-400 font-bold text-slate-600 cursor-pointer">
                        <option value="armamento">Armamento</option>
                        <option value="veiculo">Viatura</option>
                        <option value="comunicacao">Comunicação</option>
                        <option value="municao">Munição</option>
                        <option value="sade">SADE</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Descrição</label>
                      <input required name="descricao" type="text" placeholder="Ex: Pistola BERETTA APX 9mm" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-400 font-bold text-slate-700 uppercase" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nº PMPR</label>
                      <input name="pmpr" type="text" placeholder="P00XXX" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-400 font-mono font-bold text-emerald-600 uppercase" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nº de Série</label>
                      <input name="serie" type="text" placeholder="Série do Fabricante" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-400 font-mono font-bold text-slate-600 uppercase" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Quantidade</label>
                      <input required name="quantidade" type="number" min="1" defaultValue="1" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-400 font-black text-slate-700" />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* AÇÕES FINAIS */}
          <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
            {!isLoading && (
              <ActionButton 
                type="submit"
                disabled={isSaving}
                icon={isSaving ? Loader2 : Save}
                label={isSaving ? "Gravando..." : `Concluir Cadastro`}
                className="px-8 py-2.5 text-[10px] h-auto shadow-lg"
                variant={abaAtiva === "militar" ? "primary" : "success"}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}