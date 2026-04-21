"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  ClipboardCheck, Printer, Save, 
  Search, BookOpen, AlertTriangle,
  RotateCcw, CheckCircle2, ShieldCheck,
  Zap, Package, Radio, CarFront, PlugZap, Layers, Smartphone,
  ChevronUp 
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode"; 

import { INVENTARIO_COMPLETO, EFETIVO_17BPM } from "../../../data/inventario/index";

import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import SecondaryButton from "../../../components/SecondaryButton";
import Skeleton from "../../../components/Skeleton";

export default function ChecklistPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [items, setItems] = useState(INVENTARIO_COMPLETO);
  const [isLoading, setIsLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("armamento");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  
  // Ref para impedir que o useEffect de salvamento rode antes da carga de dados
  const dataLoaded = useRef(false);

  const totalItens = items.length;
  const itensConcluidos = items.filter(i => i.status === "ok").length;
  const porcentagemProgresso = totalItens > 0 ? Math.round((itensConcluidos / totalItens) * 100) : 0;

  const responsavelFormatado = session?.user?.name 
    ? `${session.user.posto || "Sd. QP PM"} ${session.user.name} - RG ${session.user.re || "000.000-0"}`
    : "CARREGANDO RESPONSÁVEL...";

  // 1. Lógica de Inicialização (CARGA DE DADOS)
  useEffect(() => {
    if (sessionStatus === "loading") return;

    async function inicializarChecklist() {
      setIsLoading(true);
      const userId = session?.user?.id || 'anon';
      
      try {
        // Tenta buscar do Banco de Dados (API real ou simulação)
        const r = await fetch('/api/checklist/status-turno');
        const data = await r.json().catch(() => ({ exists: false }));

        if (data.exists) {
          setItems(data.items);
          setIsUpdateMode(true);
          toast.success("Retomando conferência do servidor.");
        } else {
          // Backup LocalStorage específico por Usuário
          const savedData = localStorage.getItem(`checklist_backup_${userId}`);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            const isToday = new Date(parsed.timestamp).toDateString() === new Date().toDateString();
            
            if (isToday) {
              setItems(parsed.items);
              toast.info("Progresso local recuperado.");
            }
          }
        }
      } catch (e) {
        console.log("Iniciando novo checklist padrão.");
      } finally {
        dataLoaded.current = true; // Libera o salvamento
        setTimeout(() => setIsLoading(false), 600);
      }
    }

    inicializarChecklist();

    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [session, sessionStatus]);

  // 2. Lógica de Persistência (SALVAMENTO AUTOMÁTICO)
  useEffect(() => {
    // Só salva se a carga inicial já terminou para não sobrescrever com lista vazia
    if (dataLoaded.current && !isLoading && sessionStatus !== "loading") {
      const userId = session?.user?.id || 'anon';
      const backup = {
        timestamp: new Date().toISOString(),
        items: items
      };
      localStorage.setItem(`checklist_backup_${userId}`, JSON.stringify(backup));
    }
  }, [items, isLoading, session, sessionStatus]);

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
    if(confirm("Deseja realmente resetar? Isso apagará o progresso deste turno.")) {
      const userId = session?.user?.id || 'anon';
      setItems(INVENTARIO_COMPLETO);
      localStorage.removeItem(`checklist_backup_${userId}`);
      setIsUpdateMode(false);
      toast.info("Checklist resetado com sucesso.");
    }
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
        description: "Marque todos os itens como conferidos.",
        icon: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    const toastId = toast.loading(isUpdateMode ? "Atualizando..." : "Enviando relatório...");

    try {
      const doc = new jsPDF();
      const agora = new Date();
      const dataFormatada = agora.toLocaleDateString('pt-BR');
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const hashValidacao = await gerarHashValidacao(`${responsavelFormatado}-${agora.getTime()}`);
      const qrCodeDataUrl = await QRCode.toDataURL(`https://sistema-17bpm.vercel.app/validar/${hashValidacao}`);

      // Cabeçalho institucional
      doc.setFontSize(10).setFont("helvetica", "bold").text("POLÍCIA MILITAR DO PARANÁ", 105, 15, { align: "center" });
      doc.setFontSize(9).setFont("helvetica", "normal").text("17º BATALHÃO DE POLÍCIA MILITAR", 105, 22, { align: "center" });
      doc.setFontSize(12).setFont("helvetica", "bold").text("RELATÓRIO DE CONFERÊNCIA DE CARGA", 105, 35, { align: "center" });
      
      doc.setDrawColor(200).line(15, 40, 195, 40);
      doc.setFontSize(8).text(`Responsável: ${responsavelFormatado}`, 15, 48);

      let currentY = 60;

      categorias.forEach(categoria => {
        const itensDaCat = items.filter(i => i.cat === categoria.id);
        if (itensDaCat.length === 0) return;
        if (currentY > 250) { doc.addPage(); currentY = 20; }

        autoTable(doc, {
          startY: currentY,
          head: [[categoria.label.toUpperCase(), "QTD", "SÉRIE", "PMPR", "OBS"]],
          body: itensDaCat.map(i => [i.desc, i.qtd, i.serie, i.pmpr || "-", i.cautela || "OK"]),
          theme: 'grid',
          headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
          styles: { fontSize: 7 }
        });
        currentY = doc.lastAutoTable.finalY + 10;
      });

      doc.addImage(qrCodeDataUrl, 'PNG', 170, currentY, 25, 25);

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, responsavel: responsavelFormatado, hash: hashValidacao }),
      });

      if (response.ok) {
        doc.save(`Checklist_17BPM_${dataFormatada}.pdf`);
        setIsUpdateMode(true);
        toast.success("Relatório processado com sucesso!", { id: toastId });
      }
    } catch (error) { 
      toast.error("Erro ao processar PDF.", { id: toastId }); 
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6 max-w-full mx-auto p-4 flex flex-col relative">
      <Toaster richColors position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <Breadcrumb itemAtual="Checklist Diário" />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-700">Furrielação: Gestão de Carga</h1>
            {isUpdateMode && (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                SESSÃO ATIVA
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <ActionButton icon={RotateCcw} label="Resetar" onClick={handleReset} variant="outline" />
          <SecondaryButton 
            icon={isUpdateMode ? Save : Printer} 
            label={isUpdateMode ? "Atualizar" : "Gerar & Enviar"} 
            onClick={gerarPDF} 
            disabled={!isConferenciaCompleta} 
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Progresso</span>
            <span className="text-sm font-black text-blue-600">{porcentagemProgresso}%</span>
          </div>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${porcentagemProgresso === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
              style={{ width: `${porcentagemProgresso}%` }}
            />
          </div>
          <div className="text-[10px] font-bold text-slate-400">
            {itensConcluidos} / {totalItens} ITENS
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex flex-row gap-1">
          {categorias.map((cat) => {
            const Icon = cat.icon;
            const pendencias = getPendencias(cat.id);
            const isActive = abaAtiva === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setAbaAtiva(cat.id)}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all
                  ${isActive ? "bg-white text-blue-600 shadow-sm border border-blue-100" : "text-slate-400 hover:bg-white/50"}`}
              >
                <Icon size={14} />
                {cat.label}
                {pendencias > 0 && <span className="ml-1 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[9px]">{pendencias}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabela de Itens */}
      <div className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-x-auto min-h-[400px]">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : (
          <table className="w-full table-fixed" style={{ minWidth: '850px' }}>
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-[10px] text-slate-400 text-left w-[60px]">ORD</th>
                <th className="p-4 text-[10px] text-slate-400 text-center w-[60px]">QTD</th>
                <th className="p-4 text-[10px] text-slate-400 text-left">EQUIPAMENTO / SÉRIE</th>
                <th className="p-4 text-[10px] text-slate-400 text-center w-[120px]">PMPR</th>
                <th className="p-4 text-[10px] text-slate-400 text-left">OBSERVAÇÕES</th>
                <th className="p-4 text-[10px] text-slate-400 text-right w-[100px]">STATUS</th>
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

      {/* Botão de Voltar ao Topo */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-xl transition-all ${showBackToTop ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        <ChevronUp size={20} />
      </button>

      {/* Rodapé fixo de ação */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Save size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Responsável Atual</p>
            <p className="text-sm font-semibold text-slate-600 italic">{responsavelFormatado}</p>
          </div>
        </div>
        <ActionButton 
          icon={isConferenciaCompleta ? CheckCircle2 : AlertTriangle}
          label={isConferenciaCompleta ? "Finalizar Conferência" : "Aguardando Itens..."}
          onClick={gerarPDF}
          disabled={!isConferenciaCompleta}
          variant={isConferenciaCompleta ? "success" : "disabled"}
          className="w-full md:w-auto px-12 h-12"
        />
      </div>
    </div>
  );
}

function RowChecklist({ item, onToggle, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState(item.cautela || "");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredEfetivo = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    return EFETIVO_17BPM.filter(m => 
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || m.re.includes(searchTerm)
    ).slice(0, 5);
  }, [searchTerm]);

  return (
    <tr className={`hover:bg-slate-50/50 transition-colors ${item.status === 'ok' ? 'bg-emerald-50/10' : ''}`}>
      <td className="p-4 text-xs font-bold text-slate-300">#{item.id}</td>
      <td className="p-4 text-center">
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{item.qtd}</span>
      </td>
      <td className="p-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{item.desc}</span>
          <span className="text-[10px] font-mono text-blue-500">SN: {item.serie}</span>
        </div>
      </td>
      <td className="p-4 text-center">
        <span className="text-[10px] font-mono font-bold border rounded px-2 py-1">{item.pmpr || "---"}</span>
      </td>
      <td className="p-4">
        <div className="relative">
          <input 
            type="text"
            value={searchTerm}
            placeholder="Militar ou Obs..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              onUpdate({ cautela: e.target.value });
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full pl-3 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:border-blue-300"
          />
          {showDropdown && filteredEfetivo.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl overflow-hidden">
              {filteredEfetivo.map(m => (
                <button 
                  key={m.id}
                  onMouseDown={() => {
                    const val = `${m.nome} (${m.re})`;
                    setSearchTerm(val);
                    onUpdate({ cautela: val });
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-[11px] hover:bg-blue-50 flex justify-between"
                >
                  {m.nome} <span className="text-slate-400">RG {m.re}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="p-4 text-right">
        <button 
          onClick={onToggle}
          className={`p-2 rounded-lg transition-all ${item.status === 'ok' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-300 hover:text-emerald-500'}`}
        >
          <ClipboardCheck size={20} />
        </button>
      </td>
    </tr>
  );
}