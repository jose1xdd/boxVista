const fecha = document.querySelector("#fecha");
const brazos = document.querySelector("#brazos");
const piernas = document.querySelector("#piernas");
const abdomen = document.querySelector("#abdomen");
const fuerzaGeneral = document.querySelector("#fuerzaGeneral");
const resistenciaFuerza = document.querySelector("#resistenciaFuerza");
const resistenciaVueltas = document.querySelector("#resistenciaVueltas");
const peso = document.querySelector("#peso");
const resistenciaFuerzaG = document.querySelector("#resistenciaFuerzaG");
const botonRegistrar = document.querySelector("#registrar");

function check(element) {
  if(element.value == "" || !element.checkValidity()) {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    return false;
  }
  element.classList.remove("is-invalid");
  element.classList.add("is-valid");
  return true;
}

function validar() {
  let ans = true;
  ans = check(fecha) && ans;
  ans = check(brazos) && ans;
  ans = check(abdomen) && ans;
  ans = check(piernas) && ans;
  ans = check(fuerzaGeneral) && ans;
  ans = check(resistenciaFuerza) && ans;
  ans = check(resistenciaFuerzaG) && ans;
  ans = check(resistenciaVueltas) && ans;
  ans = check(peso) && ans;
  return ans;
}

botonRegistrar.addEventListener("click", async () => {
  let ans = validar();
  if(ans) {
    await verifyToken();
    let trimestre = Math.floor(parseInt(fecha.value.split("-")[1]) / 3);
    axios.post(`http://127.0.0.1:5000/test`, {
      "trimestre" : trimestre,
      "fuerza_general" : fuerzaGeneral.value,
      "brazos" : brazos.value,
      "fecha" : fecha.value,
      "piernas" : piernas.value,
      "abdomen" : abdomen.value,
      "resistencia_fuerza" : resistenciaFuerza.value,
      "resistencia_vueltas" : resistenciaVueltas.value,
      "resistencia_fuerzaG" : resistenciaFuerzaG.value,
      "peso" : peso.value,
      "user_id" : localStorage.getItem("id")
    }, { 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token_access")}`
      } 
    }).then((result) => {
      location.href = "../../html/test.html";
    })
    .catch((error) => {
      logOut();
    });
  }
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
