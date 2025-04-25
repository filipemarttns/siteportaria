import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { app } from './config.js';

const db = getFirestore(app);

window.addEventListener('DOMContentLoaded', () => {
  const cadastrarBtn = document.getElementById('cadastrarBtn');
  
  if (cadastrarBtn) {
    cadastrarBtn.style.backgroundColor = '#1a73e8';
    cadastrarBtn.style.color = '#fff';
    cadastrarBtn.style.border = 'none';
    cadastrarBtn.style.borderRadius = '6px';
    cadastrarBtn.style.padding = '15px';
    cadastrarBtn.style.fontSize = '1rem';
    cadastrarBtn.style.cursor = 'pointer';
    cadastrarBtn.style.marginBottom = '15px';
    cadastrarBtn.style.width = '100%';
    cadastrarBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

    cadastrarBtn.addEventListener('mouseover', () => {
      cadastrarBtn.style.backgroundColor = '#0f5ccc';
    });

    cadastrarBtn.addEventListener('mouseout', () => {
      cadastrarBtn.style.backgroundColor = '#1a73e8';
    });

    cadastrarBtn.addEventListener('mousedown', () => {
      cadastrarBtn.style.transform = 'scale(0.98)';
    });

    cadastrarBtn.addEventListener('mouseup', () => {
      cadastrarBtn.style.transform = 'scale(1)';
    });

    cadastrarBtn.addEventListener("click", async () => {
      const usuario = document.getElementById("usuario").value;
      const placa = document.getElementById("placa").value.trim();
      const hodometro = document.getElementById("hodometro").value.trim();
      const movimentacao = document.getElementById("movimentacao").value;
      const motorista = document.getElementById("motorista").value.trim();
      const observacoes = document.getElementById("observacoes").value.trim();
      const urgencia = document.getElementById("urgencia").value;
    
      const statusCheckboxes = document.querySelectorAll('.checkboxes input[type="checkbox"]');
      const statusMarcados = Array.from(statusCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
        const data = new Date();
        data.setHours(data.getHours() - 3);
        const data_hora = data.toISOString().replace('T', ' ').split('.')[0];
        
    
      try {
        if (!usuario || !placa || !hodometro || !movimentacao || !motorista || !urgencia || statusMarcados.length === 0) {
          alert("Preencha todos os campos obrigatórios e marque pelo menos um status.");
          return;
        }
        
        if (movimentacao.toLowerCase().trim() === "saída") {
          const q = query(collection(db, "veiculos"), where("placa", "==", placa));
          const querySnapshot = await getDocs(q);
          for (const docSnap of querySnapshot.docs) {
            await deleteDoc(doc(db, "veiculos", docSnap.id));
          }
        
          alert("Registro de saída concluído. Veículo saiu da garagem.");
          return;
        }
        
        for (let status of statusMarcados) {
          let resolvido = false;
        
          if (status.toLowerCase().trim() === "está ok") {
            status = "resolvido";
            resolvido = true;
          }

          const docRef = await addDoc(collection(db, "veiculos"), {
            data_hora,
            hodometro,
            motorista,
            movimentacao,
            observacoes, 
            placa,
            status: [status],
            urgencia,
            usuario_cadastro: usuario,
            resolvido_por: resolvido ? usuario : null,
          });
        
          if (resolvido) {
            const resolverButton = document.getElementById('resolverBtn');
            if (resolverButton) {
              resolverButton.classList.add('Tudo Ok!');
              resolverButton.disabled = true;
            }
          }
        }
        alert("Cadastros enviados com sucesso!");

        document.getElementById("usuario").value = "";
        document.getElementById("placa").value = "";
        document.getElementById("hodometro").value = "";
        document.getElementById("movimentacao").value = "";
        document.getElementById("motorista").value = "";
        document.getElementById("observacoes").value = "";
        document.getElementById("urgencia").value = "";
        statusCheckboxes.forEach(cb => cb.checked = false);

      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao enviar cadastro. Tente novamente.");
      }
    });
  }

  const voltarBtn = document.getElementById('voltarBtn');
  if (voltarBtn) {
    voltarBtn.style.backgroundColor = '#f44336';
    voltarBtn.style.color = '#fff';
    voltarBtn.style.border = 'none';
    voltarBtn.style.borderRadius = '6px';
    voltarBtn.style.padding = '15px';
    voltarBtn.style.fontSize = '1rem';
    voltarBtn.style.cursor = 'pointer';
    voltarBtn.style.marginTop = '15px';
    voltarBtn.style.width = '100%';
    voltarBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

    voltarBtn.addEventListener('mouseover', () => {
      voltarBtn.style.backgroundColor = '#e53935';
    });

    voltarBtn.addEventListener('mouseout', () => {
      voltarBtn.style.backgroundColor = '#f44336';
    });

    voltarBtn.addEventListener('mousedown', () => {
      voltarBtn.style.transform = 'scale(0.98)';
    });

    voltarBtn.addEventListener('mouseup', () => {
      voltarBtn.style.transform = 'scale(1)';
    });
  }
});
