{/* ETAPA 2: NOME E CARGO */}
{fluxo === 2 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Identificação</h2>
    <div className="grid gap-4">
      <input className="p-5 rounded-2xl bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-bold" placeholder="Nome Completo" value={dados.nome} onChange={e => salvar({...dados, nome: e.target.value})}/>
      <input className="p-5 rounded-2xl bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-bold" placeholder="Cargo que deseja" value={dados.cargo} onChange={e => salvar({...dados, cargo: e.target.value})}/>
    </div>
  </div>
)}

{/* ETAPA 3: REDES SOCIAIS E EMAIL */}
{fluxo === 3 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Presença Digital</h2>
    <div className="grid gap-4">
      <div className="relative">
        <Mail className="absolute left-5 top-5 text-slate-300" size={20}/>
        <input className="w-full p-5 pl-14 rounded-2xl bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-bold" placeholder="E-mail profissional" value={dados.email} onChange={e => salvar({...dados, email: e.target.value})}/>
      </div>
      <div className="relative">
        <Linkedin className="absolute left-5 top-5 text-slate-300" size={20}/>
        <input className="w-full p-5 pl-14 rounded-2xl bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-bold" placeholder="Link do LinkedIn (opcional)" value={dados.linkedin} onChange={e => salvar({...dados, linkedin: e.target.value})}/>
      </div>
    </div>
  </div>
)}

{/* ETAPA 4: RESUMO PROFISSIONAL */}
{fluxo === 4 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Sobre você</h2>
    <p className="text-sm text-slate-500 font-medium">Fale um pouco sobre sua trajetória e seus pontos fortes.</p>
    <textarea className="w-full h-48 p-6 rounded-[2rem] bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-medium leading-relaxed" placeholder="Ex: Profissional com 5 anos de experiência em vendas..." value={dados.resumo} onChange={e => salvar({...dados, resumo: e.target.value})}/>
  </div>
)}

{/* ETAPA 5: EXPERIÊNCIA PROFISSIONAL */}
{fluxo === 5 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Experiência</h2>
    <textarea className="w-full h-64 p-6 rounded-[2rem] bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-medium" placeholder="Empresa - Cargo - Período&#10;• Descreva suas tarefas principais..." value={dados.exp} onChange={e => salvar({...dados, exp: e.target.value})}/>
  </div>
)}

{/* ETAPA 6: FORMAÇÃO ACADÊMICA */}
{fluxo === 6 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Educação</h2>
    <textarea className="w-full h-40 p-6 rounded-[2rem] bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-medium" placeholder="Curso - Instituição - Ano de Conclusão" value={dados.estudos} onChange={e => salvar({...dados, estudos: e.target.value})}/>
  </div>
)}

{/* ETAPA 7: HABILIDADES (SKILLS) */}
{fluxo === 7 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Habilidades Técnicas</h2>
    <input className="w-full p-5 rounded-2xl bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-bold" placeholder="Ex: Excel, Gestão de Pessoas, JavaScript (separe por vírgula)" value={dados.skills} onChange={e => salvar({...dados, skills: e.target.value})}/>
  </div>
)}

{/* ETAPA 8: CURSOS E IDIOMAS */}
{fluxo === 8 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Idiomas e Certificados</h2>
    <textarea className="w-full h-40 p-6 rounded-[2rem] bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-medium" placeholder="Ex: Inglês Intermediário, Certificação Google..." value={dados.cursos} onChange={e => salvar({...dados, cursos: e.target.value})}/>
  </div>
)}

{/* ETAPA 9: REFERÊNCIAS */}
{fluxo === 9 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Referências</h2>
    <textarea className="w-full h-40 p-6 rounded-[2rem] bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-medium" placeholder="Nome do contato - Telefone (Opcional)" value={dados.referencias} onChange={e => salvar({...dados, referencias: e.target.value})}/>
  </div>
)}

{/* ETAPA 10: REVISÃO E ADICIONAIS */}
{fluxo === 10 && (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <h2 className="text-2xl font-black text-slate-800 italic">Dados Finais</h2>
    <div className="grid gap-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Categoria CNH</label>
        <div className="grid grid-cols-4 gap-2">
          {["Não", "A", "B", "AB", "C", "D", "E"].map((tipo) => (
            <button key={tipo} onClick={() => salvar({...dados, cnh: tipo})} className={`h-12 rounded-xl font-bold transition-all border-2 ${dados.cnh === tipo ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-400"}`}>{tipo}</button>
          ))}
        </div>
      </div>
      <input className="p-5 rounded-2xl bg-white border-2 border-slate-100 outline-none focus:border-blue-600 font-bold" placeholder="Disponibilidade (Ex: Imediata)" value={dados.disponibilidade} onChange={e => salvar({...dados, disponibilidade: e.target.value})}/>
    </div>
  </div>
)}
