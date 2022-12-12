const table = document.querySelector("#table");
const botonAgregar = document.querySelector("#agregar");

window.addEventListener("load", getData());

async function getData() {
  console.log(localStorage.getItem("token_access"));
  console.log(localStorage.getItem("token_refresh"));
  if(localStorage.getItem("token_access") == null || localStorage.getItem("token_refresh") == null) {
    logOut();
  }
  await verifyToken();
  axios(`http://127.0.0.1:5000/usuario`, {
    method: "get",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token_access")}`
    }
  })
  .then((response) => {
    console.log(response);
    const nombre = document.querySelector("#nombre");
    nombre.innerHTML = localStorage.getItem("user");
    for(let i in response.data) {
      console.log(i);
      table.innerHTML += `<tr class="text-center">
                            <td>${response.data[i].nombre}</td>
                            <td id=email-${i}>${response.data[i].email}</td>
                            <td>
                              <button type="button" class="btn btn-primary" onclick="sendData(${i})">_</button>
                            </td>
                            <td>
                              <button type="button" class="btn btn-warning" onclick="sendData(${i})">^</button>
                            </td>
                            <th>
                              <button type="button" class="btn btn-success" onclick="updateData(${i})">O</button>
                            </th>
                            <th>
                              <button type="button" class="btn btn-danger" onclick="eraseData(${response.data[i].id})">X</button>
                            </th>
                        </tr>`;
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
  const email = document.querySelector(`#email-${id}`).innerHTML;
  console.log(email);
  localStorage.setItem("email", email);
  location.href = "../../html/actualizar-info.html";
}

async function eraseData(id) {
  await verifyToken();
  axios.delete(`http://127.0.0.1:5000/usuario/${id}`, { 
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
