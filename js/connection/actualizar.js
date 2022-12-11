const nombre = document.querySelector("#nombre");
const email = document.querySelector("#email");
const tipoDocumento = document.querySelector("#tipodocumento");
const documento = document.querySelector("#documento");
const sexo = document.querySelector("#sexo");
const direccion = document.querySelector("#direccion");
const categoria = document.querySelector("#categoria");

window.addEventListener("load", getData());

async function getData() {
  console.log(localStorage.getItem("id"));
  console.log(localStorage.getItem("token_access"));
  console.log(localStorage.getItem("token_refresh"));
  if(localStorage.getItem("token_access") == null || localStorage.getItem("token_refresh") == null) {
    logOut();
  }
  await verifyToken();
  axios(`http://127.0.0.1:5000/usuario/${localStorage.getItem("id")}`, {
    method: "get",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token_access")}`
    }
  })
  .then((response) => {
    console.log(response);
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