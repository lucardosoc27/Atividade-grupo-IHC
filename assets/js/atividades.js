const sessao = exigirLogin();

// "Pendentes" agrupa Pendente + Atrasada; "Enviadas" agrupa Enviada + Enviada com atraso.
const GRUPOS_FILTRO = {
  todas: ["pendente", "atrasada", "enviada", "enviada-atraso"],
  pendentes: ["pendente", "atrasada"],
  enviadas: ["enviada", "enviada-atraso"],
};

function anunciarResultadoFiltro(quantidade) {
  const regiao = document.getElementById("anuncio-filtro");
  const filtroAtivo = document.querySelector('input[name="filtro"]:checked');
  const nomeFiltro = document.querySelector(`label[for="${filtroAtivo.id}"]`).textContent.trim();

  let mensagem;
  if (quantidade === 0) {
    mensagem = `Filtro ${nomeFiltro}: nenhuma atividade encontrada.`;
  } else if (quantidade === 1) {
    mensagem = `Filtro ${nomeFiltro}: 1 atividade exibida.`;
  } else {
    mensagem = `Filtro ${nomeFiltro}: ${quantidade} atividades exibidas.`;
  }

  // Limpa antes de escrever para que leitores de tela anunciem
  // mesmo quando a mensagem é igual à anterior.
  regiao.textContent = "";
  window.setTimeout(() => {
    regiao.textContent = mensagem;
  }, 50);
}

function htmlPrazo(atividade, status) {
  const data = formatarDataHora(atividade.prazo);
  const relativo = status === "pendente" || status === "atrasada" ? textoRelativoPrazo(atividade) : null;
  if (!relativo) return `Prazo: ${data}`;
  const classe = status === "atrasada" ? "is-vencido" : "is-proximo";
  return `Prazo: ${data} · <span class="deadline-hint ${classe}">${relativo}</span>`;
}

function renderizarLista({ anunciar = false } = {}) {
  const lista = document.getElementById("lista-atividades");
  const vazio = document.getElementById("lista-vazia");
  const filtro = document.querySelector('input[name="filtro"]:checked').value;
  const entregas = obterEntregas();
  const agora = new Date();

  const itens = ATIVIDADES.map((atividade) => ({
    atividade,
    status: calcularStatus(atividade, entregas[atividade.id], agora),
  }))
    .filter(({ status }) => GRUPOS_FILTRO[filtro].includes(status))
    .sort((a, b) => new Date(a.atividade.prazo) - new Date(b.atividade.prazo));

  lista.innerHTML = "";

  if (anunciar) {
    anunciarResultadoFiltro(itens.length);
  }

  if (itens.length === 0) {
    vazio.classList.remove("d-none");
    return;
  }
  vazio.classList.add("d-none");

  itens.forEach(({ atividade, status }) => {
    const linha = document.createElement("div");
    linha.className =
      "activity-row d-flex justify-content-between align-items-start flex-wrap gap-2";
    linha.setAttribute("role", "listitem");
    linha.innerHTML = `
      <div>
        <a href="atividade.html?id=${atividade.id}" class="activity-title text-decoration-none d-block">
          ${atividade.titulo}
        </a>
        <span class="activity-meta">${atividade.disciplina} · ${htmlPrazo(atividade, status)}</span>
      </div>
      ${htmlSelo(status)}
    `;
    lista.appendChild(linha);
  });
}

if (sessao) {
  document.querySelectorAll('input[name="filtro"]').forEach((radio) => {
    radio.addEventListener("change", () => renderizarLista({ anunciar: true }));
  });
  document.addEventListener("DOMContentLoaded", () => renderizarLista());
}
