"use client";
import { useState } from "react";
import { 
  Calendar, AlertTriangle, CheckCircle2, Clock, Search, 
  Plus, Filter, FileText, X, ArrowRight, AlertCircle, Settings,
  ChevronRight
} from "lucide-react";

const servicosPlanilha = [
  { id: "01", servico: "Limpeza de Caixa D'Água", periodicidade: "12 meses", ultima: "07/11/2024", proxima: "07/11/2025", status: "Atrasada" },
  { id: "02", servico: "Manutenção/Limpeza Ar Condicionado", periodicidade: "12 meses", ultima: "18/12/2023", proxima: "18/12/2024", status: "Atrasada" },
  { id: "03", servico: "Aquisição de Filtros de Água", periodicidade: "6 meses", ultima: "23/09/2025", proxima: "23/03/2026", status: "Em dia" },
  { id: "04", servico: "Dedetização / Desratização", periodicidade: "6 meses", ultima: "12/09/2025", proxima: "12/03/2026", status: "Em dia" },
  { id: "05", servico: "Manutenção e Recarga de Extintores", periodicidade: "12 meses", ultima: "18/09/2025", proxima: "18/09/2026", status: "Em dia" },
  { id: "06", servico: "Limpeza de Coifas e Dutos", periodicidade: "12 meses", ultima: "-", proxima: "-", status: "Alerta" },
  { id: "07", servico: "Manutenção Preventiva Motor Portão", periodicidade: "12 meses", ultima: "-", proxima: "-", status: "Alerta" },
  { id: "08", servico: "Manutenção Compressor Estande", periodicidade: "3 meses", ultima: "-", proxima: "-", status: "Alerta" },
];

export default function ServicosPage() {
  const [busca, setBusca] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="animate-in fade-in duration-700 space-y-6 relative">
      
      {/* --- JANELA FLUTUANTE (MODAL) DE CADASTRO --- */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Settings size={20} /></div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Novo Item de Manutenção</h2>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">17º Batalhão de Polícia Militar</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-8 animate-in slide-in-from-bottom-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Descrição do Serviço</label>
                    <input required type="text" placeholder="Ex: Manutenção Preventiva Freezer" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-normal"/>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Periodicidade</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700">
                      <option>Mensal</option>
                      <option>Trimestral</option>
                      <option>Semestral</option>
                      <option>Anual</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Data da Última Execução</label>
                    <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-600 font-bold uppercase"/>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block">Vínculo OPM / Setor</label>
                    <input type="text" placeholder="Ex: Rancho / Estante de Tiro" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-normal"/>
                  </div>
                </div>
                
                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 flex gap-4">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm self-start">
                    <AlertCircle className="text-amber-500" size={18} />
                  </div>
                  <p className="text-[11px] text-amber-900 font-semibold leading-relaxed italic">
                    Ao cadastrar um novo serviço, o sistema calculará automaticamente a <span className="text-amber-600 underline decoration-amber-200 underline-offset-2">Previsão da Próxima Execução</span> baseada na periodicidade e na data informada acima.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <button type="submit" className="flex items-center gap-3 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                    Salvar Novo Serviço <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- CABEÇALHO (COM BREADCRUMB OPÇÃO 1) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-full mb-3 shadow-sm shadow-slate-200/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">Dashboard</span>
            <ChevronRight size={10} className="text-slate-300 mx-0.5" />
            <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.15em]">Manutenção</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Controle de Serviços - 17º BPM</h1>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={16} strokeWidth={3} /> Adicionar Serviço
        </button>
      </div>

      {/* --- CARDS DE INDICADORES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-red-500 flex items-center justify-between hover:shadow-md transition-shadow">
          <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Atrasados</p><p className="text-2xl font-bold text-slate-700">02</p></div>
          <div className="bg-red-50 p-3 rounded-lg"><AlertTriangle className="text-red-500" size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-amber-500 flex items-center justify-between hover:shadow-md transition-shadow">
          <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Em Alerta</p><p className="text-2xl font-bold text-slate-700">11</p></div>
          <div className="bg-amber-50 p-3 rounded-lg"><Clock className="text-amber-500" size={24} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-emerald-500 flex items-center justify-between hover:shadow-md transition-shadow">
          <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Em Dia</p><p className="text-2xl font-bold text-slate-700">03</p></div>
          <div className="bg-emerald-50 p-3 rounded-lg"><CheckCircle2 className="text-emerald-500" size={24} /></div>
        </div>
      </div>

      {/* --- TABELA --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50/30 flex justify-between items-center border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar serviço..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"/>
          </div>
          <button className="p-2 text-slate-400 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-100 cursor-pointer"><Filter size={18} /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-50">Serviço / Item</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-50">Periodicidade</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-50 text-center">Última Exec.</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-50 text-center">Próxima Exec.</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-50 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {servicosPlanilha.filter(item => item.servico.toLowerCase().includes(busca.toLowerCase())).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer">
                  <td className="px-6 py-4"><div className="flex flex-col"><span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{item.servico}</span><span className="text-[10px] text-slate-400 uppercase font-medium">Ref: #{item.id}</span></div></td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium"><Calendar size={12} className="text-slate-400 shrink-0" />{item.periodicidade}</span></td>
                  <td className="px-6 py-4 text-xs text-slate-500 text-center font-medium">{item.ultima}</td>
                  <td className="px-6 py-4 text-xs text-slate-600 text-center font-bold">{item.proxima}</td>
                  <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${item.status === 'Atrasada' ? 'bg-red-50 text-red-600 border-red-100' : item.status === 'Em dia' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>Total: {servicosPlanilha.length} Itens Monitorados</span>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-xs cursor-pointer"><FileText size={14} className="text-slate-400" />Exportar Relatório</button>
        </div>
      </div>
    </div>
  );
}