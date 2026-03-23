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

    setTimeout(() => {
      if (email && password) {
        if (password.length < 6) {
          setError("A SENHA DEVE TER PELO MENOS 6 CARACTERES.");
          setIsLoading(false);
          return;
        }
        router.push("/login"); 
      } else {
        setError("PREENCHA TODOS OS CAMPOS CORRETAMENTE.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="h-screen w-full bg-login-image flex flex-col items-center justify-between font-sans overflow-hidden">
      
      
      <div className="flex-1 flex items-start justify-center w-full p-4 pt-20">
        <div className="relative w-full max-w-sm">
          
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

          <div className="bg-white rounded-xl shadow-2xl p-8 pt-24 pb-12">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-700">Nova Conta</h2>
              <p className="text-xs text-slate-500">Crie seu acesso com e-mail e senha</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-6 animate-shake">
                <p className="text-red-700 text-[10px] text-center font-bold uppercase">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <Input label="E-MAIL" type="email" placeholder="Digite seu e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="SENHA" type="password" placeholder="Crie uma senha..." value={password} onChange={(e) => setPassword(e.target.value)} required />
              
              <div className="pt-2">
                <Button text={isLoading ? "CRIANDO CONTA..." : "REGISTRAR"} type="submit" disabled={isLoading} />
              </div>
              
              <footer className="text-center text-sm text-slate-500 pt-4">
                Já tem cadastro? <Link href="/login" className="text-blue-500 font-bold hover:underline decoration-2">Voltar ao Login</Link>
              </footer>
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