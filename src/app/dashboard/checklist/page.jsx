"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  ClipboardCheck, Printer, Save, 
  Search, BookOpen, AlertTriangle,
  RotateCcw, CheckCircle2, ShieldCheck,
  Zap, Package, Radio, CarFront, Box, PlugZap,
  Activity, Flashlight, Layers, Smartphone,
  ChevronUp 
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode"; 

// --- IMPORTAÇÃO DOS DADOS ---
import { INVENTARIO_COMPLETO, EFETIVO_17BPM } from "../../../data/inventario/index";

// Componentes de interface
import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import SecondaryButton from "../../../components/SecondaryButton";
import Skeleton from "../../../components/Skeleton";

export default function ChecklistPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState(INVENTARIO_COMPLETO);
  const [isLoading, setIsLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("armamento");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // --- LÓGICA DA BARRA DE PROGRESSO ---
  const totalItens = items.length;
  const itensConcluidos = items.filter(i => i.status === "ok").length;
  const porcentagemProgresso = totalItens > 0 ? Math.round((itensConcluidos / totalItens) * 100) : 0;

  // --- DADOS DO RESPONSÁVEL VIA SESSION ---
  const responsavelFormatado = session?.user?.name 
    ? `${session.user.posto || "Sd. QP PM"} ${session.user.name} - RG ${session.user.re || "000.000-0"}`
    : "1º SGT ANDERSON SILVA - RE 123.456-7";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categorias = [
    { id: "armamento", label: "Armas", icon: ShieldCheck },
    { id: "municao", label: "Munições", icon: Layers },
    { id: "taser", label: "Taser", icon: Zap },
    { id: "equipamento", label: "Equip", icon: Package },
    { id: "comunicacao", label: "Rádios", icon: Radio },
    { id: "veiculo", label: "Viaturas", icon: CarFront },
    { id: "sade", label: "Sade", icon: Smartphone },
    { id: "acessoriosade", label: "Aces SADE", icon: PlugZap  },
  ];

  const getPendencias = (catId) => items.filter(i => i.cat === catId && i.status !== "ok").length;
  const isConferenciaCompleta = items.every(item => item.status === "ok");

  const itensExibidos = useMemo(() => {
    return items.filter(item => item.cat === abaAtiva);
  }, [items, abaAtiva]);

  const handleUpdateItem = (id, updates) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleToggleStatus = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === "ok" ? "pendente" : "ok" } : item
    ));
  };

  const handleReset = () => {
    setItems(INVENTARIO_COMPLETO);
    toast.info("Checklist resetado com sucesso.");
  };

  const gerarHashValidacao = async (dados) => {
    const msgUint8 = new TextEncoder().encode(dados);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 24).toUpperCase();
  };

  const gerarPDF = async () => {
    if (!isConferenciaCompleta) {
      toast.error("Conferência Incompleta", {
        description: "Marque todos os itens de TODAS as abas como conferidos.",
        icon: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    const toastId = toast.loading("Gerando e enviando relatório institucional...");

    try {
      const doc = new jsPDF();
      const agora = new Date();
      const dataFormatada = agora.toLocaleDateString('pt-BR');
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const hashValidacao = await gerarHashValidacao(`${responsavelFormatado}-${agora.getTime()}`);
      const urlValidacao = `https://pmpf.pr.gov.br/validar/${hashValidacao}`;
      const qrCodeDataUrl = await QRCode.toDataURL(urlValidacao);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("POLÍCIA MILITAR DO PARANÁ", 105, 15, { align: "center" });
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("6º COMANDO REGIONAL DE POLÍCIA MILITAR", 105, 21, { align: "center" });
      doc.text("17º BATALHÃO DE POLÍCIA MILITAR", 105, 27, { align: "center" });
      
      doc.setFontSize(8);
      doc.text("QUARTA SEÇÃO - ALMOXARIFADO / FURRIELAÇÃO", 105, 33, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("RELATÓRIO DIÁRIO DE CONFERÊNCIA DE CARGA", 105, 45, { align: "center" });

      doc.setDrawColor(203, 213, 225);
      doc.line(15, 48, 195, 48);

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Emissão: ${dataFormatada} às ${horaFormatada}`, 15, 55);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(`Responsável: ${responsavelFormatado}`, 15, 60);

      let currentY = 70;

      categorias.forEach(categoria => {
        const itensDaCat = items.filter(i => i.cat === categoria.id);
        if (itensDaCat.length === 0) return;

        if (currentY > 240) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFillColor(37, 99, 235);
        doc.rect(15, currentY, 2, 8, 'F'); 
        
        doc.setFillColor(241, 245, 249); 
        doc.rect(17, currentY, 178, 8, 'F');

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(categoria.label.toUpperCase(), 22, currentY + 5.5);
        
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`(${itensDaCat.length} ITENS)`, 190, currentY + 5.5, { align: "right" });

        const tableData = itensDaCat.map((item, idx) => [
          String(idx + 1).padStart(2, '0'),
          item.qtd,
          { content: `${item.desc}\nSÉRIE: ${item.serie}`, styles: { fontStyle: 'bold' } },
          item.pmpr || "---",
          item.cautela || "FURRIELAÇÃO",
          "OK"
        ]);

        autoTable(doc, {
          startY: currentY + 10,
          head: [["ORD", "QTD", "EQUIPAMENTO / ESPECIFICAÇÃO", "PMPR", "OBS", "CONF."]],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [30, 41, 59], fontSize: 7, halign: 'center' },
          styles: { fontSize: 7, valign: 'middle' },
          columnStyles: { 
            0: { cellWidth: 10, halign: 'center' }, 
            1: { cellWidth: 10, halign: 'center' }, 
            3: { halign: 'center' },
            5: { textColor: [22, 163, 74], fontStyle: 'bold', halign: 'center' } 
          }
        });

        currentY = doc.lastAutoTable.finalY + 15;
      });

      const pageHeight = doc.internal.pageSize.height;
      if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = 30;
      }

      doc.setDrawColor(203, 213, 225);
      doc.line(60, currentY + 20, 150, currentY + 20);
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.text("Assinatura do Responsável (Digital)", 105, currentY + 25, { align: "center" });
      
      doc.addImage(qrCodeDataUrl, 'PNG', 165, currentY + 10, 25, 25);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`Autenticidade garantida via sistema - ID: ${hashValidacao}`, 105, currentY + 30, { align: "center" });

      const pdfBase64 = doc.output('datauristring');
      const fileName = `Checklist_17BPM_${dataFormatada.replace(/\//g, '-')}.pdf`;

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          fileName,
          data: dataFormatada,
          hora: horaFormatada,
          hash: hashValidacao,
          responsavel: responsavelFormatado
        }),
      });

      if (response.ok) {
        doc.save(fileName);
        toast.success("Relatório enviado e baixado com sucesso!", { id: toastId });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro no servidor");
      }

    } catch (error) { 
      console.error(error);
      toast.error("Erro no processo: " + error.message, { id: toastId }); 
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6 max-w-full mx-auto p-4 flex flex-col relative">
      <Toaster richColors position="top-right" closeButton />
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* 1. CABEÇALHO E AÇÕES */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
        <div>
          <Breadcrumb itemAtual="Checklist Diário" />
          <h1 className="text-xl font-bold text-slate-700 tracking-tight">Furrielação: Gestão de Carga</h1>
        </div>
        <div className="flex gap-2">
          <ActionButton icon={RotateCcw} label="Resetar" onClick={handleReset} variant="outline" />
          <SecondaryButton icon={Printer} label="Gerar & Enviar" onClick={gerarPDF} disabled={!isConferenciaCompleta} />
        </div>
      </div>

      {/* 2. BARRA DE PROGRESSO */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progresso</span>
            <span className="text-sm font-black text-blue-600 w-8">{porcentagemProgresso}%</span>
          </div>
          
          <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-in-out ${porcentagemProgresso === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
              style={{ width: `${porcentagemProgresso}%` }}
            />
          </div>

          <div className="shrink-0 text-[10px] font-bold text-slate-400">
            {itensConcluidos} / {totalItens} <span className="hidden sm:inline">ITENS</span>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE NAVEGAÇÃO (TABS) - AJUSTADA PARA MOBILE */}
      <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 w-full overflow-hidden">
        <div className="flex flex-row gap-1 w-full overflow-x-auto no-scrollbar">
          {categorias.map((categoria) => {
            const Icon = categoria.icon;
            const pendencias = getPendencias(categoria.id);
            const isActive = abaAtiva === categoria.id;
            
            return (
              <button
                key={categoria.id}
                onClick={() => setAbaAtiva(categoria.id)}
                className={`
                  flex-1 flex shrink-0 items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                  text-[10px] font-bold uppercase tracking-tight transition-all duration-200
                  ${isActive 
                    ? "bg-white text-blue-600 shadow-md border border-blue-100" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/40"}
                `}
              >
                <Icon size={14} className={isActive ? "text-blue-600" : "text-slate-400"} />
                <span className="whitespace-nowrap">{categoria.label}</span>
                {pendencias > 0 && (
                  <span className={`
                    ml-1 px-1.5 py-0.5 rounded-full text-[9px]
                    ${isActive ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}
                  `}>
                    {pendencias}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão Back to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-4 z-[100] p-2 rounded-lg bg-blue-600/80 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-blue-600 active:scale-90 border border-white/20 ${
          showBackToTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-75 pointer-events-none"
        }`}
        title="Voltar ao topo"
      >
        <ChevronUp size={18} strokeWidth={3} />
      </button>

      {/* 4. CONTEÚDO / TABELA */}
      <div className="border border-slate-100 bg-white shadow-sm overflow-x-auto rounded-2xl min-h-[450px]">
        {isLoading ? (
          <div className="bg-white p-6 space-y-4 rounded-2xl">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : (
          <table className="w-full border-collapse table-fixed min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/90 backdrop-blur-sm">
                <th className="px-4 py-4 text-[10px] font-semibold uppercase text-slate-400 w-[5%] text-left">Ord</th>
                <th className="px-2 py-4 text-[10px] font-semibold uppercase text-slate-400 w-[5%] text-center">Qnt</th>
                <th className="px-4 py-4 text-[10px] font-semibold uppercase text-slate-400 w-[25%] text-left">Equipamento / Série</th>
                <th className="px-4 py-4 text-[10px] font-semibold uppercase text-slate-400 w-[15%] text-center">Nº PMPR</th>
                <th className="px-4 py-4 text-[10px] font-semibold uppercase text-slate-400 w-[30%] text-left">Cautela / Observações</th>
                <th className="px-2 py-4 text-[10px] font-semibold uppercase text-slate-400 w-[8%] text-center">Livro/Pág</th>
                <th className="px-4 py-4 text-[10px] font-semibold uppercase text-slate-400 w-[12%] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {itensExibidos.map((item) => (
                <RowChecklist 
                  key={item.id} 
                  item={item} 
                  onToggle={() => handleToggleStatus(item.id)}
                  onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. RODAPÉ DE FINALIZAÇÃO */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center shadow-sm gap-6 shrink-0">
        <div className="flex gap-4 items-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors border ${isConferenciaCompleta ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-blue-50 text-blue-500 border-blue-100'}`}>
             <Save size={24} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Responsável Turno</p>
            <p className="text-sm font-semibold text-slate-600 italic">{responsavelFormatado}</p>
          </div>
        </div>

        <ActionButton 
          icon={isConferenciaCompleta ? CheckCircle2 : AlertTriangle}
          label={isConferenciaCompleta ? "Finalizar Conferência Geral" : "Pendências em Aberto..."}
          onClick={() => isConferenciaCompleta ? gerarPDF() : toast.error("Existem itens não conferidos.")}
          disabled={!isConferenciaCompleta}
          variant={isConferenciaCompleta ? "success" : "disabled"}
          className="h-12 lg:h-14 px-10"
        />
      </div>
    </div>
  );
}

function RowChecklist({ item, onToggle, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState(item.cautela || "");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredEfetivo = useMemo(() => {
    if (!searchTerm) return [];
    return EFETIVO_17BPM.filter(m => 
        m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.re.includes(searchTerm)
      ).slice(0, 5);
  }, [searchTerm]);

  return (
    <tr className={`transition-all duration-300 ${item.status === 'ok' ? 'bg-emerald-50/20' : 'hover:bg-slate-50/50'}`}>
      <td className="px-4 py-4 text-xs font-semibold text-slate-400">#{String(item.id).padStart(2, '0')}</td>
      <td className="px-2 py-4 text-center">
        <div className="inline-flex items-center justify-center w-8 h-8 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-200">
          {item.qtd}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-slate-700 leading-tight mb-1 break-words">{item.desc}</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">SÉRIE:</span>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 leading-none">
              {item.serie}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border border-slate-200 whitespace-nowrap inline-block">
          {item.pmpr || "---"}
        </span>
      </td>
      <td className="px-4 py-4 overflow-visible">
        <div className="relative w-full">
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${searchTerm ? 'text-blue-400' : 'text-slate-300'}`}>
            <Search size={14} />
          </div>
          <input 
            type="text"
            placeholder="Militar ou Obs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              onUpdate({ cautela: e.target.value });
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-medium transition-all outline-none 
              ${searchTerm ? 'bg-white border-blue-200 text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-400 italic'}`}
          />
          {showDropdown && filteredEfetivo.length > 0 && (
            <div className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              {filteredEfetivo.map(m => (
                <button 
                  key={m.id} 
                  onMouseDown={() => {
                    const val = `${m.nome} (${m.re})`;
                    setSearchTerm(val);
                    onUpdate({ cautela: val });
                    setShowDropdown(false);
                  }} 
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 text-xs font-medium text-slate-600 flex justify-between border-b border-slate-50 last:border-0"
                >
                  {m.nome} <span className="text-slate-400 font-mono text-[10px]">RE {m.re}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="px-2 py-4 text-center">
        <div className="relative w-14 mx-auto">
          <BookOpen size={12} className={`absolute left-1 top-1/2 -translate-y-1/2 ${item.pagLivro ? 'text-blue-400' : 'text-slate-300'}`} />
          <input 
            type="text" value={item.pagLivro || ""} placeholder="-"
            onChange={(e) => onUpdate({ pagLivro: e.target.value })}
            className="w-full pl-5 pr-1 py-1.5 bg-transparent border-b border-slate-100 text-xs font-bold text-slate-600 outline-none text-center"
          />
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <button 
          onClick={onToggle} 
          className={`p-1.5 rounded-lg border transition-all ${
            item.status === 'ok' 
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
            : 'bg-white border-slate-200 text-slate-200 hover:text-emerald-400 hover:border-emerald-200'
          }`}
        >
          <ClipboardCheck size={18} strokeWidth={2} />
        </button>
      </td>
    </tr>
  );
}