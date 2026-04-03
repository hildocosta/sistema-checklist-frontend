import { PrismaClient } from "@prisma/client";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  Clock, 
  FileText,
  Building2
} from "lucide-react";

const prisma = new PrismaClient();

export default async function ValidarPage({ params }) {
  const { hash } = params;

  // Busca o registro no banco de dados pelo Hash
  const relatorio = await prisma.relatorio.findUnique({
    where: { hash: hash },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
        
        {/* Header Institucional */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <ShieldCheck className="mx-auto mb-3 text-blue-400 relative z-10" size={48} />
          <h1 className="text-white text-lg font-bold uppercase tracking-[0.2em] relative z-10">
            Autenticação Digital
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1 relative z-10">
            PMPR • 17º BPM • 4ª SEÇÃO
          </p>
        </div>

        <div className="p-8">
          {relatorio ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-700">
              {/* Status Sucesso */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-2">
                  <CheckCircle2 className="text-emerald-500" size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Documento Válido</h2>
                <p className="text-slate-500 text-sm px-4">
                  As informações abaixo foram conferidas e constam em nossos registros oficiais de carga.
                </p>
              </div>

              {/* Card de Detalhes */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-blue-600">
                    <User size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-left">Responsável pela Conferência</p>
                    <p className="text-sm font-bold text-slate-700 leading-tight text-left">
                      {relatorio.responsavel}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400"><Calendar size={14} /></div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Data</p>
                      <p className="text-sm font-bold text-slate-700">{relatorio.data}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400"><Clock size={14} /></div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Hora</p>
                      <p className="text-sm font-bold text-slate-700">{relatorio.hora}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-slate-200/50">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500">
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-left">Unidade Detentora</p>
                    <p className="text-sm font-bold text-slate-700 leading-tight text-left">
                      17º Batalhão de Polícia Militar - SJP
                    </p>
                  </div>
                </div>
              </div>

              {/* ID de Verificação */}
              <div className="text-center pt-2">
                <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                  <span className="text-[10px] font-mono font-bold text-slate-400">ID: {hash}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Status Erro */
            <div className="py-10 text-center space-y-6 animate-in shake duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full">
                <XCircle className="text-red-500" size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800">Não Encontrado</h2>
                <p className="text-slate-500 text-sm px-6">
                  Este código de autenticidade não é reconhecido pelo sistema. O documento pode ser inválido ou expirado.
                </p>
              </div>
              <div className="pt-4 px-8 text-xs text-slate-400 italic">
                Atenção: A falsificação de documentos públicos é crime conforme o Art. 297 do Código Penal.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.1em] uppercase">
            Sistema de Gestão de Carga Institucional
          </p>
        </div>
      </div>
    </div>
  );
}