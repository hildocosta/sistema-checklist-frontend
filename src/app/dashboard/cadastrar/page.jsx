"use client";

import { useState, useEffect } from "react";
import { 
  UserPlus, Shield, CheckCircle2, PackagePlus, Hash, FileText, 
  Layers, Archive, Mail, Phone, Building2, User, Save, Loader2, KeyRound, AlertCircle
} from "lucide-react";

import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import Skeleton from "../../../components/Skeleton";

export default function CadastrarPage() {
  const [abaAtiva, setAbaAtiva] = useState("militar");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ tipo: "", msg: "" });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
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
      
      {feedback.msg && (
        <div className={`fixed top-20 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg font-bold text-xs animate-in slide-in-from-right-5 ${
          feedback.tipo === "sucesso" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {feedback.tipo === "sucesso" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {feedback.msg}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end px-2 gap-4">
        <div>
          <Breadcrumb itemAtual="Novo Cadastro" />
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Gestão de Entradas</h1>
        </div>

        <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
          <button 
            type="button"
            onClick={() => setAbaAtiva("militar")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              abaAtiva === "militar" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <UserPlus size={12} strokeWidth={3} /> Militar
          </button>
          <button 
            type="button"
            onClick={() => setAbaAtiva("item")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              abaAtiva === "item" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <PackagePlus size={12} strokeWidth={3} /> Novo Item
          </button>
        </div>
      </div>

      {/* AJUSTE: p-5 em vez de p-6 para reduzir o tamanho total do card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-5">
          {isLoading ? (
            <div className="space-y-6">
               <Skeleton className="h-8 w-48 rounded-lg" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* AJUSTE: mb-4 e pb-3 para encurtar o cabeçalho interno */}
              <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
                {abaAtiva === "militar" ? (
                  <>
                    <Shield size={16} className="text-blue-600" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Dados do Novo Usuário</h3>
                  </>
                ) : (
                  <>
                    <Archive size={16} className="text-emerald-600" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Inclusão de Carga (Material)</h3>
                  </>
                )}
              </div>

              {/* AJUSTE: gap-3 em vez de gap-4 para aproximar os campos */}
              {abaAtiva === "militar" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required name="name" type="text" placeholder="Ex: Anderson Silva" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all font-medium text-slate-700" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">RG (Registro Geral)</label>
                    <div className="relative">
                      <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required name="re" type="text" placeholder="000.000-0" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-mono font-bold text-slate-600" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Posto/Graduação</label>
                    <select name="posto" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-bold text-slate-600 cursor-pointer">
                      <option>Sd. QP PM</option>
                      <option>Cb. QP PM</option>
                      <option>3º Sgt. QP PM</option>
                      <option>2º Sgt. QP PM</option>
                      <option>1º Sgt. QP PM</option>
                      <option>Subtenente QP PM</option>
                      <option>Asp. Of. PM</option>
                      <option>2º Ten. QOEM PM</option>
                      <option>Cap. QOEM PM</option>
                      <option>Major QOEM PM</option>
                      <option>Ten.-Cel. QOEM PM</option>
                      <option>Cel. QOEM PM</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Unidade (Lotação)</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required name="unidade" type="text" defaultValue="17º BPM" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nível de Acesso</label>
                    <select name="nivel" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-black text-blue-600 cursor-pointer">
                      <option value="Operador">Operador (Checklist)</option>
                      <option value="Gestor">Gestor</option>
                      <option value="Admin">Administrador</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Institucional</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required name="email" type="email" placeholder="militar@pm.pr.gov.br" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Senha de Acesso</label>
                    <div className="relative">
                      <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required name="password" type="password" placeholder="Mínimo 6 dígitos" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-bold text-slate-600" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Telefone (WhatsApp)</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="telefone" type="tel" placeholder="(41) 99999-9999" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-bold text-slate-600" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Categoria</label>
                    <div className="relative">
                      <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select name="categoria" required className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-bold text-slate-600 cursor-pointer appearance-none">
                        <option value="armamento">Armamento</option>
                        <option value="veiculo">Viatura</option>
                        <option value="sade">SADE</option>
                        <option value="acessoriosade">Acessórios SADE</option>
                        <option value="comunicacao">Comunicação</option>
                        <option value="municao">Munição</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Descrição do Equipamento</label>
                    <div className="relative">
                      <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required name="descricao" type="text" placeholder="Ex: Pistola BERETTA APX 9mm" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nº PMPR</label>
                    <div className="relative">
                      <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="pmpr" type="text" placeholder="P44XXX" className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-mono font-bold text-blue-600 uppercase" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nº de Série</label>
                    <input name="serie" type="text" placeholder="Ex: AA094019B" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-mono font-bold text-slate-600 uppercase" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Quantidade</label>
                    <input required name="quantidade" type="number" min="1" defaultValue="1" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-black text-slate-700" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AJUSTE: mt-6 e pt-4 para reduzir o espaço inferior final */}
          <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
            {!isLoading && (
              <ActionButton 
                type="submit"
                disabled={isSaving}
                icon={isSaving ? Loader2 : Save}
                label={isSaving ? "Gravando..." : `Concluir Cadastro`}
                className="px-8 py-2.5 text-xs h-auto shadow-md"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}