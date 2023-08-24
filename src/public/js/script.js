/* Swal.fire("Bienvenidos a main.handlebars!!");
 */

const socket = io();

/* socket.emit("MensajeConexion", { user: "Diego", role: "Admin" });

socket.on("credencialesConexion", (info) => {
  console.log(info);
});
 */

const botonChat = document.getElementById("botonChat");
const parrafosMensajes = document.getElementById("parrafosMensajes");
const valInput = document.getElementById("chatbox");

let user;

Swal.fire({
  title: "Identificacion de usuario",
  text: "Por favor ingrese su usuario",
  input: "text",
  inputValidator: (valor) => {
    return !valor && "Ingrese un nombre valido";
  },
  allowOutsideClick: false,
}).then((resultado) => {
  user = resultado.value;
  console.log(user);
});

botonChat.addEventListener("click", () => {
  let fechaActual = new Date().toLocaleString();

  if (valInput.value.trim().length > 0) {
    socket.emit("mensaje", {
      fecha: fechaActual,
      user: user,
      mensaje: valInput.value,
    });
    valInput.value = "";
  }
  console.log(valInput.value);
});
socket.on("mensajes", (arraymensajes) => {
  parrafosMensajes.innerHTML = "";
  arraymensajes.forEach((mensaje) => {
    parrafosMensajes.innerHTML += `<p>${mensaje.fecha}: ${mensaje.user} escribió ${mensaje.mensaje}`;
  });
});
