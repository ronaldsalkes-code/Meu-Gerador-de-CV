// components/cv-steps/Step2Contato.tsx
'use client'

import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'

interface StepProps {
  dados: { tel: string; email: string; cidade: string; linkedin: string };
  update: (obj: any) => void;
}

export default function Step2Contato({ dados, update }: StepProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <span className="text-blue-600 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-xl not-italic">2</span>
          Contato
        </h2>
        <p className="text-slate-400 font-bold text-sm ml-1">
          Como as empresas podem te encontrar? Capriche nos detalhes.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <div className="group">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-1.5 block">WhatsApp / Tel</label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                <Phone size={18} />
              </div>
              <input 
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold transition-all shadow-sm" 
                value={dados.tel} 
                onChange={e => update({tel: e.target.value})} 
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {/* E-mail */}
          <div className="group">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-1.5 block">E-mail</label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold transition-all shadow-sm" 
                value={dados.email} 
                onChange={e => update({email: e.target.value})} 
                placeholder="seu@email.com"
              />
            </div>
          </div>
        </div>

        {/* Cidade / Estado */}
        <div className="group">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-1.5 block">Onde você mora?</label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
              <MapPin size={18} />
            </div>
            <input 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold transition-all shadow-sm" 
              value={dados.cidade} 
              onChange={e => update({cidade: e.target.value})} 
              placeholder="Ex: São Paulo - SP"
            />
          </div>
        </div>

        {/* LinkedIn (Opcional) */}
        <div className="group">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-1.5 block">LinkedIn (URL)</label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
              <Linkedin size={18} />
            </div>
            <input 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold transition-all shadow-sm" 
              value={dados.linkedin} 
              onChange={e => update({linkedin: e.target.value})} 
              placeholder="linkedin.com/in/seu-perfil"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
