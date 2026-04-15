"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod"; // Importamos o Zod
import Input from "../../components/Input";
import ActionButton from "../../components/ActionButton"; 
import Footer from "../../components/Footer";

// NÍVEL 4: Definindo o molde de segurança (Schema)
const loginSchema = z.object({
  email: z.string()
    .email("E-mail com formato inválido.")
    .min(5, "E-mail muito curto."),
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(50, "Senha excessivamente longa.")
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 1. Validação do Zod (Detector de Metais)
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      // Pega a primeira mensagem de erro definida no schema acima
      const firstError = validation.error.issues[0].message;
      setError(firstError.toUpperCase());
      setIsLoading(false);
      return; // Para o login aqui mesmo
    }

    try {
      // 2. Tentativa de Login (Só chega aqui se os dados estiverem "limpos")
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
              <h2 className="text-xl font-bold text-slate-700 tracking-tight">Acessar Sistema</h2>
              <p className="text-xs text-slate-400 mt-1">Entre com seu e-mail e senha para continuar</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 animate-shake">
                <p className="text-red-700 text-[10px] text-center font-bold uppercase tracking-widest">
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
                // Retiramos o 'required' do HTML para deixar o Zod cuidar de tudo
              />

              <div className="space-y-2">
                <Input 
                  label="SENHA" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Digite sua senha..." 
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

                <div className="flex justify-end pr-1">
                  <Link 
                    href="/esqueceu_senha" 
                    className="text-[11px] text-blue-500 font-bold hover:text-blue-700 transition-colors"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>

              <div className="pt-4">
                <ActionButton 
                  label="ENTRAR NO SISTEMA"
                  type="submit"
                  loading={isLoading}
                  loadingText="AUTENTICANDO..."
                  fullWidth={true} 
                  className="h-12 shadow-lg shadow-blue-200"
                />
              </div>
              
              <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-50 mt-6">
                Não tem uma conta?{" "}
                <Link 
                  href="/register" 
                  className="text-blue-600 font-bold hover:underline underline-offset-4 transition-all"
                >
                  Cadastre-se
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