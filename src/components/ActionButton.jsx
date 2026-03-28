"use client";

export default function ActionButton({ 
  onClick, 
  icon: Icon,
  label, 
  className = "" 
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={3} />}
      {label}
    </button>
  );
}