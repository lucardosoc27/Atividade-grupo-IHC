// Dados de demonstração: contas de alunos, atividades e entregas iniciais.
// Em um sistema real isso viria de um back-end; aqui é um mock fixo
// que alimenta o protótipo sem servidor nenhum.

// Prazos são calculados em relação a hoje para que a demonstração e os
// testes com usuários sempre tenham uma atividade atrasada, uma com
// prazo próximo e duas folgadas, independente de quando forem rodados.
function prazoRelativo(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  data.setHours(23, 59, 0, 0);
  return data.toISOString();
}

function momentoRelativo(dias, hora) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  data.setHours(hora, 0, 0, 0);
  return data.toISOString();
}

// Todas as contas usam a mesma senha para facilitar o teste com usuários.
const ALUNOS = [
  { nome: "Ana Beatriz Santos", matricula: "2024101", senha: "senai123" },
  { nome: "Carlos Eduardo Lima", matricula: "2024102", senha: "senai123" },
  { nome: "Júlia Ferreira", matricula: "2024103", senha: "senai123" },
];

const ATIVIDADES = [
  {
    id: 1,
    titulo: "Relatório de Testes de Usabilidade",
    disciplina: "Interface Humano-Computador",
    professor: "Prof.ª Camila Andrade",
    prazo: prazoRelativo(-3),
    formatosAceitos: ["pdf"],
    tamanhoMaximoMB: 20,
    descricao:
      "Entregar o relatório com os resultados dos testes de usabilidade aplicados ao " +
      "protótipo da atividade anterior, incluindo as heurísticas de Nielsen violadas " +
      "e as sugestões de correção para cada uma.",
  },
  {
    id: 2,
    titulo: "Modelagem de Banco de Dados — Loja 2.0",
    disciplina: "Implantação de Sistemas",
    professor: "Prof. Ricardo Nunes",
    prazo: prazoRelativo(1),
    formatosAceitos: ["pdf", "zip"],
    tamanhoMaximoMB: 20,
    descricao:
      "Enviar o diagrama entidade-relacionamento e o script de criação das tabelas " +
      "do sistema de migração da Loja 2.0, conforme discutido em aula. Pode ser um " +
      "PDF único ou um ZIP com o diagrama e o script.",
  },
  {
    id: 3,
    titulo: "Plano de Testes de Manutenção",
    disciplina: "Teste e Manutenção de Sistemas",
    professor: "Prof.ª Renata Souza",
    prazo: prazoRelativo(7),
    formatosAceitos: ["pdf", "docx"],
    tamanhoMaximoMB: 10,
    descricao:
      "Enviar o plano de testes de manutenção corretiva para os chamados abertos " +
      "no sistema de biblioteca, com os casos de teste priorizados por severidade.",
  },
  {
    id: 4,
    titulo: "Protótipo Angular — Dashboard",
    disciplina: "Front-end",
    professor: "Prof. Marcos Lima",
    prazo: prazoRelativo(14),
    formatosAceitos: ["zip"],
    tamanhoMaximoMB: 50,
    descricao:
      "Enviar o projeto do dashboard em Angular compactado em ZIP, contendo " +
      "autenticação simulada e o player de vídeo institucional. Não inclua a " +
      "pasta node_modules.",
  },
];

// Entregas com que cada conta começa. A conta 2024101 já tem uma atividade
// enviada para a lista mostrar variedade sem o testador precisar enviar antes.
const ENTREGAS_INICIAIS = {
  2024101: {
    3: {
      nomeArquivo: "plano-testes-manutencao.pdf",
      comentario: "Segue o plano com os casos priorizados por severidade.",
      enviadoEm: momentoRelativo(-1, 15),
    },
  },
  2024102: {},
  2024103: {},
};
