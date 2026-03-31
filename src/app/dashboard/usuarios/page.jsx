"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, ShieldAlert, Edit3,
  Mail, Shield, Loader2, Save, X, User 
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
  
  // Controle de Edição
  const [editandoId, setEditandoId] = useState(null);
  const [dadosMilitar, setDadosMilitar] = useState({
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

  // Abrir modal preenchido
  const handleEditClick = (u) => {
    setEditandoId(u.id);
    setDadosMilitar({
      nome: u.name || u.nome || "",
      posto: u.posto || "Soldado",
      re: u.re || "",
      email: u.email || "",
      nivel: u.nivel || "Operador",
      status: u.status || "Ativo"
    });
    setIsModalOpen(true);
  };

  const handleSalvarAlteracoes = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`/api/usuarios/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosMilitar),
      });

      if (response.ok) {
        await carregarUsuarios();
        setIsModalOpen(false);
        setEditandoId(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
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
          <Breadcrumb itemAtual="Gestão de Usuários" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Efetivo e Níveis de Acesso</h1>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <><Skeleton className="h-32 rounded-3xl" /><Skeleton className="h-32 rounded-3xl" /><Skeleton className="h-32 rounded-3xl" /></>
        ) : (
          <>
            <StatCard label="Administradores" value={usuarios.filter(u => u.nivel === 'Admin').length.toString().padStart(2, '0')} icon={ShieldCheck} color="blue" />
            <StatCard label="Militares Ativos" value={usuarios.filter(u => u.status === 'Ativo').length.toString().padStart(2, '0')} icon={User} color="emerald" />
            <StatCard label="Acessos Bloqueados" value={usuarios.filter(u => u.status === 'Inativo').length.toString().padStart(2, '0')} icon={ShieldAlert} color="red" />
          </>
        )}
      </div>

      {/* Tabela de Dados */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
        </div>
      ) : (
        <DataTable 
          columns={[
            { label: "Militar / RG", align: "left" },
            { label: "E-mail Institucional", align: "left" },
            { label: "Nível", align: "center" },
            { label: "Status", align: "center" },
            { label: "Ações", align: "right" },
          ]}
          data={usuariosFiltrados}
          searchPlaceholder="Filtrar por nome ou RG..."
          searchValue={busca}
          onSearchChange={(e) => setBusca(e.target.value)}
          renderRow={(u) => (
            <tr key={u.id} className="hover:bg-slate-50/50 transition group border-b border-slate-50 last:border-0">
              <td className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">
                    {(u.name || u.nome || "M").charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-slate-700 leading-tight">{u.posto} {u.name || u.nome}</span>
                    <span className="text-[12px] text-blue-600 font-mono font-bold tracking-tight">RE {u.re || '---'}</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium text-left">
                  <Mail size={12} className="text-slate-300" /> {u.email}
                </div>
              </td>
              <td className="px-8 py-4 text-center"><PermissionBadge level={u.nivel || 'Operador'} /></td>
              <td className="px-8 py-4 text-center"><StatusBadge status={u.status || 'Ativo'} /></td>
              <td className="px-8 py-4 text-right">
                <TableActions showView={false} onEdit={() => handleEditClick(u)} onDelete={() => handleDelete(u.id)} />
              </td>
            </tr>
          )}
        />
      )}

      {/* Modal Unificado de Edição */}
      
     <Modal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false); setEditandoId(null);}} 
        title="Editar Militar" 
        subtitle="Acesso e Permissões" 
        icon={Edit3}
      >
        <form onSubmit={handleSalvarAlteracoes} className="space-y-3 text-left">
          {/* Linha 1: Posto e RE */}
          <div className="grid grid-cols-2 gap-3">
            <FormSelect 
                label="Posto" 
                value={dadosMilitar.posto} 
                onChange={(e) => setDadosMilitar({...dadosMilitar, posto: e.target.value})} 
                options={['Sd. QP PM', 'Cb. QP PM', '3º Sgt. QP PM', '2º Sgt. QP PM', '1º Sgt. QP PM', 'Subtenente QP PM', 'Asp. Of. PM','2º Ten. QOEM PM', '1º Ten. QOEM PM', 'Cap. QOEM PM', 'Major QOEM PM', 'Ten.-Cel. QOEM PM', 'Cel. QOEM PM']} 
            />
            <FormInput label="RG" required value={dadosMilitar.re} onChange={(e) => setDadosMilitar({...dadosMilitar, re: e.target.value})} />
          </div>
          
          {/* Linha 2: Nome */}
          <FormInput label="Nome Completo" required value={dadosMilitar.nome} onChange={(e) => setDadosMilitar({...dadosMilitar, nome: e.target.value})} />
          
          {/* Linha 3: E-mail (Compacto) */}
          <div className="relative">
             <FormInput label="E-mail Institucional" disabled value={dadosMilitar.email} className="bg-slate-50/50 opacity-60 text-[11px]" />
          </div>
          
          {/* Linha 4: Nível e Status Lado a Lado (Super Compacto) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Seletor de Nível */}
            <div className="p-2.5 bg-blue-50/30 rounded-xl border border-blue-100/50 space-y-2">
              <p className="text-[9px] font-black text-blue-900/50 uppercase tracking-widest flex items-center gap-1">
                <Shield size={10} /> Nível
              </p>
              <div className="flex gap-1">
                {['Operador', 'Gestor', 'Admin'].map((level) => (
                  <button 
                    key={level} 
                    type="button" 
                    onClick={() => setDadosMilitar({...dadosMilitar, nivel: level})}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                      dadosMilitar.nivel === level ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {level.charAt(0)}
                  </button>
                ))}
              </div>
            </div>

            {/* Seletor de Status */}
            <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-200/60 space-y-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <ShieldAlert size={10} /> Status
              </p>
              <div className="flex gap-1">
                {['Ativo', 'Inativo'].map((status) => (
                  <button 
                    key={status} 
                    type="button" 
                    onClick={() => setDadosMilitar({...dadosMilitar, status: status})}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                        dadosMilitar.status === status 
                        ? (status === 'Ativo' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white') 
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {status === 'Ativo' ? 'Ativo' : 'Off'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé: Botões Menores */}
          <div className="flex gap-3 pt-3 border-t border-slate-100 mt-1">
            <ActionButton 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              icon={X} 
              label="Sair" 
              variant="outline" 
              className="flex-1 h-10! text-[11px]" 
            />
            <ActionButton 
              type="submit" 
              disabled={isSaving} 
              icon={isSaving ? Loader2 : Save} 
              label={isSaving ? "Aguarde..." : "Gravar"} 
              className={`flex-1 h-10! text-[11px] ${isSaving ? "animate-pulse" : "bg-blue-600"}`} 
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}