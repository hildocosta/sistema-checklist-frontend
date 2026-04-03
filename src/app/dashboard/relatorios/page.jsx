"use client";
import { useState, useEffect } from "react";
import { 
  FileText, ExternalLink, Loader2, 
  Search, ChevronRight, AlertCircle,
  Printer
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Componentes Reutilizáveis
import Breadcrumb from "../../../components/Breadcrumb";
import Skeleton from "../../../components/Skeleton";
import SecondaryButton from "../../../components/SecondaryButton";

export default function RelatoriosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [listaRelatorios, setListaRelatorios] = useState([]);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
  const [filtroData, setFiltroData] = useState("");

  // 1. BUSCA DE DADOS REAIS DO PRISMA
  const fetchRelatorios = async (data = "") => {
    setIsLoading(true);
    try {
      const url = data ? `/api/relatorios?data=${data}` : '/api/relatorios';
      const response = await fetch(url);
      const dados = await response.json();
      
      if (response.ok) {
        setListaRelatorios(dados);
        if (dados.length > 0) setRelatorioSelecionado(dados[0]);
        else setRelatorioSelecionado(null);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o banco de dados Neon.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, []);

  const handleFilterDate = (e) => {
    const date = e.target.value; 
    setFiltroData(date);
    if (!date) {
      fetchRelatorios();
      return;
    }
    const dataFormatada = date.split('-').reverse().join('/');
    fetchRelatorios(dataFormatada); 
  };

  const handleOpenNewTab = () => {
    if (relatorioSelecionado?.pdfUrl) {
      window.open(relatorioSelecionado.pdfUrl, '_blank');
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-8 h-screen flex flex-col p-4 md:p-8 overflow-hidden">
      <Toaster richColors position="top-right" />
      
      {/* --- HEADER DE AÇÕES --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <Breadcrumb itemAtual="Arquivo de Relatórios" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Histórico de Conferência</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
            Repositório de Documentos Oficiais - 17º BPM
          </p>
        </div>

        <div className="flex gap-3">
          {/* APLICAÇÃO DO COMPONENTE REUTILIZÁVEL */}
          <SecondaryButton 
            icon={Printer}
            label="Imprimir Original"
            onClick={handleOpenNewTab}
            disabled={!relatorioSelecionado?.pdfUrl}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">
        
        {/* --- SIDEBAR DE SELEÇÃO (ESQUERDA) --- */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden min-h-0">
          <div className="bg-slate-100/50 p-4 rounded-[2.5rem] border border-slate-200/60 flex flex-col h-full overflow-hidden">
            
            {/* Busca por Data */}
            <div className="relative mb-6 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                value={filtroData}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                onChange={handleFilterDate}
              />
            </div>

            {/* Lista de Cards com Ajuste de Scroll */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest mb-3">Registros Localizados</p>
              
              {isLoading ? (
                [1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
              ) : listaRelatorios.length > 0 ? (
                listaRelatorios.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => setRelatorioSelecionado(rel)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group gap-3 ${
                      relatorioSelecionado?.id === rel.id 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                      : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`shrink-0 p-2.5 rounded-xl ${relatorioSelecionado?.id === rel.id ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}`}>
                        <FileText size={20} />
                      </div>
                      
                      <div className="flex flex-col overflow-hidden min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${relatorioSelecionado?.id === rel.id ? "text-blue-100" : "text-slate-400"}`}>
                          {rel.data} • {rel.hora}
                        </p>
                        <p className="text-sm font-bold truncate leading-tight">
                          {rel.responsavel.split('-')[0]}
                        </p>
                        <p className={`text-[9px] font-mono mt-0.5 truncate ${relatorioSelecionado?.id === rel.id ? "text-blue-200" : "text-slate-300"}`}>
                          ID: {rel.hash.substring(0,16)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <ChevronRight size={18} className={`transition-opacity ${relatorioSelecionado?.id === rel.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-20">
                  <AlertCircle className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-xs font-bold text-slate-400">Nenhum relatório localizado.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- VISUALIZADOR DO PDF (DIREITA) --- */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
          {relatorioSelecionado ? (
            <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              
              {/* Barra Superior */}
              <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Autenticidade Verificada</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">Documento PDF Armazenado em Nuvem</p>
                  </div>
                </div>
                
                {/* REUTILIZANDO O COMPONENTE NOVAMENTE AQUI */}
                <SecondaryButton 
                  icon={ExternalLink}
                  label="Expandir"
                  onClick={handleOpenNewTab}
                  className="!min-h-[38px] !py-2" // Ajuste pontual para barra interna
                />
              </div>

              {/* Iframe */}
              <div className="flex-1 bg-slate-100 relative overflow-hidden">
                {relatorioSelecionado.pdfUrl ? (
                  <iframe
                    src={`${relatorioSelecionado.pdfUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-none"
                    title="Visualizador de Relatório"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <AlertCircle className="text-amber-500 mb-4" size={48} />
                    <h3 className="text-slate-800 font-bold text-lg">URL do PDF não encontrada</h3>
                    <p className="text-slate-500 text-sm max-w-xs mt-2">
                      O registro existe no banco, mas o link do arquivo está ausente ou expirou.
                    </p>
                  </div>
                )}
              </div>

              {/* Rodapé Interno */}
              <div className="bg-white border-t border-slate-100 p-4 px-8 flex justify-between items-center shrink-0">
                <p className="text-[9px] font-mono text-slate-400 truncate max-w-[60%]">
                  HASH DE SEGURANÇA: {relatorioSelecionado.hash}
                </p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                  PMPR • 17º BPM • FURRIELAÇÃO
                </p>
              </div>

            </div>
          ) : (
            /* Estado Vazio (Loader ou Seleção) */
            <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/30 p-8">
               <div className="bg-white p-10 rounded-full shadow-sm mb-6">
                 <Loader2 size={56} className={`${isLoading ? 'animate-spin text-blue-500' : 'text-slate-200'}`} />
               </div>
               <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-400">
                 {isLoading ? "Buscando Registros no Neon..." : "Selecione um documento oficial"}
               </p>
               <p className="text-xs text-slate-300 mt-2 font-medium max-w-xs text-center">
                 Acesse o histórico completo de conferências diárias de carga e armamento.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}