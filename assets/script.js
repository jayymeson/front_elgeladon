// Classes

class Requisicoes {
  async listarTodasAsPaletas() {
    const resposta = await fetch(`${baseURL}/paletas/todas-paletas`);
    const paletas = await resposta.json();

    listaDePaletas = paletas;

    return paletas;
  }

  async buscarPaletasPorId(id) {
    const resposta = await fetch(`${baseURL}/paletas/paleta/${id}`);

    if (resposta.status === 404) {
      return false;
    }

    const paleta = await resposta.json();

    return paleta;
  }

  async criarPaleta(sabor, descricao, foto, preco) {
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
  }

  async atualizarPaleta(id, sabor, descricao, foto, preco) {
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
  }

  async excluirPaleta(id) {
    const resposta = await fetch(`${baseURL}/paletas/excluir-paleta/${id}`, {
      method: "DELETE",
      mode: "cors",
    });

    if (resposta.status === 200) {
      return true;
    } else {
      return false;
    }
  }
}

// Variável auxilar

const requisicoes = new Requisicoes();
const baseURL = "http://localhost:3000";
let listaDePaletas = [];

// Manipulação do DOM

const imprimirTodasAsPaletas = async () => {
  const paletas = await requisicoes.listarTodasAsPaletas();

  document.getElementById("paletaList").innerHTML = "";

  paletas.forEach((element) => {
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="CartaoPaleta">
        <div class="CartaoPaleta__infos">
           <h4>${element.sabor}</h4>
           <span>R$ ${element.preco.toFixed(2)}</span>
           <P>${element.descricao}</P>
           <div>
              <button onclick="mostrarModalExclusao('${
                element._id
              }')" class="botao-excluir-paleta">Apagar</button>
              <button onclick="mostrarModalEdicao('${
                element._id
              }')" class="botao-editar-paleta">Editar</button>
            </div>
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

const imprimirUmaPaletaPorId = async () => {
  document.getElementById("paletaPesquisada").innerHTML = "";

  const input = document.getElementById("inputBuscaSaborPaleta");
  const sabor = input.value;

  const paletaSelecionada = listaDePaletas.find((elem) => elem.sabor === sabor);

  if (paletaSelecionada === undefined) {
    const mensagemDeErro = document.createElement("p");
    mensagemDeErro.id = "mensagemDeErro";
    mensagemDeErro.classList.add("MensagemDeErro");
    mensagemDeErro.innerHTML = "Nenhuma paleta encontrada! ";

    document.getElementById("paletaPesquisada").appendChild(mensagemDeErro);
  }

  const id = paletaSelecionada._id;

  const paleta = await requisicoes.buscarPaletasPorId(id);

  if (paleta === false) {
    const mensagemDeErro = document.createElement("p");
    mensagemDeErro.id = "mensagemDeErro";
    mensagemDeErro.classList.add("MensagemDeErro");
    mensagemDeErro.innerHTML = "Nenhuma paleta encontrada! ";

    document.getElementById("paletaPesquisada").appendChild(mensagemDeErro);
  } else {
    document.getElementById("paletaPesquisada").innerHTML = `
  <div class="CartaoPaleta">
        <div class="CartaoPaleta__infos">
           <h4>${paleta.sabor}</h4>
           <span>R$ ${paleta.preco.toFixed(2)}</span>
           <P>${paleta.descricao}</P>
            <div>
              <button onclick="mostrarModalExclusao('${
                paleta._id
              }')" class="botao-excluir-paleta">Apagar</button>
              <button onclick="mostrarModalEdicao('${
                paleta._id
              }')" class="botao-editar-paleta">Editar</button>
            </div>
        </div>
        <img class="CartaoPaleta_foto" src="${paleta.foto}" alt="Paleta de ${
      paleta.sabor
    }" />
    </div>
  `;
  }
};

const mostrarModalCriacao = () => {
  document.getElementById("fundoModalCriacao").style.display = "flex";
};

const esconderModalCriacao = () => {
  document.getElementById("inputSabor").value = "";
  document.getElementById("inputDescricao").value = "";
  document.getElementById("inputFoto").value = "";
  document.getElementById("inputPreco").value = "";

  document.getElementById("fundoModalCriacao").style.display = "none";
};

const mostrarModalExclusao = (id) => {
  document.getElementById("fundoModalDeletar").style.display = "flex";

  const botaoConfirmar = document.getElementById("botao-confirmar-exclusao");

  botaoConfirmar.addEventListener("click", async () => {
    const exclusao = await requisicoes.excluirPaleta(id);

    if (exclusao) {
      mostrarNotificacao("sucesso", "Paleta excluida com sucesso");
    } else {
      mostrarNotificacao("erro", "Paleta não encontrada");
    }
    esconderModalDeletar();
    imprimirTodasAsPaletas();
  });
};

const esconderModalDeletar = () => {
  document.getElementById("fundoModalDeletar").style.display = "none";
};

const mostrarModalEdicao = (id) => {
  document.getElementById("fundoModalEdicao").style.display = "flex";

  const paleta = listaDePaletas.find((elemento) => elemento._id === id);

  document.getElementById("inputSaborEdicao").value = paleta.sabor;
  document.getElementById("inputDescricaoEdicao").value = paleta.descricao;
  document.getElementById("inputFotoEdicao").value = paleta.foto;
  document.getElementById("inputPrecoEdicao").value = paleta.preco;

  const botaoAtualizar = document.getElementById("botaoConfirmarEdicao");

  botaoAtualizar.addEventListener("click", async () => {
    const sabor = document.getElementById("inputSaborEdicao").value;
    const descricao = document.getElementById("inputDescricaoEdicao").value;
    const foto = document.getElementById("inputFotoEdicao").value;
    const preco = document.getElementById("inputPrecoEdicao").value;

    await requisicoes.atualizarPaleta(id, sabor, descricao, foto, preco);

    esconderModalEdicao();
    imprimirTodasAsPaletas();
  });
};

const esconderModalEdicao = () => {
  document.getElementById("fundoModalEdicao").style.display = "none";
};

const mostrarNotificacao = (tipo, frase) => {
  const notificacaoSpan = document.getElementById("notificacaoSpan");
  const notificacaoP = document.getElementById("notificacaoP");

  if (tipo === "sucesso") {
    notificacaoSpan.innerText = "v";
    notificacaoSpan.classList.add("notificacao-span-sucesso");
  } else if (tipo === "erro") {
    notificacaoSpan.innerText = "x";
    notificacaoSpan.classList.add("notificacao-span-erro");
  }
  notificacaoP.innerText = frase;
  document.getElementById("notificacao").style.display = "flex";
  setTimeout(() => {
    esconderNotificacao();
  }, 5000);
};

const esconderNotificacao = () => {
  document.getElementById("notificacao").style.display = "flex";
};

const cadastrarNovaPaleta = async () => {
  const sabor = document.getElementById("inputSabor").value;
  const descricao = document.getElementById("inputDescricao").value;
  const foto = document.getElementById("inputFoto").value;
  const preco = document.getElementById("inputPreco").value;

  const paleta = await requisicoes.criarPaleta(sabor, descricao, foto, preco);

  document.getElementById("paletaList").insertAdjacentHTML(
    "beforeend",
    `
    <div class="CartaoPaleta">
      <div class="CartaoPaleta__infos">
         <h4>${paleta.sabor}</h4>
         <span>R$ ${paleta.preco.toFixed(2)}</span>
         <P>${paleta.descricao}</P>
         <div>
         <button onclick="mostrarModalExclusao('${
           paleta._id
         }')" class="botao-excluir-paleta">Apagar</button>
         <button onclick="mostrarModalEdicao('${
           paleta._id
         }')" class="botao-editar-paleta">Editar</button>
       </div>
      </div>
      <img class="CartaoPaleta_foto" src="${paleta.foto}" alt="Paleta de ${
      paleta.sabor
    }" />
  </div>

      `
  );

  esconderModalCriacao();
};
