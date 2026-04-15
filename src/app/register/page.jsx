"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react"; 
import { z } from "zod"; // NÍVEL 4: Importando o Detector de Metais
import Input from "../../components/Input";
import ActionButton from "../../components/ActionButton"; 
import Footer from "../../components/Footer";

// Definição do Schema de Validação
const registerSchema = z.object({
  name: z.string()
    .min(3, "O NOME DEVE TER PELO MENOS 3 LETRAS.")
    .max(50, "NOME MUITO LONGO.")
    .regex(/^[a-zA-ZÀ-ÿ\s.]+$/, "NOME NÃO PODE CONTER SÍMBOLOS OU SCRIPTS."),
  email: z.string()
    .email("INSIRA UM E-MAIL VÁLIDO."),
  password: z.string()
    .min(8, "A SENHA DEVE TER PELO MENOS 8 CARACTERES.") // Aumentado para maior segurança
});

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // --- NÍVEL 4: Validação com Zod ---
    const validation = registerSchema.safeParse({ name, email, password });

    if (!validation.success) {
      const firstError = validation.error.issues[0].message;
      setError(firstError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ERRO AO CRIAR CONTA.");
      }

      toast.success("CONTA CRIADA COM SUCESSO!");
      router.push("/login");

    } catch (err) {
      setError(err.message.toUpperCase());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-login-image flex flex-col items-center justify-between font-sans overflow-hidden">
      
      <div className="flex-1 flex items-center justify-center w-full p-4">
        <div className="relative w-full max-w-sm mb-12">
          
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

          <div className="bg-white rounded-2xl shadow-2xl p-8 pt-20 pb-10 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-700 tracking-tight">Nova Conta</h2>
              <p className="text-xs text-slate-400 mt-1">Crie seu acesso administrativo abaixo</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 animate-shake">
                <p className="text-red-700 text-[10px] text-center font-bold uppercase tracking-widest">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <Input 
                label="NOME COMPLETO" 
                type="text" 
                placeholder="Ex: Cb. Silva" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />

              <Input 
                label="E-MAIL" 
                type="email" 
                placeholder="Digite seu e-mail institucional..." 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              
              <Input 
                label="SENHA" 
                type={showPassword ? "text" : "password"} 
                placeholder="Crie uma senha segura..." 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-blue-600 transition-all"
                  tabIndex="-1" 
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </Input>
              
              <div className="pt-4">
                <ActionButton 
                  label="CRIAR MINHA CONTA"
                  type="submit"
                  loading={isLoading}
                  loadingText="PROCESSANDO..."
                  fullWidth={true}
                  className="h-12 shadow-lg shadow-blue-200"
                />
              </div>
              
              <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-50 mt-6">
                Já tem cadastro?{" "}
                <Link 
                  href="/login" 
                  className="text-blue-600 font-bold hover:underline underline-offset-4 transition-all"
                >
                  Voltar ao Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="w-full shrink-0">
        <Footer />
      </footer>
    </main>
  );
}