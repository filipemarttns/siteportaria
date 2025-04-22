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

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Resetando a mensagem de erro antes de nova tentativa
  document.getElementById("error").innerText = "";

  // Validação simples de entrada
  if (!username || !password) {
    document.getElementById("error").innerText = "Por favor, preencha todos os campos.";
    return;
  }

  if (users[username] && users[username] === password) {
    // Salva o usuário logado
    localStorage.setItem("usuarioAtual", username);
    // Redireciona para a página inicial
    window.location.href = "tela_inicial.html";
  } else {
    // Caso o login falhe, exibe uma mensagem de erro
    document.getElementById("error").innerText = "Usuário ou senha inválidos.";
  }
}

document.getElementById("loginBtn").addEventListener("click", login);

// Adicionando funcionalidade para pressionar "Enter" para login
document.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    login();
  }
});
