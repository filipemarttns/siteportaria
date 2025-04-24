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
  "Analista - Rouxinol": "analistarouxinol2026",
  "Limpeza - Rouxinol": "limopezarouxinol",
  "Manutenção - Rouxinol": "manutençãorouxinol2025",
  "Supervisor - Rouxinol": "supervisor@2025",
  "Clever - Rouxinol": "clevercastro@2026",
  "Analista - Maxsim": "analistadados2"
};

const statusPermitidoPorUsuario = {
  "trafego2025": null,
  "controlerotas2025": null,
  "mecanicarouxinol2025": ["Abastecer", "Manutenção preventiva", "Manutenção corretiva"],
  "analistarouxinol2026": null,
  "limopezarouxinol": ["Limpar"],
  "manutençãorouxinol2025": ["Limpar"],
  "supervisor@2025": null,
  "clevercastro@2026": null,
  "analistadados2": null
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

      // Criação do botão
const button = document.createElement('button');
button.classList.add('btn-resolver');

// Aqui verifica corretamente o status:
if (veiculo.status && veiculo.status.includes("Está OK")) {
  button.textContent = "Resolvido";
  button.disabled = true;
  button.style.backgroundColor = "green";
  button.style.color = "#fff";
  button.style.cursor = "default";
} else {
  button.textContent = "Marcar como Resolvido";
  button.addEventListener('click', () => {
    button.textContent = "Resolvido";
    button.disabled = true;
    button.style.backgroundColor = "green";
    button.style.color = "#fff";
    button.style.cursor = "default";

    // Opcional: aqui você pode atualizar no Firebase também
  });
}


      const ehOk = statusArray.some(status => status.toLowerCase() === "está ok");

      if (data.resolvido_por || ehOk) {
        button.classList.add("resolvido-main");
        button.style.backgroundColor = "green";
        button.style.color = "#fff";
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
        <p><strong>Resolvido por:</strong> <span id="resolvido-${docId}">${data.resolvido_por || (ehOk ? nomeUsuario : 'N/A')}</span></p>
        <button class="resolver-btn ${data.resolvido_por || ehOk ? 'resolvido' : ''}" id="btn-${docId}" ${data.resolvido_por || ehOk ? 'disabled' : ''}>
          ${data.resolvido_por || ehOk ? 'Resolvido' : 'Marcar como Resolvido'}
        </button>
      `;

      button.onclick = () => {
        details.classList.toggle("active");
      };

      const resolverBtn = details.querySelector(`#btn-${docId}`);
      if (!data.resolvido_por && !ehOk) {
        resolverBtn.onclick = async () => {
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
            button.style.backgroundColor = "green";
            button.style.color = "#fff";
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

window.addEventListener('load', () => {
  carregarDados();
});
