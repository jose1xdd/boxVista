const nombre = document.querySelector("#nombre");
const email = document.querySelector("#email");
const tipoDocumento = document.querySelector("#tipoDocumento");
const documento = document.querySelector("#documento");
const sexo = document.querySelector("#sexo");
const direccion = document.querySelector("#direccion");
const fecha = document.querySelector("#fecha");
const user = document.querySelector("#user");
const botonAccion = document.querySelector("#accion");

window.addEventListener("load", getData());

async function getData() {
  user.innerHTML = localStorage.getItem("user");
  console.log(localStorage.getItem("user"));
  console.log(localStorage.getItem("email"));
  if(localStorage.getItem("token_access") == null || localStorage.getItem("token_refresh") == null) {
    logOut();
  }
  await verifyToken();
  axios(`http://127.0.0.1:5000/usuario/${localStorage.getItem("email")}`, {
    method: "get",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token_access")}`
    }
  })
  .then((response) => {
    nombre.innerHTML = response.data.nombre;
    email.innerHTML = response.data.email;
    documento.innerHTML = response.data.cedula;
    sexo.innerHTML = response.data.sexo;
    tipoDocumento.innerHTML = response.data.type_doc;
    direccion.innerHTML = response.data.direccion;
    fecha.innerHTML = response.data.fecha_nacimiento;
    if(localStorage.getItem("admin") == "true") {
      botonAccion.innerHTML = "Visualizar deportistas";
      botonAccion.setAttribute("href", "../../html/tables.html");
    }
    else {
      botonAccion.innerHTML = "Visualizar test";
      botonAccion.setAttribute("href", "../../html/test.html");
    }
  })
  .catch((error) => {
    console.log(error);
  });
} 

function verifyToken() {
  return axios.post("http://127.0.0.1:5000/refresh", {}, { 
    headers: {
    'Authorization': `Bearer ${localStorage.getItem("token_refresh")}`
    } 
  })
    .then((result) => {
      localStorage.setItem("token_access", result.data.access_token);
    })
    .catch((error) => {
      logOut();
    });
}

function logOut() {
  localStorage.removeItem("token_access");
  localStorage.removeItem("token_refresh");
  location.href = "../../index.html";
}