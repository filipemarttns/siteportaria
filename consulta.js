import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSLrxQH6k1XGWq93WYENzplqJ6DRTqEf8",
  authDomain: "controle-de-portaria-c2ba6.firebaseapp.com",
  projectId: "controle-de-portaria-c2ba6",
  storageBucket: "controle-de-portaria-c2ba6.firebasestorage.app",
  messagingSenderId: "656428327600",
  appId: "1:656428327600:web:ccf86031f62c46360d9175",
  measurementId: "G-05W3SNZFVV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const users = {
  "Trafego - Rouxinol": "trafego2025",
  "CCO - Rouxinol": "controlerotas2025",
  "Mecanica - Rouxinol": "mecanicarouxinol2025",
  "2396": "12082024",
  "Limpeza - Rouxinol": "limopezarouxinol",
  "Manutenção - Rouxinol": "manutençãorouxinol2025",
  "1774": "Victor@123",
  "Clever - Rouxinol": "clevercastro@2026",
  "2396": "12082024",
  "1207": "j2025",
};

const statusPermitidoPorUsuario = {
  "trafego2025": null,
  "controlerotas2025": null,
  "mecanicarouxinol2025": ["Abastecer", "Manutenção preventiva", "Manutenção corretiva"],
  "analistarouxinol2026": null,
  "limopezarouxinol": ["Limpar"],
  "manutençãorouxinol2025": ["Limpar"],
  "Victor@123": null,
  "clevercastro@2026": null,
  "12082024": null,
  "j2025": null,
};

function obterUsuarioAtual() {
  return localStorage.getItem("usuarioAtual");
}

async function carregarDados(placaPesquisa = "") {
  const container = document.getElementById("data-container");
  if (!container) return;

  container.innerHTML = "<p>Carregando...</p>";

  try {
    const snapshot = await getDocs(collection(db, "veiculos"));
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = "<p>Nenhum dado encontrado.</p>";
      return;
    }

    const nomeUsuario = obterUsuarioAtual();
    const senhaUsuario = users[nomeUsuario];
    const statusPermitidos = statusPermitidoPorUsuario[senhaUsuario] || null;

    let vehiclesData = [];

    snapshot.forEach(docSnapshot => {
      const data = docSnapshot.data();
      const docId = docSnapshot.id;

      const statusArray = Array.isArray(data.status) ? data.status : [data.status];
      const podeVer = !statusPermitidos || statusArray.some(status => statusPermitidos.includes(status));

      if (!podeVer) return;

      if (placaPesquisa && !data.placa.toLowerCase().includes(placaPesquisa.toLowerCase())) {
        return;
      }

      vehiclesData.push({ data, docId });
    });

    vehiclesData.sort((a, b) => {
      const urgenciaA = a.data.urgencia || "Baixa";
      const urgenciaB = b.data.urgencia || "Baixa";

      const prioridades = ["Alta", "Média", "Baixa"];

      if (a.data.resolvido_por && !b.data.resolvido_por) {
        return 1;
      } else if (!a.data.resolvido_por && b.data.resolvido_por) {
        return -1;
      }

      return prioridades.indexOf(urgenciaA) - prioridades.indexOf(urgenciaB);
    });

    vehiclesData.forEach(({ data, docId }) => {
      const statusArray = Array.isArray(data.status) ? data.status : [data.status];
      const card = document.createElement("div");
      card.className = "card";

      const button = document.createElement("button");
      button.textContent = `Veículo: ${data.placa} - ${statusArray.join(", ")}`;
      button.classList.add("main-btn");
      if (data.resolvido_por) {
        button.classList.add("resolvido-main");
        button.style.cursor = "default";
      }

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
          const statusArray = Array.isArray(data.status) ? data.status : [data.status];
        
          // Verifica se é tarefa de limpeza
          const isLimpeza = statusArray.includes("Limpeza") || statusArray.includes("Limpar");
        
          if (isLimpeza) {
            // Exibe o popup de tipo de limpeza
            const popup = document.getElementById("popup-limpeza");
            popup.style.display = "flex";
        
            const confirmar = document.getElementById("confirmar-limpeza");
            const cancelar = document.getElementById("cancelar-limpeza");
        
            const confirmarHandler = async () => {
              const selecionado = document.querySelector('input[name="tipoLimpeza"]:checked');
              if (!selecionado) {
                alert("Por favor, selecione um tipo de limpeza.");
                return;
              }
        
              const tipoLimpeza = selecionado.value;
        
              try {
                await updateDoc(doc(db, "veiculos", docId), {
                  resolvido_por: nomeUsuario || "Web",
                  tipo_limpeza: tipoLimpeza,
                  status: tipoLimpeza
                });
        
                details.querySelector(`#resolvido-${docId}`).textContent = nomeUsuario || "Web";
                resolverBtn.textContent = "Resolvido";
                resolverBtn.classList.add("resolvido");
                resolverBtn.disabled = true;
                button.classList.add("resolvido-main");
                button.style.cursor = "default";
        
                popup.style.display = "none";
                confirmar.removeEventListener("click", confirmarHandler);
                cancelar.removeEventListener("click", cancelarHandler);
        
              } catch (error) {
                console.error("Erro ao atualizar tipo de limpeza: ", error);
              }
            };
        
            const cancelarHandler = () => {
              popup.style.display = "none";
              confirmar.removeEventListener("click", confirmarHandler);
              cancelar.removeEventListener("click", cancelarHandler);
            };
        
            confirmar.addEventListener("click", confirmarHandler);
            cancelar.addEventListener("click", cancelarHandler);
        
            return;
          
          }
        
          // Se não for limpeza, apenas marca como resolvido
          try {
            await updateDoc(doc(db, "veiculos", docId), {
              resolvido_por: nomeUsuario || "Web"
            });
        
            details.querySelector(`#resolvido-${docId}`).textContent = nomeUsuario || "Web";
            resolverBtn.textContent = "Resolvido";
            resolverBtn.classList.add("resolvido");
            resolverBtn.disabled = true;
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

document.getElementById('search-input').addEventListener('input', (event) => {
  const placaPesquisa = event.target.value;
  carregarDados(placaPesquisa);
});

function abrirPopup() {
  document.getElementById('popup').style.display = 'flex';
}

function fecharPopup() {
  document.getElementById('popup').style.display = 'none';
}

window.addEventListener('load', () => {
  carregarDados();
});
