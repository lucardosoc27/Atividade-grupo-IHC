garantirDadosIniciais();

const MENSAGENS_MOTIVO = {
  login: { classe: "alert-info", texto: "Entre com sua matrícula e senha para ver suas atividades." },
  saiu: { classe: "alert-success", texto: "Você saiu. Até a próxima!" },
  expirada: {
    classe: "alert-warning",
    texto: "Sua sessão expirou por inatividade. Entre novamente para continuar.",
  },
  reiniciado: { classe: "alert-success", texto: "Dados de demonstração reiniciados." },
};

const parametrosLogin = new URLSearchParams(window.location.search);
const form = document.getElementById("form-login");
const erroLogin = document.getElementById("erro-login");
const campoMatricula = document.getElementById("matricula");
const campoSenha = document.getElementById("senha");

function mostrarMotivo(motivo) {
  const aviso = document.getElementById("aviso-motivo");
  const info = MENSAGENS_MOTIVO[motivo];
  if (!info) return;
  aviso.className = `alert ${info.classe} mb-3`;
  aviso.setAttribute("role", motivo === "expirada" ? "alert" : "status");
  aviso.textContent = info.texto;
}

// Se já existe sessão válida, não faz sentido mostrar o login.
const sessaoAtual = obterSessao();
if (sessaoAtual && !sessaoExpirada(sessaoAtual) && !parametrosLogin.has("motivo")) {
  window.location.replace("atividades.html");
}

mostrarMotivo(parametrosLogin.get("motivo"));

// Duração da sessão: 15 min por padrão; ?sessao=1 encurta para demonstrar a expiração.
const minutosSessao = Number(parametrosLogin.get("sessao")) || SESSAO_MINUTOS_PADRAO;

// ---------- Contas de demonstração ----------

const corpoTabela = document.getElementById("lista-contas-demo");
ALUNOS.forEach((aluno) => {
  const linha = document.createElement("tr");
  linha.innerHTML = `
    <td>${aluno.nome}</td>
    <td><code>${aluno.matricula}</code></td>
    <td class="text-end">
      <button type="button" class="btn btn-outline-primary btn-sm" data-matricula="${aluno.matricula}"
        aria-label="Preencher com a conta de ${aluno.nome}">Usar</button>
    </td>`;
  corpoTabela.appendChild(linha);
});

corpoTabela.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-matricula]");
  if (!botao) return;
  const aluno = ALUNOS.find((item) => item.matricula === botao.dataset.matricula);
  campoMatricula.value = aluno.matricula;
  campoSenha.value = aluno.senha;
  erroLogin.classList.add("d-none");
  form.classList.remove("was-validated");
  form.querySelector('button[type="submit"]').focus();
});

// ---------- Mostrar / ocultar senha ----------

document.getElementById("btn-mostrar-senha").addEventListener("click", function () {
  const mostrando = campoSenha.type === "text";
  campoSenha.type = mostrando ? "password" : "text";
  this.setAttribute("aria-pressed", String(!mostrando));
  this.setAttribute("aria-label", mostrando ? "Mostrar senha" : "Ocultar senha");
  this.querySelector("i").className = `fa-solid ${mostrando ? "fa-eye" : "fa-eye-slash"}`;
  campoSenha.focus();
});

// ---------- Entrar ----------

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  erroLogin.classList.add("d-none");

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const matricula = campoMatricula.value.trim();
  const senha = campoSenha.value;
  const aluno = ALUNOS.find((item) => item.matricula === matricula && item.senha === senha);

  if (!aluno) {
    // Mensagem genérica de propósito: não revela se a matrícula existe.
    erroLogin.classList.remove("d-none");
    campoSenha.value = "";
    campoMatricula.focus();
    return;
  }

  iniciarSessao(aluno, minutosSessao);
  window.location.href = "atividades.html";
});

// ---------- Reiniciar dados de demonstração ----------

const modalReiniciar = new bootstrap.Modal(document.getElementById("modal-reiniciar"));
const botaoReiniciar = document.getElementById("btn-reiniciar");

botaoReiniciar.addEventListener("click", () => modalReiniciar.show());

document.getElementById("btn-confirmar-reiniciar").addEventListener("click", () => {
  reiniciarDadosDemonstracao();
  window.location.replace("index.html?motivo=reiniciado");
});

document.getElementById("modal-reiniciar").addEventListener("hidden.bs.modal", () => {
  botaoReiniciar.focus();
});
