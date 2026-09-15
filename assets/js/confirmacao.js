const sessao = exigirLogin();

if (sessao) {
  const parametros = new URLSearchParams(window.location.search);
  const idAtividade = Number(parametros.get("id"));
  const atividade = ATIVIDADES.find((item) => item.id === idAtividade);
  const entrega = obterEntrega(idAtividade);

  const resumo = document.getElementById("resumo-envio");
  const recibo = document.getElementById("recibo");

  if (atividade && entrega) {
    const status = calcularStatus(atividade, entrega);
    resumo.textContent =
      status === "enviada-atraso"
        ? "Sua entrega foi registrada depois do prazo e consta como atrasada."
        : "Sua entrega foi registrada dentro do prazo.";
    document.getElementById("recibo-atividade").textContent = atividade.titulo;
    document.getElementById("recibo-arquivo").textContent = entrega.nomeArquivo;
    document.getElementById("recibo-data").textContent = formatarDataHora(entrega.enviadoEm);
    document.getElementById("recibo-status").innerHTML = htmlSelo(status);
    recibo.classList.remove("d-none");
  } else {
    document.getElementById("titulo-confirmacao").textContent = "Nenhuma entrega encontrada";
    resumo.textContent = "Não há entrega recente para mostrar aqui.";
  }
}
