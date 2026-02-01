// components/cv-steps/Step3Resumo.tsx
'use client'

import { useState } from 'react'
import { Wand2, Timer, AlignLeft, Sparkles } from 'lucide-react'

interface StepProps {
  dados: { resumo: string; cargo: string };
  update: (obj: any) => void;
  gerarIA: (campo: string) => void;
}

export default function Step3Resumo({ dados, update, gerarIA }: StepProps) {
  const [loading, setLoading] = useState(false);

  const handleIA = async () => {
    setLoading(true);
    await gerarIA('resumo');
    // Pequeno delay para o usuário sentir o "processamento" da IA
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <span className="text-blue-600 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-xl not-italic">3</span>
            Resumo
          </h2>
          <p className="text-slate-400 font-bold text-sm ml-1">
            Destaque suas melhores qualidades e experiências.
          </p>
        </div>

        {/* BOTÃO IA FLUTUANTE */}
        <button 
          onClick={handleIA}
          disabled={loading}
          className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-slate-200"
        >
          {loading ? (
            <> <Timer className="animate-spin" size={14}/> GERANDO... </>
          ) : (
            <> <Sparkles size={14} className="text-yellow-400"/> Sugerir com IA </>
          )}
        </button>
      </div>

      <div className="group relative">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-1.5 block group-focus-within:text-blue-600 transition-colors">
          Sobre Você
        </label>
        <div className="relative">
          <div className="absolute left-6 top-8 text-slate-300 group-focus-within:text-blue-600 transition-colors">
            <AlignLeft size={20} />
          </div>
          <textarea 
            className="w-full pl-14 pr-8 py-8 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none font-medium leading-relaxed shadow-inner min-h-[250px] transition-all placeholder:text-slate-300" 
            value={dados.resumo} 
            onChange={e => update({resumo: e.target.value})} 
            placeholder="Ex: Profissional com experiência em atendimento ao cliente e organização de estoque..."
          />
        </div>
      </div>

      {/* AVISO DE CARGO */}
      {!dados.cargo && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <p className="text-[10px] font-bold text-amber-700 uppercase">
            Preencha o cargo na Etapa 1 para a IA ser mais precisa!
          </p>
        </div>
      )}
    </div>
  )
}
