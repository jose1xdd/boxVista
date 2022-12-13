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
    axios(`http://127.0.0.1:5000/usuario/${email}`, {
      method: "get",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token_access")}`
      }
    })
    .then((response) => {
      localStorage.setItem("email", email);
      if(response.data.admin) {
        localStorage.setItem("admin", "true");
        location.href = "../../html/tables.html";
      }
      else {
        localStorage.setItem("admin", "false");
        location.href = "../../html/profile.html";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  })
  .catch((error) => {
    alert("Usuario o contraseña inválidos")
  });
});
