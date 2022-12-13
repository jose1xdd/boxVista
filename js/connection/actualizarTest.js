const fecha = document.querySelector("#fecha");
const brazos = document.querySelector("#brazos");
const piernas = document.querySelector("#piernas");
const abdomen = document.querySelector("#abdomen");
const fuerzaGeneral = document.querySelector("#fuerzaGeneral");
const resistenciaFuerza = document.querySelector("#resistenciaFuerza");
const resistenciaVueltas = document.querySelector("#resistenciaVueltas");
const peso = document.querySelector("#peso");
const resistenciaFuerzaG = document.querySelector("#resistenciaFuerzaG");
const botonActualizar = document.querySelector("#actualizar");

window.addEventListener("load", getData());

actualizar.addEventListener("click", async () => {
  if(localStorage.getItem("token_access") == null || localStorage.getItem("token_refresh") == null) {
    logOut();
  }
  await verifyToken();
  let trimestre = Math.floor(parseInt(fecha.value.split("-")[1]) / 3);
  axios.put(`http://127.0.0.1:5000/test/${localStorage.getItem("id_test")}`, {
    "trimestre" : trimestre,
    "fuerza_general" : fuerzaGeneral.value,
    "brazos" : brazos.value,
    "fecha" : fecha.value,
    "piernas" : piernas.value,
    "abdomen" : abdomen.value,
    "resistencia_fuerza" : resistenciaFuerza.value,
    "resistencia_vueltas" : resistenciaVueltas.value,
    "resistencia_fuerzaG" : resistenciaFuerzaG.value,
    "peso" : peso.value
  }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token_access")}`
    } 
  }).then((result) => {
    alert(result.status + " Actualizado exitosamente..");
    location.href = "../../html/test.html";
  })
  .catch((error) => {
    alert(error);
  });
});

async function getData() {
  if(localStorage.getItem("token_access") == null || localStorage.getItem("token_refresh") == null) {
    logOut();
  }
  await verifyToken();
  console.log(localStorage.getItem("id_test"));
  axios(`http://127.0.0.1:5000/test/${localStorage.getItem("id_test")}`, {
    method: "get",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token_access")}`
    }
  })
  .then((response) => {
    console.log(response);
    fecha.value = response.data.fecha;
    abdomen.value = response.data.abdomen;
    brazos.value = response.data.brazos;
    fuerzaGeneral.value = response.data.fuerza_general;
    peso.value = response.data.peso;
    piernas.value = response.data.piernas;
    resistenciaFuerza.value = response.data.resistencia_fuerza;
    resistenciaFuerzaG.value = response.data.resistencia_fuerzaG;
    resistenciaVueltas.value = response.data.resistencia_vueltas;
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