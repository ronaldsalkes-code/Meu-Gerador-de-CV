export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12);
  const [pago, setPago] = useState(false);
  const [gerandoIA, setGerandoIA] = useState(false); // <--- NOVO: Estado para a IA
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: ''
  });

  // <--- NOVA FUNÇÃO: Chama o Gemini que você configurou na Vercel
  const otimizarComIA = async () => {
    if (!dados.vagaTexto) {
      alert("Por favor, cole a descrição da vaga no passo 3 para eu poder otimizar!");
      setFluxo(3);
      return;
    }

    setGerandoIA(true);
    try {
      const response = await fetch('/api/gerar-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados }),
      });
      
      const data = await response.json();
      
      // Atualiza o currículo com o texto profissional da IA
      setDados(prev => ({
        ...prev,
        resumo: data.resumo,
        exp: data.exp,
        skills: data.skills
      }));
      
      alert("IA: Seu currículo foi otimizado com sucesso!");
    } catch (err) {
      alert("Erro ao conectar com a IA. Verifique sua chave na Vercel.");
    } finally {
      setGerandoIA(false);
    }
  };
