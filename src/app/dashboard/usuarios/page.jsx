"use client";
import { useState } from "react";
import { 
  UserPlus, Search, ShieldCheck, ShieldAlert, 
  Mail, Trash2, Edit, Filter, X, Shield,
  ChevronRight 
} from "lucide-react";

const usuariosIniciais = [
  { id: 1, nome: "Anderson Silva", posto: "1º Sargento", re: "123.456-7", email: "sargento.silva@pm.pr.gov.br", nivel: "Admin", status: "Ativo" },
  { id: 2, nome: "Ricardo Souza", posto: "Capitão", re: "987.654-3", email: "cap.souza@pm.pr.gov.br", nivel: "Gestor", status: "Ativo" },
  { id: 3, nome: "Marcos Oliveira", posto: "Soldado", re: "456.789-0", email: "sd.oliveira@pm.pr.gov.br", nivel: "Operador", status: "Inativo" },
  { id: 4, nome: "Juliana Costa", posto: "Tenente", re: "159.357-2", email: "ten.juliana@pm.pr.gov.br", nivel: "Admin", status: "Ativo" },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoMilitar, setNovoMilitar] = useState({
    nome: "", posto: "Soldado", re: "", email: "", nivel: "Operador", status: "Ativo"
  });

  const handleCadastrar = (e) => {
    e.preventDefault();
    const id = usuarios.length + 1;
    setUsuarios([...usuarios, { id, ...novoMilitar }]);
    setIsModalOpen(false);
    setNovoMilitar({ nome: "", posto: "Soldado", re: "", email: "", nivel: "Operador", status: "Ativo" });
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6">
      
      {/* --- CABEÇALHO (COM BREADCRUMB OPÇÃO 1) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-full mb-3 shadow-sm shadow-slate-200/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">Dashboard</span>
            <ChevronRight size={10} className="text-slate-300 mx-0.5" />
            <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.15em]">Usuários</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Gestão de Efetivo e Acessos
          </h1>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase shadow-lg shadow-blue-500/20 hover:scale-103 transition cursor-pointer active:scale-95"
        >
          <UserPlus size={16} /> Cadastrar Militar
        </button>
      </div>

      {/* --- CARDS DE RESUMO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administradores</p>
            <p className="text-lg font-bold text-slate-700">02</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <UserPlus size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Ativos</p>
            <p className="text-lg font-bold text-slate-700">{usuarios.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessos Bloqueados</p>
            <p className="text-lg font-bold text-slate-700">01</p>
          </div>
        </div>
      </div>

      {/* --- TABELA DE USUÁRIOS --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome, RE ou posto..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition"
            />
          </div>
          <button className="p-2.5 text-slate-400 hover:bg-white hover:text-blue-600 rounded-xl transition border border-transparent hover:border-slate-100 cursor-pointer">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">
                <th className="px-8 py-4">Militar / RE</th>
                <th className="px-8 py-4">E-mail Institucional</th>
                <th className="px-8 py-4 text-center">Nível</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                        {u.nome.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{u.posto} {u.nome}</span>
                        <span className="text-[10px] text-blue-500 font-mono font-bold tracking-tighter">RE {u.re}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Mail size={12} className="text-slate-300" /> {u.email}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      u.nivel === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      u.nivel === 'Gestor' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-100 text-slate-500 border-slate-100'
                    }`}>
                      {u.nivel}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Ativo' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-300'}`}></div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{u.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition cursor-pointer"><Edit size={14} /></button>
                      <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE CADASTRO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            {/* Header do Modal */}
            <div className="bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-xl">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Novo Militar</h3>
                  <p className="text-[10px] opacity-90 uppercase font-black tracking-widest mt-1">Cadastro de Acesso ao Sistema</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCadastrar} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 text-left block">Posto/Graduação</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 transition outline-none"
                    value={novoMilitar.posto}
                    onChange={(e) => setNovoMilitar({...novoMilitar, posto: e.target.value})}
                  >
                    <option>Soldado</option>
                    <option>Cabo</option>
                    <option>3º Sargento</option>
                    <option>2º Sargento</option>
                    <option>1º Sargento</option>
                    <option>Subtenente</option>
                    <option>Tenente</option>
                    <option>Capitão</option>
                    <option>Major</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 text-left block">RE (RG Militar)</label>
                  <input 
                    required placeholder="000.000-0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 transition outline-none"
                    value={novoMilitar.re}
                    onChange={(e) => setNovoMilitar({...novoMilitar, re: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 text-left block">Nome Completo</label>
                <input 
                  required placeholder="Ex: Anderson Silva"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 transition outline-none"
                  value={novoMilitar.nome}
                  onChange={(e) => setNovoMilitar({...novoMilitar, nome: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 text-left block">E-mail Institucional</label>
                <input 
                  type="email" required placeholder="nome@pm.pr.gov.br"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 transition outline-none"
                  value={novoMilitar.email}
                  onChange={(e) => setNovoMilitar({...novoMilitar, email: e.target.value})}
                />
              </div>

              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4 text-left">
                <div className="bg-white p-2.5 rounded-xl shadow-sm h-fit">
                  <Shield size={18} className="text-blue-600" />
                </div>
                <div className="grow space-y-3">
                  <p className="text-[11px] font-bold text-blue-900 uppercase tracking-tight">Nível de Permissão</p>
                  <div className="flex gap-2">
                    {['Operador', 'Gestor', 'Admin'].map((level) => (
                      <button
                        key={level} type="button"
                        onClick={() => setNovoMilitar({...novoMilitar, nivel: level})}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition cursor-pointer ${
                          novoMilitar.nivel === level 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                          : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/25 hover:scale-103 transition cursor-pointer active:scale-95"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}