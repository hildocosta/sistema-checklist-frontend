"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react"; // Importação dos ícones
import Input from "../../components/Input";
import ActionButton from "../../components/ActionButton"; 
import Footer from "../../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidade
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-MAIL OU SENHA INVÁLIDOS.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("ERRO DE CONEXÃO COM O SERVIDOR.");
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-full bg-login-image flex flex-col items-center justify-between font-sans overflow-hidden">
      
      <div className="flex-1 flex items-start justify-center w-full p-4 pt-20">
        <div className="relative w-full max-w-sm">
          
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

          <div className="bg-white rounded-xl shadow-2xl p-8 pt-24 pb-10 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-700">Acessar Sistema</h2>
              <p className="text-xs text-slate-500">Entre com seu e-mail e senha para continuar</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-6 animate-shake">
                <p className="text-red-700 text-[10px] text-center font-bold uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <Input 
                label="E-MAIL" 
                type="email" 
                placeholder="Digite seu e-mail..." 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />

              <div className="space-y-2">
                {/* CAMPO SENHA - USANDO A COMPOSIÇÃO PARA O ÍCONE DO OLHO */}
                <Input 
                  label="SENHA" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Digite sua senha..." 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                    tabIndex="-1" 
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </Input>

                <div className="flex justify-end pr-1">
                  <Link 
                    href="/esqueceu_senha" 
                    className="text-sm text-blue-500 font-bold hover:underline decoration-2 transition-all"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>

              <div className="pt-3">
                <ActionButton 
                  label="ENTRAR NO SISTEMA"
                  type="submit"
                  loading={isLoading}
                  loadingText="AUTENTICANDO..."
                  fullWidth={true} 
                />
              </div>
              
              <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-50 mt-4">
                Não tem uma conta?{" "}
                <Link 
                  href="/register" 
                  className="text-blue-500 font-bold hover:underline decoration-2 transition-all"
                >
                  Cadastre-se
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="w-full">
        <Footer />
      </footer>
    </main>
  );
}