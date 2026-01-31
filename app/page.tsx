'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  ArrowLeft, CheckCircle2, Eye, Camera, X, Sparkles, Target, Briefcase, 
  TrendingUp, RefreshCcw, Send, AlertTriangle, Lightbulb, Languages, 
  Phone, Mail, MapPin, Award, Link, Star, BookOpen, Clock, Linkedin, Users, Timer
} from 'lucide-react'

// --- MOTOR DE IA PARA OTIMIZAÇÃO ---
const IA_Otimizar = (dados: any) => {
  const glossario: { [key: string]: string } = {
    "limpeza": "Higiene e organização de ambientes operacionais",
    "ajudei": "Contribuí ativamente na execução de",
    "atendimento": "Excelência no suporte ao cliente e resolução de demandas",
    "vendi": "Gestão comercial e conversão de vendas",
    "caixa": "Operação financeira e conciliação de PDV"
  };

  let resumo = dados.resumo || "Profissional em busca de novos desafios...";
  let exp = dados.exp;

  if (dados.vagaTexto && dados.vagaTexto.length > 20) {
    resumo = `Especialista com competências alinhadas aos requisitos de ${dados.cargo}. Focado em entregar resultados baseados nas necessidades da vaga de ${dados.cargo}. ` + resumo;
  }

  Object.keys(glossario).forEach(termo => {
    const regex = new RegExp(termo, "gi");
    resumo = resumo.replace(regex, glossario[termo]);
    exp = exp.replace(regex, glossario[termo]);
  });

  return { 
    ...dados, 
    resumo, 
    exp: exp.split('\n').filter((l:string)=>l.trim()).map((l:string)=>l.startsWith('•')?l:`• ${l.trim()}`).join('\n') 
  };
};

export default function GeradorCurriculoMaster() {
  const [fluxo, setFluxo] = useState(0); 
  const [foto, setFoto] = useState<string | null>(null);
  const [pago, setPago] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não possuo', disponibilidade: '', vagaTexto: '', referencias: ''
  });

  useEffect(() => {
    const salvo = localStorage.getItem('cv_dados_cache');
    if (salvo) setDados(JSON.parse(salvo));
    const params = new URLSearchParams(window.location.search);
    if (params.get('pago') === 'true') {
      setPago(true);
      setFluxo(11);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cv_dados_cache', JSON.stringify(dados));
  }, [dados]);

  const gerarCV = useCallback(() => {
    const f = IA_Otimizar(dados);
    const html = `
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          @page { size: A4; margin: 0; }
          * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }
          body { width: 210mm; padding: 25mm 20mm; color: #333; line-height: 1.6; }
          .header { border-bottom: 6px solid #2563eb; padding-bottom: 25px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
          .nome { font-size: 28pt; font-weight: 800; text-transform: uppercase; letter-spacing: -1.5px; }
          .cargo { font-size: 18pt; color: #2563eb; font-weight: 700; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1.6fr 1.1fr; gap: 40px; }
          .secao { margin-bottom: 25px; }
          .titulo { font-size: 12pt; color: #2563eb; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; padding-bottom: 5px; margin-bottom: 10px; }
          .texto { font-size: 10.5pt; text-align: justify; white-space: pre-wrap; }
          .tag { display: inline-block; background: #eff6ff; border: 1px solid #bfdbfe; padding: 3px 8px; margin: 0 4px 4px 0; font-size: 8.5pt; font-weight: 700; border-radius: 4px; color: #1e40af; }
          .foto { width: 110px; height: 130px; border-radius: 10px; object-fit: cover; border: 1px solid #ddd; }
          .item-contato { font-size: 9.5pt; font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div><h1 class="nome">${f.nome || 'NOME'}</h1><div class="cargo">${f.cargo || 'CARGO'}</div></div>
          ${foto ? `<img src="${foto}" class="foto" />` : ''}
        </div>
        <div class="grid">
          <div>
            <div class="secao"><h2 class="titulo">Perfil Profissional</h2><div class="texto">${f.resumo}</div></div>
            <div class="secao"><h2 class="titulo">Experiência Profissional</h2><div class="texto">${f.exp}</div></div>
            ${f.referencias ? `<div class="secao"><h2 class="titulo">Referências Profissionais</h2><div class="texto">${f.referencias}</div></div>` : ''}
            ${f.cursos ? `<div class="secao"><h2 class="titulo">Cursos e Certificações</h2><div class="texto">${f.cursos}</div></div>` : ''}
          </div>
          <div>
            <div class="secao">
              <h2 class="titulo">Contato</h2>
              <div class="item-contato">📍 ${f.cidade}</div>
              <div class="item-contato">📞 ${f.tel}</div>
              <div class="item-contato">✉️ ${f.email}</div>
              ${f.linkedin ? `<div class="item-contato">🔗 ${f.linkedin}</div>` : ''}
            </div>
            <div class="secao"><h2 class="titulo">Habilidades</h2><div>${f.skills.split(',').map(s=>`<span class="tag">${s.trim()}</span>`).join('')}</div></div>
            <div class="secao"><h2 class="titulo">Formação</h2><div class="texto">${f.estudos}</div></div>
            ${f.idiomas ? `<div class="secao"><h2 class="titulo">Idiomas</h2><div class="texto">${f.idiomas}</div></div>` : ''}
            <div class="secao">
              <h2 class="titulo">Adicionais</h2>
              <div class="item-contato"><b>CNH:</b> ${f.cnh}</div>
              <div class="item-contato"><b>Disponibilidade:</b> ${f.disponibilidade}</div>
            </div>
          </div>
        </div>
      </body>
      </html>`;
    const win = window.open('','_blank'); win?.document.write(html); win?.document.close();
    setTimeout(() => win?.print(), 500);
  }, [dados, foto]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* PROGRESSO */}
        <div className="bg-slate-50 border-bottom p-6 flex items-center gap-4">
          <button onClick={() => setFluxo(f => f - 1)} disabled={fluxo === 0} className="p-2 disabled:invisible text-slate-400 hover:text-blue-600 transition-colors"><ArrowLeft/></button>
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full"><div className="h-full bg-blue-600 transition-all" style={{width: `${(fluxo/11)*100}%`}}/></div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Etapa {fluxo + 1} de 12</span>
        </div>

        <div className="p-8 md:p-12">
          
          {/* ETAPAS ANTERIORES (CONSERVEI TODA A LÓGICA) */}
          {fluxo === 0 && (
            <div className="space-y-6 animate-in zoom-in text-center">
              <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Vamos começar?</h1>
              <p className="text-slate-500 font-medium">Crie um currículo profissional em minutos.</p>
              <div className="grid gap-3 text-left">
                {["Não sou chamado para entrevistas", "Currículo desatualizado", "Mudança de área", "Primeiro emprego"].map(t => (
                  <button key={t} onClick={()=>setFluxo(1)} className="p-5 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-slate-700">{t}</button>
                ))}
              </div>
            </div>
          )}

          {/* ... (Etapas 1 a 10 omitidas para brevidade, mas mantidas iguais no seu código real) */}
          {fluxo === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-2 text-blue-600"><Target/> <h2 className="font-black uppercase tracking-widest text-sm">Foco na Vaga</h2></div>
              <textarea className="w-full h-32 p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-600" placeholder="Cole aqui a descrição da vaga (Opcional)..." value={dados.vagaTexto} onChange={(e)=>setDados({...dados, vagaTexto:e.target.value})}/>
              <button onClick={()=>setFluxo(2)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black shadow-lg uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right-4">
              <div className="flex justify-center">
                <label className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden">
                  {foto ? <img src={foto} className="w-full h-full object-cover"/> : <Camera className="text-slate-400"/>}
                  <input type="file" className="hidden" onChange={(e:any)=>{const f=e.target.files[0]; if(f){const r=new FileReader(); r.onloadend=()=>setFoto(r.result as string); r.readAsDataURL(f)}}}/>
                </label>
              </div>
              <input className="w-full h-14 px-6 rounded-xl border-2 border-slate-100 outline-none focus:border-blue-500" placeholder="Nome Completo" value={dados.nome} onChange={(e)=>setDados({...dados, nome:e.target.value})}/>
              <input className="w-full h-14 px-6 rounded-xl border-2 border-slate-100 outline-none focus:border-blue-500" placeholder="Cargo que busca" value={dados.cargo} onChange={(e)=>setDados({...dados, cargo:e.target.value})}/>
              <button onClick={()=>setFluxo(3)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
               <h2 className="text-xl font-black text-slate-800">Contatos Pessoais</h2>
              <div className="grid gap-4">
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border"><Phone className="text-slate-400 ml-2"/><input className="flex-1 bg-transparent h-10 outline-none" placeholder="WhatsApp" value={dados.tel} onChange={(e)=>setDados({...dados, tel:e.target.value})}/></div>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border"><Mail className="text-slate-400 ml-2"/><input className="flex-1 bg-transparent h-10 outline-none" placeholder="E-mail" value={dados.email} onChange={(e)=>setDados({...dados, email:e.target.value})}/></div>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border"><MapPin className="text-slate-400 ml-2"/><input className="flex-1 bg-transparent h-10 outline-none" placeholder="Cidade-UF" value={dados.cidade} onChange={(e)=>setDados({...dados, cidade:e.target.value})}/></div>
              </div>
              <button onClick={()=>setFluxo(4)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 4 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-black text-slate-800">LinkedIn</h2>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-2">
                <p className="text-blue-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14}/> LinkedIn é opcional, mas gera confiança!
                </p>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border focus-within:border-blue-500 transition-all">
                <Linkedin className="text-blue-600 ml-2"/>
                <input className="flex-1 bg-transparent h-10 outline-none" placeholder="Link do seu perfil (Opcional)" value={dados.linkedin} onChange={(e)=>setDados({...dados, linkedin:e.target.value})}/>
              </div>
              <button onClick={()=>setFluxo(5)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 5 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-black text-blue-600">Perfil Profissional</h2>
              <textarea className="w-full h-44 p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-600" placeholder="Conte brevemente sua carreira..." value={dados.resumo} onChange={(e)=>setDados({...dados, resumo:e.target.value})}/>
              <button onClick={()=>setFluxo(6)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 6 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-black text-slate-800">Experiência Profissional</h2>
              <textarea className="w-full h-44 p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-600" placeholder="Empresa - Cargo - Período. O que você fazia lá?" value={dados.exp} onChange={(e)=>setDados({...dados, exp:e.target.value})}/>
              <button onClick={()=>setFluxo(7)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 7 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-black text-slate-800">Formação e Skills</h2>
              <input className="w-full h-14 px-6 rounded-xl border-2 border-slate-100 outline-none" placeholder="Escolaridade (Curso, Instituição)" value={dados.estudos} onChange={(e)=>setDados({...dados, estudos:e.target.value})}/>
              <input className="w-full h-14 px-6 rounded-xl border-2 border-slate-100 outline-none" placeholder="Habilidades (Separe por vírgulas)" value={dados.skills} onChange={(e)=>setDados({...dados, skills:e.target.value})}/>
              <button onClick={()=>setFluxo(8)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 8 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-2 text-blue-600"><Users/> <h2 className="text-xl font-black">Referências</h2></div>
              <textarea className="w-full h-32 p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-600" placeholder="Ex: João Silva (Gerente na Empresa X) - (11) 99999-9999" value={dados.referencias} onChange={(e)=>setDados({...dados, referencias:e.target.value})}/>
              <button onClick={()=>setFluxo(9)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 9 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Cursos e Idiomas</h2>
              <textarea className="w-full h-24 p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-600" placeholder="Cursos extracurriculares..." value={dados.cursos} onChange={(e)=>setDados({...dados, cursos:e.target.value})}/>
              <input className="w-full h-14 px-6 rounded-xl border-2 border-slate-100 outline-none focus:border-blue-600" placeholder="Idiomas e Níveis" value={dados.idiomas} onChange={(e)=>setDados({...dados, idiomas:e.target.value})}/>
              <button onClick={()=>setFluxo(10)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wider">Próximo</button>
            </div>
          )}

          {fluxo === 10 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Informações Finais</h2>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Categoria da CNH</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Não possuo", "A", "B", "AB", "C", "D", "E"].map((tipo) => (
                    <button key={tipo} onClick={() => setDados({...dados, cnh: tipo})} className={`h-12 rounded-xl font-bold text-sm transition-all border-2 ${dados.cnh === tipo ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}>{tipo}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Disponibilidade</label>
                <input className="w-full h-14 px-6 rounded-xl border-2 border-slate-100 outline-none focus:border-blue-600" placeholder="Ex: Imediata, Integral..." value={dados.disponibilidade} onChange={(e)=>setDados({...dados, disponibilidade:e.target.value})}/>
              </div>
              <button onClick={()=>setFluxo(11)} className="w-full h-16 bg-green-600 text-white rounded-xl font-black shadow-lg uppercase tracking-wider">Concluir Currículo</button>
            </div>
          )}

          {/* TELA DE PAGAMENTO ATUALIZADA - ETAPA 11 */}
          {fluxo === 11 && (
            <div className="text-center space-y-6 animate-in zoom-in">
              {!pago ? (
                <div className="space-y-6">
                  <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                    <Sparkles className="absolute top-4 right-4 opacity-20" size={60}/>
                    <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Currículo Otimizado!</h2>
                    <p className="text-blue-100 text-sm font-medium">Sua trajetória está pronta para os recrutadores.</p>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Preço Especial</span>
                    <div className="text-5xl font-black text-slate-800">R$ 5,99</div>
                    <div className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Acesso Instantâneo via Pix</div>
                  </div>

                  {/* AVISO DE ATENÇÃO PARA O REDIRECIONAMENTO */}
                  <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-2xl flex gap-4 items-start text-left">
                    <div className="bg-amber-500 p-2 rounded-lg text-white shrink-0 shadow-sm">
                      <Timer size={20} className="animate-pulse"/>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-amber-800 text-sm uppercase tracking-tight">Atenção ao pagar!</h4>
                      <p className="text-amber-700 text-xs leading-relaxed font-medium">
                        Após pagar o Pix, <b>não feche a tela do banco nem o navegador</b>. Aguarde 5 segundos e você será trazido de volta para esta página para baixar seu arquivo automaticamente.
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'}
                    className="w-full h-20 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 border-b-[6px] border-blue-800"
                  >
                    LIBERAR MEU CURRÍCULO <Send size={24}/>
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-in bounce-in">
                  <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-8 border-green-100">
                    <CheckCircle2 size={48}/>
                  </div>
                  <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Pagamento Confirmado!</h1>
                  <button onClick={gerarCV} className="w-full h-24 bg-blue-600 text-white rounded-3xl font-black text-2xl shadow-2xl flex items-center justify-center gap-4 hover:scale-105 transition-all border-b-[10px] border-blue-800">
                    <Eye size={32}/> BAIXAR PDF AGORA
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
