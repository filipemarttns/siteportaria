import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Inicia o Firebase com a configuração que está no config.js
const firebaseConfig = {
  apiKey: "AIzaSyBSLrxQH6k1XGWq93WYENzplqJ6DRTqEf8",
  authDomain: "controle-de-portaria-c2ba6.firebaseapp.com",
  projectId: "controle-de-portaria-c2ba6",
  storageBucket: "controle-de-portaria-c2ba6.firebasestorage.app",
  messagingSenderId: "656428327600",
  appId: "1:656428327600:web:ccf86031f62c46360d9175",
  measurementId: "G-05W3SNZFVV"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function carregarDados() {
  const container = document.getElementById("data-container");

  if (!container) {
    console.error("Elemento container não encontrado.");
    return;
  }

  container.innerHTML = "<p>Carregando...</p>";

  try {
    console.log("Tentando carregar dados...");
    const snapshot = await getDocs(collection(db, "veiculos"));

    console.log("Snapshot recebido:", snapshot);

    container.innerHTML = ""; // Limpa a área de carregamento

    if (snapshot.empty) {
      console.log("Nenhum dado encontrado.");
      container.innerHTML = "<p>Nenhum dado encontrado.</p>";
      return;
    }

    console.log("Dados carregados com sucesso!");

    snapshot.forEach(docSnapshot => {
      const data = docSnapshot.data();
      const docId = docSnapshot.id;
      console.log("Carregando veículo:", data);

      // Criação do card
      const card = document.createElement("div");
      card.className = "card";

      // Botão de veículo
      const button = document.createElement("button");
      button.textContent = `Veículo: ${data.placa} - ${Array.isArray(data.status) ? data.status.join(", ") : data.status}`;
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
          try {
            // Corrigido: usando o método doc e updateDoc corretamente
            await updateDoc(doc(db, "veiculos", docId), {
              resolvido_por: "Web" // Atualizando com "Web" como exemplo de quem resolveu
            });
            details.querySelector(`#resolvido-${docId}`).textContent = "Web"; // Atualiza a visualização no card
            resolverBtn.textContent = "Resolvido";
            resolverBtn.classList.add("resolvido");
            resolverBtn.disabled = true; // Desabilita o botão de resolver após a marcação

            // Muda o botão principal para verde
            button.classList.add("resolvido-main");
            button.style.cursor = "default";
          } catch (error) {
            console.error("Erro ao marcar como resolvido: ", error);
          }
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
