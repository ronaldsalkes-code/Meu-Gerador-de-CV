// components/cv-steps/Step1Identificacao.tsx
'use client'

import { User, Briefcase } from 'lucide-react'

interface StepProps {
  dados: { nome: string; cargo: string };
  update: (obj: any) => void;
}

export default function Step1Identificacao({ dados, update }: StepProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
      {/* Cabeçalho da Etapa */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <span className="text-blue-600 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-xl not-italic">1</span>
          Quem é você?
        </h2>
        <p className="text-slate-400 font-bold text-sm ml-1">
          Insira seus dados básicos de identificação para começar seu currículo.
        </p>
      </div>
      
      <div className="space-y-5">
        {/* Campo Nome */}
        <div className="group">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-1.5 block group-focus-within:text-blue-600 transition-colors">
            Nome Completo
          </label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
              <User size={20} />
            </div>
            <input 
              className="w-full pl-14 pr-6 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none font-bold transition-all shadow-sm placeholder:text-slate-300" 
              value={dados.nome} 
              onChange={e => update({nome: e.target.value})} 
              placeholder="Ex: João Silva"
            />
          </div>
        </div>

        {/* Campo Cargo */}
        <div className="group">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-1.5 block group-focus-within:text-blue-600 transition-colors">
            Cargo Desejado
          </label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
              <Briefcase size={20} />
            </div>
            <input 
              className="w-full pl-14 pr-6 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none font-bold transition-all shadow-sm placeholder:text-slate-300" 
              value={dados.cargo} 
              onChange={e => update({cargo: e.target.value})} 
              placeholder="Ex: Auxiliar Administrativo"
            />
          </div>
        </div>
      </div>

      {/* Dica visual */}
      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
        <p className="text-[10px] font-bold text-blue-600 leading-relaxed">
          💡 DICA: Use o cargo exatamente como aparece na vaga que você deseja se candidatar. Isso ajuda o recrutador a te achar!
        </p>
      </div>
    </div>
  )
}
