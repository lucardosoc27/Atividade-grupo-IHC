const sessao = exigirLogin();

const ATRASO_SIMULADO_MS = 800;

function iniciarPagina() {
  const parametros = new URLSearchParams(window.location.search);
  const idAtividade = Number(parametros.get("id"));
  const atividade = ATIVIDADES.find((item) => item.id === idAtividade);

  if (!atividade) {
    document.getElementById("atividade-conteudo").classList.add("d-none");
    document.getElementById("atividade-nao-encontrada").classList.remove("d-none");
    return;
  }

  document.title = `${atividade.titulo} — SENAI CIMATEC`;
  document.getElementById("atividade-titulo").textContent = atividade.titulo;
  document.getElementById("atividade-meta").textContent =
    `${atividade.disciplina} · ${atividade.professor}`;
  document.getElementById("atividade-descricao").textContent = atividade.descricao;
  document.getElementById("atividade-formato").textContent =
    `Um arquivo ${descreverFormatos(atividade)}.`;
  document.getElementById("arquivo-hint").textContent =
    `Formatos aceitos: ${descreverFormatos(atividade)}. Protótipo: só o nome do arquivo é registrado.`;

  const badge = document.getElementById("badge-status");
  const campoPrazo = document.getElementById("atividade-prazo");
  const avisoEntrega = document.getElementById("entrega-existente");
  const textoAvisoEntrega = document.getElementById("texto-entrega-existente");
  const avisoAtraso = document.getElementById("aviso-atraso");
  const textoAvisoAtraso = document.getElementById("texto-aviso-atraso");
  const textoBotao = document.getElementById("texto-botao-envio");

  const form = document.getElementById("form-envio");
  const botaoEnviar = document.getElementById("btn-enviar");
  const iconeEnvio = document.getElementById("icone-envio");
  const spinnerEnvio = document.getElementById("spinner-envio");
  const campoArquivo = document.getElementById("arquivo");
  const erroArquivo = document.getElementById("arquivo-erro");
  const campoComentario = document.getElementById("comentario");
  const contadorComentario = document.getElementById("comentario-contador");

  campoArquivo.setAttribute("accept", atividade.formatosAceitos.map((f) => `.${f}`).join(","));

  // ---------- Estado da atividade ----------

  function atualizarEstado() {
    const entrega = obterEntrega(idAtividade);
    const status = calcularStatus(atividade, entrega);
    const encerrado = prazoEncerrado(atividade);

    badge.innerHTML = htmlSelo(status);

    const relativo = !entrega ? textoRelativoPrazo(atividade) : null;
    campoPrazo.innerHTML = `<strong>Prazo:</strong> ${formatarDataHora(atividade.prazo)}` +
      (relativo
        ? ` · <span class="deadline-hint ${encerrado ? "is-vencido" : "is-proximo"}">${relativo}</span>`
        : "");

    if (entrega) {
      avisoEntrega.classList.remove("d-none");
      textoAvisoEntrega.textContent =
        `Você já enviou "${entrega.nomeArquivo}" em ${formatarDataHora(entrega.enviadoEm)}` +
        (status === "enviada-atraso" ? " (com atraso)." : ".");
      textoBotao.textContent = "Substituir entrega";
    } else {
      avisoEntrega.classList.add("d-none");
      textoBotao.textContent = encerrado ? "Enviar com atraso" : "Enviar entrega";
    }

    if (encerrado && !entrega) {
      avisoAtraso.classList.remove("d-none");
      textoAvisoAtraso.textContent =
        `O prazo encerrou em ${formatarDataHora(atividade.prazo)}. ` +
        "A entrega ainda é aceita, mas será registrada como atrasada.";
    } else {
      avisoAtraso.classList.add("d-none");
    }
  }

  atualizarEstado();

  // ---------- Validação do arquivo ----------

  function verificarArquivo() {
    const mensagem = validarArquivo(campoArquivo.files[0], atividade);
    campoArquivo.setCustomValidity(mensagem || "");
    erroArquivo.textContent = mensagem || "";
    campoArquivo.classList.toggle("is-invalid", Boolean(mensagem));
    campoArquivo.setAttribute("aria-invalid", String(Boolean(mensagem)));
    return !mensagem;
  }

  campoArquivo.addEventListener("change", verificarArquivo);

  // ---------- Contador do comentário ----------

  function atualizarContador() {
    contadorComentario.textContent = `${campoComentario.value.length}/${campoComentario.maxLength}`;
  }
  campoComentario.addEventListener("input", atualizarContador);
  atualizarContador();

  // ---------- Envio ----------

  function concluirEnvio() {
    botaoEnviar.disabled = true;
    form.setAttribute("aria-busy", "true");
    iconeEnvio.classList.add("d-none");
    spinnerEnvio.classList.remove("d-none");
    textoBotao.textContent = "Enviando…";

    const arquivo = campoArquivo.files[0];
    const comentario = campoComentario.value.trim();

    // Não há back-end: o atraso simula a resposta do servidor e evita clique duplo.
    window.setTimeout(() => {
      registrarEntrega(idAtividade, { nomeArquivo: arquivo.name, comentario });
      window.location.href = `confirmacao.html?id=${idAtividade}`;
    }, ATRASO_SIMULADO_MS);
  }

  const elementoModal = document.getElementById("modal-reenvio");
  const modalReenvio = new bootstrap.Modal(elementoModal);
  const botaoConfirmarReenvio = document.getElementById("btn-confirmar-reenvio");
  const textoModalAtraso = document.getElementById("modal-reenvio-atraso");
  let reenvioConfirmado = false;

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (botaoEnviar.disabled) return;

    const arquivoOk = verificarArquivo();
    if (!arquivoOk || !form.checkValidity()) {
      form.classList.add("was-validated");
      campoArquivo.focus();
      return;
    }

    if (obterEntrega(idAtividade)) {
      // Cancelar, Esc, o "x" ou clicar fora fecham sem enviar.
      reenvioConfirmado = false;
      textoModalAtraso.textContent = prazoEncerrado(atividade)
        ? "O prazo já encerrou: sua entrega passará a constar como atrasada."
        : "";
      modalReenvio.show();
      return;
    }

    concluirEnvio();
  });

  botaoConfirmarReenvio.addEventListener("click", function () {
    reenvioConfirmado = true;
    modalReenvio.hide();
  });

  elementoModal.addEventListener("shown.bs.modal", function () {
    botaoConfirmarReenvio.focus();
  });

  elementoModal.addEventListener("hidden.bs.modal", function () {
    if (reenvioConfirmado) {
      concluirEnvio();
      return;
    }
    botaoEnviar.focus();
  });
}

if (sessao) {
  iniciarPagina();
}
