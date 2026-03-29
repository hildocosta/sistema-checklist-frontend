"use client";
import { useState, useEffect } from "react";
import { 
  UserPlus, 
  Shield, 
  CheckCircle2,
  PackagePlus,
  Hash,
  FileText,
  Layers,
  Archive,
  Mail,
  Phone,
  MapPin,
  Building2
} from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import Skeleton from "../../../components/Skeleton";

export default function CadastrarPage() {
  const [abaAtiva, setAbaAtiva] = useState("militar");
  const [formEnviado, setFormEnviado] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setFormEnviado(true);
      setTimeout(() => setFormEnviado(false), 3000);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-8 text-left">
      
      {formEnviado && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 font-bold text-sm border border-white/20">
          <CheckCircle2 size={20} strokeWidth={3} /> Cadastro realizado com sucesso!
        </div>
      )}

      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Breadcrumb itemAtual="Novo Cadastro" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Gestão de Entradas</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Inclusão de Efetivo ou Materiais de Carga no 17º BPM.</p>
        </div>

        <div className="flex gap-2 p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-inner">
          <button 
            type="button"
            onClick={() => setAbaAtiva("militar")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              abaAtiva === "militar" ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <UserPlus size={14} strokeWidth={3} /> Militar
          </button>
          <button 
            type="button"
            onClick={() => setAbaAtiva("item")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              abaAtiva === "item" ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <PackagePlus size={14} strokeWidth={3} /> Novo Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 to-cyan-400 opacity-20"></div>
        
        <form onSubmit={handleSubmit} className="p-10">
          {isLoading ? (
            <div className="space-y-10">
               <Skeleton className="h-12 w-48 rounded-2xl" />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
               </div>
            </div>
          ) : (
            abaAtiva === "militar" ? (
              /* FORMULÁRIO MILITAR */
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100"><Shield size={20} strokeWidth={2.5} /></div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Dados do Efetivo</h2>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mt-1 italic">Vínculo Direto com o 17º BPM</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nome Completo</label>
                    <input required type="text" placeholder="Ex: Anderson Silva" className="w-full h-13.5 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-medium text-slate-700 shadow-xs"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">RE (Registro Estadual)</label>
                    <input required type="text" placeholder="000.000-0" className="w-full h-13.5 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-mono font-bold text-slate-600 shadow-xs"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Posto/Graduação</label>
                    <select className="w-full h-13.5 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-bold text-slate-600 cursor-pointer shadow-xs">
                      <option>Soldado</option>
                      <option>Cabo</option>
                      <option>3º Sargento</option>
                      <option>2º Sargento</option>
                      <option>1º Sargento</option>
                      <option>Subtenente</option>
                      <option>Oficial</option>
                    </select>
                  </div>
                  
                  {/* LOTAÇÃO */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Lotação (Unidade)</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input required type="text" defaultValue="17º BPM - São José dos Pinhais" className="w-full h-13.5 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-medium text-slate-700 shadow-xs"/>
                    </div>
                  </div>

                  {/* SETOR */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Setor / Seção</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input required type="text" defaultValue="P4 - Logística" className="w-full h-13.5 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-medium text-slate-700 shadow-xs"/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nível de Acesso</label>
                    <select className="w-full h-13.5 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-black text-blue-600 cursor-pointer shadow-xs">
                      <option>Operador (Checklist)</option>
                      <option>Gestor de Logística</option>
                      <option>Administrador SJD</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">E-mail Institucional</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input required type="email" placeholder="militar@pm.pr.gov.br" className="w-full h-13.5 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-medium text-slate-700 shadow-xs"/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Telefone (WhatsApp)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input required type="tel" placeholder="(41) 99999-9999" className="w-full h-13.5 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-bold text-slate-600 shadow-xs"/>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* FORMULÁRIO DE ITEM (CARGA) */
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><Archive size={20} strokeWidth={2.5} /></div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Inclusão de Carga (Material)</h2>
                    <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-tight mt-1 italic">Módulo de Inventário Consolidado</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Categoria do Item</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <select required className="w-full h-13.5 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-bold text-slate-600 cursor-pointer shadow-xs appearance-none">
                        <option value="armamento">Armamento</option>
                        <option value="veiculo">Viatura</option>
                        <option value="sade">SADE</option>
                        <option value="acessoriosade">Acessórios SADE</option>
                        <option value="comunicacao">Comunicação</option>
                        <option value="municao">Munição</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Descrição do Equipamento</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input required type="text" placeholder="Ex: Pistola BERETTA APX 9mm" className="w-full h-13.5 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-medium text-slate-700 shadow-xs"/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nº PMPR</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="P44XXX" className="w-full h-13.5 pl-12 pr-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-mono font-bold text-blue-600 shadow-xs uppercase"/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Nº de Série</label>
                    <input required type="text" placeholder="Ex: AA094019B" className="w-full h-13.5 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-mono font-bold text-slate-600 shadow-xs uppercase"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Quantidade</label>
                    <input required type="number" min="1" defaultValue="1" className="w-full h-13.5 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-300 outline-none font-black text-slate-700 shadow-xs"/>
                  </div>
                </div>
              </div>
            )
          )}

          <div className="mt-16 pt-8 border-t border-slate-50 flex justify-end">
            {!isLoading && (
              <ActionButton 
                type="submit"
                disabled={isSaving}
                label={isSaving ? "Gravando..." : `Concluir Cadastro de ${abaAtiva === "militar" ? "Militar" : "Equipamento"}`}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}