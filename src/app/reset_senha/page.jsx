"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import Input from "../../components/Input";
import ActionButton from "../../components/ActionButton";
import Footer from "../../components/Footer";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("A SENHA DEVE TER NO MÍNIMO 6 CARACTERES.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("AS SENHAS DIGITADAS NÃO CONFEREM.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    /* Ajuste de min-h-screen para preenchimento total em monitores de 23" */
    <main className="min-h-screen w-full bg-login-image flex flex-col items-center justify-between font-sans overflow-hidden">
      
      {/* Container flex-1 com items-center para centralização vertical real */}
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
            {!isSuccess ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-700 uppercase tracking-tight">Nova Senha</h2>
                  <p className="text-xs text-slate-400 mt-2">
                    Crie uma combinação segura para o seu próximo acesso.
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

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <Input 
                    label="NOVA SENHA" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
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

                  <Input 
                    label="CONFIRMAR NOVA SENHA" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  >
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-blue-600 transition-all"
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Input>

                  <div className="pt-4">
                    <ActionButton 
                      label="ATUALIZAR SENHA"
                      type="submit"
                      loading={isLoading}
                      loadingText="ATUALIZANDO..."
                      fullWidth={true}
                    />
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center animate-in fade-in zoom-in duration-500 py-2">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                  <ShieldCheck size={32} />
                </div>
                
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-3">
                  Senha Alterada!
                </h2>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-8 px-4">
                  Sua nova credencial foi registrada com sucesso. Você já pode acessar o sistema com segurança.
                </p>

                <ActionButton 
                  label="IR PARA O LOGIN"
                  onClick={() => router.push("/login")}
                  fullWidth={true}
                />
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