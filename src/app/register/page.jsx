"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner"; // Recomendado para feedback visual
import Input from "../../components/Input";
import ActionButton from "../../components/ActionButton"; 
import Footer from "../../components/Footer";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validação básica de segurança no client
    if (password.length < 6) {
      setError("A SENHA DEVE TER PELO MENOS 6 CARACTERES.");
      setIsLoading(false);
      return;
    }

    try {
      // Chamada real para a API que criamos no backend Vercel/Neon
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ERRO AO CRIAR CONTA.");
      }

      // Sucesso: Feedback e Redirecionamento
      toast.success("CONTA CRIADA COM SUCESSO!");
      router.push("/login");

    } catch (err) {
      setError(err.message.toUpperCase());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-full bg-login-image flex flex-col items-center justify-between font-sans overflow-hidden">
      
      {/* Container Principal do Formulário */}
      <div className="flex-1 flex items-start justify-center w-full p-4 pt-20">
        <div className="relative w-full max-w-sm">
          
          {/* Header Flutuante com Logo */}
          <header className="card-header-floating">
            <Image 
              src="/assets/image/bg-profile.png" 
              alt="Logo 17BPM" 
              width={80} 
              height={80} 
              className="logo-style" 
              priority 
            />
          </header>

          {/* Card de Registro */}
          <div className="bg-white rounded-xl shadow-2xl p-8 pt-24 pb-10 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-700">Nova Conta</h2>
              <p className="text-xs text-slate-500">Crie seu acesso administrativo abaixo</p>
            </div>
            
            {/* Alerta de Erro */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 animate-shake">
                <p className="text-red-700 text-[10px] text-center font-bold uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Campo Nome */}
              <Input 
                label="NOME COMPLETO" 
                type="text" 
                placeholder="Ex: Cb. Silva" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />

              {/* Campo E-mail */}
              <Input 
                label="E-MAIL" 
                type="email" 
                placeholder="Digite seu e-mail institucional..." 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              
              {/* Campo Senha */}
              <Input 
                label="SENHA" 
                type="password" 
                placeholder="Crie uma senha segura..." 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              
              {/* Botão de Ação Reutilizável */}
              <div className="pt-2">
                <ActionButton 
                  label="CRIAR MINHA CONTA"
                  type="submit"
                  loading={isLoading}
                  loadingText="PROCESSANDO..."
                  fullWidth={true}
                />
              </div>
              
              {/* Rodapé do Card: Voltar ao Login */}
              <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-50 mt-4">
                Já tem cadastro?{" "}
                <Link 
                  href="/login" 
                  className="text-blue-500 font-bold hover:underline decoration-2 transition-all"
                >
                  Voltar ao Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Rodapé Institucional */}
      <footer className="w-full">
        <Footer />
      </footer>
    </main>
  );
}