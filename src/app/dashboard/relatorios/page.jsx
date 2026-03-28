"use client";
import Image from "next/image";
import { FileText, Download, Printer, ChevronRight } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function RelatoriosPage() {
  
  // Dados simulados do sistema 17º BPM
  const dadosManutencao = [
    { servico: "Limpeza de Caixa D'Água", ultimaExec: "07/11/2024", vencimento: "07/11/2025", situacao: "Atrasado" },
    { servico: "Manutenção Ar Condicionado", ultimaExec: "18/12/2023", vencimento: "18/12/2024", situacao: "Atrasado" },
    { servico: "Dedetização / Desratização", ultimaExec: "12/09/2025", vencimento: "12/03/2026", situacao: "Em Dia" },
    { servico: "Revisão Elétrica Setor A", ultimaExec: "10/01/2026", vencimento: "10/07/2026", situacao: "Em Dia" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório de Manutenção");

    // 1. Configurar Cabeçalhos
    worksheet.columns = [
      { header: "SERVIÇO / MANUTENÇÃO", key: "servico", width: 40 },
      { header: "ÚLTIMA EXECUÇÃO", key: "ultimaExec", width: 20 },
      { header: "VENCIMENTO", key: "vencimento", width: 20 },
      { header: "SITUAÇÃO", key: "situacao", width: 15 },
    ];

    // 2. Estilizar o Cabeçalho
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" }, size: 12 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1A73E8" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // 3. Adicionar Dados
    dadosManutencao.forEach((item) => {
      const row = worksheet.addRow(item);
      const situacaoCell = row.getCell(4);
      if (item.situacao === "Atrasado") {
        situacaoCell.font = { color: { argb: "FF0000" }, bold: true };
      } else {
        situacaoCell.font = { color: { argb: "008000" }, bold: true };
      }
      row.alignment = { vertical: "middle", horizontal: "left" };
      row.getCell(2).alignment = { horizontal: "center" };
      row.getCell(3).alignment = { horizontal: "center" };
      row.getCell(4).alignment = { horizontal: "center" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const dataAtual = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
    saveAs(new Blob([buffer]), `Relatorio_Logistica_17BPM_${dataAtual}.xlsx`);
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-8 print:p-0 print:m-0">
      
      {/* --- BOTÕES DE AÇÃO (COM BREADCRUMB OPÇÃO 1) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-full mb-3 shadow-sm shadow-slate-200/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">Dashboard</span>
            <ChevronRight size={10} className="text-slate-300 mx-0.5" />
            <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.15em]">Relatórios</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Central de Relatórios
          </h1>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase shadow-sm hover:bg-slate-50 transition cursor-pointer"
          >
            <Printer size={16} /> Imprimir PDF
          </button>
          
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase shadow-lg shadow-blue-500/20 hover:scale-103 transition cursor-pointer active:scale-95"
          >
            <Download size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* --- ÁREA DO RELATÓRIO (Documento Físico) --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 min-h-screen print:shadow-none print:border-none print:p-0 print:text-black">
        
        {/* Cabeçalho do Batalhão */}
        <div className="flex justify-between items-center border-b-2 border-slate-100 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 print:border-slate-300">
               <Image 
                src="/assets/image/bg-profile.png" 
                alt="17º BPM" 
                width={48} 
                height={48} 
                className="object-contain"
                priority
               />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none">Polícia Militar do Estado do Paraná</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">17º Batalhão de Polícia Militar</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Seção de Logística e Manutenção</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data do Relatório</p>
            <p className="text-sm font-bold text-slate-700 tracking-tight">28 de Março, 2026</p>
          </div>
        </div>

        {/* Grid de Resumo */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 print:bg-slate-50">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Eficiência Geral</p>
            <p className="text-2xl font-black text-emerald-600">82.5%</p>
          </div>
          <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 print:bg-slate-50">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Serviços Pendentes</p>
            <p className="text-2xl font-black text-amber-500">11 <span className="text-[10px] text-slate-400 font-medium italic">itens</span></p>
          </div>
          <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 print:bg-slate-50">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Urgência Crítica</p>
            <p className="text-2xl font-black text-red-500">02 <span className="text-[10px] text-slate-400 font-medium italic">itens</span></p>
          </div>
        </div>

        {/* Tabela de Detalhamento */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2">
            <FileText size={14} className="text-blue-600" /> Detalhamento de Manutenções
          </h3>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviço/Local</th>
                <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Última Exec.</th>
                <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vencimento</th>
                <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dadosManutencao.map((item, idx) => (
                <tr key={idx} className="print:break-inside-avoid">
                  <td className="py-5 text-sm font-bold text-slate-700">{item.servico}</td>
                  <td className="py-5 text-xs text-slate-500 text-center font-medium">{item.ultimaExec}</td>
                  <td className={`py-5 text-xs text-center font-black ${item.situacao === 'Atrasado' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {item.vencimento}
                  </td>
                  <td className="py-5 text-right">
                    <span className={`text-[9px] font-black uppercase border px-3 py-1 rounded-lg ${
                      item.situacao === 'Atrasado' 
                      ? 'text-red-600 border-red-200 bg-red-50' 
                      : 'text-emerald-600 border-emerald-200 bg-emerald-50'
                    }`}>
                      {item.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé de Assinaturas */}
        <div className="mt-auto pt-20 flex justify-between items-end">
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-64 border-b border-slate-300 mb-2"></div>
              <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Encarregado de Manutenção</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase">17º Batalhão de Polícia Militar</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-300 font-medium italic mb-1">Relatório gerado via GIM - Gestão de Infraestrutura Militar</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Emissão: 28/03/2026 - 10:35h</p>
          </div>
        </div>

      </div>
    </div>
  );
}