import { prisma } from "../../../lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  Clock, 
  Building2,
  FileSearch
} from "lucide-react";
import Footer from "../../components/Footer";

export default async function ValidarPage({ params }) {
  const { hash } = await params;

  // Busca o registro no banco de dados pelo Hash
  const relatorio = await prisma.relatorio.findUnique({
    where: { hash: hash },
  });

  return (
    <main className="h-screen w-full bg-login-image flex flex-col items-center justify-between font-sans overflow-hidden">
      
      <div className="flex-1 flex items-start justify-center w-full p-4 pt-20 overflow-y-auto no-scrollbar">
        <div className="relative w-full max-w-sm">
          
          {/* Cabeçalho Flutuante idêntico ao Login */}
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
            
            {relatorio ? (
              <div className="space-y-6">
                {/* Status Sucesso */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-3 border border-emerald-100">
                    <CheckCircle2 className="text-emerald-500" size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-700">Relatório Válido</h2>
                  <p className="text-xs text-slate-500">Documento autenticado no sistema</p>
                </div>

                {/* Grid de Informações Estilo Formulário */}
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-1">
                      <User size={14} className="text-blue-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Responsável</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 uppercase">
                      {relatorio.responsavel}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Data</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">{relatorio.data}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Hora</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">{relatorio.hora}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <div className="flex items-center gap-3 mb-1">
                      <FileSearch size={14} className="text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Código de Verificação</span>
                    </div>
                    <p className="text-[10px] font-mono font-bold text-blue-600 break-all uppercase">
                      {hash}
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-center">
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                     PMPR • 17º BPM • SJP
                   </p>
                </div>
              </div>
            ) : (
              /* Status Erro */
              <div className="py-6 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full border border-red-100">
                  <XCircle className="text-red-500" size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-700">Não Encontrado</h2>
                  <p className="text-xs text-slate-500 mt-2">
                    Este código não consta em nossos registros oficiais.
                  </p>
                </div>
                
                <Link 
                  href="/login" 
                  className="inline-block text-sm text-blue-500 font-bold hover:underline"
                >
                  Voltar para o Início
                </Link>

                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[9px] text-red-400 italic px-4 leading-tight">
                    A falsificação de documentos públicos é crime conforme o Art. 297 do Código Penal.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <footer className="w-full">
        <Footer />
      </footer>
    </main>
  );
}