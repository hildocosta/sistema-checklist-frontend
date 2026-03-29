"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  FileText, 
  Download, 
  Printer, 
  Loader2, 
  Calendar as CalendarIcon, 
  Sun, 
  Moon, 
  Search,
  ChevronRight,
  Filter
} from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Componentes Reutilizáveis
import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import DataTable from "../../../components/DataTable";
import StatusBadge from "../../../components/StatusBadge";
import Skeleton from "../../../components/Skeleton";

export default function RelatoriosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
  const [filtroData, setFiltroData] = useState("");

  // Dados Simulados de Relatórios Realizados
  const listaRelatorios = [
    { id: 1, data: "2026-03-29", turno: "Matutino", responsavel: "Sgt. Anderson", itens: 42, status: "Finalizado" },
    { id: 2, data: "2026-03-28", turno: "Noturno", responsavel: "Sgt. Castro", itens: 38, status: "Finalizado" },
    { id: 3, data: "2026-03-28", turno: "Matutino", responsavel: "Sgt. Silva", itens: 40, status: "Finalizado" },
    { id: 4, data: "2026-03-27", turno: "Noturno", responsavel: "Cabo Oliveira", itens: 35, status: "Finalizado" },
  ];

  // Dados do conteúdo do relatório selecionado
  const dadosMockRelatorio = [
    { item: "Viatura prefixo 14902", condicao: "Operacional", obs: "Sem avarias" },
    { item: "Carregadores Beretta (02 un)", condicao: "Completo", obs: "Municiado" },
    { item: "Colete Balístico", condicao: "Vencimento 2028", obs: "Em ordem" },
    { item: "Rádio HT Motorola", condicao: "Operacional", obs: "Bateria 100%" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setRelatorioSelecionado(listaRelatorios[0]); // Seleciona o mais recente por padrão
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="animate-in fade-in duration-700 space-y-8 print:space-y-0">
      
      <style jsx global>{`
        @media print {
          aside, nav, header, .no-print, .sidebar-relatorios, .header-acoes { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
          .report-card { border: none !important; box-shadow: none !important; width: 100% !important; }
        }
      `}</style>

      {/* --- HEADER DE AÇÕES --- */}
      <div className="header-acoes flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <Breadcrumb itemAtual="Arquivo de Relatórios" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Histórico de Conferência</h1>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Consulta de turnos e exportação de PDF</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase shadow-sm hover:bg-slate-50 transition active:scale-95"
          >
            <Printer size={16} /> Imprimir PDF
          </button>
          <ActionButton 
            icon={Download} 
            label="Planilha Geral" 
            onClick={() => {}} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- SIDEBAR DE SELEÇÃO --- */}
        <div className="sidebar-relatorios lg:col-span-4 space-y-6">
          <div className="bg-slate-100/50 p-4 rounded-3xl border border-slate-200/60 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-600 outline-none focus:border-blue-400 transition"
                onChange={(e) => setFiltroData(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Relatórios Recentes</p>
              {isLoading ? (
                [1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
              ) : (
                listaRelatorios.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => setRelatorioSelecionado(rel)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                      relatorioSelecionado?.id === rel.id 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                      : "bg-white border-slate-100 text-slate-600 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${relatorioSelecionado?.id === rel.id ? "bg-white/20" : "bg-slate-50"}`}>
                        {rel.turno === "Matutino" ? <Sun size={18} /> : <Moon size={18} />}
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-tight ${relatorioSelecionado?.id === rel.id ? "text-blue-100" : "text-slate-400"}`}>
                          {new Date(rel.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm font-bold">{rel.turno}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className={relatorioSelecionado?.id === rel.id ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- ÁREA DE VISUALIZAÇÃO DO RELATÓRIO --- */}
        <div className="lg:col-span-8">
          {relatorioSelecionado ? (
            <div className="report-card bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-12 min-h-screen relative overflow-hidden">
              {/* Marca d'água ou Detalhe Lateral */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

              {/* Cabeçalho do Documento */}
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10 mb-10 relative">
                <div className="flex gap-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                     <Image src="/assets/image/bg-profile.png" alt="Brasão" width={56} height={56} className="grayscale" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-tight">Relatório de Carga e Turno</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">17º Batalhão de Polícia Militar</p>
                    <div className="flex gap-4 mt-3">
                       <span className="flex items-center gap-1.5 text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">
                         <CalendarIcon size={12} /> {new Date(relatorioSelecionado.data).toLocaleDateString('pt-BR')}
                       </span>
                       <span className="flex items-center gap-1.5 text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase">
                         {relatorioSelecionado.turno === "Matutino" ? <Sun size={12} /> : <Moon size={12} />} {relatorioSelecionado.turno}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocolo Digital</p>
                  <p className="text-sm font-mono font-bold text-slate-400">#2026-BPM17-{relatorioSelecionado.id.toString().padStart(4, '0')}</p>
                </div>
              </div>

              {/* Informações do Responsável */}
              <div className="grid grid-cols-2 gap-10 mb-12 text-left bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Militar Responsável</p>
                  <p className="text-sm font-bold text-slate-700">{relatorioSelecionado.responsavel}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seção / Destino</p>
                  <p className="text-sm font-bold text-slate-700">P4 - Logística / Patrulha Urbana</p>
                </div>
              </div>

              {/* Tabela de Itens Conferidos */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2 text-left">
                  <FileText size={14} className="text-blue-600" /> Conferência de Itens de Carga
                </h3>
                
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item / Equipamento</th>
                      <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                      <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosMockRelatorio.map((dado, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                        <td className="py-5 text-sm font-bold text-slate-700">{dado.item}</td>
                        <td className="py-5 text-center">
                          <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg uppercase tracking-tighter">
                            {dado.condicao}
                          </span>
                        </td>
                        <td className="py-5 text-right text-xs font-medium text-slate-500 italic">{dado.obs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Assinatura Digital / Rodapé */}
              <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center">
                <div className="text-left">
                  <div className="w-48 h-px bg-slate-300 mb-2"></div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Assinatura do Graduado de Dia</p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Autenticado via Sistema GIM</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400">PMPR - 17º BPM - São José dos Pinhais</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
               <FileText size={48} className="mb-4 opacity-20" />
               <p className="font-bold uppercase tracking-widest text-sm">Selecione um relatório para visualizar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}