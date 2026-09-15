// Dados de demonstração: contas de alunos, atividades e entregas iniciais.
// Em um sistema real isso viria de um back-end; aqui é um mock fixo
// que alimenta o protótipo sem servidor nenhum.

// Prazos e momentos de entrega são calculados em relação a hoje para que a
// demonstração e os testes com usuários mostrem, em qualquer data e em qualquer
// conta, pelo menos um exemplo de cada status: Pendente com prazo folgado,
// Pendente com prazo próximo, Atrasada, Enviada e Enviada com atraso.
// A composição de cada conta está documentada no CONTEXT.md.
function prazoRelativo(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  data.setHours(23, 59, 0, 0);
  return data.toISOString();
}

// Só usar com dias negativos: garante que a entrega já aconteceu, seja qual
// for a hora em que o protótipo é aberto.
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

// Prazos em relação a hoje: 5 (-8), 1 (-3), 6 (-1), 2 (+1), 7 (+3),
// 3 (+7), 4 (+14), 8 (+21). A de +1 dia é a única com prazo próximo
// (menos de 48h), então fica sem entrega em todas as contas.
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
  {
    id: 5,
    titulo: "Wireframes do Aplicativo de Caronas",
    disciplina: "Interface Humano-Computador",
    professor: "Prof.ª Camila Andrade",
    prazo: prazoRelativo(-8),
    formatosAceitos: ["pdf"],
    tamanhoMaximoMB: 20,
    descricao:
      "Enviar os wireframes de baixa fidelidade das telas principais do aplicativo " +
      "de caronas entre alunos (cadastro, busca de carona e confirmação), com uma " +
      "breve justificativa das escolhas de navegação.",
  },
  {
    id: 6,
    titulo: "API REST de Cadastro de Produtos",
    disciplina: "Programação de Aplicativos",
    professor: "Prof. André Oliveira",
    prazo: prazoRelativo(-1),
    formatosAceitos: ["zip"],
    tamanhoMaximoMB: 30,
    descricao:
      "Enviar o projeto da API em Node.js com as rotas de listar, criar, editar e " +
      "remover produtos, incluindo a coleção do Postman usada nos testes. Não " +
      "inclua a pasta node_modules.",
  },
  {
    id: 7,
    titulo: "Questionário de Segurança da Informação",
    disciplina: "Segurança da Informação",
    professor: "Prof. Felipe Barros",
    prazo: prazoRelativo(3),
    formatosAceitos: ["pdf", "docx"],
    tamanhoMaximoMB: 5,
    descricao:
      "Responder ao questionário sobre políticas de senha, engenharia social e LGPD " +
      "disponibilizado em aula e enviar as respostas em um único arquivo.",
  },
  {
    id: 8,
    titulo: "Apresentação Parcial do Projeto Integrador",
    disciplina: "Projeto Integrador",
    professor: "Prof. Ricardo Nunes",
    prazo: prazoRelativo(21),
    formatosAceitos: ["pdf", "pptx"],
    tamanhoMaximoMB: 50,
    descricao:
      "Enviar os slides da apresentação parcial do Projeto Integrador, com o " +
      "problema escolhido, a solução proposta e o cronograma do semestre.",
  },
];

// Entregas com que cada conta começa. Cada conta tem uma mistura diferente,
// mas todas mostram pelo menos uma Enviada e uma Enviada com atraso sem que o
// testador precise enviar nada antes.
const ENTREGAS_INICIAIS = {
  // Ana: em dia com a de prazo folgado, entregou os wireframes uma semana
  // depois do prazo e ainda deve o relatório (-3) e a API (-1).
  2024101: {
    3: {
      nomeArquivo: "plano-testes-manutencao.pdf",
      comentario: "Segue o plano com os casos priorizados por severidade.",
      enviadoEm: momentoRelativo(-1, 15),
    },
    5: {
      nomeArquivo: "wireframes-caronas.pdf",
      comentario: "Desculpe o atraso, professora. Os wireframes estão na ordem do fluxo.",
      enviadoEm: momentoRelativo(-6, 20),
    },
  },
  // Carlos: o mais adiantado. Entregou os wireframes e o dashboard cedo,
  // o relatório saiu um dia depois do prazo e a API (-1) ficou para trás.
  2024102: {
    1: {
      nomeArquivo: "relatorio-usabilidade.pdf",
      comentario: "Relatório com as 5 heurísticas violadas e as correções sugeridas.",
      enviadoEm: momentoRelativo(-2, 19),
    },
    4: {
      nomeArquivo: "dashboard-angular.zip",
      comentario: "",
      enviadoEm: momentoRelativo(-2, 14),
    },
    5: {
      nomeArquivo: "wireframes-app-caronas.pdf",
      comentario: "",
      enviadoEm: momentoRelativo(-9, 16),
    },
  },
  // Júlia: a mais atrasada. Entregou a API em cima da hora, o relatório
  // dois dias depois do prazo e nunca enviou os wireframes (-8).
  2024103: {
    1: {
      nomeArquivo: "relatorio-testes-usabilidade.pdf",
      comentario: "Tive que refazer os testes com mais dois participantes, por isso o atraso.",
      enviadoEm: momentoRelativo(-1, 21),
    },
    6: {
      nomeArquivo: "api-produtos.zip",
      comentario: "A coleção do Postman está na pasta docs.",
      enviadoEm: momentoRelativo(-2, 22),
    },
  },
};
