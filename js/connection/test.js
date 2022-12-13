const table = document.querySelector("#table");
const botonAgregar = document.querySelector("#agregar");
const nombre = document.querySelector("#nombre");
const encabezado = document.querySelector("#encabezado");
const registrar = document.querySelector("#registrar");
const emailUser = document.querySelector("#emailUser");

console.log(localStorage.getItem("id"));
window.addEventListener("load", getData());

async function getData() {
  console.log(localStorage.getItem("token_access"));
  console.log(localStorage.getItem("token_refresh"));
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
    console.log(response.data.tests);
    emailUser.innerHTML = localStorage.getItem("user");
    nombre.innerHTML = response.data.nombre;
    localStorage.setItem("id", response.data.id);
    if(localStorage.getItem("admin") == "true") {
      encabezado.innerHTML += `<th>Editar</th>
                              <th>Eliminar</th>`;
      registrar.innerHTML = `<a class="btn btn-primary" href="registrarTest.html" role="button">Registrar Test</a>`; 
    }
    for(let i in response.data.tests) {
      console.log(i);
      let text = "";
      text += `<tr class="text-center">
                            <td>${response.data.tests[i].fecha}</td>
                            <td>${response.data.tests[i].peso} kg</td>
                            <td>${response.data.tests[i].fuerza_general} lb</td>
                            <td>${response.data.tests[i].brazos} rep</td>
                            <td>${response.data.tests[i].piernas} rep</td>
                            <td>${response.data.tests[i].resistencia_fuerza} min</td>
                            <td>${response.data.tests[i].resistencia_vueltas} min</td>
                            <td>${response.data.tests[i].resistencia_fuerzaG} min</td>`;
      if(localStorage.getItem("admin") == "true") {
        text += `<td>
                              <button type="button" class="btn btn-success" onclick="updateData(${response.data.tests[i].id})">O</button>
                            </td>
                            <td>
                              <button type="button" class="btn btn-danger" onclick="eraseData(${response.data.tests[i].id})">X</button>
                            </td>`;
      }
      text += `</tr>`;
      table.innerHTML += text;
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

function updateData(id) {
  localStorage.setItem("id_test", id);
  location.href = "../../html/editarTest.html";
}

async function eraseData(id) {
  await verifyToken();
  axios.delete(`http://127.0.0.1:5000/test/${id}`, { 
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token_access")}`
    } 
  }).then((result) => {
    location.reload();
  })
  .catch((error) => {
    logOut();
  });
}
