"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Footer from "../../components/Footer";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulação de cadastro simplificado
    setTimeout(() => {
      if (email && password) {
        if (password.length < 6) {
          setError("A senha deve ter pelo menos 6 caracteres.");
          setIsLoading(false);
          return;
        }
        console.log("Usuário registrado:", { email });
        router.push("/login"); 
      } else {
        setError("Preencha todos os campos corretamente.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-login-image flex flex-col items-center justify-center p-4 font-sans">
      
      <div className="relative w-full max-w-sm mt-20 mb-10">
        
        {/* Header do Card (Identidade 17º BPM) */}
        <header className="card-header-floating">
          <Image 
            src="/assets/image/bg-profile.png" 
            alt="Logo"
            width={80}
            height={80}
            className="logo-style"
            priority 
          />
        </header>

        <div className="bg-white rounded-xl shadow-2xl p-8 pt-32">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-700">Nova Conta</h2>
            <p className="text-xs text-slate-500">Crie seu acesso com e-mail e senha</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-6 animate-shake">
              <p className="text-red-700 text-xs text-center font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input 
              label="E-mail" 
              type="email" 
              placeholder="Digite seu e-mail..."
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            
            <Input 
              label="Senha" 
              type="password" 
              placeholder="Crie uma senha..."
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            
            <div className="pt-2">
              <Button 
                text={isLoading ? "Criando conta..." : "Registrar"} 
                type="submit" 
                disabled={isLoading}
              />
            </div>
            
            <footer className="text-center text-sm text-slate-500 pt-4">
              Já tem cadastro?{" "}
              <Link href="/login" className="text-blue-500 font-bold hover:underline decoration-2">
                Voltar ao Login
              </Link>
            </footer>
          </form>
        </div>
      </div>

      <footer className="mt-auto w-full">
        <Footer />
      </footer>
    </main>
  );
}