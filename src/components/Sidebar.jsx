"use client";
import { useState } from "react"; 
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutGrid, 
  ClipboardList, 
  Wrench,          
  Users,           
  BarChart3,       
  User, 
  UserPlus,
  LogOut,
  Loader2,
  ChevronRight,
  ClipboardCheck
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { name: "CheckList", icon: ClipboardCheck, path: "/dashboard/checklist" },
  { name: "Relatórios", icon: BarChart3, path: "/dashboard/relatorios" },
  { name: "Usuários", icon: Users, path: "/dashboard/usuarios" },  
  { name: "Perfil", icon: User, path: "/dashboard/perfil" },
  { name: "Cadastrar", icon: UserPlus, path: "/dashboard/cadastrar" },
 
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault(); 
    setIsLoggingOut(true); 

    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  return (
    <aside className="sidebar-container flex flex-col">
      {/* Header com Logo */}
      <div className="sidebar-header flex items-center px-4 py-6">
        <Image 
          src="/assets/image/bg-profile.png" 
          alt="Logo" 
          width={40} 
          height={40}
          className="brightness-125"
        />
        <span className="text-white font-semibold tracking-wide text-sm ml-3">
          Gestão 17º BPM
        </span>
      </div>

      {/* Navegação */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div className={`sidebar-item flex items-center justify-between px-4 py-3 mx-4 my-1 rounded-lg transition-all ${isActive ? "sidebar-item-active text-white" : "text-white/70 hover:bg-white/5"}`}>
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? "text-white" : "text-white/70"} />
                  <span className="text-[13px] font-light">{item.name}</span>
                </div>
                
                {/* Setinha que aparece apenas no item ativo */}
                {isActive && (
                  <ChevronRight size={16} className="text-white/50 animate-in fade-in slide-in-from-left-1" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Botão de Logout */}
      <div className="w-full px-4 mb-8">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`sidebar-footer-btn w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 m-0
            ${isLoggingOut ? "opacity-70 bg-slate-600 cursor-not-allowed" : "hover:scale-[1.02] bg-linear-to-tr from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/30"}`}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Saindo...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span className="font-bold uppercase text-xs tracking-widest">Sair</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}