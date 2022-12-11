const table = document.querySelector("#table");

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
      table.innerHTML += `<tr>
                            <td>${response.data[i].nombre}</td>
                            <td>${response.data[i].email}</td>
                            <td>
                              <div class="container text-center text-info"><a href="actualizar-info.html"> 
                              <i class="fa fa-bars" aria-hidden="true"></i>
                              </a></div>
                            </td>
                            <td><div class="container text-center"><a class="text-center text-success" href="test.html"> <i class="fa-xl fa-solid fa-magnifying-glass"></i></a></div>
                            </td>
                            <th>
                                <div class="container text-center text-info"><a href="actualizar-info.html"> <i
                                            class="fa-xl fa-solid fa-pen-to-square"></i></a></div>
                            </th>
                            <th>
                                <div class="container text-center"><a class="text-danger" href=""> <i
                                            class="fa-xl fa-solid fa-square-xmark"></i></a></div>
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