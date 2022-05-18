const baseURL = "http://localhost:3000";

async function findAllPaletas() {
  const res = await fetch(`${baseURL}/paletas/todas-paletas`);

  const paletas = await res.json();
  paletas.forEach((paleta) => {
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="PaletaListaItem">
        <div>
            <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
            <div class="PaletaListaItem__preco">R$ ${paleta.preco}</div>
            <div class="PaletaListaItem__descricao">${paleta.descricao}</div>
        </div>
        <img class="PaletaListaItem__foto" src="${paleta.foto}" alt="Paleta de ${paleta.sabor}" />
    </div>
        
        
        `
    );
  });
}

async function findByIdPaletas() {
    const id = document.getElementById("idPaleta").value

    const response = await fetch(`${baseURL}/paletas/paleta/${id}`)
    const paleta = await response.json();

    const paletaEscolhidaDiv = document.getElementById("paletaEscolhida")
    paletaEscolhidaDiv.innerHTML = ` 
    <div class="PaletaCardItem">
    <div>
        <div class="PaletaCardItem__sabor">${paleta.sabor}</div>
        <div class="PaletaCardItem__preco">R$ ${paleta.preco}</div>
        <div class="PaletaCardItem__descricao">${paleta.descricao}</div>
    </div>
    <img class="PaletaCardItem__foto" src="${paleta.foto}" alt="Paleta de ${paleta.sabor}" />
</div>
`

}


findAllPaletas();
findByIdPaletas();

