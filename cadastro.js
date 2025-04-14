window.addEventListener('DOMContentLoaded', () => {
    // Botão Cadastrar
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
      cadastrarBtn.style.width = '100%'; // Faz o botão ocupar toda a largura disponível
      cadastrarBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Sombra suave
  
      cadastrarBtn.addEventListener('mouseover', () => {
        cadastrarBtn.style.backgroundColor = '#0f5ccc'; // Cor ao passar o mouse
      });
  
      cadastrarBtn.addEventListener('mouseout', () => {
        cadastrarBtn.style.backgroundColor = '#1a73e8'; // Cor original
      });
  
      cadastrarBtn.addEventListener('mousedown', () => {
        cadastrarBtn.style.transform = 'scale(0.98)'; // Efeito de pressionamento
      });
  
      cadastrarBtn.addEventListener('mouseup', () => {
        cadastrarBtn.style.transform = 'scale(1)'; // Restaura o tamanho
      });
    }
  
    // Botão Voltar
    const voltarBtn = document.getElementById('voltarBtn');
    if (voltarBtn) {
      voltarBtn.style.backgroundColor = '#f44336'; // Cor vermelha para o "Voltar"
      voltarBtn.style.color = '#fff';
      voltarBtn.style.border = 'none';
      voltarBtn.style.borderRadius = '6px';
      voltarBtn.style.padding = '15px';
      voltarBtn.style.fontSize = '1rem';
      voltarBtn.style.cursor = 'pointer';
      voltarBtn.style.marginTop = '15px';
      voltarBtn.style.width = '100%'; // Faz o botão ocupar toda a largura disponível
      voltarBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Sombra suave
  
      voltarBtn.addEventListener('mouseover', () => {
        voltarBtn.style.backgroundColor = '#e53935'; // Cor mais escura ao passar o mouse
      });
  
      voltarBtn.addEventListener('mouseout', () => {
        voltarBtn.style.backgroundColor = '#f44336'; // Cor original
      });
  
      voltarBtn.addEventListener('mousedown', () => {
        voltarBtn.style.transform = 'scale(0.98)'; // Efeito de pressionamento
      });
  
      voltarBtn.addEventListener('mouseup', () => {
        voltarBtn.style.transform = 'scale(1)'; // Restaura o tamanho
      });
    }
  });
  