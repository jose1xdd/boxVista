const nombre = document.querySelector("#nombre");
const email = document.querySelector("#email");
const tipoDocumento = document.querySelector("#tipoDocumento");
const documento = document.querySelector("#documento");
const sexo = document.querySelector("#sexo");
const direccion = document.querySelector("#direccion");
const fecha = document.querySelector("#fecha");
const contrasena = document.querySelector("#contrasena");
const repetirContrasena = document.querySelector("#repetirContrasena");
const botonRegistrar = document.querySelector("#registrar");

function check(element) {
  if(element.value == "" || !element.checkValidity()) {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
  }
  else {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
  }
}

function validar() {
  check(nombre);
  check(email);
  if(tipoDocumento.value == "Tipo") {
    tipoDocumento.classList.remove("is-valid");
    tipoDocumento.classList.add("is-invalid");
  }
  else {
    tipoDocumento.classList.remove("is-invalid");
    tipoDocumento.classList.add("is-valid");
  }
  check(documento);
  if(sexo.value == "Sexo") {
    sexo.classList.remove("is-valid");
    sexo.classList.add("is-invalid");
  }
  else {
    sexo.classList.remove("is-invalid");
    sexo.classList.add("is-valid");
  }
  check(direccion);
  check(fecha);
  check(contrasena);
  check(repetirContrasena);
}

botonRegistrar.addEventListener("click", async () => {
  validar();
  await verifyToken();
  axios.post(`http://127.0.0.1:5000/register`, {
    "email" : email.value,
    "cedula" : documento.value,
    "password" : contrasena.value,
    "admin" : false,
    "type_doc" : tipoDocumento.value,
    "nombre" : nombre.value,
    "fecha_nacimiento" : fecha.value,
    "sexo" : sexo.value,
    "direccion" : direccion.value 
  }, { 
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token_access")}`
    } 
  }).then((result) => {
    location.href = "../../html/tables.html";
  })
  .catch((error) => {
    logOut();
  });
});

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
