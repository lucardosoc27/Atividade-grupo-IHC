// Regras de domínio e formatação compartilhadas entre as páginas.
// Vocabulário conforme CONTEXT.md.

const MS_POR_HORA = 60 * 60 * 1000;
const LIMIAR_PRAZO_PROXIMO_MS = 48 * MS_POR_HORA;

const STATUS = {
  pendente: { rotulo: "Pendente", icone: "fa-clock", classe: "is-pendente" },
  atrasada: { rotulo: "Atrasada", icone: "fa-triangle-exclamation", classe: "is-atrasada" },
  enviada: { rotulo: "Enviada", icone: "fa-circle-check", classe: "is-enviada" },
  "enviada-atraso": {
    rotulo: "Enviada com atraso",
    icone: "fa-circle-check",
    classe: "is-enviada-atraso",
  },
};

// Status do par aluno + atividade. O momento da entrega atual é o que vale.
function calcularStatus(atividade, entrega, agora = new Date()) {
  const prazo = new Date(atividade.prazo);
  if (entrega) {
    return new Date(entrega.enviadoEm) > prazo ? "enviada-atraso" : "enviada";
  }
  return agora > prazo ? "atrasada" : "pendente";
}

function prazoEncerrado(atividade, agora = new Date()) {
  return agora > new Date(atividade.prazo);
}

function formatarData(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarDataHora(iso) {
  const data = new Date(iso);
  const dia = formatarData(iso);
  const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dia} às ${hora}`;
}

function inicioDoDia(data) {
  const copia = new Date(data);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

// Texto relativo do prazo. Só existe quando o prazo é próximo (menos de 48h)
// ou já passou; fora disso retorna null e a interface mostra só a data.
function textoRelativoPrazo(atividade, agora = new Date()) {
  const prazo = new Date(atividade.prazo);
  const diferenca = prazo - agora;
  const diasCalendario = Math.round((inicioDoDia(prazo) - inicioDoDia(agora)) / (24 * MS_POR_HORA));

  if (diferenca < 0) {
    if (diasCalendario === 0) return "venceu hoje";
    if (diasCalendario === -1) return "venceu ontem";
    return `venceu há ${-diasCalendario} dias`;
  }
  if (diferenca < LIMIAR_PRAZO_PROXIMO_MS) {
    if (diasCalendario === 0) return "vence hoje";
    if (diasCalendario === 1) return "vence amanhã";
    return `vence em ${diasCalendario} dias`;
  }
  return null;
}

function htmlSelo(status, classesExtras = "") {
  const info = STATUS[status];
  return (
    `<span class="status-badge ${info.classe} ${classesExtras}">` +
    `<i class="fa-solid ${info.icone}" aria-hidden="true"></i> ${info.rotulo}</span>`
  );
}

function descreverFormatos(atividade) {
  const nomes = atividade.formatosAceitos.map((f) => f.toUpperCase());
  const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} ou ${nomes.at(-1)}` : nomes[0];
  return `${lista} · até ${atividade.tamanhoMaximoMB} MB`;
}

function extensaoDoArquivo(nome) {
  const partes = nome.toLowerCase().split(".");
  return partes.length > 1 ? partes.at(-1) : "";
}

// Retorna a mensagem de erro, ou null quando o arquivo é aceito.
function validarArquivo(arquivo, atividade) {
  if (!arquivo) return "Selecione um arquivo antes de enviar.";
  const extensao = extensaoDoArquivo(arquivo.name);
  if (!atividade.formatosAceitos.includes(extensao)) {
    return `Formato não aceito. Envie um arquivo ${descreverFormatos(atividade).split(" · ")[0]}.`;
  }
  const limiteBytes = atividade.tamanhoMaximoMB * 1024 * 1024;
  if (arquivo.size > limiteBytes) {
    const tamanhoMB = (arquivo.size / (1024 * 1024)).toFixed(1);
    return `Arquivo muito grande (${tamanhoMB} MB). O limite é ${atividade.tamanhoMaximoMB} MB.`;
  }
  return null;
}
