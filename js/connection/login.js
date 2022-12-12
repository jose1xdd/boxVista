// http://127.0.0.1:5000
const login = document.querySelector("#login");

login.addEventListener("click", () => {
  const email = document.querySelector("#inputEmail").value;
  const password = document.querySelector("#inputPassword").value;
  axios.post('http://127.0.0.1:5000/login', {
    email: email,
    password: password
  })
  .then((response) => {
    localStorage.setItem("token_access", response.data.access_token);
    localStorage.setItem("token_refresh", response.data.refresh_token);
    localStorage.setItem("user", email);
    localStorage.setItem("password", password);
    location.href = "../../html/tables.html";
  })
  .catch((error) => {
    alert("Usuario o contraseña inválidos")
  });
});
