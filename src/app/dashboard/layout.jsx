"use client"; // Adicione "use client" no topo para permitir o uso do Provider

import { SessionProvider } from "next-auth/react";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    // O SessionProvider envolve todo o conteúdo do Dashboard
    <SessionProvider>
      <div className="min-h-screen bg-[#f0f2f5]">
        {/* A Sidebar aparece apenas nas rotas que começam com /dashboard */}
        <Sidebar />

        <main className="ml-72 p-8 pt-10 transition-all duration-300">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}