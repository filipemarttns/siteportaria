console.log("firebase:", firebase);
if (typeof firebase === "undefined") {
  console.error("Firebase não carregado.");
} else {
  const db = firebase.firestore();

  async function carregarDados() {
    const container = document.getElementById("data-container");

    if (!container) {
      console.error("Elemento container não encontrado.");
      return;
    }

    container.innerHTML = "<p>Carregando...</p>";

    try {
      console.log("Tentando carregar dados...");
      const snapshot = await db.collection("veiculos").get();

      console.log("Dados carregados:", snapshot);

      container.innerHTML = ""; // Limpa a área de carregamento

      if (snapshot.empty) {
        console.log("Nenhum dado encontrado.");
        container.innerHTML = "<p>Nenhum dado encontrado.</p>";
        return;
      }

      console.log("Dados carregados com sucesso!");

      snapshot.forEach(doc => {
        const data = doc.data();
        const docId = doc.id;

        // Criação do card
        const card = document.createElement("div");
        card.className = "card";

        // Botão de veículo
        const button = document.createElement("button");
        button.textContent = `Veículo: ${data.placa} - ${data.status}`;
        button.classList.add("main-btn");

        // Estilo especial para resolvido
        if (data.resolvido_por) {
          button.classList.add("resolvido-main");
          button.style.cursor = "default";
        }

        // Detalhes do card
        const details = document.createElement("div");
        details.className = "details";
        details.innerHTML = `
          <p><strong>Data/Hora:</strong> ${data.data_hora}</p>
          <p><strong>Movimentação:</strong> ${data.movimentacao}</p>
          <p><strong>Urgência:</strong> ${data.urgencia}</p>
          <p><strong>Motorista:</strong> ${data.motorista}</p>
          <p><strong>Hodômetro:</strong> ${data.hodometro}</p>
          <p><strong>Observações:</strong> ${data.observacoes}</p>
          <p><strong>Usuário Cadastro:</strong> ${data.usuario_cadastro}</p>
          <p><strong>Resolvido por:</strong> <span id="resolvido-${docId}">${data.resolvido_por || 'N/A'}</span></p>
          <button class="resolver-btn ${data.resolvido_por ? 'resolvido' : ''}" id="btn-${docId}" ${data.resolvido_por ? 'disabled' : ''}>
            ${data.resolvido_por ? 'Resolvido' : 'Marcar como Resolvido'}
          </button>
        `;

        button.onclick = () => {
          details.classList.toggle("active");
        };

        const resolverBtn = details.querySelector(`#btn-${docId}`);
        if (!data.resolvido_por) {
          resolverBtn.onclick = async () => {
            await db.collection("veiculos").doc(docId).update({
              resolvido_por: "Web"
            });
            details.querySelector(`#resolvido-${docId}`).textContent = "Web";
            resolverBtn.textContent = "Resolvido";
            resolverBtn.classList.add("resolvido");
            resolverBtn.disabled = true;

            // Marcar botão principal como resolvido também
            button.classList.add("resolvido-main");
            button.style.cursor = "default";
          };
        }

        card.appendChild(button);
        card.appendChild(details);
        container.appendChild(card);
      });

    } catch (error) {
      console.error("Erro ao carregar dados: ", error);
      container.innerHTML = "<p>Erro ao carregar dados.</p>";
    }
  }

  // Carrega os dados diretamente ao carregar a página
  window.addEventListener('load', () => {
    carregarDados();
  });
}
