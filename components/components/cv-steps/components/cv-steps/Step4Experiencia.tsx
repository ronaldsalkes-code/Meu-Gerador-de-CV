// components/cv-steps/Step4Experiencia.tsx
'use client'

import { useState } from 'react'
import { Briefcase, Wand2, Timer, Plus, Info } from 'lucide-react'

interface StepProps {
  dados: { exp: string; cargo: string };
  update: (obj: any) => void;
  gerarIA: (campo: string) => void;
}

export default function Step4Experiencia({ dados, update, gerarIA }: StepProps) {
  const [loading, setLoading] = useState(false);

  const handleIA = async () => {
    setLoading(true);
    await gerarIA('exp');
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <span className="text-blue-600 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-xl not-italic">4</span>
            Experiências
          </h2>
          <p className="text-slate-400 font-bold text-sm ml-1">
            Conte onde trabalhou e o que você conquistou lá.
          </p>
        </div>

        <button 
          onClick={handleIA}
          disabled={loading}
          className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-slate-200"
        >
          {loading ? (
            <Timer className="animate-spin" size={14}/>
          ) : (
            <Wand2 size={14} className="text-blue-400"/>
          )}
          IA Sugerir Tópicos
        </button>
      </div>

      <div className="group relative">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-1.5 block group-focus-within:text-blue-600 transition-colors">
          Histórico Profissional
        </label>
        <div className="relative">
          <div className="absolute left-6 top-8 text-slate-300 group-focus-within:text-blue-600 transition-colors">
            <Briefcase size={20} />
          </div>
          <textarea 
            className="w-full pl-14 pr-8 py-8 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none font-medium leading-relaxed shadow-inner min-h-[300px] transition-all placeholder:text-slate-300" 
            value={dados.exp} 
            onChange={e => update({exp: e.target.value})} 
            placeholder="Ex: Empresa Tal (2020 - 2023)&#10;Cargo: Auxiliar&#10;• Realizei a organização de documentos...&#10;• Auxiliei no atendimento..."
          />
        </div>
      </div>

      <div className="flex gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 items-start">
        <div className="bg-white p-2 rounded-lg shadow-sm">
            <Info size={16} className="text-blue-600"/>
        </div>
        <div className="space-y-1">
            <p className="text-[11px] font-black uppercase text-slate-700">Dica de Ouro</p>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Coloque sempre a experiência mais **recente primeiro**. Use tópicos (•) para listar suas tarefas, isso facilita muito a leitura do recrutador!
            </p>
        </div>
      </div>
    </div>
  )
}
