const users = {
  "Trafego - Rouxinol": "trafego2025",
  "CCO - Rouxinol": "controlerotas2025",
  "Mecanica - Rouxinol": "mecanicarouxinol2025",
  "2309": "eldin",
  "Limpeza - Rouxinol": "limopezarouxinol",
  "Manutenção - Rouxinol": "manutençãorouxinol2025",
  "1774": "Victor@123",
  "Clever - Rouxinol": "clevercastro@2026",
  "Analista - Maxsim": "analistadados2",
  "1207": "j2025",
  "2396": "12082024",
  "2587": "vitin",
};

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  document.getElementById("error").innerText = "";

  if (!username || !password) {
    document.getElementById("error").innerText = "Por favor, preencha todos os campos.";
    return;
  }

  if (users[username] && users[username] === password) {
    localStorage.setItem("usuarioAtual", username);
    window.location.href = "tela_inicial.html";
  } else {
    document.getElementById("error").innerText = "Matrícula ou senha inválidos.";
  }
}

document.getElementById("loginBtn").addEventListener("click", login);

document.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    login();
  }
});
