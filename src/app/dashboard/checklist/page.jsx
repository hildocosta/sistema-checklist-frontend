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

  const responsavelFormatado = session?.user?.name 
    ? `${session.user.posto || "Sd. QP PM"} ${session.user.name} - RG ${session.user.re || "000.000-0"}`
    : "RESPONSÁVEL NÃO IDENTIFICADO";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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

  const itensExibidos = useMemo(() => items.filter(item => item.cat === abaAtiva), [items, abaAtiva]);

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
      toast.error("Conferência Incompleta", { description: "Marque todos os itens como conferidos." });
      return;
    }

    const toastId = toast.loading("Gerando relatório oficial...");

    try {
      const doc = new jsPDF();
      const agora = new Date();
      const dataFormatada = agora.toLocaleDateString('pt-BR');
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const hashValidacao = await gerarHashValidacao(`${responsavelFormatado}-${agora.getTime()}`);
      const urlValidacao = `https://gestao-17bpm.vercel.app/validar/${hashValidacao}`;
      const qrCodeDataUrl = await QRCode.toDataURL(urlValidacao);

      // Cabeçalho Institucional
      doc.setFontSize(10).setFont("helvetica", "bold").text("POLÍCIA MILITAR DO PARANÁ", 105, 15, { align: "center" });
      doc.setFontSize(9).setFont("helvetica", "normal").text("6º COMANDO REGIONAL DE POLÍCIA MILITAR", 105, 21, { align: "center" });
      doc.text("17º BATALHÃO DE POLÍCIA MILITAR", 105, 27, { align: "center" });
      doc.setFontSize(8).text("QUARTA SEÇÃO - ALMOXARIFADO / FURRIELAÇÃO", 105, 33, { align: "center" });
      doc.setFontSize(12).setFont("helvetica", "bold").text("RELATÓRIO DIÁRIO DE CONFERÊNCIA DE CARGA", 105, 45, { align: "center" });

      doc.setDrawColor(203, 213, 225).line(15, 48, 195, 48);
      doc.setFontSize(8).setFont("helvetica", "normal").setTextColor(100, 116, 139).text(`Emissão: ${dataFormatada} às ${horaFormatada}`, 15, 55);
      doc.setFont("helvetica", "bold").setTextColor(30, 41, 59).text(`Responsável: ${responsavelFormatado}`, 15, 60);

      let currentY = 70;

      categorias.forEach(categoria => {
        const itensDaCat = items.filter(i => i.cat === categoria.id);
        if (itensDaCat.length === 0) return;

        if (currentY > 240) { doc.addPage(); currentY = 20; }

        doc.setFillColor(37, 99, 235).rect(15, currentY, 2, 8, 'F'); 
        doc.setFillColor(241, 245, 249).rect(17, currentY, 178, 8, 'F');
        doc.setFontSize(9).setFont("helvetica", "bold").setTextColor(30, 41, 59).text(categoria.label.toUpperCase(), 22, currentY + 5.5);

        const tableData = itensDaCat.map((item, idx) => [
          String(idx + 1).padStart(2, '0'),
          item.qtd,
          { content: `${item.desc}\nSÉRIE: ${item.serie}`, styles: { fontStyle: 'bold' } },
          item.pmpr || "---",
          item.pagLivro || "---", // Coluna LIVRO/PÁG
          item.cautela || "DISPONÍVEL",
          "OK"
        ]);

        autoTable(doc, {
          startY: currentY + 10,
          head: [["ORD", "QTD", "EQUIPAMENTO / ESPECIFICAÇÃO", "PMPR", "LIVRO/PÁG", "OBS", "CONF."]],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [30, 41, 59], fontSize: 7, halign: 'center' },
          styles: { fontSize: 7, valign: 'middle' },
          columnStyles: { 
            0: { cellWidth: 10, halign: 'center' }, 
            1: { cellWidth: 10, halign: 'center' }, 
            2: { cellWidth: 60 },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' }, // Largura Livro/Pág
            6: { cellWidth: 12, textColor: [22, 163, 74], fontStyle: 'bold', halign: 'center' } 
          }
        });

        currentY = doc.lastAutoTable.finalY + 15;
      });

      // Assinatura e QR Code
      const pageHeight = doc.internal.pageSize.height;
      if (currentY > pageHeight - 60) { doc.addPage(); currentY = 30; }

      doc.line(60, currentY + 20, 150, currentY + 20);
      doc.setFontSize(8).setFont("helvetica", "bold").text("Assinatura do Responsável (Digital)", 105, currentY + 25, { align: "center" });
      doc.addImage(qrCodeDataUrl, 'PNG', 165, currentY + 10, 25, 25);
      doc.setFont("helvetica", "italic").setFontSize(7).setTextColor(148, 163, 184).text(`ID: ${hashValidacao}`, 105, currentY + 30, { align: "center" });

      const pdfBase64 = doc.output('datauristring');
      const fileName = `Checklist_17BPM_${dataFormatada.replace(/\//g, '-')}.pdf`;

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64, fileName, data: dataFormatada, hora: horaFormatada, hash: hashValidacao, responsavel: responsavelFormatado }),
      });

      if (response.ok) {
        doc.save(fileName);
        toast.success("Relatório processado e salvo!", { id: toastId });
      }
    } catch (error) { 
      toast.error("Erro ao gerar PDF: " + error.message, { id: toastId }); 
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6 p-4">
      <Toaster richColors position="top-right" />
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <Breadcrumb itemAtual="Checklist Diário" />
          <h1 className="text-xl font-bold text-slate-700">Furrielação: Gestão de Carga</h1>
        </div>
        <div className="flex gap-2">
          <ActionButton icon={RotateCcw} label="Resetar" onClick={handleReset} variant="outline" />
          <SecondaryButton icon={Printer} label="Gerar & Enviar" onClick={gerarPDF} disabled={!isConferenciaCompleta} />
        </div>
      </div>

      {/* PROGRESSO */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Progresso</span>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${porcentagemProgresso}%` }} />
        </div>
        <span className="text-sm font-black text-blue-600">{porcentagemProgresso}%</span>
      </div>

      {/* TABS NAVEGAÇÃO */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setAbaAtiva(cat.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all
              ${abaAtiva === cat.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <cat.icon size={14} /> {cat.label}
            {getPendencias(cat.id) > 0 && <span className="ml-1 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[9px]">{getPendencias(cat.id)}</span>}
          </button>
        ))}
      </div>

      {/* TABELA DE ITENS */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
        {isLoading ? <div className="p-10 text-center text-slate-400">Carregando Inventário...</div> : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-[10px] text-slate-400 uppercase w-[5%]">Ord</th>
                <th className="p-4 text-[10px] text-slate-400 uppercase w-[5%]">Qnt</th>
                <th className="p-4 text-[10px] text-slate-400 uppercase w-[25%] text-left">Equipamento / Série</th>
                <th className="p-4 text-[10px] text-slate-400 uppercase w-[15%]">Nº PMPR</th>
                <th className="p-4 text-[10px] text-slate-400 uppercase w-[30%] text-left">Cautela / Observações</th>
                <th className="p-4 text-[10px] text-slate-400 uppercase w-[10%]">Livro/Pág</th>
                <th className="p-4 text-[10px] text-slate-400 uppercase w-[10%] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {itensExibidos.map((item) => (
                <RowChecklist key={item.id} item={item} onToggle={() => handleToggleStatus(item.id)} onUpdate={(upd) => handleUpdateItem(item.id, upd)} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* RODAPÉ FINALIZAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Save size={20}/></div>
          <div className="text-left"><p className="text-[10px] font-bold text-slate-400 uppercase">Responsável</p><p className="text-xs font-bold text-slate-600">{responsavelFormatado}</p></div>
        </div>
        <ActionButton 
          icon={isConferenciaCompleta ? CheckCircle2 : AlertTriangle}
          label={isConferenciaCompleta ? "Finalizar e Gerar PDF" : "Pendências Restantes"}
          onClick={gerarPDF}
          disabled={!isConferenciaCompleta}
          variant={isConferenciaCompleta ? "success" : "disabled"}
          className="px-12 h-12"
        />
      </div>

      <button onClick={scrollToTop} className={`fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-all ${showBackToTop ? "opacity-100" : "opacity-0"}`}><ChevronUp size={20}/></button>
    </div>
  );
}

function RowChecklist({ item, onToggle, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState(item.cautela || "");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredEfetivo = useMemo(() => {
    if (!searchTerm) return [];
    return EFETIVO_17BPM.filter(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || m.re.includes(searchTerm)).slice(0, 5);
  }, [searchTerm]);

  return (
    <tr className={`transition-colors ${item.status === 'ok' ? 'bg-emerald-50/10' : ''}`}>
      <td className="p-4 text-xs font-bold text-slate-400 text-center">#{item.id}</td>
      <td className="p-4 text-center"><span className="px-2 py-1 bg-slate-100 rounded font-bold text-xs">{item.qtd}</span></td>
      <td className="p-4">
        <p className="text-[11px] font-bold text-slate-700 uppercase leading-tight">{item.desc}</p>
        <p className="text-[9px] font-mono text-blue-600 font-bold mt-1">SÉRIE: {item.serie}</p>
      </td>
      <td className="p-4 text-center"><span className="text-xs font-mono font-bold text-slate-500">{item.pmpr || "---"}</span></td>
      <td className="p-4">
        <div className="relative">
          <input 
            type="text" value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); onUpdate({ cautela: e.target.value }); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Militar ou Observação..."
            className="w-full pl-3 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-blue-200"
          />
          {showDropdown && filteredEfetivo.length > 0 && (
            <div className="absolute z-50 w-full bg-white border rounded-xl shadow-xl mt-1">
              {filteredEfetivo.map(m => (
                <button key={m.id} onMouseDown={() => { const val = `${m.nome} (${m.re})`; setSearchTerm(val); onUpdate({ cautela: val }); setShowDropdown(false); }} 
                  className="w-full p-2 text-left text-xs hover:bg-blue-50 border-b last:border-0">{m.nome} <span className="text-slate-400">RE {m.re}</span></button>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-1 border-b border-slate-100">
          <BookOpen size={10} className="text-slate-300"/>
          <input 
            type="text" value={item.pagLivro || ""} 
            onChange={(e) => onUpdate({ pagLivro: e.target.value })}
            placeholder="-" className="w-10 text-center text-xs font-bold text-slate-600 bg-transparent outline-none"
          />
        </div>
      </td>
      <td className="p-4 text-right">
        <button onClick={onToggle} className={`p-2 rounded-lg border transition-all ${item.status === 'ok' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-200'}`}>
          <ClipboardCheck size={18} />
        </button>
      </td>
    </tr>
  );
}