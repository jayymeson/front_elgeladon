// Variável auxilar

const baseURL = "http://localhost:3000";

// Requisições

const listarTodasAsPaletas = async () => {
  const resposta = await fetch(`${baseURL}/paletas/todas-paletas`);
  const paletas = await resposta.json();

  return paletas;
};

const buscarPaletasPorId = async (id) => {
  const resposta = await fetch(`${baseURL}/paletas/paleta/${id}`);

  if (resposta.status === 404) {
    return false;
  }

  const paleta = await resposta.json();

  return paleta;
};

const criarPaleta = async (sabor, descricao, foto, preco) => {
  const paleta = {
    sabor,
    descricao,
    foto,
    preco,
  };

  const resposta = await fetch(`${baseURL}/paletas/criar-paleta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await resposta.json();

  return novaPaleta;
};

const atualizarPaleta = async (id, sabor, descricao, foto, preco) => {
  const paleta = {
    sabor,
    descricao,
    foto,
    preco,
  };

  const resposta = await fetch(`${baseURL}/paletas/atualizar-paleta/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });
  const paletaAtualizada = await resposta.json();

  return paletaAtualizada;
};

const excluirPaleta = async (id) => {
  const resposta = await fetch(`${baseURL}/paletas/excluir-paleta/${id}`, {
    method: "DELETE",
    mode: "cors",
  });

  if (resposta.status === 204) {
    return "Paleta excuída com sucesso";
  } else {
    return "Paleta não encontrada";
  }
};

// Manipulação do DOM

const imprimirTodasAsPaletas = async () => {
  const paletas = await listarTodasAsPaletas();

  paletas.forEach((element) => {
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="CartaoPaleta">
        <div class="CartaoPaleta__infos">
           <h4>${element.sabor}</h4>
           <span>R$ ${element.preco.toFixed(2)}</span>
           <P>${element.descricao}</P>
        </div>
        <img class="CartaoPaleta_foto" src="${element.foto}" alt="Paleta de ${
        element.sabor
      }" />
    </div>

        `
    );
  });
};

imprimirTodasAsPaletas();

const imprimirUmaPaletaPorID = async () => {
  document.getElementById("paletaPesquisada").innerHTML = "";

  const input = document.getElementById("inputIdPaleta");
  const id = input.value;

  const paleta = await buscarPaletasPorId(id);

  if (paleta === false) {
    document.getElementById("paletaPesquisada").innerHTML =
      "Nenhuma paleta encontrada! ";
  }

  document.getElementById("paletaPesquisada").innerHTML = `
  <div class="CartaoPaleta">
        <div class="CartaoPaleta__infos">
           <h4>${paleta.sabor}</h4>
           <span>R$ ${paleta.preco.toFixed(2)}</span>
           <P>${paleta.descricao}</P>
        </div>
        <img class="CartaoPaleta_foto" src="${paleta.foto}" alt="Paleta de ${
    paleta.sabor
  }" />
    </div>
  `;
};
