// Sessão do aluno e entregas, simuladas com localStorage.
// Não há back-end: tudo fica salvo apenas no navegador.

const CHAVE_SESSAO = "ihc_sessao";
const CHAVE_ENTREGAS = "ihc_entregas";
const SESSAO_MINUTOS_PADRAO = 15;
const INTERVALO_RENOVACAO_MS = 30 * 1000;

// ---------- Dados de demonstração ----------

function garantirDadosIniciais() {
  if (localStorage.getItem(CHAVE_ENTREGAS) === null) {
    localStorage.setItem(CHAVE_ENTREGAS, JSON.stringify(ENTREGAS_INICIAIS));
  }
}

function reiniciarDadosDemonstracao() {
  localStorage.removeItem(CHAVE_SESSAO);
  localStorage.removeItem(CHAVE_ENTREGAS);
  garantirDadosIniciais();
}

// ---------- Sessão ----------

function iniciarSessao(aluno, minutos = SESSAO_MINUTOS_PADRAO) {
  localStorage.setItem(
    CHAVE_SESSAO,
    JSON.stringify({
      matricula: aluno.matricula,
      nome: aluno.nome,
      minutos,
      ultimaAtividade: Date.now(),
    })
  );
}

function obterSessao() {
  const dados = localStorage.getItem(CHAVE_SESSAO);
  return dados ? JSON.parse(dados) : null;
}

function sessaoExpirada(sessao) {
  return Date.now() - sessao.ultimaAtividade > sessao.minutos * 60 * 1000;
}

function renovarSessao() {
  const sessao = obterSessao();
  if (!sessao) return;
  sessao.ultimaAtividade = Date.now();
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

function irParaLogin(motivo) {
  window.location.replace(`index.html?motivo=${motivo}`);
}

function sair() {
  localStorage.removeItem(CHAVE_SESSAO);
  irParaLogin("saiu");
}

// Retorna a sessão válida, ou null depois de redirecionar para o login.
function exigirLogin() {
  const sessao = obterSessao();
  if (!sessao) {
    irParaLogin("login");
    return null;
  }
  if (sessaoExpirada(sessao)) {
    localStorage.removeItem(CHAVE_SESSAO);
    irParaLogin("expirada");
    return null;
  }
  renovarSessao();
  garantirDadosIniciais();
  return sessao;
}

// Enquanto o aluno interage, a sessão se mantém viva. Ao parar de interagir,
// a próxima navegação depois do limite cai no login com o motivo "expirada".
function acompanharAtividadeDoAluno() {
  let ultimaRenovacao = Date.now();
  const renovar = () => {
    if (Date.now() - ultimaRenovacao < INTERVALO_RENOVACAO_MS) return;
    ultimaRenovacao = Date.now();
    renovarSessao();
  };
  ["click", "keydown", "scroll", "input"].forEach((evento) => {
    document.addEventListener(evento, renovar, { passive: true });
  });
}

// ---------- Entregas ----------

function obterTodasEntregas() {
  const dados = localStorage.getItem(CHAVE_ENTREGAS);
  return dados ? JSON.parse(dados) : {};
}

function obterEntregas() {
  const sessao = obterSessao();
  if (!sessao) return {};
  return obterTodasEntregas()[sessao.matricula] || {};
}

function obterEntrega(idAtividade) {
  return obterEntregas()[idAtividade] || null;
}

function registrarEntrega(idAtividade, dadosEntrega) {
  const sessao = obterSessao();
  const todas = obterTodasEntregas();
  const minhas = todas[sessao.matricula] || {};
  minhas[idAtividade] = { ...dadosEntrega, enviadoEm: new Date().toISOString() };
  todas[sessao.matricula] = minhas;
  localStorage.setItem(CHAVE_ENTREGAS, JSON.stringify(todas));
  return minhas[idAtividade];
}

// ---------- Cabeçalho ----------

function montarNavbar() {
  const sessao = obterSessao();
  const spanNome = document.getElementById("nome-usuario");
  if (spanNome && sessao) {
    spanNome.textContent = sessao.nome;
  }
  const botaoSair = document.getElementById("btn-sair");
  if (botaoSair) {
    botaoSair.addEventListener("click", sair);
    acompanharAtividadeDoAluno();
  }
}

document.addEventListener("DOMContentLoaded", montarNavbar);
