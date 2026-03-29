"use client";
import { useState, useEffect } from "react";
import { 
  UserPlus, ShieldCheck, ShieldAlert, 
  Mail, Shield, Loader2, Save, X 
} from "lucide-react";

// Importação dos Componentes Reutilizáveis
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

const usuariosIniciais = [
  { id: 1, nome: "Anderson Silva", posto: "1º Sargento", re: "123.456-7", email: "sargento.silva@pm.pr.gov.br", nivel: "Admin", status: "Ativo" },
  { id: 2, nome: "Ricardo Souza", posto: "Capitão", re: "987.654-3", email: "cap.souza@pm.pr.gov.br", nivel: "Gestor", status: "Ativo" },
  { id: 3, nome: "Marcos Oliveira", posto: "Soldado", re: "456.789-0", email: "sd.oliveira@pm.pr.gov.br", nivel: "Operador", status: "Inativo" },
  { id: 4, nome: "Juliana Costa", posto: "Tenente", re: "159.357-2", email: "ten.juliana@pm.pr.gov.br", nivel: "Admin", status: "Ativo" },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoMilitar, setNovoMilitar] = useState({
    nome: "", posto: "Soldado", re: "", email: "", nivel: "Operador", status: "Ativo"
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const colunas = [
    { label: "Militar / RE", align: "left" },
    { label: "E-mail Institucional", align: "left" },
    { label: "Nível", align: "center" },
    { label: "Status", align: "center" },
    { label: "Ações", align: "right" },
  ];

  const handleCadastrar = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      const id = usuarios.length + 1;
      setUsuarios([...usuarios, { id, ...novoMilitar }]);
      setIsSaving(false);
      setIsModalOpen(false);
      setNovoMilitar({ nome: "", posto: "Soldado", re: "", email: "", nivel: "Operador", status: "Ativo" });
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6">
      
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <Breadcrumb itemAtual="Usuários" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Gestão de Efetivo e Acessos
          </h1>
        </div>

        <ActionButton 
          onClick={() => setIsModalOpen(true)}
          icon={UserPlus}                      
          label="Adicionar Usuário"
        />
      </div>

      {/* --- CARDS DE RESUMO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </>
        ) : (
          <>
            <StatCard label="Administradores" value="02" icon={ShieldCheck} color="blue" />
            <StatCard label="Total Ativos" value={usuarios.length} icon={UserPlus} color="emerald" />
            <StatCard label="Acessos Bloqueados" value="01" icon={ShieldAlert} color="red" />
          </>
        )}
      </div>

      {/* --- TABELA DE USUÁRIOS --- */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        </div>
      ) : (
        <DataTable 
          columns={colunas}
          data={usuarios}
          searchPlaceholder="Buscar por nome, RE ou posto..."
          searchValue={busca}
          onSearchChange={(e) => setBusca(e.target.value)}
          renderRow={(u) => (
            <tr key={u.id} className="hover:bg-slate-50/50 transition group">
              <td className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                    {u.nome.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
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
                <PermissionBadge level={u.nivel} />
              </td>
              <td className="px-8 py-4 text-center">
                <StatusBadge status={u.status} />
              </td>
              <td className="px-8 py-4 text-right">
                <div className="flex justify-end">
                  <TableActions 
                    showView={false} 
                    onEdit={() => console.log("Editar usuário:", u.id)}
                    onDelete={() => console.log("Deletar usuário:", u.id)}
                  />
                </div>
              </td>
            </tr>
          )}
        />
      )}

      {/* --- MODAL DE CADASTRO --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Novo Militar"
        subtitle="Cadastro de Acesso ao Sistema"
        icon={UserPlus}
      >
        <form onSubmit={handleCadastrar} className="space-y-6 text-left">
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Posto/Graduação"
              value={novoMilitar.posto}
              onChange={(e) => setNovoMilitar({...novoMilitar, posto: e.target.value})}
              options={['Soldado', 'Cabo', '3º Sargento', '2º Sargento', '1º Sargento', 'Subtenente', 'Tenente', 'Capitão', 'Major']}
            />
            <FormInput 
              label="RE (RG Militar)"
              required
              placeholder="000.000-0"
              value={novoMilitar.re}
              onChange={(e) => setNovoMilitar({...novoMilitar, re: e.target.value})}
            />
          </div>

          <FormInput 
            label="Nome Completo"
            required
            placeholder="Ex: Anderson Silva"
            value={novoMilitar.nome}
            onChange={(e) => setNovoMilitar({...novoMilitar, nome: e.target.value})}
          />

          <FormInput 
            label="E-mail Institucional"
            type="email"
            required
            placeholder="nome@pm.pr.gov.br"
            value={novoMilitar.email}
            onChange={(e) => setNovoMilitar({...novoMilitar, email: e.target.value})}
          />

          {/* Seletor de Nível */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
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

          {/* --- BOTÕES DE AÇÃO USANDO ACTIONBUTTON --- */}
          <div className="flex gap-4 pt-2">
            <ActionButton 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              icon={X}
              label="Cancelar"
              variant="outline" // Assumindo que seu ActionButton suporte variantes, caso contrário ele usará o estilo padrão
              className="flex-1 h-14! border-slate-100 text-slate-400 hover:bg-slate-50 transition"
            />
            <ActionButton 
              type="submit"
              disabled={isSaving}
              icon={isSaving ? Loader2 : Save}
              label={isSaving ? "Gravando..." : "Confirmar Cadastro"}
              className={`flex-[1.5] h-14! ${isSaving ? "animate-pulse" : ""}`}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}