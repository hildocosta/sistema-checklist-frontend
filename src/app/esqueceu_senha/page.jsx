"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MailCheck, AlertCircle } from "lucide-react";
import Input from "../../components/Input";
import ActionButton from "../../components/ActionButton";
import Footer from "../../components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulação de envio
    setTimeout(() => {
      if (email.includes("@")) {
        setIsSubmitted(true);
        setIsLoading(false);
      } else {
        setError("O E-MAIL INFORMADO NÃO FOI ENCONTRADO EM NOSSA BASE.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen w-full bg-login-image flex flex-col items-center justify-between font-sans overflow-hidden">
      
      {/* Container de Centralização para qualquer monitor */}
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

          <div className="bg-white rounded-2xl shadow-2xl p-8 pt-20 pb-10 transition-all duration-500 border border-slate-100">
            {!isSubmitted ? (
              /* ESTADO 1: FORMULÁRIO */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-700 uppercase tracking-tight">Recuperar Acesso</h2>
                  <p className="text-xs text-slate-400 mt-2">
                    Identifique-se para receber as instruções de redefinição de senha.
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 flex items-center gap-3 animate-shake">
                    <AlertCircle className="text-red-600 shrink-0" size={18} />
                    <p className="text-red-700 text-[10px] font-bold uppercase leading-tight">
                      {error}
                    </p>
                  </div>
                )}

                <form onSubmit={handleResetRequest} className="space-y-6">
                  <Input 
                    label="E-MAIL INSTITUCIONAL" 
                    type="email" 
                    placeholder="exemplo@pm.pr.gov.br" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />

                  <div className="pt-2">
                    <ActionButton 
                      label="ENVIAR INSTRUÇÕES"
                      type="submit"
                      loading={isLoading}
                      loadingText="PROCESSANDO..."
                      fullWidth={true}
                    />
                  </div>
                </form>

                <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-50 mt-8">
                  Lembrou a senha?{" "}
                  <Link 
                    href="/login" 
                    className="text-blue-600 font-bold hover:underline underline-offset-4 transition-all"
                  >
                    Voltar ao Login
                  </Link>
                </div>
              </div>
            ) : (
              /* ESTADO 2: SUCESSO */
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                  <MailCheck size={32} />
                </div>
                
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Link Enviado!
                </h2>
                
                <div className="space-y-4 mb-8">
                  <p className="text-xs text-slate-500 leading-relaxed px-2">
                    As instruções de recuperação foram enviadas para:<br/>
                    <strong className="text-slate-800 font-bold break-all">{email}</strong>
                  </p>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mx-1">
                    <p className="text-[10px] text-slate-500 italic uppercase font-bold mb-2 tracking-wider">
                      Não recebeu o e-mail?
                    </p>
                    <ul className="text-[10px] text-slate-400 space-y-1 leading-tight list-none">
                      <li>• Verifique a pasta de <b>Spam</b></li>
                      <li>• Aguarde até 5 minutos para o processamento</li>
                    </ul>
                  </div>
                </div>

                <ActionButton 
                  label="VOLTAR PARA O LOGIN"
                  onClick={() => router.push("/login")}
                  fullWidth={true}
                />
                
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-[11px] font-bold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-widest"
                >
                  Tentar outro e-mail
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="w-full shrink-0">
        <Footer />
      </footer>
    </main>
  );
}