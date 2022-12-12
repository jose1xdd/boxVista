const nombre = document.querySelector("#nombre");
const email = document.querySelector("#email");
const tipoDocumento = document.querySelector("#tipodocumento");
const documento = document.querySelector("#documento");
const sexo = document.querySelector("#sexo");
const direccion = document.querySelector("#direccion");
const actualizar = document.querySelector("#actualizar");

window.addEventListener("load", getData());

actualizar.addEventListener("click", async () => {
  const password1 = document.querySelector("#contraseña").value;
  const password2 = document.querySelector("#contraseña2").value;
  console.log(password1);
  console.log(password2);
  console.log(localStorage.getItem("password"));
  if(password1 == password2 && localStorage.getItem("password") == password1) {
    const newPassword = (document.querySelector("#nuevaContraseña").value != "") ? document.querySelector("#nuevaContraseña").value : password1;
    if(localStorage.getItem("token_access") == null || localStorage.getItem("token_refresh") == null) {
      logOut();
    } 
    await verifyToken();
    axios(`http://127.0.0.1:5000/usuario/${email.value}`, {
      method: "get",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token_access")}`
      }
    })
    .then((response) => {
      console.log(response);
      console.log(newPassword);
      axios.put(`http://127.0.0.1:5000/usuario/${response.data.id}`, {
        "email": email.value,
        "cedula": documento.value,
        "password": newPassword,
        "admin": response.data.admin,
        "type_doc": tipoDocumento.value,
        "nombre": nombre.value,
        "fecha_nacimiento": response.data.fecha_nacimiento,
        "sexo": sexo.value,
        "direccion": direccion.value
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_access")}`
        } 
      }).then((result) => {
        alert(result.status + " Actualizado exitosamente..");
        location.href = "../../html/tables.html";
      })
      .catch((error) => {
        alert(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
  else {
    alert("Las contraseñas no coinciden");
  }
   
});

async function getData() {
  console.log(nombre.value);
  console.log(localStorage.getItem("email"));
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
    console.log(response);
    nombre.value = response.data.nombre;
    email.value = response.data.email;
    documento.value = response.data.cedula;
    sexo.value = response.data.sexo;
    tipoDocumento.value = response.data.type_doc;
    direccion.value = response.data.direccion;
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