import React from "react";
import { Loader2 } from "lucide-react";

/**
 * SecondaryButton - Componente de botão padrão PMPR (Estilo Clean/White)
 * * @param {Element} icon - Ícone do Lucide (opcional)
 * @param {string} label - Texto do botão
 * @param {function} onClick - Função disparada ao clicar
 * @param {boolean} disabled - Desativa o botão
 * @param {boolean} isLoading - Ativa o estado de carregamento com spinner
 * @param {string} className - Classes CSS adicionais para ajustes pontuais
 * @param {string} type - Tipo do botão (button, submit, reset)
 */
const SecondaryButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  disabled = false, 
  isLoading = false,
  className = "",
  type = "button",
  children
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        /* Layout Base */
        flex items-center justify-center gap-2 
        min-h-[44px] px-5 py-2.5 rounded-xl
        
        /* Tipografia e Cores */
        text-[11px] font-black uppercase tracking-wider
        bg-white border border-slate-200 text-slate-600 
        
        /* Efeitos e Interação */
        shadow-sm transition-all duration-200
        hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800
        active:scale-95 
        
        /* Estados de Erro/Desabilitado */
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        
        /* Injeção de classes extras */
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin text-blue-600" />
      ) : (
        Icon && <Icon size={16} className="shrink-0" />
      )}

      <span className="truncate">
        {isLoading ? "Processando..." : (children || label)}
      </span>
    </button>
  );
};

export default SecondaryButton;