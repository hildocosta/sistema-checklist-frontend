"use client";

import { useState, useEffect } from "react";
import { 
  UserPlus, ShieldCheck, ShieldAlert, 
  Mail, Shield, Loader2, Save, X 
} from "lucide-react";

import Breadcrumb from "../../../components/Breadcrumb";
import ActionButton from "../../../components/ActionButton";
import StatCard from "../../../components/StatCard";
import Modal from "../../../components/Modal";
import DataTable from "../../../components/DataTable";
import StatusBadge from "../../../components/StatusBadge";
import PermissionBadge from "../../../components/PermissionBadge";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import TableActions from "../../../components/TableActions";
import Skeleton from "../../../components/Skeleton";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [novoMilitar, setNovoMilitar] = useState({
    nome: "", posto: "Soldado", re: "", email: "", nivel: "Operador", status: "Ativo"
  });

  const carregarUsuarios = async () => {
    try {
      const response = await fetch("/api/usuarios");
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const colunas = [
    { label: "Militar / RE", align: "left" },
    { label: "E-mail Institucional", align: "left" },
    { label: "Nível", align: "center" },
    { label: "Status", align: "center" },
    { label: "Ações", align: "right" },
  ];

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoMilitar),
      });

      if (response.ok) {
        await carregarUsuarios();
        setIsModalOpen(false);
        setNovoMilitar({ nome: "", posto: "Soldado", re: "", email: "", nivel: "Operador", status: "Ativo" });
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente remover este acesso?")) {
      await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
      carregarUsuarios();
    }
  };

  // Ajuste do Filtro para aceitar 'name' ou 'nome'
  const usuariosFiltrados = usuarios.filter(u => {
    const nomeBase = (u.name || u.nome || "").toLowerCase();
    const reBase = (u.re || "").toLowerCase();
    const termo = busca.toLowerCase();
    return nomeBase.includes(termo) || reBase.includes(termo);
  });

  return (
    <div className="animate-in fade-in duration-700 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <Breadcrumb itemAtual="Usuários" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Gestão de Efetivo e Acessos</h1>
        </div>
        <ActionButton onClick={() => setIsModalOpen(true)} icon={UserPlus} label="Adicionar Usuário" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <><Skeleton className="h-32 rounded-3xl" /><Skeleton className="h-32 rounded-3xl" /><Skeleton className="h-32 rounded-3xl" /></>
        ) : (
          <>
            <StatCard label="Administradores" value={usuarios.filter(u => u.nivel === 'Admin').length.toString().padStart(2, '0')} icon={ShieldCheck} color="blue" />
            <StatCard label="Total Ativos" value={usuarios.filter(u => u.status === 'Ativo').length.toString().padStart(2, '0')} icon={UserPlus} color="emerald" />
            <StatCard label="Acessos Bloqueados" value={usuarios.filter(u => u.status === 'Inativo').length.toString().padStart(2, '0')} icon={ShieldAlert} color="red" />
          </>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
        </div>
      ) : (
        <DataTable 
          columns={colunas}
          data={usuariosFiltrados}
          searchPlaceholder="Buscar por nome ou RE..."
          searchValue={busca}
          onSearchChange={(e) => setBusca(e.target.value)}
          renderRow={(u) => {
            const nomeFinal = u.name || u.nome || "Militar";
            return (
              <tr key={u.id} className="hover:bg-slate-50/50 transition group border-b border-slate-50 last:border-0">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">
                      {nomeFinal.charAt(0)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-slate-700 leading-tight">{u.posto} {nomeFinal}</span>
                      <span className="text-[10px] text-blue-600 font-mono font-bold tracking-tight">RE {u.re || 'S/R'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Mail size={12} className="text-slate-300" /> {u.email}
                  </div>
                </td>
                <td className="px-8 py-4 text-center"><PermissionBadge level={u.nivel || 'Operador'} /></td>
                <td className="px-8 py-4 text-center"><StatusBadge status={u.status || 'Ativo'} /></td>
                <td className="px-8 py-4 text-right">
                  <TableActions showView={false} onEdit={() => console.log("Edit", u.id)} onDelete={() => handleDelete(u.id)} />
                </td>
              </tr>
            );
          }}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Militar" subtitle="Cadastro de Acesso" icon={UserPlus}>
        <form onSubmit={handleCadastrar} className="space-y-6 text-left">
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Posto" value={novoMilitar.posto} onChange={(e) => setNovoMilitar({...novoMilitar, posto: e.target.value})} options={['Soldado', 'Cabo', '3º Sargento', '2º Sargento', '1º Sargento', 'Subtenente', 'Tenente', 'Capitão', 'Major']} />
            <FormInput label="RE" required placeholder="000.000-0" value={novoMilitar.re} onChange={(e) => setNovoMilitar({...novoMilitar, re: e.target.value})} />
          </div>
          <FormInput label="Nome Completo" required placeholder="Ex: Anderson Silva" value={novoMilitar.nome} onChange={(e) => setNovoMilitar({...novoMilitar, nome: e.target.value})} />
          <FormInput label="E-mail" type="email" required placeholder="nome@pm.pr.gov.br" value={novoMilitar.email} onChange={(e) => setNovoMilitar({...novoMilitar, email: e.target.value})} />
          
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-sm h-fit"><Shield size={18} className="text-blue-600" /></div>
            <div className="grow space-y-3">
              <p className="text-[11px] font-bold text-blue-900 uppercase">Nível de Permissão</p>
              <div className="flex gap-2">
                {['Operador', 'Gestor', 'Admin'].map((level) => (
                  <button key={level} type="button" onClick={() => setNovoMilitar({...novoMilitar, nivel: level})}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition ${novoMilitar.nivel === level ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{level}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <ActionButton type="button" onClick={() => setIsModalOpen(false)} icon={X} label="Cancelar" variant="outline" className="flex-1 h-14! border-slate-100 text-slate-400" />
            <ActionButton type="submit" disabled={isSaving} icon={isSaving ? Loader2 : Save} label={isSaving ? "Gravando..." : "Confirmar Cadastro"} className={`flex-[1.5] h-14! ${isSaving ? "animate-pulse" : ""}`} />
          </div>
        </form>
      </Modal>
    </div>
  );
}